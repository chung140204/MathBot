'use client';

import { Toggle } from './Toggle';
import type { useSettingsData } from '../hooks/useSettingsData';

type S = ReturnType<typeof useSettingsData>;

export function SettingsAiTab({ s }: { s: S }) {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">AI & Chat</h2>
        <p className="text-sm text-gray-500 mb-8">Tuỳ chỉnh cách AI hỗ trợ bạn học</p>
        <div className="space-y-0 divide-y divide-gray-100">
          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Phong cách giải thích</h3><p className="text-sm text-gray-500 mt-1">Cách AI trình bày lời giải</p></div>
            <select value={s.aiStyle} onChange={e => s.setAiStyle(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white min-w-[280px]">
              <option>Chi tiết từng bước</option><option>Chỉ gợi ý hướng giải</option><option>Chỉ đáp án cuối cùng</option>
            </select>
          </div>
          <div className="py-6 flex items-center justify-between">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Gợi ý bài tương tự sau khi giải</h3><p className="text-sm text-gray-500 mt-1">AI tự động gợi ý bài luyện thêm</p></div>
            <Toggle checked={s.aiSuggest} onChange={s.setAiSuggest} />
          </div>
          <div className="py-6 flex items-center justify-between">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Lưu lịch sử chat</h3><p className="text-sm text-gray-500 mt-1">Lưu các cuộc trò chuyện để xem lại</p></div>
            <Toggle checked={s.aiSaveHistory} onChange={s.setAiSaveHistory} />
          </div>
          <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Ngôn ngữ phản hồi của AI</h3></div>
            <select value={s.aiLanguage} onChange={e => s.setAiLanguage(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white min-w-[280px]">
              <option>Tiếng Việt</option><option>Tiếng Anh</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}
