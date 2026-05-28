'use client';

type ExamMode = 'quick' | 'standard' | 'thpt';
type Difficulty = 'all' | 'RECOGNITION' | 'COMPREHENSION' | 'APPLICATION' | 'ADVANCED';

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'RECOGNITION', label: 'Nhận biết' },
  { key: 'COMPREHENSION', label: 'Thông hiểu' },
  { key: 'APPLICATION', label: 'Vận dụng' },
  { key: 'ADVANCED', label: 'Vận dụng cao' },
];

interface Props {
  mode: ExamMode;
  topics: { key: string; label: string }[];
  selectedTopics: string[];
  difficulty: Difficulty;
  currentModeCount: number;
  currentModeTimeMins: number;
  starting: boolean;
  onToggleTopic: (key: string) => void;
  onSelectAll: () => void;
  onClearTopics: () => void;
  onSetDifficulty: (d: Difficulty) => void;
  onStart: () => void;
}

export function PracticeCustomizePanel({
  mode, topics, selectedTopics, difficulty, currentModeCount, currentModeTimeMins,
  starting, onToggleTopic, onSelectAll, onClearTopics, onSetDifficulty, onStart,
}: Props) {
  if (mode === 'thpt') return null;

  return (
    <section id="custom-section" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black text-gray-900">Tùy chỉnh nhanh</h2>
        <span className="text-xs text-gray-500 font-medium">
          {mode === 'quick' ? 'Chọn 1 chủ đề để luyện tập' : 'Bỏ qua để thi ngẫu nhiên tất cả chủ đề'}
        </span>
      </div>

      {/* Topic chips */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black text-gray-600 uppercase tracking-wider">
            Chủ đề{' '}
            <span className="text-[#059669] font-black">
              {mode === 'quick'
                ? selectedTopics.length === 0 ? '(chọn 1)' : '(1 đã chọn)'
                : selectedTopics.length === 0 ? '(tất cả)' : `(${selectedTopics.length}/${topics.length})`}
            </span>
          </p>
          {mode !== 'quick' && (
            <div className="flex gap-2">
              <button onClick={onSelectAll} className="text-[11px] font-bold text-[#059669] hover:underline">Chọn tất cả</button>
              <span className="text-gray-300">·</span>
              <button onClick={onClearTopics} className="text-[11px] font-bold text-gray-500 hover:text-red-500 hover:underline">Xóa</button>
            </div>
          )}
          {mode === 'quick' && selectedTopics.length > 0 && (
            <button onClick={onClearTopics} className="text-[11px] font-bold text-gray-500 hover:text-red-500 hover:underline">Bỏ chọn</button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map(t => (
            <button key={t.key} onClick={() => onToggleTopic(t.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                selectedTopics.includes(t.key) ? 'bg-[#059669] text-white border-[#059669] shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-[#059669] hover:text-[#059669]'
              }`}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Difficulty chips */}
      <div>
        <p className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">Mức độ</p>
        <div className="flex flex-wrap gap-2">
          {DIFFICULTIES.map(d => (
            <button key={d.key} onClick={() => onSetDifficulty(d.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                difficulty === d.key ? 'bg-[#0891b2] text-white border-[#0891b2] shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-[#0891b2] hover:text-[#0891b2]'
              }`}>{d.label}</button>
          ))}
        </div>
      </div>

      {/* Summary + start */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
        <div className="text-sm text-gray-500 space-y-0.5">
          <p><span className="font-bold text-gray-800">{currentModeCount} câu</span>{` · ${currentModeTimeMins} phút`}</p>
          <p>
            {mode === 'quick'
              ? selectedTopics.length === 0 ? 'Chưa chọn chủ đề' : `Chủ đề: ${topics.find(t => t.key === selectedTopics[0])?.label}`
              : selectedTopics.length === 0 ? 'Tất cả 11 chủ đề' : `${selectedTopics.length} chủ đề đã chọn`}
            {difficulty !== 'all' ? ` · ${DIFFICULTIES.find(d => d.key === difficulty)?.label}` : ''}
          </p>
        </div>
        <button onClick={onStart} disabled={starting}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white font-black rounded-2xl shadow-lg shadow-[#059669]/25 hover:shadow-xl hover:shadow-[#059669]/30 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70">
          {starting ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
          Bắt đầu thi
        </button>
      </div>
    </section>
  );
}
