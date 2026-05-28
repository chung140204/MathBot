/**
 * Stage 1b + figure assignment: YOLO detection → question ownership mapping.
 *
 * Combines:
 * - YOLO DocLayout inference (local ONNX)
 * - Stage 1c vision-based label assignment
 * - Y-overlap estimation
 * - Section boundary checks
 * - Cross-page continuation
 * - Adjacent table reassignment
 * - Box merging (union tables, largest figure)
 */
import OpenAI from 'openai';
import { detectFigures, type FigureDetection } from '@/features/ocr/lib/yolo-detect';
import { callStage1cFigureDetection, type Stage1cFigure } from '@/features/ocr/lib/ocr-stage1c-figures';
import { type QuestionPosition, fixOcrTypos, prevSection } from '@/features/ocr/lib/ocr-text-utils';
import type { Base64Image } from '@/features/ocr/lib/ocr-stage1-vision';

// ---------------------------------------------------------------------------
// Configuration constants for figure assignment heuristics
// ---------------------------------------------------------------------------
const STAGE1C_MAX_Y_DISTANCE = 0.25;    // Max Y distance for stage1c→YOLO matching
const ADJACENT_TABLE_MAX_GAP = 0.1;      // Max gap for adjacent table reassignment
const TABLE_MERGE_MAX_GAP = 0.08;        // Max gap for merging tables into union box
const CROSS_PAGE_MIN_Y_START = 0.15;     // Min first-question Y for cross-page detection
const CROSS_PAGE_MIN_TEXT_LENGTH = 80;   // Min chars before first "Câu" for cross-page
const EARLY_TEXT_CUTOFF = 0.4;           // Fraction of page text for early-text fallback
const MAX_LABELS_PER_PAGE = 10;          // Max question labels per page for fallback
const Y_OVERLAP_OVERRIDE_RATIO = 1.5;   // Stage1c override threshold

// ---------------------------------------------------------------------------
// Label prefixing — determine PHẦN for a bare "Câu X" label
// ---------------------------------------------------------------------------

/**
 * Prefix a bare label like "Câu 2" with the correct PHẦN (I/II/III) section.
 * Uses Y-position of the label relative to section headers in the page text.
 * Falls back to text-offset matching, then to the pageSectionMap (forward-filled).
 * Returns the label unchanged if it already starts with "PHẦN".
 */
function prefixLabel(
  label: string,
  pageNum: number,
  pageTexts: string[],
  pageSectionMap: Map<number, string[]>,
  yCenter?: number,
): string {
  if (/^PHẦN/i.test(label)) return label;

  const pageText = pageTexts[pageNum - 1] ?? '';
  const totalLen = Math.max(pageText.length, 1);

  // Find section header char offsets → estimate Y positions
  const sectionYPositions: { section: string; yEst: number }[] = [];
  for (const sm of pageText.matchAll(/PHẦN\s+(I{1,3})/gi)) {
    sectionYPositions.push({
      section: `PHẦN ${sm[1].toUpperCase()}`,
      yEst: sm.index! / totalLen,
    });
  }

  if (sectionYPositions.length > 0 && yCenter !== undefined) {
    const lastSect = sectionYPositions.filter((s) => s.yEst < yCenter).pop();
    if (lastSect) {
      if (lastSect.section !== 'PHẦN I') return `${lastSect.section} ${label}`;
      return label;
    }
    const firstSect = sectionYPositions[0];
    const inferredSection = prevSection(firstSect.section);
    if (inferredSection !== 'PHẦN I') return `${inferredSection} ${label}`;
    return label;
  }

  if (sectionYPositions.length > 0) {
    const fixed = fixOcrTypos(label);
    const escaped = fixed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const lm = new RegExp(escaped, 'i').exec(fixOcrTypos(pageText));
    if (lm?.index !== undefined) {
      const labelYEst = lm.index / totalLen;
      const lastSect = sectionYPositions.filter((s) => s.yEst < labelYEst).pop();
      if (lastSect) {
        if (lastSect.section !== 'PHẦN I') return `${lastSect.section} ${label}`;
        return label;
      }
      const firstSect = sectionYPositions[0];
      const inferredSection = prevSection(firstSect.section);
      if (inferredSection !== 'PHẦN I') return `${inferredSection} ${label}`;
      return label;
    }
  }

  // Fallback: use pageSectionMap
  const pageSections = pageSectionMap.get(pageNum) ?? ['PHẦN I'];
  const dominantSection = pageSections[pageSections.length - 1];
  if (dominantSection !== 'PHẦN I') return `${dominantSection} ${label}`;
  return label;
}

