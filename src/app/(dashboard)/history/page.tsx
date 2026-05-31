'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { TOPIC_LABEL } from '@/shared/constants/topics';
import { Topic } from '@prisma/client';
import { Skeleton } from '@/features/progress/components/ProgressSubComponents';

// ─── Types ───────────────────────────────────────────────────────────────────

type HistoryAttempt = {
  id: string;
  topics: string[];
  mode: string;
  totalScore: number;
  totalQuestions: number;
  timeTakenSecs: number;
  submittedAt: string;
};

type HistoryResponse = {
  attempts: HistoryAttempt[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

const LIMIT = 10;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MODE_LABEL: Record<string, string> = {
  QUICK: 'Thi nhanh',
  STANDARD: 'Thi chuẩn',
  THPT: 'Thi thử THPT',
  ADAPTIVE: 'Luyện theo điểm yếu',
};

function modeLabel(mode: string): string {
  return MODE_LABEL[mode?.toUpperCase()] ?? mode;
}

function scoreColor(pct: number): string {
  if (pct >= 70) return '#059669';
  if (pct >= 50) return '#d97706';
  return '#dc2626';
}

function formatTime(secs: number): string {
  const safe = Math.max(0, secs);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function topicsLabel(topics: string[]): string {
  if (!topics || topics.length === 0) return 'Tất cả chủ đề';
  if (topics.length === 1) return TOPIC_LABEL[topics[0] as Topic] ?? topics[0];
  return `${topics.length} chủ đề`;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  useEffect(() => { document.title = 'Lịch sử | MathBot'; }, []);

  const [page, setPage] = useState(1);
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback((p: number, signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    fetch(`/api/v1/exam/history?page=${p}&limit=${LIMIT}`, { signal })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) setData(d);
        else setError('Không thể tải lịch sử. Vui lòng thử lại.');
      })
      .catch((err) => { if (err?.name !== 'AbortError') setError('Không thể tải lịch sử. Vui lòng thử lại.'); })
      .finally(() => { if (!signal?.aborted) setLoading(false); });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchData(page, controller.signal);
    return () => controller.abort();
  }, [page, fetchData]);

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Lịch sử làm bài <span role="img" aria-label="history">📜</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {data && data.total > 0 ? `Tổng ${data.total} bài thi đã hoàn thành` : 'Toàn bộ bài thi bạn đã thực hiện'}
          </p>
        </div>
        <Link
          href="/practice"
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-[#059669] hover:text-[#059669] transition-all flex items-center gap-1.5"
        >
          Luyện tập ngay
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Table card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : data && data.attempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Chủ đề</th>
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Chế độ</th>
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Điểm</th>
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Thời gian làm</th>
                  <th className="px-5 py-3 text-[11px] font-black text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {data.attempts.map(a => {
                  const pct = a.totalQuestions > 0 ? Math.round((a.totalScore / a.totalQuestions) * 100) : 0;
                  return (
                    <tr key={a.id} className="border-b border-gray-50 last:border-0 hover:bg-[#f0fdf9] transition-colors group">
                      <td className="px-5 py-3.5">
                        <Link href={`/exam/result?attemptId=${a.id}`} className="block">
                          <span className="text-sm font-bold text-gray-800">{topicsLabel(a.topics)}</span>
                          <span className="block text-[11px] text-gray-400 mt-0.5">{a.totalQuestions} câu</span>
                        </Link>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-600">
                          {modeLabel(a.mode)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-black px-2.5 py-1 rounded-lg"
                            style={{ color: scoreColor(pct), backgroundColor: `${scoreColor(pct)}18` }}
                          >
                            {pct}%
                          </span>
                          <span className="text-xs font-semibold text-gray-500">{a.totalScore}/{a.totalQuestions}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-gray-600">{formatTime(a.timeTakenSecs)}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{format(new Date(a.submittedAt), 'dd/MM/yyyy HH:mm')}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/exam/result?attemptId=${a.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#059669] opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                        >
                          Xem
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">📭</span>
            <p className="text-sm font-semibold text-gray-600">Chưa có bài thi nào.</p>
            <p className="text-xs text-gray-400 mt-1">Hãy bắt đầu luyện tập để xây dựng lịch sử của bạn!</p>
            <Link
              href="/practice"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 bg-[#059669] text-white text-xs font-bold rounded-xl hover:bg-[#047857] transition-colors"
            >
              Bắt đầu luyện tập
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && data && data.attempts.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-semibold">
            Trang <span className="font-black text-gray-800">{data.page}</span> / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white text-gray-600 hover:border-[#059669] hover:text-[#059669] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600"
            >
              ← Trước
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-200 bg-white text-gray-600 hover:border-[#059669] hover:text-[#059669] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600"
            >
              Sau →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
