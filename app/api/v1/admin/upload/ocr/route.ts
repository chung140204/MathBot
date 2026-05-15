import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { THPT_PAGE_EXTRACTION_PROMPT, THPT_OCR_SYSTEM_PROMPT } from '@/lib/ocr-prompt';
import { detectFigures } from '@/lib/yolo-detect';

interface QuestionPosition {
  label: string;
  type: 'question' | 'figure' | 'table';
  yStart: number;
  yEnd: number;
  xStart?: number; // optional horizontal crop (0.0-1.0), defaults to 0.0
  xEnd?: number;   // optional horizontal crop (0.0-1.0), defaults to 1.0
  questionLabel?: string; // only for figure/table — which question this belongs to
}

/**
 * Parse the __positions__ JSON block appended at the end of each stage-1 page output.
 * Returns the clean text (without the JSON line) and the parsed positions array.
 */
function extractPositions(rawText: string): { text: string; positions: QuestionPosition[] } {
  const lines = rawText.split('\n');
  // Search from the end for the positions JSON line (expand window to 10 lines for safety)
  for (let i = lines.length - 1; i >= Math.max(0, lines.length - 10); i--) {
    // Strip markdown code-fence backticks the model sometimes wraps around JSON
    const line = lines[i].trim().replace(/^```(?:json)?|```$/g, '').trim();
    if (line.startsWith('{"__positions__":')) {
      try {
        const parsed = JSON.parse(line);
        const positions: QuestionPosition[] = (parsed.__positions__ ?? [])
          // Clamp yStart/yEnd to [0,1] in case model outputs values > 1
          .map((p: QuestionPosition) => ({
            ...p,
            yStart: Math.max(0, Math.min(1, p.yStart ?? 0)),
            yEnd: Math.max(0, Math.min(1, p.yEnd ?? 1)),
          }))
          // Drop degenerate entries where yStart >= yEnd after clamping
          .filter((p: QuestionPosition) => p.yEnd > p.yStart);
        return {
          text: lines.slice(0, i).join('\n'),
          positions,
        };
      } catch {
        // ignore malformed JSON
      }
    }
  }
  return { text: rawText, positions: [] };
}

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Fix unescaped LaTeX backslashes in raw model JSON output.
 *
 * Models often output \frac, \sqrt etc. with a single backslash, but JSON.parse
 * treats \f as a form-feed char (0x0C) and \b as backspace, silently corrupting
 * the LaTeX. This replaces single \X (where X is a letter) with \\X so
 * JSON.parse produces the literal backslash needed for LaTeX rendering.
 *
 * Example: '"\frac{1}{2}"' → '"\\frac{1}{2}"' → JSON.parse → '\frac{1}{2}' ✓
 */
function fixLatexEscapes(raw: string): string {
  // Replace \X (letter) that is NOT already preceded by a backslash.
  // EXCEPTIONS — do NOT double these JSON-standard escape sequences:
  //   \uXXXX  — JSON unicode codepoint (Vietnamese chars like \u00e0 = 'à')
  //   \n \r \t \b \f  — standard JSON whitespace/control escapes
  return raw.replace(/(?<!\\)\\([a-zA-Z])/g, (match, letter, offset) => {
    if ('nrtbf'.includes(letter)) return match;
    if (letter === 'u' && /^[0-9a-fA-F]{4}/.test(raw.slice(offset + 2))) return match;
    return `\\\\${letter}`;
  });
}

/**
 * Wrap bare LaTeX commands (e.g. \sqrt{21}) in $...$ if they are not already
 * inside a math delimiter. This is a safety net for models that output correct
 * LaTeX commands but forget to add the surrounding $...$.
 *
 * Only wraps: \command{...} and \command (without braces) in common math contexts.
 * Does NOT touch text that is already inside $...$ or $$...$$.
 */
