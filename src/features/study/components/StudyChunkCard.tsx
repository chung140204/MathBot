'use client';
import StudyMathRenderer from './StudyMathRenderer';

interface StudyChunkCardProps {
  chunk: { id: string; title?: string; source?: string; content: string };
  idx: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
  onAskExplain: (question: string) => void;
  onAskExample: (question: string) => void;
  activeSubSectionLabel: string;
}

export function StudyChunkCard({ chunk, idx, isExpanded, onToggle, onAskExplain, onAskExample, activeSubSectionLabel }: StudyChunkCardProps) {
  const chunkTitle = chunk.title || chunk.source || `Phần ${idx + 1}`;
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-[#059669]/20 transition-all duration-300">
      <button onClick={() => onToggle(chunk.id)} className="w-full flex items-center justify-between p-5 text-left group">
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-colors ${isExpanded ? 'bg-[#059669] text-white' : 'bg-[#f0fdf9] text-[#059669] group-hover:bg-[#059669] group-hover:text-white'}`}>
            {idx + 1}
          </div>
          <h3 className="text-lg font-black text-slate-800">{chunkTitle}</h3>
        </div>
        <svg className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-slate-500' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isExpanded ? '2000px' : '0px' }}>
        <div className="px-6 pb-6 pt-0 border-t border-slate-50">
          <div className="prose prose-slate max-w-none text-slate-700 font-medium py-4">
            <StudyMathRenderer content={chunk.content} />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => onAskExplain(`Giải thích chi tiết về: ${chunkTitle}`)}
              className="flex items-center gap-2 px-3 py-2 bg-[#f0fdf9] text-[#059669] text-[13px] font-bold rounded-xl border border-[#d1fae5] hover:bg-[#d1fae5] transition-colors"
            >
              🤖 Hỏi AI giải thích thêm
            </button>
            <button
              onClick={() => onAskExample(`Cho ví dụ bài tập về: ${chunkTitle || activeSubSectionLabel}`)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-100 transition-colors"
            >
              📝 Cho bài tập ví dụ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
