'use client';

import type { useSettingsData } from '../hooks/useSettingsData';

type S = ReturnType<typeof useSettingsData>;

export function SettingsAccountTab({ s }: { s: S }) {
  return (
    <div className="space-y-8">
      <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Thông tin cá nhân</h2>
        <p className="text-sm text-gray-500 mb-8">Cập nhật ảnh đại diện và thông tin tài khoản</p>
        <div className="space-y-6 max-w-2xl">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            {s.accountImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.accountImage} alt="Avatar" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md" />
            ) : (
              <div className="w-20 h-20 bg-[#0891b2] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                {s.accountName?.substring(0, 2).toUpperCase() || '??'}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{s.accountName || 'Chưa cập nhật'}</h3>
              <p className="text-sm text-gray-500">{s.accountEmail}</p>
            </div>
            <div className="ml-auto flex flex-col gap-2">
              <input ref={s.avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={s.handleAvatarUpload} className="hidden" />
              <button onClick={() => s.avatarInputRef.current?.click()} disabled={s.isUploadingAvatar}
                className="px-5 py-2 border border-gray-200 text-gray-900 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all text-sm disabled:opacity-50">
                {s.isUploadingAvatar ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />Đang tải...</span> : 'Đổi ảnh'}
              </button>
            </div>
          </div>
          {/* Fields */}
          {([
            ['Họ và tên', s.accountName, s.setAccountName, 'text'] as const,
            ['Email', s.accountEmail, s.setAccountEmail, 'email'] as const,
          ]).map(([label, val, setter, type]) => (
            <div key={label} className="grid grid-cols-[120px_1fr] items-center gap-4">
              <label className="text-sm font-semibold text-gray-700">{label}</label>
              <input type={type} value={val} onChange={e => setter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
            </div>
          ))}
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">Lớp học</label>
            <select value={s.accountClass} onChange={e => s.setAccountClass(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white">
              <option>Lớp 10</option><option>Lớp 11</option><option>Lớp 12</option>
            </select>
          </div>
          <div className="grid grid-cols-[120px_1fr] items-center gap-4">
            <label className="text-sm font-semibold text-gray-700">Mục tiêu điểm thi</label>
            <select value={s.accountGoal} onChange={e => s.setAccountGoal(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white">
              <option>Dưới 7.0 điểm</option><option>7.0 - 8.0 điểm</option><option>8.0 - 9.0 điểm</option><option>9.0+ điểm</option>
            </select>
          </div>
        </div>
      </section>
      <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-6">Gói sử dụng</h2>
        <div className="bg-[#f0fdf9] rounded-2xl p-6 border border-[#059669]/20 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#059669] mb-1">Free Plan</h3>
            <p className="text-sm text-[#059669]/80">200 câu hỏi · AI chat không giới hạn</p>
          </div>
          <button className="px-5 py-2.5 bg-white border border-[#059669]/30 text-[#059669] font-bold rounded-xl shadow-sm hover:bg-[#059669]/5 transition-all flex items-center gap-2">
            Nâng cấp Pro <span>→</span>
          </button>
        </div>
      </section>
    </div>
  );
}
