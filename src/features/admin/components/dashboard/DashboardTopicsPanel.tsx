'use client';
import Link from 'next/link';
import { TOPIC_LABEL } from '@/shared/constants/topics';
import { Topic } from '@prisma/client';
import { dotBgClass, Skeleton, formatDuration, timeAgo } from '@/features/progress/components/ProgressSubComponents';

function scoreColor(pct: number): string { if (pct >= 70) return '#059669'; if (pct >= 50) return '#d97706'; return '#dc2626'; }

type TopicStat = { topic: string; totalQuestions: number; correctAnswers: number; accuracy: number };
type RecentAttempt = { id: string; topics: string[]; totalScore: number; totalQuestions: number; timeTakenSecs: number; submittedAt: string };
type OverviewData = { topicStats: TopicStat[]; weakTopics: string[]; recentAttempts: RecentAttempt[] };

interface DashboardTopicsPanelProps {
  loading: boolean;
  data: OverviewData | null;
  studyProgress: { topic: string; percent: number }[];
}

export function DashboardTopicsPanel({ loading, data, studyProgress }: DashboardTopicsPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Topic accuracy bars */}
      <div className="lg:col-span-3 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-gray-800">Năng lực theo chủ đề</h2>
          <Link href="/progress" className="text-xs font-bold text-[#059669] hover:text-[#0891b2] transition-colors">Chi tiết</Link>
        </div>
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-6" />)}</div>
        ) : (() => {
          const examMap = new Map((data?.topicStats || []).map(t => [t.topic, t.accuracy]));
          const studyMap = new Map(studyProgress.map(p => [p.topic, p.percent]));
          const allTopics = new Set([...examMap.keys(), ...studyMap.keys()]);
          const merged = Array.from(allTopics).map(topic => ({
            topic,
            examAcc: examMap.get(topic) ?? null,
            studyPct: studyMap.get(topic) ?? 0,
            combined: examMap.has(topic) ? examMap.get(topic)! : studyMap.get(topic) ?? 0,
          })).sort((a, b) => b.combined - a.combined);

          return merged.length > 0 ? (
            <div className="space-y-3">
              {merged.slice(0, 8).map(t => (
                <div key={t.topic} className="flex items-center gap-3">
                  <div className="w-[130px] flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-700">{TOPIC_LABEL[t.topic as Topic] ?? t.topic}</span>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotBgClass(t.combined)}`} />
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${t.combined}%`, backgroundColor: scoreColor(t.combined) }} />
                  </div>
                  <span className="w-10 text-right text-xs font-black text-gray-700">{t.combined}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-3">Chưa có dữ liệu thống kê</p>
              <Link href="/practice" className="inline-flex items-center gap-2 px-4 py-2 bg-[#059669] text-white text-xs font-bold rounded-xl hover:bg-[#047857] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
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
          <h2 className="text-sm font-black text-gray-800 mb-3">Cần ôn tập gấp <span role="img" aria-label="warning">⚠️</span></h2>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-8" />)}</div>
          ) : (() => {
            const weakStudy = studyProgress.filter(p => p.percent < 50).sort((a, b) => a.percent - b.percent).slice(0, 4);
            const weakExam = (data?.weakTopics || []).slice(0, 4);
            const weakItems = weakStudy.length > 0 ? weakStudy : weakExam.map(t => {
              const stat = data?.topicStats.find(s => s.topic === t);
              return { topic: t, percent: stat?.accuracy ?? 0 };
            });
            return weakItems.length > 0 ? (
              <div className="space-y-2">
                {weakItems.map(item => {
                  const pct = item.percent;
                  return (
                    <Link key={item.topic} href={`/study?topic=${item.topic}`} className="flex items-center justify-between px-3 py-2 rounded-xl bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: scoreColor(pct) }} />
                        <span className="text-xs font-semibold text-gray-700">{TOPIC_LABEL[item.topic as Topic] ?? item.topic}</span>
                      </div>
                      <span className="text-xs font-black text-red-600">{pct}%</span>
                    </Link>
                  );
                })}
              </div>
            ) : <p className="text-xs text-gray-500 text-center py-4">{data ? '🎉 Không có chủ đề yếu!' : 'Chưa có dữ liệu'}</p>;
          })()}
        </div>

        {/* Recent exams */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-black text-gray-800">Lần thi gần đây</h2>
            <Link href="/progress" className="text-xs font-bold text-[#059669] hover:text-[#0891b2] transition-colors">Tất cả</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : data && data.recentAttempts.length > 0 ? (
            <div className="space-y-2.5">
              {data.recentAttempts.map(attempt => {
                const pct = Math.round((attempt.totalScore / attempt.totalQuestions) * 100);
                const topicLabel = attempt.topics.length === 1 ? TOPIC_LABEL[attempt.topics[0] as Topic] ?? attempt.topics[0] : `${attempt.topics.length} chủ đề`;
                return (
                  <Link key={attempt.id} href={`/exam/result?attemptId=${attempt.id}`} className="flex items-center justify-between gap-2 p-2 -mx-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">{topicLabel} · {attempt.totalQuestions} câu</p>
                      <p className="text-[11px] text-gray-500">{timeAgo(attempt.submittedAt)} · {formatDuration(attempt.timeTakenSecs)}</p>
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 rounded-lg flex-shrink-0" style={{ color: scoreColor(pct), backgroundColor: `${scoreColor(pct)}18` }}>
                      {attempt.totalScore}/{attempt.totalQuestions}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-gray-500 mb-3">Chưa có lần thi nào</p>
              <Link href="/practice" className="inline-flex items-center gap-2 px-4 py-2 bg-[#059669] text-white text-xs font-bold rounded-xl hover:bg-[#047857] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                Bắt đầu luyện tập
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
