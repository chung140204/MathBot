'use client';

import type { useSettingsData } from '../hooks/useSettingsData';

type S = ReturnType<typeof useSettingsData>;

function EyeIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
      ) : (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </>
      )}
    </svg>
  );
}

function PasswordInput({ value, onChange, show, onToggleShow, placeholder }: {
  value: string; onChange: (v: string) => void; show: boolean; onToggleShow: () => void; placeholder: string;
}) {
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all" />
      <button type="button" onClick={onToggleShow} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <EyeIcon open={show} />
      </button>
    </div>
  );
}

export function SettingsSecurityTab({ s }: { s: S }) {
  return (
    <div className="space-y-8">
      {/* Change Password */}
      <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Đổi mật khẩu</h2>
        <p className="text-sm text-gray-500 mt-0.5 mb-6">Cập nhật mật khẩu để bảo vệ tài khoản</p>
        <div className="space-y-5 max-w-lg">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu hiện tại</label>
            <PasswordInput value={s.currentPassword} onChange={s.setCurrentPassword} show={s.showCurrentPassword} onToggleShow={() => s.setShowCurrentPassword(!s.showCurrentPassword)} placeholder="Nhập mật khẩu hiện tại" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mật khẩu mới</label>
            <PasswordInput value={s.newPassword} onChange={s.setNewPassword} show={s.showNewPassword} onToggleShow={() => s.setShowNewPassword(!s.showNewPassword)} placeholder="Tối thiểu 8 ký tự" />
            {s.newPassword.length > 0 && (
              <div className="mt-2.5">
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map(level => (
                    <div key={level} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${level <= s.strength.score ? s.strength.color : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className={`text-xs font-semibold mt-1.5 ${s.strength.score <= 1 ? 'text-red-500' : s.strength.score === 2 ? 'text-[#eab308]' : s.strength.score === 3 ? 'text-blue-500' : 'text-[#059669]'}`}>{s.strength.label}</p>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1.5">Dùng chữ hoa, số và ký tự đặc biệt để mật khẩu mạnh hơn</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Xác nhận mật khẩu mới</label>
            <input type="password" value={s.confirmPassword} onChange={e => s.setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu mới"
              className={`w-full px-4 py-3 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 ${s.passwordsMismatch ? 'border-red-300 focus:ring-red-200' : s.passwordsMatch ? 'border-[#059669] focus:ring-[#059669]/20' : 'border-gray-200 focus:ring-[#059669]/20'}`} />
            {s.passwordsMismatch && <p className="text-xs text-red-500 mt-1.5 font-medium">Mật khẩu không khớp</p>}
            {s.passwordsMatch && <p className="text-xs text-[#059669] mt-1.5 font-medium">✓ Mật khẩu khớp</p>}
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={s.handleChangePassword}
              disabled={s.isChangingPassword || !s.currentPassword || !s.newPassword || !s.confirmPassword || !s.passwordsMatch || s.strength.score < 2}
              className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              {s.isChangingPassword ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang cập nhật...</span> : 'Cập nhật mật khẩu'}
            </button>
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="rounded-2xl border-2 border-red-200 p-6 bg-red-50/30">
        <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          Vùng nguy hiểm
        </h2>
        <p className="text-sm text-red-500/70 mt-1 mb-6">Các hành động không thể hoàn tác</p>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100">
            <div><h3 className="font-semibold text-gray-900 text-sm">Đăng xuất</h3><p className="text-xs text-gray-500 mt-0.5">Đăng xuất khỏi thiết bị này</p></div>
            <button onClick={s.handleLogout} className="px-5 py-2.5 text-sm font-semibold text-red-600 border-2 border-red-200 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all">Đăng xuất</button>
          </div>
          <div className="p-4 bg-white rounded-xl border border-red-100">
            <div className="flex items-center justify-between">
              <div><h3 className="font-semibold text-gray-900 text-sm">Xoá tài khoản</h3><p className="text-xs text-gray-500 mt-0.5">Xoá vĩnh viễn tài khoản và toàn bộ dữ liệu học tập</p></div>
              {!s.showDeleteConfirm ? (
                <button onClick={() => s.setShowDeleteConfirm(true)} className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all">Xoá tài khoản</button>
              ) : (
                <button onClick={() => { s.setShowDeleteConfirm(false); s.setDeletePassword(''); }} className="px-4 py-2 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">Huỷ</button>
              )}
            </div>
            {s.showDeleteConfirm && (
              <div className="mt-4 pt-4 border-t border-red-100">
                <p className="text-sm text-red-600 font-medium mb-3">Nhập mật khẩu để xác nhận xoá tài khoản. Hành động này không thể hoàn tác.</p>
                <div className="flex gap-3">
                  <input type="password" value={s.deletePassword} onChange={e => s.setDeletePassword(e.target.value)} placeholder="Nhập mật khẩu xác nhận"
                    className="flex-1 px-4 py-2.5 border border-red-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-red-400 transition-all" />
                  <button onClick={s.handleDeleteAccount} disabled={s.isDeletingAccount || !s.deletePassword}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    {s.isDeletingAccount ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Đang xoá...</span> : 'Xác nhận xoá'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
