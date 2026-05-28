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
    if (index === currentIndex) return 'bg-[#065f46] text-white ring-2 ring-emerald-300';
    if (answers[qId] !== null && answers[qId] !== undefined) return 'bg-[#059669] text-white';
    
    // Check if it's a TRUE_FALSE question (needs proper mapping if we had formats in props)
    // For now, using the skipped logic or default
    if (skipped.has(qId)) return 'bg-[#eab308] text-white';
    return 'bg-white border-[#e2e8f0] text-[#64748b] border hover:bg-slate-50';
  }

  return (
    <aside className="w-[240px] flex-shrink-0 bg-[#f8fafc] border-r border-[#e2e8f0] flex flex-col h-screen overflow-hidden">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#059669] to-[#0891b2] flex items-center justify-center text-white font-bold text-xs uppercase">
          M
        </div>
        <span className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">
          MathBot
        </span>
      </div>

      {/* Progress & Timer Info */}
      <div className="px-5 py-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tiến trình</span>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{answeredCount}/{totalQuestions}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Timer Section */}
      <div className="px-5 py-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Thời gian</p>
        <div className={`text-2xl font-black tabular-nums tracking-tighter ${isWarning ? 'text-[#ef4444]' : 'text-slate-900'}`}>
          {timerDisplay}
        </div>
      </div>

      {/* Question grid */}
      <div className="flex-1 overflow-y-auto px-5 py-2 custom-scrollbar">
        <div className="grid grid-cols-4 gap-2 pb-6">
          {questionIds.map((_, index) => (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all
                ${getQuestionColor(index)}
              `}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Legend */}
      <div className="px-5 py-4 border-t border-[#e2e8f0] bg-white flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
          <div className="w-3 h-3 rounded bg-[#059669]" /> Answered
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
          <div className="w-3 h-3 rounded bg-white border border-[#e2e8f0]" /> Unanswered
        </div>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="mt-2 w-full py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isSubmitting ? '...' : 'Nộp bài'}
        </button>
      </div>
    </aside>
  );
}
