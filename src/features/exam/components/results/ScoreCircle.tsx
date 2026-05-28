'use client';

export function ScoreCircle({ score, total }: { score: number; total: number }) {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-36 h-36 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
        <circle cx="60" cy="60" r="54" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white">{score}</span>
        <span className="text-white/70 text-sm font-medium">/{total}</span>
      </div>
    </div>
  );
}

export function getScoreLabel(percentage: number) {
  if (percentage >= 90) return { text: 'Xuất sắc!', emoji: '🌟' };
  if (percentage >= 80) return { text: 'Giỏi!', emoji: '🎉' };
  if (percentage >= 65) return { text: 'Khá!', emoji: '👍' };
  if (percentage >= 50) return { text: 'Trung bình', emoji: '📚' };
  return { text: 'Cần cố gắng', emoji: '💪' };
}

export function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
