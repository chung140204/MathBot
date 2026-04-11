'use client';

import Link from 'next/link';

interface ExamSidebarProps {
  examTitle: string;
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, string | null>;
  skipped: Set<string>;
  questionIds: string[];
  timeRemaining: number;
  onNavigate: (index: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function ExamSidebar({
  examTitle,
  totalQuestions,
  currentIndex,
  answers,
  skipped,
  questionIds,
  timeRemaining,
  onNavigate,
  onSubmit,
  isSubmitting,
}: ExamSidebarProps) {
  const answeredCount = Object.values(answers).filter((a) => a !== null && a !== undefined).length;
  const skippedCount = skipped.size;
  const unansweredCount = totalQuestions - answeredCount - skippedCount;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const isWarning = timeRemaining <= 300;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timerDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  function getQuestionColor(index: number): string {
    const qId = questionIds[index];
    if (index === currentIndex) return 'bg-[#0891b2] text-white';
    if (answers[qId] !== null && answers[qId] !== undefined) return 'bg-[#059669] text-white';
    if (skipped.has(qId)) return 'bg-[#eab308] text-white';
    return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  }

  return (
    <aside className="w-[360px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col h-screen shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#059669] to-[#0891b2] flex items-center justify-center text-white font-black text-sm shadow-md">
            M
          </div>
          <span className="text-xl font-black tracking-tighter text-gray-900 uppercase italic">
            MathBot
          </span>
        </Link>
      </div>

      {/* Exam info */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-bold text-gray-900 text-base">{examTitle}</h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-gray-500">{totalQuestions} câu</span>
          <span className="px-2 py-0.5 bg-red-50 text-red-500 text-xs font-semibold rounded-full">
            Trắc nghiệm
          </span>
        </div>
      </div>

      {/* Timer */}
      <div className="px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
          Thời gian còn lại
        </p>
        <p
          className={`text-4xl font-black tabular-nums tracking-tight transition-colors ${
            isWarning ? 'text-[#eab308]' : 'text-[#059669]'
          }`}
        >
          {timerDisplay}
        </p>

        {/* Timer bar */}
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isWarning
                ? 'bg-[#eab308]'
                : 'bg-gradient-to-r from-[#059669] to-[#0891b2]'
            }`}
            style={{ width: `${(timeRemaining / 1800) * 100}%` }}
          />
        </div>
      </div>

      {/* Progress */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Tiến độ</p>
          <p className="text-sm font-bold text-gray-600">
            {answeredCount} / {totalQuestions} câu
          </p>
        </div>

        {/* Question grid */}
        <div className="grid grid-cols-5 gap-2">
          {questionIds.map((_, index) => (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`w-full aspect-square rounded-xl text-sm font-bold transition-all
                ${getQuestionColor(index)}
                ${index === currentIndex ? 'ring-2 ring-[#0891b2]/30 scale-105' : ''}
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Stats footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm mb-4">
          <span>
            Đã làm: <strong className="text-[#059669]">{answeredCount}</strong>
          </span>
          <span>
            Bỏ qua: <strong className="text-[#eab308]">{skippedCount}</strong>
          </span>
          <span>
            Chưa làm: <strong className="text-gray-500">{unansweredCount}</strong>
          </span>
        </div>

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gray-900 text-white font-bold rounded-2xl text-base
            hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Đang nộp...
            </span>
          ) : (
            'Nộp bài →'
          )}
        </button>
      </div>
    </aside>
  );
}
