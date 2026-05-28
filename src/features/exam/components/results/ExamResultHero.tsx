'use client';
import { TOPIC_LABEL } from '@/shared/constants/topics';

const TOPIC_LABELS = TOPIC_LABEL as Record<string, string>;

interface ExamResultHeroProps {
  attempt: {
    totalScore: number; totalQuestions: number; timeTakenSecs: number;
    topics: string[]; submittedAt: string;
  };
  stats: { correct: number; wrong: number; skip: number; timeFormatted: string };
}

export function ExamResultHero({ attempt, stats }: ExamResultHeroProps) {
  const pct = attempt.totalQuestions > 0 ? attempt.totalScore / attempt.totalQuestions : 0;
  const badge = pct >= 0.8 ? { icon: '🏆', label: 'Xuất sắc' } : pct >= 0.6 ? { icon: '✅', label: 'Tốt' } : pct >= 0.4 ? { icon: '📝', label: 'Khá' } : { icon: '💪', label: 'Cần ôn thêm' };

  return (
    <header className="max-w-4xl mx-auto mt-8 px-4">
      <div className="bg-gradient-to-br from-[#059669] to-[#0891b2] rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-200/50">
        <div className="absolute top-6 right-6">
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 flex items-center gap-2">
            <span className="text-xl">{badge.icon}</span>
            <span className="font-black uppercase text-xs tracking-widest text-white">{badge.label}</span>
          </div>
        </div>

        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-widest mb-4">
          Thi nhanh · {attempt.totalQuestions} câu · 15 phút
        </span>

        <div className="flex flex-col items-center gap-1">
          <span className="text-8xl font-black italic tracking-tighter drop-shadow-lg">{attempt.totalScore}</span>
          <span className="text-white/70 font-bold uppercase tracking-widest text-sm">/ 10 điểm</span>
        </div>

        <div className="mt-8 flex justify-center gap-3 text-[13px] font-medium text-white/80">
          {attempt.topics.map(t => TOPIC_LABELS[t] || t).join(' · ')}
          <span> · Hoàn thành lúc {new Date(attempt.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>

        <div className="grid grid-cols-4 gap-4 mt-8">
          {[
            { label: 'Câu đúng', value: stats.correct, color: 'bg-emerald-500/20 text-emerald-100' },
            { label: 'Câu sai', value: stats.wrong, color: 'bg-red-500/20 text-red-100' },
            { label: 'Bỏ qua', value: stats.skip, color: 'bg-slate-500/20 text-slate-100' },
            { label: 'Thời gian', value: stats.timeFormatted, color: 'bg-amber-500/20 text-amber-100' }
          ].map(s => (
            <div key={s.label} className={`${s.color} backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center gap-1 border border-white/10`}>
              <span className="text-2xl font-black">{s.value}</span>
              <span className="text-[10px] font-bold uppercase opacity-70 tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