// ---------------------------------------------------------------------------
// Build page → section map
// ---------------------------------------------------------------------------

/**
 * Build a map of page number → section labels (e.g. ['PHẦN I'], ['PHẦN II', 'PHẦN III']).
 * Pages without explicit section headers inherit from the previous page (forward-fill).
 */
export function buildPageSectionMap(pageTexts: string[]): Map<number, string[]> {
  const pageSectionMap = new Map<number, string[]>();
  for (let p = 0; p < pageTexts.length; p++) {
    const sections: string[] = [];
    for (const sm of pageTexts[p].matchAll(/PHẦN\s+(I{1,3})/gi)) {
      sections.push(`PHẦN ${sm[1].toUpperCase()}`);
    }
    if (sections.length > 0) pageSectionMap.set(p + 1, sections);
  }
  // Forward-fill: pages without headers inherit last section from previous page
  let lastKnownSection = 'PHẦN I';
  for (let p = 1; p <= pageTexts.length; p++) {
    if (pageSectionMap.has(p)) {
      const sections = pageSectionMap.get(p)!;
      lastKnownSection = sections[sections.length - 1];
    } else {
      pageSectionMap.set(p, [lastKnownSection]);
    }
  }
  return pageSectionMap;
}

// ---------------------------------------------------------------------------
// Figure assignment for a single page
// ---------------------------------------------------------------------------

interface FigureAssignmentContext {
  pageIndex: number; // 0-based
  pageTexts: string[];
  pagePositionsMap: Record<number, QuestionPosition[]>;
  pageSectionMap: Map<number, string[]>;
  fallbackPages: Set<number>;
  visionClient: OpenAI;
  visionModel: string;
  nvidiaVisionClient: OpenAI;
  nvidiaVisionModel: string;
}

/**
 * Run YOLO figure detection + Stage 1c label assignment for one page.
 *
 * Algorithm:
 * 1. Skip answer/cover pages based on text pattern matching
 * 2. Run YOLO ONNX inference to detect figure/table bounding boxes
 * 3. Call Stage 1c vision API to identify which question each figure belongs to
 * 4. Build effective question positions from Stage 1 output or text-based fallback
 * 5. Add cross-page continuation zones for split questions
 * 6. Estimate Y positions when only full-page fallbacks are available
 * 7. Assign figures to questions using Stage1c labels, Y-overlap, and section boundaries
 * 8. Reassign adjacent tables to the same owner and merge overlapping boxes
 *
 * @returns Combined question + figure positions for the page, or null if no figures found
 */
