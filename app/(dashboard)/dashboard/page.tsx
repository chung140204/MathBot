'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
};

// ─── Constants ───────────────────────────────────────────────────────────────

const TOPIC_LABELS: Record<string, string> = {
  LIMITS_AND_CONTINUITY: 'Giới hạn',
  DERIVATIVES: 'Đạo hàm',
  INTEGRALS: 'Tích phân',
  COMPLEX_NUMBERS: 'Số phức',
  VOLUMES: 'Thể tích',
  COMBINATORICS_PROBABILITY: 'Xác suất',
  SEQUENCES: 'Dãy số',
  EXPONENTIAL_LOGARITHM: 'Hàm mũ & Log',
  FUNCTION_ANALYSIS: 'Hàm số',
  ANALYTIC_GEOMETRY: 'Hình học GT',
  SOLID_GEOMETRY: 'Hình học KG',
};

const VN_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatStudyTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h${m > 0 ? m + 'm' : ''}`;
  return `${m}m`;
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) return 'Hôm nay';
  if (diffDays === 1) return 'Hôm qua';
  return `${diffDays} ngày trước`;
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  if (m < 1) return '<1 phút';
  return `${m} phút`;
}

function scoreColor(pct: number): string {
  if (pct >= 70) return '#059669';
  if (pct >= 50) return '#d97706';
  return '#dc2626';
}

function accuracyDotColor(pct: number): string {
  if (pct >= 70) return 'bg-[#059669]';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'buổi sáng';
  if (h < 18) return 'buổi chiều';
  return 'buổi tối';
}

function computeStreak(weeklyScores: WeeklyScore[]): number {
  let streak = 0;
  for (let i = weeklyScores.length - 1; i >= 0; i--) {
    if (weeklyScores[i].score !== null) streak++;
    else break;
  }
  return streak;
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  subPositive,
}: {
  label: string;
  value: string;
  sub: string;
  subPositive: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col gap-1">
      <p className="text-xs font-semibold text-gray-500 leading-tight">{label}</p>
      <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
      <p
        className={`text-xs font-semibold ${
          subPositive ? 'text-[#059669]' : 'text-red-500'
        }`}
      >
        {sub}
      </p>
    </div>
  );
}

type ChartEntry = { day: string; score: number | null };

function WeeklyChart({ data }: { data: WeeklyScore[] }) {
  const chartData: ChartEntry[] = data.map((d) => ({
    day: VN_DAYS[new Date(d.date + 'T12:00:00').getDay()],
    score: d.score,
  }));

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { value: number }[];
    label?: string;
  }) => {
    if (!active || !payload?.length || payload[0].value == null) return null;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-sm">
        <p className="font-bold text-gray-700">{label}</p>
        <p className="text-[#059669] font-black">{payload[0].value}%</p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={chartData} barCategoryGap="35%">
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
        />
        <YAxis hide domain={[0, 100]} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf9' }} />
        <Bar
          dataKey="score"
          maxBarSize={36}
          shape={(props: { x?: number; y?: number; width?: number; height?: number; value?: number }) => {
            const { x = 0, y = 0, width = 0, height = 0, value } = props;
            const r = Math.min(6, width / 2);
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={height}
                rx={r}
                ry={r}
                fill={value == null ? '#e5e7eb' : '#059669'}
                opacity={value == null ? 0.4 : 1}
              />
            );
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />;
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/analytics/overview')
      .then((r) => {
        if (!r.ok) throw new Error('Lỗi tải dữ liệu');
        return r.json();
      })
      .then((d: OverviewData) => setData(d))
      .catch(() => setError('Không thể tải dữ liệu. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  const userName = (session?.user as { name?: string })?.name ?? 'bạn';
  const firstName = userName.split(' ').pop() ?? userName;
  const streak = data ? computeStreak(data.weeklyScores) : 0;

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
              <span className="ml-1 text-gray-400">
                · {Math.ceil((new Date('2026-07-01').getTime() - Date.now()) / 86400000)} ngày đến kỳ thi
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-sm font-medium">
          {error}
        </div>
      ) : data ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Tổng bài đã làm"
            value={String(data.totalExams)}
            sub="Tổng số bài thi đã hoàn thành"
            subPositive
          />
          <MetricCard
            label="Độ chính xác TB"
            value={`${data.averageScore}%`}
            sub={data.averageScore >= 70 ? 'Kết quả tốt, tiếp tục duy trì!' : 'Cần cải thiện thêm'}
            subPositive={data.averageScore >= 70}
          />
          <MetricCard
            label="Câu đúng tổng"
            value={formatNumber(data.totalCorrect)}
            sub="Tổng số câu trả lời đúng"
            subPositive
          />
          <MetricCard
            label="Thời gian ôn tập"
            value={formatStudyTime(data.totalStudyTimeSecs)}
            sub="Tổng thời gian học tích lũy"
            subPositive
          />
        </div>
      ) : null}

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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Topic accuracy bars */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-800">Năng lực theo chủ đề</h2>
            <Link
              href="/progress"
              className="text-xs font-bold text-[#059669] hover:text-[#0891b2] transition-colors"
            >
              Chi tiết
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-6" />
              ))}
            </div>
          ) : data && data.topicStats.length > 0 ? (
            <div className="space-y-3">
              {[...data.topicStats]
                .sort((a, b) => b.accuracy - a.accuracy)
                .slice(0, 7)
                .map((t) => (
                  <div key={t.topic} className="flex items-center gap-3">
                    <div className="w-[130px] flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-700">
                        {TOPIC_LABELS[t.topic] ?? t.topic}
                      </span>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${accuracyDotColor(t.accuracy)}`}
                    />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${t.accuracy}%`,
                          backgroundColor: scoreColor(t.accuracy),
                        }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-black text-gray-700">
                      {t.accuracy}%
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">
              Chưa có dữ liệu. Hãy làm bài để xem thống kê!
            </p>
          )}
        </div>

        {/* Right column: weak topics + recent exams */}
        <div className="lg:col-span-2 space-y-4">
          {/* Weak topics */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-gray-800 mb-3">
              Cần ôn tập gấp{' '}
              <span role="img" aria-label="warning">⚠️</span>
            </h2>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-8" />
                ))}
              </div>
            ) : data && data.weakTopics.length > 0 ? (
              <div className="space-y-2">
                {data.weakTopics.slice(0, 4).map((topic) => {
                  const stat = data.topicStats.find((t) => t.topic === topic);
                  const pct = stat?.accuracy ?? 0;
                  return (
                    <div
                      key={topic}
                      className="flex items-center justify-between px-3 py-2 rounded-xl bg-red-50 border border-red-100"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: scoreColor(pct) }}
                        />
                        <span className="text-xs font-semibold text-gray-700">
                          {TOPIC_LABELS[topic] ?? topic}
                        </span>
                      </div>
                      <span className="text-xs font-black text-red-600">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">
                {data ? '🎉 Không có chủ đề yếu!' : 'Chưa có dữ liệu'}
              </p>
            )}
          </div>

          {/* Recent exams */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-black text-gray-800">Lần thi gần đây</h2>
              <Link
                href="/progress"
                className="text-xs font-bold text-[#059669] hover:text-[#0891b2] transition-colors"
              >
                Tất cả
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            ) : data && data.recentAttempts.length > 0 ? (
              <div className="space-y-2.5">
                {data.recentAttempts.map((attempt) => {
                  const pct = Math.round(
                    (attempt.totalScore / attempt.totalQuestions) * 100
                  );
                  const topicLabel =
                    attempt.topics.length === 1
                      ? TOPIC_LABELS[attempt.topics[0]] ?? attempt.topics[0]
                      : `${attempt.topics.length} chủ đề`;
                  return (
                    <div key={attempt.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {topicLabel} · {attempt.totalQuestions} câu
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {timeAgo(attempt.submittedAt)} · {formatDuration(attempt.timeTakenSecs)}
                        </p>
                      </div>
                      <span
                        className="text-xs font-black px-2.5 py-1 rounded-lg flex-shrink-0"
                        style={{
                          color: scoreColor(pct),
                          backgroundColor: `${scoreColor(pct)}18`,
                        }}
                      >
                        {attempt.totalScore}/{attempt.totalQuestions}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">
                Chưa có lần thi nào. Bắt đầu luyện tập ngay!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
