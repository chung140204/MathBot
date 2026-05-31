'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import {
  formatStudyTime,
  Skeleton, MetricCard,
} from '@/features/progress/components/ProgressSubComponents';
import { DashboardTopicsPanel } from '@/features/admin/components/dashboard/DashboardTopicsPanel';
import { TargetProgress } from './TargetProgress';

const WeeklyChart = dynamic(() => import('./WeeklyChart'), {
  ssr: false,
  loading: () => <div className="bg-gray-100 animate-pulse rounded-xl h-40" />,
});

// Ngày thi THPT Quốc Gia — cập nhật mỗi năm
const THPT_EXAM_DATE = '2026-07-01';

// ─── Types ───────────────────────────────────────────────────────────────────

type TopicStat = {
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
};

type WeeklyScore = {
  date: string;
  score: number | null;
};

type RecentAttempt = {
  id: string;
  topics: string[];
  totalScore: number;
  totalQuestions: number;
  timeTakenSecs: number;
  submittedAt: string;
};

type OverviewData = {
  totalExams: number;
  averageScore: number;
  bestScore: number;
  totalCorrect: number;
  totalStudyTimeSecs: number;
  topicStats: TopicStat[];
  weeklyScores: WeeklyScore[];
  recentAttempts: RecentAttempt[];
  weakTopics: string[];
  targetScore: string | null;
};

// ─── Constants ───────────────────────────────────────────────────────────────

// ─── Helpers ─────────────────────────────────────────────────────────────────


// Helpers + MetricCard + Skeleton imported from @/features/progress/components/ProgressSubComponents

function scoreColor(pct: number): string { if (pct >= 70) return "#059669"; if (pct >= 50) return "#d97706"; return "#dc2626"; }
function greeting(): string { const h = new Date().getHours(); if (h < 12) return "Chào buổi sáng"; if (h < 18) return "Chào buổi chiều"; return "Chào buổi tối"; }
function computeStreak(weeklyScores: WeeklyScore[]): number { let streak = 0; for (let i = weeklyScores.length - 1; i >= 0; i--) { if (weeklyScores[i].score !== null) streak++; else break; } return streak; }

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  useEffect(() => { document.title = 'Dashboard | MathBot'; }, []);
  const { data: session } = useSession();
  const [data, setData] = useState<OverviewData | null>(null);
  const [studyProgress, setStudyProgress] = useState<{ topic: string; percent: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch independently — dashboard renders as soon as analytics arrives
    fetch('/api/v1/analytics/overview')
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setData(d); })
      .catch(() => setError('Không thể tải dữ liệu. Vui lòng thử lại.'))
      .finally(() => setLoading(false));

    fetch('/api/v1/study/progress')
      .then(r => r.ok ? r.json() : [])
      .then(d => { if (Array.isArray(d)) setStudyProgress(d); })
      .catch(() => {});
  }, []);

  const userName = (session?.user as { name?: string })?.name ?? 'bạn';
  const firstName = userName.split(' ').pop() ?? userName;
  const streak = data ? computeStreak(data.weeklyScores) : 0;

  // Calculate overall study progress
  const totalStudyItems = studyProgress.reduce((s, p) => s + (p as any).total, 0) || 1;
  const totalStudyRead = studyProgress.reduce((s, p) => s + (p as any).read, 0) || 0;
  const overallStudyPercent = Math.round((totalStudyRead / totalStudyItems) * 100);

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Chào {greeting()}, {firstName}!{' '}
            <span role="img" aria-label="wave">👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
            {data && (
              <span className="ml-1 text-gray-500">
                · {Math.ceil((new Date(THPT_EXAM_DATE).getTime() - Date.now()) / 86400000)} ngày đến kỳ thi
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <span className="text-base">🔥</span>
              <span className="text-xs font-black text-amber-700">
                {streak} ngày streak
              </span>
            </div>
          )}
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
      </div>

      {/* ── Metric Cards ── */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-sm font-medium">
          {error}
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            label="Tổng bài đã làm"
            value={String(data.totalExams)}
            sub="Tổng số bài thi đã hoàn thành"
            subGreen
          />
          <MetricCard
            label="Độ chính xác TB"
            value={`${data.averageScore}%`}
            sub={data.averageScore >= 70 ? 'Kết quả tốt, tiếp tục duy trì!' : 'Cần cải thiện thêm'}
            subGreen={data.averageScore >= 70}
          />
          <MetricCard
            label="Tiến độ ôn tập"
            value={`${overallStudyPercent}%`}
            sub={overallStudyPercent >= 80 ? 'Gần hoàn thành!' : `${totalStudyRead}/${totalStudyItems} phần đã đọc`}
            subGreen={overallStudyPercent >= 50}
          />
          <MetricCard
            label="Thời gian luyện tập"
            value={formatStudyTime(Math.max(0, data.totalStudyTimeSecs))}
            sub="Tổng thời gian làm bài thi"
            subGreen
          />
          {/* Streak card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Chuỗi luyện tập</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-3xl">{streak > 0 ? '🔥' : '❄️'}</span>
              <span className="text-3xl font-black text-gray-900">{streak}</span>
              <span className="text-sm font-bold text-gray-500">ngày</span>
            </div>
            <p className={`text-xs font-semibold mt-1 ${streak > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
              {streak >= 7 ? 'Tuyệt vời! Duy trì chuỗi!' : streak > 0 ? 'Tiếp tục giữ chuỗi!' : 'Hãy bắt đầu luyện tập!'}
            </p>
          </div>
        </div>
      ) : null}

      {/* ── Tiến độ mục tiêu ── */}
      {!loading && data && (
        <TargetProgress
          averageScore={data.averageScore}
          bestScore={data.bestScore}
          targetScore={data.targetScore}
        />
      )}

      {/* ── Chart + AI Card ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-800">Điểm số 7 ngày qua</h2>
            <Link
              href="/progress"
              className="text-xs font-bold text-[#059669] hover:text-[#0891b2] transition-colors"
            >
              Xem tất cả
            </Link>
          </div>
          {loading ? (
            <Skeleton className="h-40" />
          ) : data ? (
            <WeeklyChart data={data.weeklyScores} />
          ) : null}
        </div>

        {/* AI Chat card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#059669] to-[#0891b2] rounded-2xl p-6 text-white flex flex-col justify-between shadow-md">
          <div>
            <p className="text-lg font-black mb-2">🤖 Hỏi AI ngay</p>
            <p className="text-sm text-white/80 leading-relaxed">
              Giải bài, giải thích lý thuyết, tư vấn lộ trình ôn thi 24/7
            </p>
          </div>
          <Link
            href="/chat"
            className="mt-6 block w-full text-center bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl py-3 text-sm font-bold transition-all"
          >
            Bắt đầu hội thoại →
          </Link>
        </div>
      </div>

      {/* ── Topic Accuracy + Weak Topics + Recent Exams ── */}
      <DashboardTopicsPanel loading={loading} data={data} studyProgress={studyProgress} />
    </div>
  );
}
