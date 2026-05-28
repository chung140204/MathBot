'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell,
} from 'recharts';

// ---------------------------------------------------------------------------
// Types (shared with page)
// ---------------------------------------------------------------------------

export type Period = '7d' | '30d' | 'all';
export type TopicStat = { topic: string; totalQuestions: number; correctAnswers: number; accuracy: number };
export type WeeklyScore = { date: string; score: number | null };
export type StreakDay = { date: string; practiced: boolean; isToday: boolean };
export type RecentAttempt = { id: string; topics: string[]; totalScore: number; totalQuestions: number; timeTakenSecs: number; submittedAt: string };
export type OverviewData = {
  totalExams: number; averageScore: number; bestScore: number; totalCorrect: number; totalStudyTimeSecs: number;
  topicStats: TopicStat[]; weakTopics: string[]; weeklyScores: WeeklyScore[]; streakCalendar: StreakDay[];
  currentStreak: number; bestStreak: number; recentAttempts: RecentAttempt[];
};

export const PERIOD_LABELS: Record<Period, string> = { '7d': '7 ngày', '30d': '30 ngày', all: 'Tất cả' };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const VN_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const STREAK_GOAL = 10;

export function formatStudyTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  return h > 0 ? `${h}h${m > 0 ? m + 'm' : ''}` : `${m}m`;
}

export function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (diff === 0) return 'Hôm nay';
  if (diff === 1) return 'Hôm qua';
  return `${diff} ngày trước`;
}

export function formatDuration(secs: number) {
  const m = Math.floor(secs / 60);
  return m < 1 ? '<1 phút' : `${m} phút`;
}

function scoreColor(pct: number) { return pct >= 70 ? '#059669' : pct >= 50 ? '#d97706' : '#dc2626'; }
export function accuracyTextClass(pct: number) { return pct >= 70 ? 'text-[#059669]' : pct >= 50 ? 'text-amber-500' : 'text-red-500'; }
export function dotBgClass(pct: number) { return pct >= 70 ? 'bg-[#059669]' : pct >= 50 ? 'bg-amber-500' : 'bg-red-500'; }
export function scoreRingClass(pct: number) { return pct >= 70 ? 'bg-[#f0fdf9] text-[#059669]' : pct >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'; }

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export function Skeleton({ className }: { className: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />;
}

// ---------------------------------------------------------------------------
// MetricCard
// ---------------------------------------------------------------------------

export function MetricCard({ label, value, sub, subGreen, badge }: {
  label: string; value: string; sub: string; subGreen: boolean; badge?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <p className="text-xs font-semibold text-gray-500 mb-1 leading-tight">{label}</p>
      <div className="flex items-end gap-2">
        <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
        {badge}
      </div>
      <p className={`text-xs font-semibold mt-1 ${subGreen ? 'text-[#059669]' : 'text-red-500'}`}>{sub}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScoreBarChart
// ---------------------------------------------------------------------------

export function ScoreBarChart({ data }: { data: WeeklyScore[] }) {
  const chartData = data.map(d => ({ day: VN_DAYS[new Date(d.date + 'T12:00:00').getDay()], score: d.score }));

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (!active || !payload?.length || payload[0].value == null) return null;
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-sm">
        <p className="font-bold text-gray-600">{label}</p>
        <p className="font-black" style={{ color: scoreColor(payload[0].value) }}>{payload[0].value}%</p>
      </div>
    );
  };

  const CustomLabel = ({ x, y, value, width }: { x?: number; y?: number; value?: number | null; width?: number }) => {
    if (value == null || x == null || y == null || width == null) return null;
    return <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={scoreColor(value)}>{value}%</text>;
  };

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} barCategoryGap="35%" margin={{ top: 24, right: 4, left: 4, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#f0f0f0" />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }} />
        <YAxis hide domain={[0, 110]} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f0fdf9' }} />
        <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={36}>
          <LabelList content={<CustomLabel />} />
          {chartData.map((entry, i) => <Cell key={i} fill={entry.score == null ? '#e5e7eb' : '#059669'} opacity={entry.score == null ? 0.35 : 1} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ---------------------------------------------------------------------------
// StreakCalendar
// ---------------------------------------------------------------------------

export function StreakCalendar({ days = [], currentStreak = 0, bestStreak = 0 }: { days?: StreakDay[]; currentStreak?: number; bestStreak?: number }) {
  const progress = Math.min(currentStreak / STREAK_GOAL, 1);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-1">
        {days.map(day => {
          return (
            <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                day.practiced ? 'bg-[#059669] text-white shadow-md shadow-[#059669]/30'
                  : day.isToday ? 'border-2 border-[#059669] text-[#059669]' : 'border-2 border-gray-200 text-gray-300'
              }`}>{VN_DAYS[new Date(day.date + 'T12:00:00').getDay()]}</div>
              <span className={`text-[10px] font-semibold ${day.isToday ? 'text-[#059669]' : day.practiced ? 'text-[#059669]' : 'text-gray-300'}`}>
                {day.isToday ? 'Hôm nay' : day.practiced ? '✓' : ''}
              </span>
            </div>
          );
        })}
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500 font-semibold">Mục tiêu {STREAK_GOAL} ngày</span>
          <span className="text-xs font-black text-[#059669]">{currentStreak}/{STREAK_GOAL}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#059669] to-[#0891b2] rounded-full transition-all duration-500" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#f0fdf9] rounded-xl p-3 text-center"><p className="text-2xl font-black text-[#059669]">{currentStreak}</p><p className="text-[11px] text-gray-500 font-semibold mt-0.5">Hiện tại</p></div>
        <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-2xl font-black text-gray-700">{bestStreak}</p><p className="text-[11px] text-gray-500 font-semibold mt-0.5">Kỷ lục</p></div>
      </div>
    </div>
  );
}
