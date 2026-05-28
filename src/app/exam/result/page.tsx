'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, AlertCircle } from 'lucide-react';
import { TOPIC_LABEL } from '@/shared/constants/topics';
import { ExamAnswerList } from '@/features/exam/components/results/ExamAnswerList';
import { ExamResultHero } from '@/features/exam/components/results/ExamResultHero';
import { ExamResultDetailsGrid } from '@/features/exam/components/results/ExamResultDetailsGrid';
import { useExamResultStats, ExamAttempt } from '@/features/exam/hooks/useExamResultStats';

const TOPIC_LABELS = TOPIC_LABEL as Record<string, string>;

export default function ExamResultPage() {
  return <Suspense><ExamResultContent /></Suspense>;
}

function ExamResultContent() {
  useEffect(() => { document.title = 'Kết quả bài thi | MathBot'; }, []);
  const searchParams = useSearchParams();
  const router = useRouter();
  const attemptId = searchParams.get('attemptId');

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!attemptId) return;
    fetch(`/api/v1/exam/result?attemptId=${attemptId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data) setAttempt(data); })
      .catch(err => console.error('Error fetching exam result:', err))
      .finally(() => setLoading(false));
  }, [attemptId]);

  const { stats, filteredAnswers, filter, setFilter, expandedQuestions, toggleExpand } = useExamResultStats(attempt);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
    </div>
  );

  if (!attempt || !stats) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-900">Không tìm thấy kết quả</h1>
        <p className="text-slate-500 mt-2">Bài thi có thể chưa được nộp hoặc ID không hợp lệ.</p>
        <button onClick={() => router.push('/dashboard')} className="mt-6 px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl">Về Dashboard</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="font-black text-xl text-slate-900 italic tracking-tighter">MathBot</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-600 font-bold hover:text-slate-900 transition-colors">Về trang chủ</Link>
          <button onClick={() => router.push('/exam')} className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors">Thi lại ngay →</button>
        </div>
      </nav>

      <ExamResultHero attempt={attempt} stats={stats} />
      <ExamResultDetailsGrid diffData={stats.diffData} topicData={stats.topicData} timeData={stats.timeData} suggestions={stats.suggestions} />

      {/* Review Section */}
      <section className="max-w-4xl mx-auto mt-12 px-4 shadow-sm">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-black text-slate-900 text-lg">Chi tiết từng câu</h2>
            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200">
              {[
                { id: 'ALL' as const, label: `Tất cả (${attempt.totalQuestions})` },
                { id: 'WRONG' as const, label: `Sai (${stats.wrong + stats.skip})` },
                { id: 'CORRECT' as const, label: `Đúng (${stats.correct})` }
              ].map(f => (
                <button key={f.id} onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === f.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <ExamAnswerList
            answers={filteredAnswers}
            topicLabels={TOPIC_LABELS}
            avgTimeSecs={attempt.totalQuestions > 0 ? Math.floor(attempt.timeTakenSecs / attempt.totalQuestions) : 0}
            expandedIds={expandedQuestions}
            onToggle={toggleExpand}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto mt-12 mb-20 px-4 flex flex-col md:flex-row items-center justify-center gap-4">
        <button onClick={() => router.push('/dashboard')} className="w-full md:w-auto px-8 py-3 bg-white text-slate-600 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Về trang luyện tập
        </button>
        <button className="w-full md:w-auto px-8 py-3 bg-white text-slate-900 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" /> Xem AI giải thích
        </button>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-slate-200">
          Thi lại ngay →
        </button>
      </footer>
    </div>
  );
}

