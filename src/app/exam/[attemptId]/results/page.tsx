'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MathRenderer from '@/shared/components/MathRenderer';
import type { ExamResultData } from '@/features/exam/components/results/types';
import { ScoreCircle, getScoreLabel, formatTime } from '@/features/exam/components/results/ScoreCircle';
import { TopicBar } from '@/features/exam/components/results/TopicBar';
import { QuestionResultItem } from '@/features/exam/components/results/QuestionResultItem';

export default function ExamResultsPage() {
  const { attemptId } = useParams();
  const [data, setData] = useState<ExamResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/v1/exam/attempts/${attemptId}`);
        if (!res.ok) throw new Error('Không thể tải kết quả bài thi');
        const resultData = await res.json();
        setData(resultData);
        const wrongIds = resultData.results.filter((r: { isCorrect: boolean }) => !r.isCorrect).map((r: { questionId: string }) => r.questionId);
        setExpandedIds(new Set(wrongIds));
      } catch (err: unknown) { setError(err instanceof Error ? err.message : 'Lỗi không xác định'); }
      finally { setLoading(false); }
    })();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0fdf9] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-emerald-700 font-bold">Đang tải kết quả...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f0fdf9] flex flex-col items-center justify-center p-6 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Đã xảy ra lỗi</h1>
        <p className="text-gray-600 mb-6">{error || 'Không tìm thấy dữ liệu bài thi'}</p>
        <Link href="/dashboard" className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg">Quay lại Dashboard</Link>
      </div>
    );
  }

  const scoreLabel = getScoreLabel(data.percentage);
  const wrongCount = data.totalQuestions - data.totalScore;
  const improvement = data.previousAttempt ? data.percentage - data.previousAttempt.percentage : null;
  const wrongTopics = data.topicStats.filter(t => t.accuracy < 80).map(t => t.label);

  function toggleQuestion(id: string) {
    setExpandedIds(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  }

  return (
    <div className="min-h-screen bg-[#f0fdf9]">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#059669] to-[#0891b2] flex items-center justify-center text-white font-black text-xs">M</div>
              <span className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">MathBot</span>
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">← Dashboard</Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Làm lại đề này</button>
            <Link href={`/chat?context=exam-review&attemptId=${data.attemptId}`}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#059669] to-[#0891b2] rounded-xl hover:shadow-lg hover:shadow-[#059669]/20 transition-all">Hỏi AI giải thích →</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#059669] to-[#0891b2] py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">Kết quả bài thi</p>
          <ScoreCircle score={data.totalScore} total={data.totalQuestions} />
          <h1 className="text-2xl font-black text-white mt-4">{scoreLabel.text} {scoreLabel.emoji}</h1>
          <p className="text-white/70 text-sm mt-1">{data.examTitle} · {data.totalQuestions} câu · Hoàn thành lúc {formatTime(data.timeTakenSecs)}</p>
          <div className="flex items-center justify-center gap-4 mt-8">
            {[{ value: `${data.percentage}%`, label: 'Điểm số' }, { value: String(data.totalScore), label: 'Câu đúng' }, { value: String(wrongCount), label: 'Câu sai' }, { value: formatTime(data.timeTakenSecs), label: 'Thời gian' }].map(stat => (
              <div key={stat.label} className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 min-w-[100px]">
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-white/60 text-xs font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Topic + Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-5">Kết quả theo chủ đề</h2>
            <div className="space-y-3.5">
              {data.topicStats.map(stat => <TopicBar key={stat.topic} label={stat.label} accuracy={stat.accuracy} correct={stat.correct} total={stat.total} />)}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-5">So sánh với lần trước</h2>
            {data.previousAttempt ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span className="text-sm text-gray-500">Lần này</span><span className="text-3xl font-black text-[#059669]">{data.percentage}%</span></div>
                <div className="flex items-center justify-between"><span className="text-sm text-gray-500">Lần trước</span><span className="text-2xl font-bold text-gray-400">{data.previousAttempt.percentage}%</span></div>
                <hr className="border-gray-100" />
                <div className="flex items-center justify-between bg-[#f0fdf9] rounded-xl p-4">
                  <span className="text-sm font-medium text-gray-600">Cải thiện</span>
                  <span className={`text-lg font-black ${improvement !== null && improvement >= 0 ? 'text-[#059669]' : 'text-red-500'}`}>
                    {improvement !== null && improvement >= 0 ? '↑' : '↓'} {improvement !== null ? `${improvement >= 0 ? '+' : ''}${improvement}%` : '—'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <p className="text-sm">Đây là lần thi đầu tiên</p><p className="text-xs mt-1">Kết quả sẽ được so sánh ở lần sau</p>
              </div>
            )}
          </div>
        </div>

        {/* Question list */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Chi tiết từng câu</h2>
            <button onClick={() => setShowAll(!showAll)} className="text-sm font-semibold text-[#0891b2] hover:underline">{showAll ? 'Chỉ xem câu sai' : 'Xem tất cả'}</button>
          </div>
          <div className="space-y-3">
            {data.results.map(result => {
              if (!showAll && result.isCorrect) {
                return (
                  <div key={result.questionId} className="flex items-center gap-4 px-5 py-3 border-2 border-[#059669]/10 rounded-2xl bg-white">
                    <span className="w-8 h-8 rounded-full bg-[#f0fdf9] text-[#059669] flex items-center justify-center text-sm font-bold">{result.questionNumber}</span>
                    <span className="flex-1 text-sm text-gray-500 truncate"><MathRenderer content={result.content} /></span>
                    <span className="text-xs font-bold text-[#059669]">✓ Đúng</span>
                  </div>
                );
              }
              return <QuestionResultItem key={result.questionId} result={result} isExpanded={expandedIds.has(result.questionId)} onToggle={() => toggleQuestion(result.questionId)} />;
            })}
          </div>
        </div>

        {/* CTA Banner */}
        {wrongCount > 0 && (
          <div className="bg-gradient-to-r from-[#059669] to-[#0891b2] rounded-2xl p-8 text-center">
            <h3 className="text-xl font-black text-white">Còn {wrongCount} câu sai cần ôn lại 💪</h3>
            <p className="text-white/70 text-sm mt-1">AI đã phân tích — bạn cần ôn thêm phần {wrongTopics.length > 0 ? wrongTopics.join(' và ') : 'các chủ đề'}</p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <Link href="/dashboard" className="px-6 py-3 bg-white text-gray-800 font-bold rounded-xl hover:shadow-lg transition-all text-sm">Về Dashboard</Link>
              <Link href={`/chat?context=exam-review&attemptId=${data.attemptId}&wrongTopics=${wrongTopics.join(',')}`}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all text-sm">Hỏi AI về câu sai</Link>
            </div>
          </div>
        )}
      </div>
      <div className="h-12" />
    </div>
  );
}
