'use client';

import { useEffect, useState } from 'react';
import { difficultyLabel } from '@/shared/constants/difficulty';

// ─── Types (consume backend contract) ─────────────────────────────────────────

type ErrorPattern = {
  topic: string;
  label: string;
  difficulty: string;
  wrong: number;
  total: number;
  rate: number;
};

export function ErrorPatternsPanel() {
  const [patterns, setPatterns] = useState<ErrorPattern[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/v1/analytics/error-patterns', { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('fetch failed')))
      .then((d: { patterns?: ErrorPattern[] }) => setPatterns(d.patterns ?? []))
      .catch((err) => { if (err?.name !== 'AbortError') setPatterns([]); });
    return () => controller.abort();
  }, []);

  // Render nothing on empty data or failure (sort already done server-side).
  if (!patterns || patterns.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-sm font-black text-gray-800 mb-4">
        <span role="img" aria-label="magnifier">🔍</span> Phân tích lỗi sai
      </h2>
      <div className="space-y-2.5">
        {patterns.map(p => {
          const diffLabel = difficultyLabel(p.difficulty);
          return (
            <div
              key={`${p.topic}-${p.difficulty}`}
              className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100"
            >
              <span className="text-xs font-semibold text-gray-700 truncate">
                {diffLabel} – {p.label}
              </span>
              <span className="text-[11px] font-black px-2 py-0.5 rounded-lg bg-red-100 text-red-600 flex-shrink-0">
                {p.wrong}/{p.total} câu sai ({p.rate}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
