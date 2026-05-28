'use client';

import { useEffect } from 'react';
import ExamSidebar from '@/features/exam/components/ExamSidebar';
import ExamQuestion from '@/features/exam/components/ExamQuestion';
import ExamSetupModal from '@/features/exam/components/ExamSetupModal';
import { useExamState } from '@/features/exam/hooks/useExamState';

export default function ExamPage() {
  useEffect(() => { document.title = 'Làm bài thi | MathBot'; }, []);

  const { state, dispatch, phase, isGenerating, setupError, isHydrated, handleStartExam, handleSubmit } = useExamState();

  if (!isHydrated) return null;

  const examTitle = state.examMode === 'thpt' ? 'Đề thi thử THPT QG 2025' : state.examMode === 'quick' ? 'Thi nhanh' : 'Luyện đề chuẩn';
  const examBadge = state.examMode === 'thpt' ? '12 TN + 4 ĐS + 6 TL' : `${state.questions.length} câu`;

  if (phase === 'setup') {
    if (isGenerating) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
          <div className="text-center">
            <div className="w-10 h-10 border-[3px] border-[#059669]/20 border-t-[#059669] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-600">Đang tạo đề thi...</p>
            {setupError && <p className="text-sm text-red-600 mt-3">{setupError}</p>}
          </div>
        </div>
      );
    }
    return (
      <div>
        <ExamSetupModal onStart={(config) => handleStartExam({ mode: 'standard', topics: config.topics })} isLoading={isGenerating} />
        {setupError && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="rounded-xl bg-red-50 border border-red-200 px-6 py-3 text-sm text-red-700 shadow-lg">{setupError}</div>
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentIndex];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <ExamSidebar
        examTitle={examTitle}
        totalQuestions={state.questions.length}
        currentIndex={state.currentIndex}
        answers={state.answers}
        skipped={state.skipped}
        questionIds={state.questions.map(q => q.id)}
        timeRemaining={state.timeRemaining}
        onNavigate={(idx) => dispatch({ type: 'NAVIGATE', index: idx })}
        onSubmit={() => handleSubmit(false)}
        isSubmitting={state.isSubmitting}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{examTitle}</span>
            <div className="h-4 w-px bg-slate-200" />
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded">{examBadge}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-700">{Object.keys(state.answers).length}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-amber-600">{state.skipped?.size ?? 0}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold">
                <span className="w-2 h-2 rounded-full bg-slate-200" />
                <span className="text-slate-500">{Math.max(0, state.questions.length - Object.keys(state.answers).length - (state.skipped?.size ?? 0))}</span>
              </div>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <span className="text-sm font-black text-slate-900">
              {state.questions.length > 0 ? Math.round((Object.keys(state.answers).length / state.questions.length) * 100) : 0}%
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {currentQuestion && (
            <ExamQuestion
              question={currentQuestion}
              questionNumber={state.currentIndex + 1}
              totalQuestions={state.questions.length}
              selectedAnswer={state.answers[currentQuestion.id] ?? null}
              onSelectAnswer={(val) => dispatch({ type: 'SELECT_ANSWER', questionId: currentQuestion.id, answer: val })}
              onSkip={() => dispatch({ type: 'SKIP_QUESTION', questionId: currentQuestion.id })}
              onPrev={() => dispatch({ type: 'NAVIGATE', index: state.currentIndex - 1 })}
              onNext={() => dispatch({ type: 'NAVIGATE', index: state.currentIndex + 1 })}
              hasPrev={state.currentIndex > 0}
              hasNext={state.currentIndex < state.questions.length - 1}
            />
          )}
        </main>
      </div>
    </div>
  );
}