export async function assignFiguresForPage(
  img: Base64Image,
  ctx: FigureAssignmentContext,
): Promise<QuestionPosition[] | null> {
  const i = ctx.pageIndex;
  const pageNum = i + 1;

  console.log(`[OCR_API] YOLO: detecting figures on page ${pageNum}`);

  // Skip answer/cover pages
  const pageText = ctx.pageTexts[i] ?? '';
  const isAnswerPage = /PHẦN\s+I\s*:\s*Câu\s+\d+\s*[-–]\s*[A-D]/i.test(pageText);
  if (isAnswerPage) {
    console.log(`[OCR_API] YOLO page ${pageNum}: answer/cover page detected, skipping figure assignment`);
    return null;
  }

  const detections = await detectFigures(img.data);
  if (detections.length === 0) return null;

  // Stage 1c: dedicated vision call for label assignment
  const pageUsedFallback = ctx.fallbackPages.has(pageNum);
  let stage1cResults: Stage1cFigure[] = [];
  try {
    stage1cResults = await callStage1cFigureDetection(
      img.data, img.type,
      pageUsedFallback ? ctx.nvidiaVisionClient : ctx.visionClient,
      pageUsedFallback ? ctx.nvidiaVisionModel : ctx.visionModel,
      ctx.nvidiaVisionClient, ctx.nvidiaVisionModel,
    );
    console.log(`[OCR_API] Stage 1c page ${pageNum}: ${stage1cResults.length} figure(s) identified${pageUsedFallback ? ' (NVIDIA direct)' : ''}`, JSON.stringify(stage1cResults));
  } catch (err) {
    console.warn(`[OCR_API] Stage 1c page ${pageNum} failed, falling back:`, err);
  }

  // Build effective positions from Stage 1 positions or fallback
  const allStage1Positions = ctx.pagePositionsMap[pageNum] ?? [];
  const questionPositions = allStage1Positions.filter((p) => p.type === 'question');

  const effectivePositions: QuestionPosition[] = questionPositions.length > 0
    ? [...questionPositions]
    : buildFallbackPositions(ctx.pageTexts[i] ?? '', pageNum);

  // Fix OCR typos + add PHẦN prefix
  for (const pos of effectivePositions) {
    if (pos.type !== 'question') continue;
    pos.label = fixOcrTypos(pos.label);
    const yMid = (pos.yStart + pos.yEnd) / 2;
    const prefixed = prefixLabel(pos.label, pageNum, ctx.pageTexts, ctx.pageSectionMap, yMid);
    if (prefixed !== pos.label) {
      console.log(`[OCR_API] YOLO page ${pageNum}: prefixed "${pos.label}" → "${prefixed}"`);
      pos.label = prefixed;
    }
  }

  // Cross-page continuation
  addCrossPageContinuation(effectivePositions, i, ctx.pageTexts, ctx.pagePositionsMap);

  console.log(`[OCR_API] YOLO page ${pageNum}: effectivePositions=`, JSON.stringify(effectivePositions));

  // Estimate Y positions when all are fallback [0,1]
  estimateYPositions(effectivePositions, ctx.pageTexts[i] ?? '');

  // Fix OCR typos + add PHẦN prefix to stage1c labels
  for (const s1c of stage1cResults) {
    s1c.questionLabel = fixOcrTypos(s1c.questionLabel);
    const yMid = (s1c.yStart + s1c.yEnd) / 2;
    const prefixed = prefixLabel(s1c.questionLabel, pageNum, ctx.pageTexts, ctx.pageSectionMap, yMid);
    if (prefixed !== s1c.questionLabel) {
      console.log(`[OCR_API] Stage 1c page ${pageNum}: prefixed "${s1c.questionLabel}" → "${prefixed}"`);
      s1c.questionLabel = prefixed;
    }
  }

  // Pre-compute 1-to-1 stage1c assignment
  const stage1cAssignment = computeStage1cAssignment(detections, stage1cResults);

  // Build section Y boundaries
  const pageSectionBoundaries = buildSectionBoundaries(ctx.pageTexts[i] ?? '');

  const getSectionAtY = (y: number): string | null => {
    if (pageSectionBoundaries.length === 0) return null;
    const sect = pageSectionBoundaries.filter((s) => s.yEst <= y).pop();
    if (sect) return sect.section;
    return prevSection(pageSectionBoundaries[0].section);
  };

  // Assign figures to questions
  const figures = assignDetectionsToQuestions(
    detections, effectivePositions, stage1cAssignment, getSectionAtY, i,
  );

  // Adjacent table reassignment
  reassignAdjacentTables(figures);

  // Merge multiple boxes belonging to the same question
  const mergedFigures = mergeBoxes(figures);

  const allPositions = [...effectivePositions, ...mergedFigures];
  console.log(`[OCR_API] YOLO page ${pageNum}: ${detections.length} box(es) → ${mergedFigures.length} figure(s) after merge`);

  return allPositions;
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function buildFallbackPositions(pageText: string, pageNum: number): QuestionPosition[] {
  // Match "Câu X" at start of line
  const lineStartMatches = [...new Set(
    [...pageText.matchAll(/^[\s*#]*(?:PHẦN\s+(?:II?I?)\s+)?Câu\s+\d+/gim)]
      .map((m) => m[0].trim().replace(/^[*#\s]+/, '').replace(/\s+/g, ' ')),
  )].filter((label) => !/Câu\s+0\d/i.test(label));

  if (lineStartMatches.length > 0 && lineStartMatches.length <= MAX_LABELS_PER_PAGE) {
    console.log(`[OCR_API] YOLO page ${pageNum}: no __positions__, fallback (line-start): ${lineStartMatches.join(', ')}`);
    return lineStartMatches.map((label) => ({ label, type: 'question' as const, yStart: 0, yEnd: 1 }));
  }

  // Last resort: early text
  const cutoff = Math.floor(pageText.length * EARLY_TEXT_CUTOFF);
  const earlyText = pageText.slice(0, cutoff);
  const earlyMatches = [...new Set(
    [...earlyText.matchAll(/(?:PHẦN\s+(?:II?I?)\s+)?Câu\s+\d+/gi)]
      .map((m) => m[0].trim().replace(/\s+/g, ' ')),
  )].filter((label) => !/Câu\s+0\d/i.test(label));

  if (earlyMatches.length > 0 && earlyMatches.length <= MAX_LABELS_PER_PAGE) {
    console.log(`[OCR_API] YOLO page ${pageNum}: no __positions__, fallback (early-text): ${earlyMatches.join(', ')}`);
    return earlyMatches.map((label) => ({ label, type: 'question' as const, yStart: 0, yEnd: 1 }));
  }

  console.warn(`[OCR_API] YOLO page ${pageNum}: fallback failed — line-start: ${lineStartMatches.length}, early-text: ${earlyMatches.length} labels`);
  return [];
}

function addCrossPageContinuation(
  effectivePositions: QuestionPosition[],
  pageIndex: number,
  pageTexts: string[],
  pagePositionsMap: Record<number, QuestionPosition[]>,
): void {
  if (pageIndex <= 0 || effectivePositions.length === 0) return;

  const firstQYStart = effectivePositions[0].yStart;
  const rawPageText = pageTexts[pageIndex] ?? '';
  const firstCauMatch = rawPageText.match(/Câu\s+\d+/i);
  const textBeforeFirstCau = firstCauMatch?.index ?? 0;

  if (firstQYStart > CROSS_PAGE_MIN_Y_START && textBeforeFirstCau > CROSS_PAGE_MIN_TEXT_LENGTH) {
    const prevPositions = pagePositionsMap[pageIndex] ?? []; // 1-indexed → pageIndex = previous page
    const prevQuestions = prevPositions.filter((p) => p.type === 'question');
    const lastPrevLabel = prevQuestions.length > 0
      ? prevQuestions[prevQuestions.length - 1].label
      : null;
    if (lastPrevLabel) {
      effectivePositions.unshift({
        label: lastPrevLabel,
        type: 'question',
        yStart: 0,
        yEnd: firstQYStart,
      });
      console.log(`[OCR_API] YOLO page ${pageIndex + 1}: added continuation zone [0, ${firstQYStart.toFixed(2)}] for "${lastPrevLabel}" from previous page`);
    }
  }
}

function estimateYPositions(effectivePositions: QuestionPosition[], pageText: string): void {
  const allFullPage = effectivePositions.every((p) => p.yStart === 0 && p.yEnd === 1);
  if (!allFullPage || effectivePositions.length <= 1) return;

  const totalLen = Math.max(pageText.length, 1);
  const charOffsets: number[] = effectivePositions.map((p) => {
    const escaped = p.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
    const match = new RegExp(escaped, 'i').exec(pageText);
    return match ? match.index : -1;
  });

  const allFound = charOffsets.every((o) => o >= 0);
  const isMonotonic = charOffsets.every((o, idx) => idx === 0 || o > charOffsets[idx - 1]);

  if (allFound && isMonotonic) {
    effectivePositions.forEach((p, idx) => {
      p.yStart = charOffsets[idx] / totalLen;
      p.yEnd = idx + 1 < charOffsets.length ? charOffsets[idx + 1] / totalLen : 1.0;
    });
  } else {
    const step = 1.0 / effectivePositions.length;
    effectivePositions.forEach((p, idx) => {
      p.yStart = idx * step;
      p.yEnd = (idx + 1) * step;
    });
  }
}

function computeStage1cAssignment(
  detections: FigureDetection[],
  stage1cResults: Stage1cFigure[],
): Map<number, Stage1cFigure> {
  const sortedDetIdx = detections
    .map((d, idx) => ({ idx, yCenter: (d.yStart + d.yEnd) / 2 }))
    .sort((a, b) => a.yCenter - b.yCenter);
  const assignment = new Map<number, Stage1cFigure>();

  if (stage1cResults.length > 0) {
    const consumed = new Set<number>();
    for (const { idx, yCenter } of sortedDetIdx) {
      let bestS = -1, bestDist = Infinity;
      for (let s = 0; s < stage1cResults.length; s++) {
        if (consumed.has(s)) continue;
        const dist = Math.abs((stage1cResults[s].yStart + stage1cResults[s].yEnd) / 2 - yCenter);
        if (dist < bestDist) { bestDist = dist; bestS = s; }
      }
      if (bestS >= 0 && bestDist < STAGE1C_MAX_Y_DISTANCE) {
        consumed.add(bestS);
        assignment.set(idx, stage1cResults[bestS]);
      }
    }
  }

  return assignment;
}

function buildSectionBoundaries(pageText: string): { section: string; yEst: number }[] {
  const boundaries: { section: string; yEst: number }[] = [];
  const pLen = Math.max(pageText.length, 1);
  for (const sm of pageText.matchAll(/PHẦN\s+(I{1,3})/gi)) {
    boundaries.push({ section: `PHẦN ${sm[1].toUpperCase()}`, yEst: sm.index! / pLen });
  }
  return boundaries;
}

function findBestYOverlap(
  figYStart: number,
  figYEnd: number,
  effectivePositions: QuestionPosition[],
): QuestionPosition | null {
  let bestPos: QuestionPosition | null = null;
  let bestOverlap = 0;
  for (const qp of effectivePositions) {
    if (qp.type !== 'question') continue;
    const overlapStart = Math.max(figYStart, qp.yStart);
    const overlapEnd = Math.min(figYEnd, qp.yEnd);
    const overlap = Math.max(0, overlapEnd - overlapStart);
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      bestPos = qp;
    }
  }
  if (!bestPos) {
    bestPos = [...effectivePositions]
      .filter((qp) => qp.type === 'question' && qp.yStart <= figYStart)
      .pop() ?? null;
  }
  return bestPos;
}

function assignDetectionsToQuestions(
  detections: FigureDetection[],
  effectivePositions: QuestionPosition[],
  stage1cAssignment: Map<number, Stage1cFigure>,
  getSectionAtY: (y: number) => string | null,
  pageIndex: number,
): QuestionPosition[] {
  return detections.map((det, detIdx) => {
    const figCenterY = (det.yStart + det.yEnd) / 2;
    const figSection = getSectionAtY(figCenterY);

    let bestOverlapQ = findBestYOverlap(det.yStart, det.yEnd, effectivePositions);

    // Section boundary check
    if (bestOverlapQ && figSection && !bestOverlapQ.label.includes(figSection) && figSection !== 'PHẦN I') {
      console.log(`[OCR_API] YOLO det: y-overlap "${bestOverlapQ.label}" rejected — figure in ${figSection} area`);
      bestOverlapQ = null;
    }

    // Stage 1c label validation
    let stage1cLabel = stage1cAssignment.get(detIdx)?.questionLabel ?? null;
    if (stage1cLabel && bestOverlapQ && stage1cLabel !== bestOverlapQ.label) {
      const s1cEntry = stage1cAssignment.get(detIdx)!;
      const s1cOverlap = Math.max(0, Math.min(det.yEnd, s1cEntry.yEnd) - Math.max(det.yStart, s1cEntry.yStart));
      const qOverlap = Math.max(0, Math.min(det.yEnd, bestOverlapQ.yEnd) - Math.max(det.yStart, bestOverlapQ.yStart));
      if (qOverlap > s1cOverlap * Y_OVERLAP_OVERRIDE_RATIO) {
        console.log(`[OCR_API] YOLO det: stage1c="${stage1cLabel}" overridden by y-overlap="${bestOverlapQ.label}" (overlap ${qOverlap.toFixed(3)} vs ${s1cOverlap.toFixed(3)})`);
        stage1cLabel = null;
      }
    }

    let ownerLabel = stage1cLabel
      ?? bestOverlapQ?.label
      ?? effectivePositions.find((qp) => qp.type === 'question')?.label;

    // Section mismatch check
    if (ownerLabel && figSection && !ownerLabel.includes(figSection) && figSection !== 'PHẦN I') {
      console.log(`[OCR_API] YOLO det: owner "${ownerLabel}" section mismatch with figure ${figSection} area — skipping assignment`);
      ownerLabel = undefined;
    }

    const source = stage1cLabel ? 'stage1c' : (bestOverlapQ ? 'y-overlap' : 'none');
    console.log(`[OCR_API] YOLO det: type=${det.type} y=[${det.yStart.toFixed(2)},${det.yEnd.toFixed(2)}] conf=${det.confidence.toFixed(3)} → owner=${ownerLabel ?? 'NONE'} (${source})`);

    return {
      label: ownerLabel ?? `figure-p${pageIndex + 1}`,
      type: det.type as 'figure' | 'table',
      yStart: det.yStart,
      yEnd: det.yEnd,
      xStart: det.xStart,
      xEnd: det.xEnd,
      questionLabel: ownerLabel,
    };
  });
}

function reassignAdjacentTables(figures: QuestionPosition[]): void {
  if (figures.length <= 1) return;

  const sorted = [...figures].sort((a, b) => a.yStart - b.yStart);
  for (let j = 0; j < sorted.length - 1; j++) {
    const current = sorted[j];
    const next = sorted[j + 1];
    const gap = next.yStart - current.yEnd;
    if (
      gap < ADJACENT_TABLE_MAX_GAP &&
      current.type === 'table' && next.type === 'table' &&
      current.questionLabel !== next.questionLabel
    ) {
      console.log(`[OCR_API] YOLO reassign: ${current.type} (owner=${current.questionLabel}) adjacent to ${next.type} (owner=${next.questionLabel}), gap=${gap.toFixed(3)} → reassign to ${next.questionLabel}`);
      current.questionLabel = next.questionLabel;
      current.label = next.label;
    }
  }
}

function mergeBoxes(figures: QuestionPosition[]): QuestionPosition[] {
  const grouped = new Map<string, QuestionPosition[]>();
  for (const fig of figures) {
    const key = fig.questionLabel ?? fig.label;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(fig);
  }

  const mergedFigures: QuestionPosition[] = [];
  for (const [, group] of grouped) {
    const tables = group.filter((f) => f.type === 'table').sort((a, b) => a.yStart - b.yStart);
    const figs = group.filter((f) => f.type === 'figure');

    // Merge adjacent tables into consecutive runs
    if (tables.length > 0) {
      let run = [tables[0]];
      const flushRun = () => {
        mergedFigures.push({
          label: run[0].label,
          type: 'table',
          xStart: Math.min(...run.map((f) => f.xStart ?? 0)),
          yStart: Math.min(...run.map((f) => f.yStart)),
          xEnd: Math.max(...run.map((f) => f.xEnd ?? 1)),
          yEnd: Math.max(...run.map((f) => f.yEnd)),
          questionLabel: run[0].questionLabel,
        });
        run = [];
      };
      for (let k = 1; k < tables.length; k++) {
        const gap = tables[k].yStart - run[run.length - 1].yEnd;
        if (gap < TABLE_MERGE_MAX_GAP) {
          run.push(tables[k]);
        } else {
          flushRun();
          run = [tables[k]];
        }
      }
      flushRun();
    }

    // For figures: keep only the largest (by area)
    if (figs.length > 0) {
      const largest = figs.reduce((best, f) => {
        const area = ((f.xEnd ?? 1) - (f.xStart ?? 0)) * (f.yEnd - f.yStart);
        const bestArea = ((best.xEnd ?? 1) - (best.xStart ?? 0)) * (best.yEnd - best.yStart);
        return area > bestArea ? f : best;
      });
      mergedFigures.push(largest);
    }
  }

  return mergedFigures;
}
