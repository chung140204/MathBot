'use client';

import { useState, useMemo } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type SettingsTab = 'account' | 'notifications' | 'ai-chat' | 'practice' | 'security';

interface LoginProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  connected: boolean;
  email?: string;
}

interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

// ─── Password strength ───────────────────────────────────────────────────────

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: '', color: 'bg-gray-200' };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score: 1, label: 'Yếu', color: 'bg-red-500' };
  if (score === 2) return { score: 2, label: 'Trung bình', color: 'bg-[#eab308]' };
  if (score === 3) return { score: 3, label: 'Khá', color: 'bg-blue-500' };
  if (score >= 4) return { score: 4, label: 'Mạnh', color: 'bg-[#059669]' };

  return { score: 0, label: '', color: 'bg-gray-200' };
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const PROVIDERS: LoginProvider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: (
      <span className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-lg font-bold text-blue-500 shadow-sm">
        G
      </span>
    ),
    connected: true,
    email: 'thanh.nguyen@gmail.com',
  },
  {
    id: 'email',
    name: 'Email',
    icon: (
      <span className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </span>
    ),
    connected: true,
    email: 'thanh@mathbot.vn',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: (
      <span className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-lg font-bold text-blue-600 shadow-sm">
        f
      </span>
    ),
    connected: false,
  },
];

const SESSIONS: Session[] = [
  {
    id: 's1',
    device: 'Windows PC',
    browser: 'Chrome 124',
    ip: '192.168.1.10',
    lastActive: 'Đang hoạt động',
    isCurrent: true,
  },
  {
    id: 's2',
    device: 'iPhone 15',
    browser: 'Safari 17',
    ip: '10.0.0.42',
    lastActive: '2 giờ trước',
    isCurrent: false,
  },
  {
    id: 's3',
    device: 'MacBook Pro',
    browser: 'Firefox 125',
    ip: '172.16.0.5',
    lastActive: '1 ngày trước',
    isCurrent: false,
  },
];

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'account', label: 'Tài khoản' },
  { id: 'notifications', label: 'Thông báo' },
  { id: 'ai-chat', label: 'AI & Chat' },
  { id: 'practice', label: 'Luyện tập' },
  { id: 'security', label: 'Bảo mật' },
];

// ─── Device icons ─────────────────────────────────────────────────────────────