function ensureLatexDelimiters(text: string): string {
  // Split by existing $...$ regions to avoid double-processing
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$]+?\$)/g);
  return parts.map((part, i) => {
    // Odd-indexed parts are already inside $...$ or $$...$$
    if (i % 2 === 1) return part;
    // In plain text segments, wrap \command patterns in $...$
    // Greedily capture the full LaTeX expression: \cmd, \cmd{}, \cmd{}\cmd{}...
    let result = part.replace(
      /\\(?:frac|sqrt|int|sum|prod|lim|log|ln|sin|cos|tan|cot|vec|overrightarrow|overline|hat|bar|infty|pm|mp|cdot|times|div|leq|geq|neq|approx|in|notin|subset|mathbb|binom|begin|end|left|right|alpha|beta|gamma|delta|epsilon|theta|pi|sigma|omega|lambda|mu|phi|psi|rho|xi|eta|zeta|tau|nu|kappa|iota)(?:\{[^{}]*(?:\{[^{}]*\}[^{}]*)?\}|\[[^\]]*\])*/g,
      (match) => `$${match}$`
    );
    // Wrap probability expressions: P(A), P(A|B), P(A ∩ B) etc.
    result = result.replace(
      /P\([^)]+\)\s*=\s*[\d,.\s]+|P\([^)]+\)/g,
      (match) => `$${match}$`
    );
    return result;
  }).join('');
}


