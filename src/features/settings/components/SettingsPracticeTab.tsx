'use client';

import { Toggle } from './Toggle';
import type { useSettingsData } from '../hooks/useSettingsData';

type S = ReturnType<typeof useSettingsData>;

export function SettingsPracticeTab({ s }: { s: S }) {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Luyện tập</h2>
        <p className="text-sm text-gray-500 mb-8">Tuỳ chỉnh mặc định khi làm bài thi</p>
        <div className="space-y-0 divide-y divide-gray-100">
          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Số câu mặc định</h3></div>
            <select value={s.practiceQuestionCount} onChange={e => s.setPracticeQuestionCount(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white min-w-[280px]">
              <option>10 câu</option><option>20 câu</option><option>30 câu</option><option>40 câu</option><option>50 câu</option>
            </select>
          </div>
          <div className="py-6 flex items-center justify-between">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Hiển thị bộ đếm thời gian</h3><p className="text-sm text-gray-500 mt-1">Hiện countdown timer trong khi làm bài</p></div>
            <Toggle checked={s.practiceShowTimer} onChange={s.setPracticeShowTimer} />
          </div>
          <div className="py-6 flex items-center justify-between">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Xáo trộn câu hỏi</h3><p className="text-sm text-gray-500 mt-1">Ngẫu nhiên hoá thứ tự câu hỏi mỗi lần</p></div>
            <Toggle checked={s.practiceShuffle} onChange={s.setPracticeShuffle} />
          </div>
          <div className="py-6 flex items-center justify-between">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Hiện đáp án ngay sau khi nộp</h3><p className="text-sm text-gray-500 mt-1">Xem giải thích chi tiết ngay sau khi nộp bài</p></div>
            <Toggle checked={s.practiceShowAnswers} onChange={s.setPracticeShowAnswers} />
          </div>
          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Độ khó mặc định</h3></div>
            <select value={s.practiceDifficulty} onChange={e => s.setPracticeDifficulty(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white min-w-[280px]">
              <option>Dễ</option><option>Trung bình</option><option>Khó</option><option>Hỗn hợp</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
