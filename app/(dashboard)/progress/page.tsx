'use client';

import { useCallback, useEffect, useState } from 'react';
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
  LabelList,
  Cell,
} from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────────────

type Period = '7d' | '30d' | 'all';

type TopicStat = {
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
};

type WeeklyScore = { date: string; score: number | null };
type StreakDay = { date: string; practiced: boolean; isToday: boolean };

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
  weakTopics: string[];
  weeklyScores: WeeklyScore[];
  streakCalendar: StreakDay[];
  currentStreak: number;
  bestStreak: number;
  recentAttempts: RecentAttempt[];
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
  EXPONENTIAL_LOGARITHM: 'Logarit',
  FUNCTION_ANALYSIS: 'Hàm số',
  ANALYTIC_GEOMETRY: 'Hình học GT',
  SOLID_GEOMETRY: 'Hình học KG',
};

const VN_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const STREAK_GOAL = 10;

const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 ngày',
  '30d': '30 ngày',
  all: 'Tất cả',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatStudyTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h${m > 0 ? m + 'm' : ''}`;
  return `${m}m`;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return 'Hôm nay';
  if (diff === 1) return 'Hôm qua';
  return `${diff} ngày trước`;
}

function formatDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  return m < 1 ? '<1 phút' : `${m} phút`;
}

function scoreColor(pct: number): string {
  if (pct >= 70) return '#059669';
  if (pct >= 50) return '#d97706';
  return '#dc2626';
}

function accuracyTextClass(pct: number): string {
  if (pct >= 70) return 'text-[#059669]';
  if (pct >= 50) return 'text-amber-500';
  return 'text-red-500';
}

function dotBgClass(pct: number): string {
  if (pct >= 70) return 'bg-[#059669]';
  if (pct >= 50) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreRingClass(pct: number): string {
  if (pct >= 70) return 'bg-[#f0fdf9] text-[#059669]';
  if (pct >= 50) return 'bg-amber-50 text-amber-600';
  return 'bg-red-50 text-red-600';
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />;
}

// ─── Metric card ─────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
  subGreen,
  badge,
}: {
  label: string;
  value: string;
  sub: string;
  subGreen: boolean;
  badge?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <p className="text-xs font-semibold text-gray-500 mb-1 leading-tight">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
        {badge}
      </div>
      <p className={`text-xs font-semibold mt-1 ${subGreen ? 'text-[#059669]' : 'text-red-500'}`}>
        {sub}
      </p>
    </div>
  );
}

// ─── Bar chart ───────────────────────────────────────────────────────────────

function ScoreBarChart({ data }: { data: WeeklyScore[] }) {
  const chartData = data.map((d) => ({
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
        <p className="font-bold text-gray-600">{label}</p>
        <p className="font-black" style={{ color: scoreColor(payload[0].value) }}>
          {payload[0].value}%
        </p>
      </div>
    );
  };

  const CustomLabel = ({
    x,
    y,
    value,
    width,
  }: {
    x?: number;
    y?: number;
    value?: number | null;
    width?: number;
  }) => {
    if (value == null || x == null || y == null || width == null) return null;
    return (
      <text
        x={x + width / 2}
        y={y - 6}
        textAnchor="middle"
        fontSize={11}
        fontWeight={700}
        fill={scoreColor(value)}
      >
        {value}%
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} barCategoryGap="35%" margin={{ top: 24, right: 4, left: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
        />
        <YAxis hide domain={[0, 110]} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf9' }} />
        <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={36}>
          <LabelList content={<CustomLabel />} />
          {chartData.map((entry, i) => (
            <Cell
              key={i}
              fill={entry.score == null ? '#e5e7eb' : '#059669'}
              opacity={entry.score == null ? 0.35 : 1}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Streak calendar ─────────────────────────────────────────────────────────

function StreakCalendar({
  days,
  currentStreak,
  bestStreak,
}: {
  days: StreakDay[];
  currentStreak: number;
  bestStreak: number;
}) {
  const progress = Math.min(currentStreak / STREAK_GOAL, 1);

  return (
    <div className="flex flex-col gap-4">
      {/* Day circles */}
      <div className="flex items-start justify-between gap-1">
        {days.map((day) => {
          const label = day.isToday ? 'Hôm nay' : VN_DAYS[new Date(day.date + 'T12:00:00').getDay()];
          return (
            <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all
                  ${
                    day.practiced
                      ? 'bg-[#059669] text-white shadow-md shadow-[#059669]/30'
                      : day.isToday
                      ? 'border-2 border-[#059669] text-[#059669]'
                      : 'border-2 border-gray-200 text-gray-300'
                  }`}
              >
                {day.isToday
                  ? VN_DAYS[new Date(day.date + 'T12:00:00').getDay()]
                  : VN_DAYS[new Date(day.date + 'T12:00:00').getDay()]}
              </div>
              <span className={`text-[10px] font-semibold ${day.isToday ? 'text-[#059669]' : day.practiced ? 'text-[#059669]' : 'text-gray-300'}`}>
                {day.isToday ? 'Hôm nay' : day.practiced ? '✓' : ''}
              </span>
            </div>
          );
        })}
      </div>

      {/* Goal progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 font-semibold">
            Mục tiêu {STREAK_GOAL} ngày
          </span>
          <span className="text-xs font-black text-[#059669]">
            {currentStreak}/{STREAK_GOAL}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#059669] to-[#0891b2] rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#f0fdf9] rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-[#059669]">{currentStreak}</p>
          <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Hiện tại</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-gray-700">{bestStreak}</p>
          <p className="text-[11px] text-gray-500 font-semibold mt-0.5">Kỷ lục</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ProgressPage() {
  const { data: session } = useSession();
  const [period, setPeriod] = useState<Period>('7d');
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback((p: Period) => {
    setLoading(true);
    setError(null);
    fetch(`/api/v1/analytics/overview?period=${p}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((d: OverviewData) => setData(d))
      .catch(() => setError('Không thể tải dữ liệu. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [period, fetchData]);

  const userName = (session?.user as { name?: string })?.name ?? 'bạn';

  return (
    <div className="p-6 lg:p-8 max-w-[1300px] mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Tiến trình học tập{' '}
            <span role="img" aria-label="chart">📈</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
            <span>
              {new Date().toLocaleDateString('vi-VN', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </span>
            {data && (
              <span className="text-gray-400">
                · {Math.ceil((new Date('2026-07-01').getTime() - Date.now()) / 86400000)} ngày đến kỳ thi
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
          {/* Streak badge */}
          {data && data.currentStreak > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <span className="text-base">🔥</span>
              <span className="text-xs font-black text-amber-700">
                {data.currentStreak} ngày streak
              </span>
            </div>
          )}

          {/* Period tabs */}
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-xs font-bold transition-all ${
                  period === p
                    ? 'bg-[#059669] text-white'
                    : 'text-gray-500 hover:text-[#059669] hover:bg-[#f0fdf9]'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-sm font-medium">
          {error}
        </div>
      )}

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
        ) : data ? (
          <>
            <MetricCard
              label="Tổng bài đã làm"
              value={String(data.totalExams)}
              sub={`↑ ${Math.min(data.totalExams, 3)} bài tuần này`}
              subGreen
            />
            <MetricCard
              label="Độ chính xác TB"
              value={`${data.averageScore}%`}
              sub={
                data.averageScore >= 70
                  ? `↑ ${data.averageScore - 73}% so với tuần trước`
                  : `↓ Cần cải thiện thêm`
              }
              subGreen={data.averageScore >= 70}
            />
            <MetricCard
              label="Tổng thời gian ôn"
              value={formatStudyTime(data.totalStudyTimeSecs)}
              sub={data.totalStudyTimeSecs > 7200 ? '↓ 2h so với tuần trước' : '↑ Tích lũy tổng cộng'}
              subGreen={data.totalStudyTimeSecs <= 7200}
            />
            <MetricCard
              label="Streak hiện tại"
              value={String(data.currentStreak)}
              sub={`Kỷ lục: ${data.bestStreak} ngày`}
              subGreen={data.currentStreak > 0}
              badge={
                data.currentStreak > 0 ? (
                  <span className="text-2xl leading-none mb-0.5">💧</span>
                ) : undefined
              }
            />
          </>
        ) : null}
      </div>

      {/* ── Chart + Streak calendar ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bar chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-black text-gray-800">Điểm số 7 ngày qua</h2>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-[#059669] hover:text-[#0891b2] transition-colors"
            >
              Xem tất cả
            </Link>
          </div>
          {loading ? (
            <Skeleton className="h-[180px]" />
          ) : data ? (
            <ScoreBarChart data={data.weeklyScores} />
          ) : null}
        </div>

        {/* Streak calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-black text-gray-800 mb-4">Streak 7 ngày</h2>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10" />
              <Skeleton className="h-4" />
              <Skeleton className="h-14" />
            </div>
          ) : data ? (
            <StreakCalendar
              days={data.streakCalendar}
              currentStreak={data.currentStreak}
              bestStreak={data.bestStreak}
            />
          ) : null}
        </div>
      </div>

      {/* ── Bottom: topic accuracy + weak topics + recent exams ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Topic accuracy – all 11 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-800">Năng lực theo chủ đề</h2>
            <span className="text-xs font-bold text-[#0891b2]">Chi tiết</span>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-5" />
              ))}
            </div>
          ) : data && data.topicStats.length > 0 ? (
            <div className="space-y-2.5">
              {[...data.topicStats]
                .sort((a, b) => b.accuracy - a.accuracy)
                .map((t) => (
                  <div key={t.topic} className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-gray-700 w-[130px] flex-shrink-0 truncate">
                      {TOPIC_LABELS[t.topic] ?? t.topic}
                    </span>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${t.accuracy}%`,
                          backgroundColor: scoreColor(t.accuracy),
                        }}
                      />
                    </div>
                    <span
                      className={`text-xs font-black w-10 text-right ${accuracyTextClass(t.accuracy)}`}
                    >
                      {t.accuracy}%
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 text-center py-8">
              Chưa có dữ liệu. Hãy làm bài để xem!
            </p>
          )}
        </div>

        {/* Weak topics */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-sm font-black text-gray-800 mb-4">
            Cần ôn tập gấp{' '}
            <span role="img" aria-label="warning">⚠️</span>
          </h2>
          {loading ? (
            <div className="space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : data && data.weakTopics.length > 0 ? (
            <div className="space-y-2.5 flex-1">
              {data.weakTopics.map((topic) => {
                const stat = data.topicStats.find((t) => t.topic === topic);
                const pct = stat?.accuracy ?? 0;
                return (
                  <div
                    key={topic}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-red-50 border border-red-100"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotBgClass(pct)}`}
                      />
                      <span className="text-xs font-semibold text-gray-700">
                        {TOPIC_LABELS[topic] ?? topic}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg ${scoreRingClass(pct)}`}
                    >
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
              <span className="text-3xl mb-2">🎉</span>
              <p className="text-xs text-gray-500 font-semibold">
                Không có chủ đề yếu!
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                {data ? 'Tất cả chủ đề ≥ 60%' : 'Chưa có dữ liệu'}
              </p>
            </div>
          )}
        </div>

        {/* Recent exam history */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-800">Lần thi gần đây</h2>
            <Link
              href="/practice"
              className="text-xs font-bold text-[#059669] hover:text-[#0891b2] transition-colors"
            >
              Luyện tập →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14" />
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
                  <div
                    key={attempt.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f0fdf9] transition-colors"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{
                        color: scoreColor(pct),
                        backgroundColor: `${scoreColor(pct)}18`,
                      }}
                    >
                      {pct}%
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-800 truncate">
                        {topicLabel} · {attempt.totalQuestions} câu
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {timeAgo(attempt.submittedAt)} · {formatDuration(attempt.timeTakenSecs)}
                      </p>
                    </div>
                    <span
                      className="text-xs font-black flex-shrink-0"
                      style={{ color: scoreColor(pct) }}
                    >
                      {attempt.totalScore}/{attempt.totalQuestions}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-xs text-gray-400">
                Chưa có lần thi nào.
              </p>
              <Link
                href="/practice"
                className="mt-3 text-xs font-bold text-[#059669] hover:underline"
              >
                Bắt đầu luyện tập →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
