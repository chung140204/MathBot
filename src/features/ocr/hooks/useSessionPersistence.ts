'use client';

import { useEffect } from 'react';
import { ExtractedQuestion } from '@/features/ocr/lib/ocr-prompt';
import type { PagePosition } from '@/features/ocr/hooks/useOcrExtraction';

export interface PersistableState {
  questions: ExtractedQuestion[];
  status: string;
  progress: { current: number; total: number };
  questionFigures: Record<number, string>;
  pagePositions: Record<number, PagePosition[]>;
  examYear?: string;
  examCode?: string;
  title?: string;
  topic?: string;
}

/**
 * Persist OCR extraction state to sessionStorage.
 * Saves when status is 'done' and questions exist.
 * Clears when status is 'saved' or 'idle'.
 * Restores on mount via onRestore callback.
 */
export function useSessionPersistence(
  storageKey: string,
  state: PersistableState,
  onRestore: (data: PersistableState) => void,
) {
  useEffect(() => {
    if ((state.status === 'done' || state.status === 'saving') && state.questions.length > 0) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(state));
      } catch { /* sessionStorage full or unavailable */ }
    } else if (state.status === 'saved' || state.status === 'idle') {
      sessionStorage.removeItem(storageKey);
    }
  }, [storageKey, state]);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        const data = JSON.parse(saved) as PersistableState;
        if (data.questions?.length > 0 && data.status === 'done') {
          onRestore(data);
        }
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
