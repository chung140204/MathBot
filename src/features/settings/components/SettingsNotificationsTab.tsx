'use client';

import { Toggle } from './Toggle';
import type { useSettingsData } from '../hooks/useSettingsData';

type S = ReturnType<typeof useSettingsData>;

export function SettingsNotificationsTab({ s }: { s: S }) {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Thông báo</h2>
        <p className="text-sm text-gray-500 mb-8">Tuỳ chỉnh loại thông báo nhận được</p>
        <div className="space-y-0 divide-y divide-gray-100">
          <div className="py-6 flex items-center justify-between">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Nhắc nhở học tập hàng ngày</h3><p className="text-sm text-gray-500 mt-1">Nhận thông báo nhắc ôn bài mỗi ngày</p></div>
            <Toggle checked={s.notifyDaily} onChange={s.setNotifyDaily} />
          </div>
          {s.notifyDaily && (
            <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div><h3 className="text-[15px] font-semibold text-gray-900">Thời gian nhắc nhở</h3></div>
              <select value={s.notifyTime} onChange={e => s.setNotifyTime(e.target.value)}
                className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white min-w-[200px]">
                <option>19:00 tối</option><option>20:00 tối</option><option>21:00 tối</option>
              </select>
            </div>
          )}
          <div className="py-6 flex items-center justify-between">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Thông báo kết quả bài thi</h3><p className="text-sm text-gray-500 mt-1">Hiện thông báo ngay sau khi nộp bài</p></div>
            <Toggle checked={s.notifyExam} onChange={s.setNotifyExam} />
          </div>
          <div className="py-6 flex items-center justify-between">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Email tổng kết tuần</h3><p className="text-sm text-gray-500 mt-1">Nhận báo cáo tiến trình qua email mỗi tuần</p></div>
            <Toggle checked={s.notifyEmail} onChange={s.setNotifyEmail} />
          </div>
          <div className="py-6 flex items-center justify-between">
            <div><h3 className="text-[15px] font-semibold text-gray-900">Thông báo streak sắp gãy</h3><p className="text-sm text-gray-500 mt-1">Cảnh báo khi chưa học đến 22:00</p></div>
            <Toggle checked={s.notifyStreak} onChange={s.setNotifyStreak} />
          </div>
        </div>
      </section>
    </div>
  );
}
