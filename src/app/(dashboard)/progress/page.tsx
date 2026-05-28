'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { TOPIC_LABEL } from '@/shared/constants/topics';
import { Topic } from '@prisma/client';
import {
  type Period, type OverviewData, PERIOD_LABELS,
  formatStudyTime, timeAgo, formatDuration,
  accuracyTextClass, dotBgClass, scoreRingClass,
  Skeleton, MetricCard, ScoreBarChart, StreakCalendar,
} from '@/features/progress/components/ProgressSubComponents';

function scoreColor(pct: number) { return pct >= 70 ? '#059669' : pct >= 50 ? '#d97706' : '#dc2626'; }

export default function ProgressPage() {
  useEffect(() => { document.title = 'Tiến trình | MathBot'; }, []);
  const { data: session } = useSession();
  const [period, setPeriod] = useState<Period>('7d');
  const [data, setData] = useState<OverviewData | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [studyProgress, setStudyProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback((p: Period) => {
    setLoading(true); setError(null);
    Promise.all([
      fetch(`/api/v1/analytics/overview?period=${p}`).then(r => r.ok ? r.json() : null),
      fetch('/api/v1/study/progress').then(r => r.ok ? r.json() : []),
    ]).then(([analytics, progress]) => {
      if (analytics) setData(analytics);
      if (Array.isArray(progress)) setStudyProgress(progress);
    }).catch(() => setError('Không thể tải dữ liệu. Vui lòng thử lại.')).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(period); }, [period, fetchData]);

  return (
    <div className="p-6 lg:p-8 max-w-[1300px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Tiến trình học tập <span role="img" aria-label="chart">📈</span></h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-2">
            <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            {data && <span className="text-gray-500">· {Math.ceil((new Date('2026-07-01').getTime() - Date.now()) / 86400000)} ngày đến kỳ thi</span>}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
          {data && data.currentStreak > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
              <span className="text-base">🔥</span>
              <span className="text-xs font-black text-amber-700">{data.currentStreak} ngày streak</span>
            </div>
          )}
          <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 text-xs font-bold transition-all ${period === p ? 'bg-[#059669] text-white' : 'text-gray-500 hover:text-[#059669] hover:bg-[#f0fdf9]'}`}>
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-sm font-medium">{error}</div>}

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />) : data ? (
          <>
            <MetricCard label="Tổng bài đã làm" value={String(data.totalExams)} sub={`↑ ${Math.min(data.totalExams, 3)} bài tuần này`} subGreen />
            <MetricCard label="Độ chính xác TB" value={`${data.averageScore}%`} sub={data.averageScore >= 70 ? `↑ ${data.averageScore - 73}% so với tuần trước` : '↓ Cần cải thiện thêm'} subGreen={data.averageScore >= 70} />
            <MetricCard label="Tổng thời gian ôn" value={formatStudyTime(Math.max(0, data.totalStudyTimeSecs))} sub="↑ Tích lũy tổng cộng" subGreen />
            <MetricCard label="Streak hiện tại" value={String(data.currentStreak ?? 0)} sub={`Kỷ lục: ${data.bestStreak ?? 0} ngày`} subGreen={(data.currentStreak ?? 0) > 0}
              badge={(data.currentStreak ?? 0) > 0 ? <span className="text-2xl leading-none mb-0.5">💧</span> : undefined} />
          </>
        ) : null}
      </div>

      {/* Chart + Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-black text-gray-800">Điểm số 7 ngày qua</h2>
            <Link href="/dashboard" className="text-xs font-bold text-[#059669] hover:text-[#0891b2] transition-colors">Xem tất cả</Link>
          </div>
          {loading ? <Skeleton className="h-[180px]" /> : data ? <ScoreBarChart data={data.weeklyScores} /> : null}
        </div>
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="text-sm font-black text-gray-800 mb-4">Streak 7 ngày</h2>
          {loading ? <div className="space-y-3"><Skeleton className="h-10" /><Skeleton className="h-4" /><Skeleton className="h-14" /></div>
            : data ? <StreakCalendar days={data.streakCalendar} currentStreak={data.currentStreak} bestStreak={data.bestStreak} /> : null}
        </div>
      </div>

      {/* Bottom: topics + weak + recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Topic accuracy */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-800">Năng lực theo chủ đề</h2>
            <span className="text-xs font-bold text-[#0891b2]">Chi tiết</span>
          </div>
          {loading ? <div className="space-y-3">{Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-5" />)}</div>
            : (() => {
              const examMap = new Map((data?.topicStats || []).map(t => [t.topic, t.accuracy]));
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const studyMap = new Map(studyProgress.map((p: any) => [p.topic, p.percent]));
              const merged = Array.from(new Set([...examMap.keys(), ...studyMap.keys()]))
                .map(topic => ({ topic, combined: examMap.has(topic) ? examMap.get(topic)! : studyMap.get(topic) ?? 0 }))
                .sort((a, b) => b.combined - a.combined);
              return merged.length > 0 ? (
                <div className="space-y-2.5">
                  {merged.map(t => (
                    <Link key={t.topic} href={`/study?topic=${t.topic}`} className="flex items-center justify-between gap-2 hover:bg-gray-50 rounded-lg px-1 py-0.5 -mx-1 transition-colors">
                      <span className="text-xs font-semibold text-gray-700 w-[130px] flex-shrink-0 truncate">{TOPIC_LABEL[t.topic as Topic] ?? t.topic}</span>
                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${t.combined}%`, backgroundColor: scoreColor(t.combined) }} />
                      </div>
                      <span className={`text-xs font-black w-10 text-right ${accuracyTextClass(t.combined)}`}>{t.combined}%</span>
                    </Link>
                  ))}
                </div>
              ) : <p className="text-xs text-gray-500 text-center py-8">Chưa có dữ liệu. Hãy ôn tập hoặc làm bài!</p>;
            })()}
        </div>

        {/* Weak topics */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-sm font-black text-gray-800 mb-4">Cần ôn tập gấp <span role="img" aria-label="warning">⚠️</span></h2>
          {loading ? <div className="space-y-2.5">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
            : (() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const weakStudy = studyProgress.filter((p: any) => p.percent < 50).sort((a: any, b: any) => a.percent - b.percent).slice(0, 5);
              const weakExam = (data?.weakTopics || []).map(t => ({ topic: t, percent: data?.topicStats.find(s => s.topic === t)?.accuracy ?? 0 }));
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const weakItems: any[] = weakStudy.length > 0 ? weakStudy : weakExam;
              return weakItems.length > 0 ? (
                <div className="space-y-2.5 flex-1">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {weakItems.map((item: any) => (
                    <Link key={item.topic} href={`/study?topic=${item.topic}`}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotBgClass(item.percent ?? 0)}`} />
                        <span className="text-xs font-semibold text-gray-700">{TOPIC_LABEL[item.topic as Topic] ?? item.topic}</span>
                      </div>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${scoreRingClass(item.percent ?? 0)}`}>{item.percent ?? 0}%</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                  <span className="text-3xl mb-2">🎉</span>
                  <p className="text-xs text-gray-500 font-semibold">Không có chủ đề yếu!</p>
                  <p className="text-[11px] text-gray-500 mt-1">{data ? 'Tất cả chủ đề ≥ 60%' : 'Chưa có dữ liệu'}</p>
                </div>
              );
            })()}
        </div>

        {/* Recent exams */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-gray-800">Lần thi gần đây</h2>
            <Link href="/practice" className="text-xs font-bold text-[#059669] hover:text-[#0891b2] transition-colors">Luyện tập →</Link>
          </div>
          {loading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
            : data && data.recentAttempts.length > 0 ? (
              <div className="space-y-2.5">
                {data.recentAttempts.map(attempt => {
                  const pct = Math.round((attempt.totalScore / attempt.totalQuestions) * 100);
                  const topicLabel = attempt.topics.length === 1 ? (TOPIC_LABEL[attempt.topics[0] as Topic] ?? attempt.topics[0]) : `${attempt.topics.length} chủ đề`;
                  return (
                    <div key={attempt.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#f0fdf9] transition-colors">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0"
                        style={{ color: scoreColor(pct), backgroundColor: `${scoreColor(pct)}18` }}>{pct}%</div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-800 truncate">{topicLabel} · {attempt.totalQuestions} câu</p>
                        <p className="text-[11px] text-gray-500">{timeAgo(attempt.submittedAt)} · {formatDuration(attempt.timeTakenSecs)}</p>
                      </div>
                      <span className="text-xs font-black flex-shrink-0" style={{ color: scoreColor(pct) }}>{attempt.totalScore}/{attempt.totalQuestions}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-xs text-gray-500">Chưa có lần thi nào.</p>
                <Link href="/practice" className="mt-3 text-xs font-bold text-[#059669] hover:underline">Bắt đầu luyện tập →</Link>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