/**
 * Apply ensureLatexDelimiters to all user-visible text fields of a parsed question.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyLatexDelimiters(q: Record<string, any>): Record<string, any> {
  const stringFields = ['content', 'statementA', 'statementB', 'statementC', 'statementD'];
  const result = { ...q };
  for (const field of stringFields) {
    if (typeof result[field] === 'string') {
      result[field] = ensureLatexDelimiters(result[field]);
    }
  }
  if (result.options && typeof result.options === 'object') {
    result.options = Object.fromEntries(
      Object.entries(result.options).map(([k, v]) => [
        k,
        typeof v === 'string' ? ensureLatexDelimiters(v) : v,
      ])
    );
  }
  return result;
}

/**
 * POST /api/v1/admin/upload/ocr
 *
 * 2-stage pipeline:
 *   Stage 1 — Vision (parallel): each page image → raw text extraction
 *   Stage 2 — Text LLM (stream): combined text → structured NDJSON questions
 *
 * This avoids the NVIDIA 1-image-per-request limit AND correctly handles
 * questions that span multiple pages (e.g. Phần II Câu 2, Câu 4).
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const imageFiles = formData.getAll('images') as File[];
    const examYear = (formData.get('examYear') as string) || '';
    const examCode = (formData.get('examCode') as string) || '';

    if (!imageFiles.length) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }
    if (imageFiles.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Maximum ${MAX_IMAGES} images allowed` }, { status: 400 });
    }

    for (const file of imageFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}` },
          { status: 400 },
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 5MB limit` },
          { status: 400 },
        );
      }
    }

    // Pre-convert all files to base64
    const base64Images = await Promise.all(
      imageFiles.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return { type: file.type, data: buffer.toString('base64') };
      }),
    );

    // Stage 1 Vision: use Gemini if GEMINI_API_KEY is set, else fall back to NVIDIA
    const visionClient = process.env.GEMINI_API_KEY
      ? new OpenAI({
          apiKey: process.env.GEMINI_API_KEY,
          baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
        })
      : new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
          baseURL: process.env.NVIDIA_BASE_URL || undefined,
        });
    const visionModel = process.env.GEMINI_API_KEY
      ? (process.env.GEMINI_VISION_MODEL || 'gemini-2.5-flash')
      : (process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct');

    // Stage 2 Text: keep NVIDIA (no vision needed)
    const textClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.NVIDIA_BASE_URL || undefined,
    });
    const textModel = process.env.NVIDIA_TEXT_MODEL || 'meta/llama-3.1-70b-instruct';

    console.log(`[OCR_API] Stage 1 vision: ${visionModel} (${process.env.GEMINI_API_KEY ? 'Gemini' : 'NVIDIA'})`);
    console.log(`[OCR_API] Stage 2 text:   ${textModel} (NVIDIA)`);

    const examLabel = [
      examYear ? `năm ${examYear}` : '',
      examCode ? `mã đề ${examCode}` : '',
    ].filter(Boolean).join(', ');

    const encoder = new TextEncoder();
    let cancelled = false;
    const stream = new ReadableStream({
      cancel() {
        cancelled = true;
      },
      async start(controller) {
        const emit = (event: string, data: unknown) => {
          if (cancelled) return;
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ event, ...((typeof data === 'object' && data !== null) ? data : { data }) })}\n\n`,
              ),
            );
          } catch {
            // Controller already closed (client disconnected)
            cancelled = true;
          }
        };

        try {
          const total = base64Images.length;

          // ─────────────────────────────────────────────────────────────
          // STAGE 1: Extract raw text from each page (parallel vision calls)
          // ─────────────────────────────────────────────────────────────
          emit('status', { message: `Đang đọc ${total} trang đề thi...` });

          const pageTextResults = await Promise.allSettled(
            base64Images.map(async (img, i) => {
              const res = await visionClient.chat.completions.create({
                model: visionModel,
                messages: [
                  { role: 'system', content: THPT_PAGE_EXTRACTION_PROMPT },
                  {
                    role: 'user',
                    content: [
                      { type: 'text', text: `This is page ${i + 1} of ${total} from a Vietnamese math exam. Transcribe ALL visible Vietnamese math content from this image exactly as written. Output ONLY what you see in this specific image.\n\nREMINDER: You MUST end your output with the __positions__ JSON line as specified in the system prompt.` },
                      { type: 'image_url', image_url: { url: `data:${img.type};base64,${img.data}` } },
                    ],
                  },
                ],
                max_tokens: 4096,
                temperature: 0,
                stream: false,
              });
              const text = res.choices[0]?.message?.content ?? '';
              console.log(`[OCR_API] Page ${i + 1} extracted: ${text.length} chars`);
              // Detect hallucination: if model outputs mostly ASCII (no Vietnamese diacritics and no LaTeX)
              // it likely generated from training data instead of reading the image
              const hasVietnamese = /[àáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỷỹ]/i.test(text);
              const hasLatex = text.includes('\\') || text.includes('$');
              const hasVietStructure = /Câu|PHẦN|phần/.test(text);
              if (!hasVietnamese && !hasLatex && !hasVietStructure) {
                console.warn(`[OCR_API] Page ${i + 1} WARNING: possible hallucination — no Vietnamese text detected`);
              }
              return { page: i + 1, text };
            }),
          );

          // Collect successful extractions in page order; parse positions
          const pageTexts: string[] = [];
          const pagePositionsMap: Record<number, QuestionPosition[]> = {};
          for (let i = 0; i < pageTextResults.length; i++) {
            const result = pageTextResults[i];
            if (result.status === 'fulfilled') {
              const { text, positions } = extractPositions(result.value.text);
              pageTexts.push(`=== TRANG ${i + 1} ===\n${text}`);
              pagePositionsMap[i + 1] = positions;
              emit('pagePositions', { page: i + 1, positions });
            } else {
              console.error(`[OCR_API] Page ${i + 1} extraction failed:`, result.reason);
              pageTexts.push(`=== TRANG ${i + 1} ===\n[Không đọc được trang này]`);
              pagePositionsMap[i + 1] = [];
              emit('pagePositions', { page: i + 1, positions: [] });
            }
          }

          const combinedText = pageTexts.join('\n\n');
          console.log(`[OCR_API] Stage 1 complete. Total chars: ${combinedText.length}`);

          // ─────────────────────────────────────────────────────────────
          // STAGE 1b: YOLO figure/table detection (parallel, concurrent with stage 2)
          // Runs ONNX inference locally — no extra API call, precise bounding boxes
          // ─────────────────────────────────────────────────────────────
          const figureDetectionTasks = base64Images.map(async (img, i) => {
            try {
              console.log(`[OCR_API] YOLO: detecting figures on page ${i + 1}`);
              const detections = await detectFigures(img.data);

              if (detections.length === 0) return;

              const questionPositions = pagePositionsMap[i + 1] ?? [];

              // Fallback: stage 1 didn't output __positions__ → parse page text for question labels
              // Strategy: find "Câu X" near line starts (allow leading whitespace/markdown), cap at 10
              const effectivePositions: QuestionPosition[] = questionPositions.length > 0
                ? questionPositions
                : (() => {
                    const pageText = pageTexts[i] ?? '';
                    // Match "Câu X" at start of line (allow leading spaces, *, #, etc.)
                    const lineStartMatches = [...new Set(
                      [...pageText.matchAll(/^[\s*#]*(?:PHẦN\s+(?:II?I?)\s+)?Câu\s+\d+/gim)]
                        .map((m) => m[0].trim().replace(/^[*#\s]+/, '').replace(/\s+/g, ' ')),
                    )].filter((label) => !/Câu\s+0\d/i.test(label));

                    // Use line-start matches if reasonable count (1-10 per page)
                    if (lineStartMatches.length > 0 && lineStartMatches.length <= 10) {
                      console.log(`[OCR_API] YOLO page ${i + 1}: no __positions__, fallback (line-start): ${lineStartMatches.join(', ')}`);
                      return lineStartMatches.map((label) => ({ label, type: 'question' as const, yStart: 0, yEnd: 1 }));
                    }

                    // Last resort: find ALL "Câu X" but only keep first occurrence of each number,
                    // limited to first 40% of text (actual page content, not hallucinated continuation)
                    const cutoff = Math.floor(pageText.length * 0.4);
                    const earlyText = pageText.slice(0, cutoff);
                    const earlyMatches = [...new Set(
                      [...earlyText.matchAll(/(?:PHẦN\s+(?:II?I?)\s+)?Câu\s+\d+/gi)]
                        .map((m) => m[0].trim().replace(/\s+/g, ' ')),
                    )].filter((label) => !/Câu\s+0\d/i.test(label));

                    if (earlyMatches.length > 0 && earlyMatches.length <= 10) {
                      console.log(`[OCR_API] YOLO page ${i + 1}: no __positions__, fallback (early-text): ${earlyMatches.join(', ')}`);
                      return earlyMatches.map((label) => ({ label, type: 'question' as const, yStart: 0, yEnd: 1 }));
                    }

                    console.warn(`[OCR_API] YOLO page ${i + 1}: fallback failed — line-start: ${lineStartMatches.length}, early-text: ${earlyMatches.length} labels`);
                    return [];
                  })();

              console.log(`[OCR_API] YOLO page ${i + 1}: effectivePositions=`, JSON.stringify(effectivePositions));

              const allFullPage = effectivePositions.every((p) => p.yStart === 0 && p.yEnd === 1);

              // When all positions are fallback [0,1], distribute evenly so Y-center matching works
              if (allFullPage && effectivePositions.length > 1) {
                const step = 1.0 / effectivePositions.length;
                effectivePositions.forEach((p, idx) => {
                  p.yStart = idx * step;
                  p.yEnd = (idx + 1) * step;
                });
                console.log(`[OCR_API] YOLO page ${i + 1}: distributed positions evenly (${effectivePositions.length} questions, step=${step.toFixed(3)})`);
              }

              const figures: QuestionPosition[] = detections.map((det) => {
                // Infer which question owns this figure by y-center overlap
                const figCenterY = (det.yStart + det.yEnd) / 2;
                const owner = effectivePositions.find(
                    (qp) => qp.type === 'question' && figCenterY >= qp.yStart && figCenterY <= qp.yEnd,
                  ) ?? effectivePositions[effectivePositions.length - 1];
                console.log(`[OCR_API] YOLO det: type=${det.type} bbox=[${det.xStart.toFixed(3)},${det.yStart.toFixed(3)},${det.xEnd.toFixed(3)},${det.yEnd.toFixed(3)}] conf=${det.confidence.toFixed(3)} → owner=${owner?.label ?? 'NONE'}`);

                return {
                  label: owner?.label ?? `figure-p${i + 1}`,
                  type: det.type as 'figure' | 'table',
                  yStart: det.yStart,
                  yEnd: det.yEnd,
                  xStart: det.xStart,
                  xEnd: det.xEnd,
                  questionLabel: owner?.label,
                };
              });

              // Adjacent table/figure reassignment: if two detections are close vertically
              // but assigned to different consecutive questions, reassign the upper one to the
              // lower question. Adjacent tables almost always belong to the same question.
              if (figures.length > 1) {
                const sorted = [...figures].sort((a, b) => a.yStart - b.yStart);
                for (let j = 0; j < sorted.length - 1; j++) {
                  const current = sorted[j];
                  const next = sorted[j + 1];
                  const gap = next.yStart - current.yEnd;
                  // Only reassign adjacent TABLES — figures from different questions should stay separate
                  if (
                    gap < 0.1 &&
                    current.type === 'table' && next.type === 'table' &&
                    current.questionLabel !== next.questionLabel
                  ) {
                    console.log(`[OCR_API] YOLO reassign: ${current.type} (owner=${current.questionLabel}) adjacent to ${next.type} (owner=${next.questionLabel}), gap=${gap.toFixed(3)} → reassign to ${next.questionLabel}`);
                    current.questionLabel = next.questionLabel;
                    current.label = next.label;
                  }
                }
              }

              // Merge multiple boxes belonging to the same question into one union box.
              // A question may have 2 adjacent tables — YOLO gives 2 boxes, we crop 1 image.
              const grouped = new Map<string, QuestionPosition[]>();
              for (const fig of figures) {
                const key = fig.questionLabel ?? fig.label;
                if (!grouped.has(key)) grouped.set(key, []);
                grouped.get(key)!.push(fig);
              }
              const mergedFigures: QuestionPosition[] = [];
              for (const [, group] of grouped) {
                mergedFigures.push({
                  label: group[0].label,
                  type: group[0].type,
                  xStart: Math.min(...group.map((f) => f.xStart ?? 0)),
                  yStart: Math.min(...group.map((f) => f.yStart)),
                  xEnd:   Math.max(...group.map((f) => f.xEnd ?? 1)),
                  yEnd:   Math.max(...group.map((f) => f.yEnd)),
                  questionLabel: group[0].questionLabel,
                });
              }

              const allPositions = [...effectivePositions, ...mergedFigures];
              emit('pagePositions', { page: i + 1, positions: allPositions });
              console.log(`[OCR_API] YOLO page ${i + 1}: ${detections.length} box(es) → ${mergedFigures.length} figure(s) after merge`);
            } catch (err) {
              console.error(`[OCR_API] YOLO page ${i + 1} failed:`, err);
            }
          });

          // ─────────────────────────────────────────────────────────────
          // STAGE 2: Structure combined text → NDJSON (streaming)
          // Runs concurrently with stage 1b figure detection
          // ─────────────────────────────────────────────────────────────
          emit('status', { message: 'Đang phân tích và cấu trúc câu hỏi...' });

          const userContent = examLabel
            ? `Đề thi THPT ${examLabel}.\n\nNội dung đề thi:\n${combinedText}`
            : `Nội dung đề thi:\n${combinedText}`;

          const response = await textClient.chat.completions.create({
            model: textModel,
            messages: [
              { role: 'system', content: THPT_OCR_SYSTEM_PROMPT },
              { role: 'user', content: userContent },
            ],
            max_tokens: 8192,
            temperature: 0.1,
            stream: true,
          });

          let buffer = '';
          let questionCount = 0;

          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content;
            if (!content) continue;

            buffer += content;

            while (buffer.includes('\n')) {
              const newlineIdx = buffer.indexOf('\n');
              const line = buffer.slice(0, newlineIdx).trim();
              buffer = buffer.slice(newlineIdx + 1);

              if (!line) continue;

              try {
                const question = JSON.parse(fixLatexEscapes(line));
                if (question.questionNumber && question.format) {
                  questionCount++;
                  emit('question', {
                    data: applyLatexDelimiters(question),
                    progress: { current: questionCount, total: 22 },
                  });
                }
              } catch {
                // Not JSON (markdown fence etc.) — skip
              }
            }
          }

          // Flush remaining buffer
          const remaining = buffer.trim();
          if (remaining) {
            try {
              const question = JSON.parse(fixLatexEscapes(remaining));
              if (question.questionNumber && question.format) {
                questionCount++;
                emit('question', {
                  data: applyLatexDelimiters(question),
                  progress: { current: questionCount, total: 22 },
                });
              }
            } catch {
              // ignore
            }
          }

          // Wait for stage 1b figure detection to finish before completing
          await Promise.allSettled(figureDetectionTasks);

          emit('complete', { totalExtracted: questionCount });
          if (!cancelled) controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (error) {
          console.error('[OCR_API] Error:', error);
          emit('error', {
            message: error instanceof Error ? error.message : 'OCR extraction failed',
          });
          if (!cancelled) controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        }

        if (!cancelled) controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[OCR_API] Outer error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 },
    );
  }
}
