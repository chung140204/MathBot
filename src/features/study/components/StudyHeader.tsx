'use client';
import Link from 'next/link';

interface StudyHeaderProps {
  selectedTopicLabel: string;
  activeSubSectionLabel: string;
  currentAccuracy: number;
  chunkCount: number;
  isBookmarked: boolean;
  selectedTopic: string;
  onToggleBookmark: () => void;
}

export function StudyHeader({ selectedTopicLabel, activeSubSectionLabel, currentAccuracy, chunkCount, isBookmarked, selectedTopic, onToggleBookmark }: StudyHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-black text-slate-800">
          {selectedTopicLabel} <span className="text-slate-300 mx-1">—</span> {activeSubSectionLabel}
        </h1>
        <div className="flex items-center px-2.5 py-0.5 bg-[#d1fae5] rounded-full gap-1.5 border border-[#d1fae5]">
          <span className="text-[10px] font-bold text-[#059669]">Năng lực: {currentAccuracy}%</span>
        </div>
        <div className="flex items-center px-2.5 py-0.5 bg-blue-50 rounded-full gap-1.5 border border-blue-100">
          <span className="text-[10px] font-bold text-[#0891b2]">{chunkCount} phần</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onToggleBookmark}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-colors ${isBookmarked ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-rose-50 text-rose-600 hover:bg-rose-100'}`}
        >
          <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {isBookmarked ? 'Đã lưu' : 'Lưu'}
        </button>
        <Link href={`/exam?topic=${selectedTopic}`} className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-800 text-slate-800 text-sm font-black rounded-xl hover:bg-slate-50 transition-all group">
          📝 Luyện tập
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
