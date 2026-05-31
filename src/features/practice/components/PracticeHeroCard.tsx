'use client';

interface ExamMode { key: string; icon: string; title: string; desc: string; count: number; timeMins: number; }

interface PracticeHeroCardProps {
  mode: string;
  currentMode: ExamMode;
  starting: boolean;
  onQuickStart: () => void;
  onScrollToCustomize: () => void;
}

export function PracticeHeroCard({ mode, currentMode, starting, onQuickStart, onScrollToCustomize }: PracticeHeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#059669] via-[#0a9578] to-[#0891b2] p-8 lg:p-10 text-white shadow-xl">
      <div className="pointer-events-none absolute top-[-20%] right-[10%] w-[35%] h-[140%] rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-30%] left-[30%] w-[40%] h-[120%] rounded-full bg-[#0891b2]/20 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
        <div className="flex-1">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mb-3">
            {mode === 'thpt' ? 'THI THỬ THPT' : mode === 'adaptive' ? 'LUYỆN THEO ĐIỂM YẾU' : mode === 'standard' ? 'THI CHUẨN' : 'THI NHANH'}
          </p>
          <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-4 tracking-tight">Sẵn sàng chiến đấu?</h2>
          <p className="text-2xl mb-4 leading-none">{currentMode.icon}</p>
          <p className="text-white/80 text-base leading-relaxed mb-8 max-w-md">
            {mode === 'thpt'
              ? 'Đề thi theo cấu trúc THPT Quốc gia 2025: 12 trắc nghiệm + 4 đúng/sai + 6 trả lời ngắn. Thang điểm 10.'
              : mode === 'adaptive'
              ? 'Đề tự sinh tập trung vào các chủ đề bạn đang yếu, được chọn tự động dựa trên kết quả luyện tập của bạn.'
              : mode === 'standard'
              ? 'Tự chọn chủ đề và mức độ khó. 30 câu trong 45 phút.'
              : 'Chọn 1 chủ đề, luyện nhanh 10 câu trong 20 phút.'}
          </p>
          <div className="flex flex-wrap gap-3">
            <button onClick={onQuickStart} disabled={starting}
              className="px-7 py-3.5 bg-white text-gray-900 font-black rounded-2xl hover:bg-gray-50 active:scale-95 transition-all shadow-lg disabled:opacity-70 flex items-center gap-2">
              {starting && <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />}
              {mode === 'thpt' ? 'Thi thử ngay →' : mode === 'adaptive' ? 'Luyện ngay →' : 'Thi ngay →'}
            </button>
            {mode !== 'thpt' && mode !== 'adaptive' && (
              <button onClick={onScrollToCustomize}
                className="px-7 py-3.5 bg-white/10 border border-white/25 text-white font-black rounded-2xl hover:bg-white/20 active:scale-95 transition-all">
                Tự chọn đề
              </button>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-right lg:text-right">
          <p className="text-8xl lg:text-9xl font-black leading-none tracking-tighter text-white drop-shadow-lg">{currentMode.count}</p>
          <p className="text-white/70 font-semibold text-base mt-1">câu · {currentMode.timeMins} phút</p>
        </div>
      </div>
    </div>
  );
}
