'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { ExtractedQuestion } from '@/features/ocr/lib/ocr-prompt';
import { pdfToImages, cropPageImage } from '@/features/ocr/lib/pdf-to-images';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OcrStatus = 'idle' | 'converting' | 'extracting' | 'done' | 'saving' | 'saved' | 'error';

export interface PagePosition {
  label: string;
  type?: string;
  yStart: number;
  yEnd: number;
  xStart?: number;
  xEnd?: number;
  questionLabel?: string;
}

export interface UseOcrExtractionOptions {
  apiBasePath: string;
  mode: 'thpt' | 'individual';
  defaultTotal?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** THPT section → question format. Part I = MC, Part II = TF, Part III = SA. */
const SECTION_FORMAT: Record<string, ExtractedQuestion['format']> = {
  I: 'MULTIPLE_CHOICE',
  II: 'TRUE_FALSE',
  III: 'SHORT_ANSWER',
};

/** Parse a figure label like "PHẦN III Câu 1" into its section + in-section number. */
function parseSectionAndLocal(label: string | undefined): {
  section: 'I' | 'II' | 'III' | null;
  local: number | null;
} {
  if (!label) return { section: null, local: null };
  const secMatch = label.match(/PH[ẦA]N\s+(III|II|I)\b/i);
  const section = (secMatch?.[1]?.toUpperCase() as 'I' | 'II' | 'III' | undefined) ?? null;
  const cauMatch = label.match(/C[âa]u\s*(\d+)/i) ?? label.match(/(\d+)/);
  const local = cauMatch ? parseInt(cauMatch[1], 10) : null;
  return { section, local };
}

/**
 * Resolve a figure label to the GLOBAL question number (1–22).
 *
 * Figure labels carry an in-section number ("PHẦN III Câu 1"), but questions are
 * keyed by the global questionNumber. Map by format: the N-th question of the
 * section's format (sorted by questionNumber) → its global number. Falls back to
 * the raw number when there is no section prefix (e.g. individual mode).
 */
function resolveGlobalQuestionNumber(
  label: string | undefined,
  questions: ExtractedQuestion[],
): number | null {
  const { section, local } = parseSectionAndLocal(label);
  if (local === null) return null;
  if (!section) return local; // no section info → the number already is global
  const fmt = SECTION_FORMAT[section];
  const inSection = questions
    .filter((q) => q.format === fmt)
    .sort((a, b) => a.questionNumber - b.questionNumber);
  return inSection[local - 1]?.questionNumber ?? null;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useOcrExtraction(opts: UseOcrExtractionOptions) {
  const { apiBasePath, mode, defaultTotal = 22 } = opts;

  const [questions, setQuestions] = useState<ExtractedQuestion[]>([]);
  const [status, setStatus] = useState<OcrStatus>('idle');
  const [progress, setProgress] = useState({ current: 0, total: defaultTotal });
  const [error, setError] = useState('');
  const [pageDataUrls, setPageDataUrls] = useState<string[]>([]);
  const [pagePositions, setPagePositions] = useState<Record<number, PagePosition[]>>({});
  const [questionFigures, setQuestionFigures] = useState<Record<number, string>>({});
  const [savedExamSet, setSavedExamSet] = useState<{ id: string; title: string } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const allAnswersFilled = useMemo(
    () =>
      questions.length > 0 &&
      questions.every((q) => {
        if (q.format === 'MULTIPLE_CHOICE') return !!q.answer;
        if (q.format === 'TRUE_FALSE')
          return q.answerA !== undefined && q.answerB !== undefined &&
                 q.answerC !== undefined && q.answerD !== undefined;
        if (q.format === 'SHORT_ANSWER') return !!q.correctAnswer;
        return false;
      }),
    [questions],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setQuestions([]);
    setStatus('idle');
    setProgress({ current: 0, total: defaultTotal });
    setError('');
    setPageDataUrls([]);
    setPagePositions({});
    setQuestionFigures({});
    setSavedExamSet(null);
  }, [defaultTotal]);

  const updateQuestion = useCallback(
    (index: number, updates: Partial<ExtractedQuestion>) => {
      setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
    },
    [],
  );

  const autoCropFigures = useCallback(
    async (
      positions: Record<number, PagePosition[]>,
      dataUrls: string[],
      questionList: ExtractedQuestion[],
    ) => {
      const figures: Record<number, string> = {};
      for (const [pageStr, entries] of Object.entries(positions)) {
        const pageNum = parseInt(pageStr, 10);
        const dataUrl = dataUrls[pageNum - 1]; // pagePositions is 1-indexed
        if (!dataUrl || !entries.length) continue;
        for (const pos of entries) {
          if (pos.type !== 'figure' && pos.type !== 'table') continue;
          // Map "PHẦN X Câu N" → global question number so the key matches q.questionNumber.
          const qNum = resolveGlobalQuestionNumber(pos.questionLabel, questionList);
          if (qNum === null || figures[qNum]) continue;
          try {
            const cropped = await cropPageImage(dataUrl, pos.yStart, pos.yEnd, 0, pos.xStart ?? 0, pos.xEnd ?? 1);
            if (cropped) figures[qNum] = cropped;
          } catch { /* skip failed crops */ }
        }
      }
      if (Object.keys(figures).length > 0) {
        setQuestionFigures((prev) => ({ ...prev, ...figures }));
      }
    },
    [],
  );

  const startExtraction = useCallback(
    async (files: File[], options?: { examYear?: string; examCode?: string; topic?: string }) => {
      try {
        // 1. Reset & convert PDFs
        setQuestions([]);
        setError('');
        setQuestionFigures({});
        setPagePositions({});
        setPageDataUrls([]);
        setProgress({ current: 0, total: defaultTotal });
        setStatus('converting');

        const imageFiles: File[] = [];
        for (const f of files) {
          if (f.type === 'application/pdf') {
            const pages = await pdfToImages(f);
            imageFiles.push(...pages);
          } else {
            imageFiles.push(f);
          }
        }

        const dataUrls = await Promise.all(imageFiles.map(fileToDataUrl));
        setPageDataUrls(dataUrls);

        // 2. Send to OCR API with abort + timeout
        setStatus('extracting');
        abortRef.current?.abort();
        const abortController = new AbortController();
        abortRef.current = abortController;

        const formData = new FormData();
        imageFiles.forEach((f) => formData.append('images', f));
        formData.append('mode', mode);
        if (options?.examYear) formData.append('examYear', options.examYear);
        if (options?.examCode) formData.append('examCode', options.examCode);

        const res = await fetch(`${apiBasePath}/ocr`, { method: 'POST', body: formData, signal: abortController.signal });
        if (!res.ok || !res.body) throw new Error('Không thể kết nối đến server OCR');

        // 3. Parse SSE stream
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        const qs: ExtractedQuestion[] = [];
        const posMap: Record<number, PagePosition[]> = {};

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const raw = line.slice(6);
            if (raw === '[DONE]') continue;
            try {
              const parsed = JSON.parse(raw);
              if (parsed.event === 'question' && parsed.data) {
                const q = parsed.data as ExtractedQuestion;
                if (options?.topic) q.topic = options.topic;
                qs.push(q);
                setQuestions([...qs]);
                setProgress(parsed.progress || { current: qs.length, total: defaultTotal });
              } else if (parsed.event === 'pagePositions') {
                posMap[parsed.page] = parsed.positions;
                setPagePositions({ ...posMap });
              } else if (parsed.event === 'complete') {
                // Will finalize below
              } else if (parsed.event === 'error') {
                setError(parsed.message || 'Lỗi trích xuất');
                setStatus('error');
                return;
              }
            } catch { /* skip malformed SSE */ }
          }
        }

        if (qs.length === 0) throw new Error('Không trích xuất được câu hỏi nào');

        // 4. Sort and finalize
        const sorted = [...qs].sort((a, b) => a.questionNumber - b.questionNumber);
        setQuestions(sorted);
        setStatus('done');

        // 5. Auto-crop figures (key by global question number via `sorted`)
        await autoCropFigures(posMap, dataUrls, sorted);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          // User cancelled or timeout — reset silently
          return;
        }
        setError(err instanceof Error ? err.message : 'Extraction failed');
        setStatus('error');
      }
    },
    [apiBasePath, mode, defaultTotal, autoCropFigures],
  );

  return {
    questions, status, progress, error, pageDataUrls, pagePositions, questionFigures, savedExamSet,
    startExtraction, updateQuestion, setQuestions, setStatus, setSavedExamSet,
    setQuestionFigures, setError, reset, allAnswersFilled,
  };
}
