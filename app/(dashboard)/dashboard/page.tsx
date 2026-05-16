'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { TOPIC_LABEL } from '@/lib/constants/topics';
import { Topic } from '@prisma/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
};

// ─── Constants ───────────────────────────────────────────────────────────────

const VN_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatStudyTime(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0) return `${h}h${m > 0 ? m + 'm' : ''}`;
  return `${m}m`;
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
          shape={(props: any) => {
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
  useEffect(() => { document.title = 'Dashboard | MathBot'; }, []);
  const { data: session } = useSession();
  const [data, setData] = useState<OverviewData | null>(null);
  const [studyProgress, setStudyProgress] = useState<{ topic: string; percent: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/v1/analytics/overview').then(r => r.ok ? r.json() : null),
      fetch('/api/v1/study/progress').then(r => r.ok ? r.json() : []),
    ])
      .then(([analytics, progress]) => {
        if (analytics) setData(analytics);
        if (Array.isArray(progress)) setStudyProgress(progress);
      })
      .catch(() => setError('Không thể tải dữ liệu. Vui lòng thử lại.'))
      .finally(() => setLoading(false));
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
            subPositive
          />
          <MetricCard
            label="Độ chính xác TB"
            value={`${data.averageScore}%`}
            sub={data.averageScore >= 70 ? 'Kết quả tốt, tiếp tục duy trì!' : 'Cần cải thiện thêm'}
            subPositive={data.averageScore >= 70}
          />
          <MetricCard
            label="Tiến độ ôn tập"
            value={`${overallStudyPercent}%`}
            sub={overallStudyPercent >= 80 ? 'Gần hoàn thành!' : `${totalStudyRead}/${totalStudyItems} phần đã đọc`}
            subPositive={overallStudyPercent >= 50}
          />
          <MetricCard
            label="Thời gian luyện tập"
            value={formatStudyTime(Math.max(0, data.totalStudyTimeSecs))}
            sub="Tổng thời gian làm bài thi"
            subPositive
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
          ) : (() => {
            // Merge exam stats with study progress
            const examMap = new Map((data?.topicStats || []).map(t => [t.topic, t.accuracy]));
            const studyMap = new Map(studyProgress.map((p: any) => [p.topic, p.percent]));
            const allTopics = new Set([...examMap.keys(), ...studyMap.keys()]);

            const merged = Array.from(allTopics).map(topic => ({
              topic,
              examAcc: examMap.get(topic) ?? null,
              studyPct: studyMap.get(topic) ?? 0,
              // Combined score: exam accuracy if exists, else study progress
              combined: examMap.has(topic) ? examMap.get(topic)! : studyMap.get(topic) ?? 0,
            })).sort((a, b) => b.combined - a.combined);

            return merged.length > 0 ? (
              <div className="space-y-3">
                {merged.slice(0, 8).map((t) => (
                  <div key={t.topic} className="flex items-center gap-3">
                    <div className="w-[130px] flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-700">
                        {TOPIC_LABEL[t.topic as Topic] ?? t.topic}
                      </span>
                    </div>
                    <span
                      className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${accuracyDotColor(t.combined)}`}
                    />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${t.combined}%`,
                          backgroundColor: scoreColor(t.combined),
                        }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs font-black text-gray-700">
                      {t.combined}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-3">Chưa có dữ liệu thống kê</p>
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#059669] text-white text-xs font-bold rounded-xl hover:bg-[#047857] transition-colors"
                >
                  Làm bài thi đầu tiên
                </Link>
              </div>
            );
          })()}
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
            ) : (() => {
              // Topics with low study progress
              const weakStudy = studyProgress
                .filter((p: any) => p.percent < 50)
                .sort((a: any, b: any) => a.percent - b.percent)
                .slice(0, 4);
              const weakExam = (data?.weakTopics || []).slice(0, 4);
              const weakItems = weakStudy.length > 0 ? weakStudy : weakExam.map(t => {
                const stat = data?.topicStats.find(s => s.topic === t);
                return { topic: t, percent: stat?.accuracy ?? 0 };
              });

              return weakItems.length > 0 ? (
                <div className="space-y-2">
                  {weakItems.map((item: any) => {
                    const pct = item.percent ?? item.accuracy ?? 0;
                    return (
                      <Link
                        key={item.topic}
                        href={`/study?topic=${item.topic}`}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: scoreColor(pct) }}
                          />
                          <span className="text-xs font-semibold text-gray-700">
                            {TOPIC_LABEL[item.topic as Topic] ?? item.topic}
                          </span>
                        </div>
                        <span className="text-xs font-black text-red-600">{pct}%</span>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-gray-500 text-center py-4">
                  {data ? '🎉 Không có chủ đề yếu!' : 'Chưa có dữ liệu'}
                </p>
              );
            })()}
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
                      ? TOPIC_LABEL[attempt.topics[0] as Topic] ?? attempt.topics[0]
                      : `${attempt.topics.length} chủ đề`;
                  return (
                    <Link key={attempt.id} href={`/exam/result?attemptId=${attempt.id}`} className="flex items-center justify-between gap-2 p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          {topicLabel} · {attempt.totalQuestions} câu
                        </p>
                        <p className="text-[11px] text-gray-500">
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
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-gray-500 mb-3">Chưa có lần thi nào</p>
                <Link
                  href="/practice"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#059669] text-white text-xs font-bold rounded-xl hover:bg-[#047857] transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  Bắt đầu luyện tập
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