function DeviceIcon({ device }: { device: string }) {
  if (device.toLowerCase().includes('iphone') || device.toLowerCase().includes('android')) {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    );
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

// ─── Shared Components ────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (c: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
        ${checked ? 'bg-[#059669]' : 'bg-gray-200'}
      `}
    >
      <span
        className={`pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out
          ${checked ? 'translate-x-[24px]' : 'translate-x-0'}
        `}
      />
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');

  // Account state
  const [accountName, setAccountName] = useState('Nguyễn Thành');
  const [accountEmail, setAccountEmail] = useState('thanh.nguyen@email.com');
  const [accountClass, setAccountClass] = useState('Lớp 12');
  const [accountGoal, setAccountGoal] = useState('8.0 - 9.0 điểm');

  // Notifications state
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyTime, setNotifyTime] = useState('19:00 tối');
  const [notifyExam, setNotifyExam] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);
  const [notifyStreak, setNotifyStreak] = useState(true);

  // AI state
  const [aiStyle, setAiStyle] = useState('Chi tiết từng bước');
  const [aiSuggest, setAiSuggest] = useState(true);
  const [aiSaveHistory, setAiSaveHistory] = useState(true);
  const [aiLanguage, setAiLanguage] = useState('Tiếng Việt');

  // Practice state
  const [practiceQuestionCount, setPracticeQuestionCount] = useState('20 câu');
  const [practiceShowTimer, setPracticeShowTimer] = useState(true);
  const [practiceShuffle, setPracticeShuffle] = useState(true);
  const [practiceShowAnswers, setPracticeShowAnswers] = useState(true);
  const [practiceDifficulty, setPracticeDifficulty] = useState('Hỗn hợp');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Providers state
  const [providers, setProviders] = useState(PROVIDERS);
  const [connectingId, setConnectingId] = useState<string | null>(null);

  // Sessions state
  const [sessions, setSessions] = useState(SESSIONS);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const strength = useMemo(() => getPasswordStrength(newPassword), [newPassword]);
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;

  // ── Handlers ────────────────────────────────────────────────────────────────

  async function handleChangePassword() {
    if (!currentPassword || !newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;
    if (strength.score < 2) return;

    setIsChangingPassword(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Mật khẩu đã được cập nhật!');
  }

  async function handleToggleProvider(id: string) {
    setConnectingId(id);
    await new Promise((r) => setTimeout(r, 1000));
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, connected: !p.connected } : p))
    );
    setConnectingId(null);
  }

  async function handleRevokeSession(id: string) {
    setRevokingId(id);
    await new Promise((r) => setTimeout(r, 800));
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setRevokingId(null);
  }

  async function handleRevokeAll() {
    if (!confirm('Bạn sẽ bị đăng xuất khỏi tất cả các thiết bị khác. Tiếp tục?')) return;
    setSessions((prev) => prev.filter((s) => s.isCurrent));
  }

  function handleLogout() {
    if (!confirm('Bạn có chắc chắn muốn đăng xuất?')) return;
    window.location.href = '/api/auth/signout';
  }

  function handleDeleteAccount() {
    if (!confirm('⚠️ Hành động này không thể hoàn tác!\n\nTất cả dữ liệu học tập, lịch sử thi và cuộc trò chuyện sẽ bị xoá vĩnh viễn.\n\nBạn có chắc chắn?')) return;
    alert('Chức năng xoá tài khoản sẽ được triển khai sau.');
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Cài đặt ⚙️</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản và tuỳ chỉnh trải nghiệm</p>
        </div>
        <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-900 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all">
          Lưu thay đổi
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold transition-all relative
              ${activeTab === tab.id
                ? 'text-[#059669]'
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#059669] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Security tab content */}
      {activeTab === 'security' && (
        <div className="space-y-8">
          {/* ━━ Section 1: Change Password ━━ */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Đổi mật khẩu</h2>
            <p className="text-sm text-gray-500 mt-0.5 mb-6">
              Cập nhật mật khẩu để bảo vệ tài khoản
            </p>

            <div className="space-y-5 max-w-lg">
              {/* Current password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showCurrentPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 8 ký tự"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                      focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showNewPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>

                {/* Strength meter */}
                {newPassword.length > 0 && (
                  <div className="mt-2.5">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300
                            ${level <= strength.score ? strength.color : 'bg-gray-200'}
                          `}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-semibold mt-1.5 transition-colors
                      ${strength.score <= 1 ? 'text-red-500' :
                        strength.score === 2 ? 'text-[#eab308]' :
                        strength.score === 3 ? 'text-blue-500' :
                        'text-[#059669]'
                      }
                    `}>
                      {strength.label}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-1.5">
                  Dùng chữ hoa, số và ký tự đặc biệt để mật khẩu mạnh hơn
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className={`w-full px-4 py-3 border rounded-xl text-sm transition-all
                    focus:outline-none focus:ring-2
                    ${passwordsMismatch
                      ? 'border-red-300 focus:ring-red-200 focus:border-red-400'
                      : passwordsMatch
                        ? 'border-[#059669] focus:ring-[#059669]/20 focus:border-[#059669]'
                        : 'border-gray-200 focus:ring-[#059669]/20 focus:border-[#059669]'
                    }
                  `}
                />
                {passwordsMismatch && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">Mật khẩu không khớp</p>
                )}
                {passwordsMatch && (
                  <p className="text-xs text-[#059669] mt-1.5 font-medium">✓ Mật khẩu khớp</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleChangePassword}
                  disabled={
                    isChangingPassword ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    !passwordsMatch ||
                    strength.score < 2
                  }
                  className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl text-sm
                    hover:bg-gray-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isChangingPassword ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Đang cập nhật...
                    </span>
                  ) : (
                    'Cập nhật mật khẩu'
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* ━━ Section 2: Login Providers ━━ */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Phương thức đăng nhập</h2>
            <p className="text-sm text-gray-500 mt-0.5 mb-6">
              Quản lý các tài khoản liên kết với MathBot
            </p>

            <div className="space-y-4">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  {provider.icon}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{provider.name}</span>
                      {provider.connected ? (
                        <span className="px-2 py-0.5 bg-[#f0fdf9] text-[#059669] text-xs font-bold rounded-full border border-[#059669]/20">
                          Đã kết nối
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                          Chưa kết nối
                        </span>
                      )}
                    </div>
                    {provider.email && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{provider.email}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleProvider(provider.id)}
                    disabled={connectingId === provider.id}
                    className={`px-4 py-2 text-sm font-semibold rounded-xl border transition-all
                      ${provider.connected
                        ? 'text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                        : 'text-[#059669] border-[#059669]/30 bg-[#f0fdf9] hover:bg-[#059669]/10'
                      }
                      disabled:opacity-50
                    `}
                  >
                    {connectingId === provider.id ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-3 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        ...
                      </span>
                    ) : provider.connected ? (
                      'Ngắt kết nối'
                    ) : (
                      'Kết nối'
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ━━ Section 3: Active Sessions ━━ */}
          <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Phiên đăng nhập</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Quản lý các thiết bị đang truy cập tài khoản
                </p>
              </div>

              {sessions.filter((s) => !s.isCurrent).length > 0 && (
                <button
                  onClick={handleRevokeAll}
                  className="px-4 py-2 text-sm font-semibold text-red-500 border border-red-200 rounded-xl
                    hover:bg-red-50 transition-all"
                >
                  Đăng xuất tất cả
                </button>
              )}
            </div>

            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-colors
                    ${session.isCurrent
                      ? 'border-[#059669]/30 bg-[#f0fdf9]'
                      : 'border-gray-100 hover:bg-gray-50/50'
                    }
                  `}
                >
                  {/* Device icon */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${session.isCurrent
                      ? 'bg-[#059669]/10 text-[#059669]'
                      : 'bg-gray-100 text-gray-500'
                    }
                  `}>
                    <DeviceIcon device={session.device} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 text-sm">{session.device}</span>
                      {session.isCurrent && (
                        <span className="px-2 py-0.5 bg-[#059669] text-white text-[10px] font-bold rounded-full">
                          Thiết bị này
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {session.browser} · {session.ip} · {session.lastActive}
                    </p>
                  </div>

                  {/* Revoke button */}
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      disabled={revokingId === session.id}
                      className="px-4 py-2 text-sm font-semibold text-red-500 border border-red-200 rounded-xl
                        hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      {revokingId === session.id ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                        </span>
                      ) : (
                        'Thu hồi'
                      )}
                    </button>
                  )}
                </div>
              ))}

              {sessions.length === 1 && sessions[0].isCurrent && (
                <p className="text-sm text-gray-400 text-center py-3">
                  Không có phiên đăng nhập nào khác
                </p>
              )}
            </div>
          </section>

          {/* ━━ Section 4: Danger Zone ━━ */}
          <section className="rounded-2xl border-2 border-red-200 p-6 bg-red-50/30">
            <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              Vùng nguy hiểm
            </h2>
            <p className="text-sm text-red-500/70 mt-1 mb-6">
              Các hành động không thể hoàn tác
            </p>

            <div className="space-y-4">
              {/* Logout */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Đăng xuất</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Đăng xuất khỏi thiết bị này
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-sm font-semibold text-red-600 border-2 border-red-200 rounded-xl
                    hover:bg-red-50 hover:border-red-300 transition-all"
                >
                  Đăng xuất
                </button>
              </div>

              {/* Delete account */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-red-100">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">Xoá tài khoản</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Xoá vĩnh viễn tài khoản và toàn bộ dữ liệu học tập
                  </p>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-red-500 rounded-xl
                    hover:bg-red-600 transition-all"
                >
                  Xoá tài khoản
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Account tab content */}
      {activeTab === 'account' && (
        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Thông tin cá nhân</h2>
            <p className="text-sm text-gray-500 mb-8">Cập nhật ảnh đại diện và thông tin tài khoản</p>

            <div className="space-y-6 max-w-2xl">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-[#0891b2] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                  NT
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Nguyễn Thành</h3>
                  <p className="text-sm text-gray-500">thanh.nguyen@email.com</p>
                </div>
                <div className="ml-auto">
                  <button className="px-5 py-2 border border-gray-200 text-gray-900 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-all">
                    Đổi ảnh
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
                <input
                  type="text"
                  value={accountName}
                  onChange={e => setAccountName(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                />
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={accountEmail}
                  onChange={e => setAccountEmail(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all"
                />
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Lớp học</label>
                <select
                  value={accountClass}
                  onChange={e => setAccountClass(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white"
                >
                  <option>Lớp 10</option>
                  <option>Lớp 11</option>
                  <option>Lớp 12</option>
                </select>
              </div>

              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <label className="text-sm font-semibold text-gray-700">Mục tiêu điểm thi</label>
                <select
                  value={accountGoal}
                  onChange={e => setAccountGoal(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white"
                >
                  <option>Dưới 7.0 điểm</option>
                  <option>7.0 - 8.0 điểm</option>
                  <option>8.0 - 9.0 điểm</option>
                  <option>9.0+ điểm</option>
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
      )}

      {/* Notifications tab content */}
      {activeTab === 'notifications' && (
        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Thông báo</h2>
            <p className="text-sm text-gray-500 mb-8">Tuỳ chỉnh loại thông báo nhận được</p>

            <div className="space-y-0 divide-y divide-gray-100">
              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Nhắc nhở học tập hàng ngày</h3>
                  <p className="text-sm text-gray-500 mt-1">Nhận thông báo nhắc ôn bài mỗi ngày</p>
                </div>
                <Toggle checked={notifyDaily} onChange={setNotifyDaily} />
              </div>

              {notifyDaily && (
                <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[15px] font-semibold text-gray-900">Thời gian nhắc nhở</h3>
                  </div>
                  <select
                    value={notifyTime}
                    onChange={e => setNotifyTime(e.target.value)}
                    className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white min-w-[200px]"
                  >
                    <option>19:00 tối</option>
                    <option>20:00 tối</option>
                    <option>21:00 tối</option>
                  </select>
                </div>
              )}

              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Thông báo kết quả bài thi</h3>
                  <p className="text-sm text-gray-500 mt-1">Hiện thông báo ngay sau khi nộp bài</p>
                </div>
                <Toggle checked={notifyExam} onChange={setNotifyExam} />
              </div>

              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Email tổng kết tuần</h3>
                  <p className="text-sm text-gray-500 mt-1">Nhận báo cáo tiến trình qua email mỗi tuần</p>
                </div>
                <Toggle checked={notifyEmail} onChange={setNotifyEmail} />
              </div>

              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Thông báo streak sắp gãy</h3>
                  <p className="text-sm text-gray-500 mt-1">Cảnh báo khi chưa học đến 22:00</p>
                </div>
                <Toggle checked={notifyStreak} onChange={setNotifyStreak} />
              </div>
            </div>
          </section>
        </div>
      )}

      {/* AI & Chat tab content */}
      {activeTab === 'ai-chat' && (
        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">AI & Chat</h2>
            <p className="text-sm text-gray-500 mb-8">Tuỳ chỉnh cách AI hỗ trợ bạn học</p>

            <div className="space-y-0 divide-y divide-gray-100">
              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Phong cách giải thích</h3>
                  <p className="text-sm text-gray-500 mt-1">Cách AI trình bày lời giải</p>
                </div>
                <select
                  value={aiStyle}
                  onChange={e => setAiStyle(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white min-w-[280px]"
                >
                  <option>Chi tiết từng bước</option>
                  <option>Chỉ gợi ý hướng giải</option>
                  <option>Chỉ đáp án cuối cùng</option>
                </select>
              </div>

              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Gợi ý bài tương tự sau khi giải</h3>
                  <p className="text-sm text-gray-500 mt-1">AI tự động gợi ý bài luyện thêm</p>
                </div>
                <Toggle checked={aiSuggest} onChange={setAiSuggest} />
              </div>

              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Lưu lịch sử chat</h3>
                  <p className="text-sm text-gray-500 mt-1">Lưu các cuộc trò chuyện để xem lại</p>
                </div>
                <Toggle checked={aiSaveHistory} onChange={setAiSaveHistory} />
              </div>

              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Ngôn ngữ phản hồi của AI</h3>
                </div>
                <select
                  value={aiLanguage}
                  onChange={e => setAiLanguage(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white min-w-[280px]"
                >
                  <option>Tiếng Việt</option>
                  <option>Tiếng Anh</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Practice tab placeholder */}
      {activeTab === 'practice' && (
        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Luyện tập</h2>
            <p className="text-sm text-gray-500 mb-8">Tuỳ chỉnh mặc định khi làm bài thi</p>

            <div className="space-y-0 divide-y divide-gray-100">
              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Số câu mặc định</h3>
                </div>
                <select
                  value={practiceQuestionCount}
                  onChange={e => setPracticeQuestionCount(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white min-w-[280px]"
                >
                  <option>10 câu</option>
                  <option>20 câu</option>
                  <option>30 câu</option>
                  <option>40 câu</option>
                  <option>50 câu</option>
                </select>
              </div>

              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Hiển thị bộ đếm thời gian</h3>
                  <p className="text-sm text-gray-500 mt-1">Hiện countdown timer trong khi làm bài</p>
                </div>
                <Toggle checked={practiceShowTimer} onChange={setPracticeShowTimer} />
              </div>

              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Xáo trộn câu hỏi</h3>
                  <p className="text-sm text-gray-500 mt-1">Ngẫu nhiên hoá thứ tự câu hỏi mỗi lần</p>
                </div>
                <Toggle checked={practiceShuffle} onChange={setPracticeShuffle} />
              </div>

              <div className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Hiện đáp án ngay sau khi nộp</h3>
                  <p className="text-sm text-gray-500 mt-1">Xem giải thích chi tiết ngay sau khi nộp bài</p>
                </div>
                <Toggle checked={practiceShowAnswers} onChange={setPracticeShowAnswers} />
              </div>

              <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-[15px] font-semibold text-gray-900">Độ khó mặc định</h3>
                </div>
                <select
                  value={practiceDifficulty}
                  onChange={e => setPracticeDifficulty(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#059669]/20 focus:border-[#059669] transition-all bg-white min-w-[280px]"
                >
                  <option>Dễ</option>
                  <option>Trung bình</option>
                  <option>Khó</option>
                  <option>Hỗn hợp</option>
                </select>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
