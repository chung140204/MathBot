'use client';

export function TopicBar({ label, accuracy, correct, total }: { label: string; accuracy: number; correct: number; total: number }) {
  const barColor = accuracy >= 80 ? 'bg-[#059669]' : accuracy >= 50 ? 'bg-[#eab308]' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 w-24 truncate font-medium">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${accuracy}%` }} />
      </div>
      <span className="text-sm font-bold text-gray-600 w-20 text-right">{correct}/{total} ({accuracy}%)</span>
    </div>
  );
}
