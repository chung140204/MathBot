'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Settings,
  RefreshCw,
  Save,
  Globe,
  Bot,
  FileText,
  ShieldCheck,
  Loader2,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  user: { id?: string; name?: string | null; email?: string | null; role?: string };
}

type SettingsMap = Record<string, string>;

// ---------------------------------------------------------------------------
// Toggle component
// ---------------------------------------------------------------------------

function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-[#059669]' : 'bg-[#cbd5e1]'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Section wrapper
// ---------------------------------------------------------------------------

function Section({ icon: Icon, iconBg, title, description, children }: {
  icon: React.ElementType; iconBg: string; title: string; description: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[12px] overflow-hidden" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="px-6 py-4 border-b border-[#f1f5f9] flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: iconBg }}>
          <Icon size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-[14px] font-bold text-[#0f172a]">{title}</h3>
          <p className="text-[11px] text-[#94a3b8]">{description}</p>
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">
        {children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Field components
// ---------------------------------------------------------------------------

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-8">
      <div className="flex-shrink-0 min-w-[180px]">
        <p className="text-[13px] font-semibold text-[#374151]">{label}</p>
        {hint && <p className="text-[11px] text-[#94a3b8] mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1 max-w-[400px]">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full h-9 px-3 text-[13px] text-[#374151] bg-white border border-[#e2e8f0] rounded-lg outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 transition-all placeholder:text-[#94a3b8] disabled:bg-[#f8fafc] disabled:text-[#94a3b8]"
    />
  );
}

function NumberInput({ value, onChange, min, max, disabled }: {
  value: string; onChange: (v: string) => void; min?: number; max?: number; disabled?: boolean;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      min={min}
      max={max}
      disabled={disabled}
      className="w-full h-9 px-3 text-[13px] text-[#374151] bg-white border border-[#e2e8f0] rounded-lg outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 transition-all disabled:bg-[#f8fafc] disabled:text-[#94a3b8]"
    />
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function SettingsClient({ user }: Props) {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [original, setOriginal] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/settings');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSettings(data.settings);
      setOriginal(data.settings);
    } catch { setError('Không thể tải cài đặt'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSettings(); }, []);

  const update = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(original);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSettings(data.settings);
      setOriginal(data.settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { setError('Lỗi lưu cài đặt'); }
    finally { setSaving(false); }
  };

  const handleReset = () => {
    setSettings({ ...original });
    setSaved(false);
  };

  return (
    <>
      <AdminSidebar user={user} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 border-b border-[#e2e8f0] bg-white flex-shrink-0" style={{ height: 60 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
              <Settings size={16} className="text-[#64748b]" />
            </div>
            <h1 className="text-[15px] font-bold text-[#0f172a]">Cài đặt hệ thống</h1>
          </div>
          <div className="flex items-center gap-2">
            {error && (
              <span className="text-[12px] text-[#dc2626] flex items-center gap-1">
                <AlertTriangle size={12} />{error}
              </span>
            )}
            {saved && (
              <span className="text-[12px] text-[#059669] flex items-center gap-1 font-semibold">
                <Check size={14} />Đã lưu
              </span>
            )}
            <button onClick={handleReset} disabled={!hasChanges || saving}
              className="px-3 py-1.5 text-[12px] font-semibold text-[#64748b] bg-[#f1f5f9] rounded-lg hover:bg-[#e2e8f0] transition-colors disabled:opacity-40">
              Hoàn tác
            </button>
            <button onClick={handleSave} disabled={!hasChanges || saving}
              className="px-4 py-1.5 text-[12px] font-semibold text-white bg-[#059669] rounded-lg hover:bg-[#047857] transition-colors flex items-center gap-1.5 disabled:opacity-40">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Lưu thay đổi
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-60 gap-3">
              <Loader2 size={24} className="animate-spin text-[#059669]" />
              <p className="text-[13px] text-[#94a3b8]">Đang tải cài đặt...</p>
            </div>
          ) : (
            <>
              {/* General */}
              <Section icon={Globe} iconBg="#059669" title="Thông tin chung" description="Tên và mô tả hiển thị trên hệ thống">
                <Field label="Tên hệ thống" hint="Hiển thị trên sidebar và trang chủ">
                  <TextInput value={settings.site_name || ''} onChange={v => update('site_name', v)} placeholder="MathBot" />
                </Field>
                <Field label="Mô tả" hint="Mô tả ngắn gọn về hệ thống">
                  <TextInput value={settings.site_description || ''} onChange={v => update('site_description', v)} placeholder="Hỗ trợ học Toán..." />
                </Field>
              </Section>

              {/* Security */}
              <Section icon={ShieldCheck} iconBg="#7c3aed" title="Bảo mật & Truy cập" description="Quản lý quyền truy cập và chế độ bảo trì">
                <Field label="Cho phép đăng ký" hint="Tắt để ngừng nhận người dùng mới">
                  <Toggle
                    enabled={settings.allow_registration === 'true'}
                    onChange={v => update('allow_registration', v ? 'true' : 'false')}
                  />
                </Field>
                <Field label="Chế độ bảo trì" hint="Bật sẽ chặn người dùng truy cập hệ thống">
                  <div className="flex items-center gap-3">
                    <Toggle
                      enabled={settings.maintenance_mode === 'true'}
                      onChange={v => update('maintenance_mode', v ? 'true' : 'false')}
                    />
                    {settings.maintenance_mode === 'true' && (
                      <span className="text-[11px] font-bold text-[#dc2626] bg-[#fef2f2] px-2 py-0.5 rounded-full">
                        Đang bảo trì
                      </span>
                    )}
                  </div>
                </Field>
              </Section>

              {/* AI Chatbot */}
              <Section icon={Bot} iconBg="#0284c7" title="AI Chatbot" description="Cấu hình model và tham số cho chatbot">
                <Field label="Model chính" hint="Model dùng cho chế độ Thinking">
                  <TextInput value={settings.ai_model || ''} onChange={v => update('ai_model', v)} placeholder="nvidia/nemotron-3-super-120b-a12b" />
                </Field>
                <Field label="Model nhanh" hint="Model dùng cho chế độ Fast">
                  <TextInput value={settings.ai_fast_model || ''} onChange={v => update('ai_fast_model', v)} placeholder="meta/llama-3.1-8b-instruct" />
                </Field>
                <Field label="Temperature" hint="0 = chính xác, 1 = sáng tạo (khuyến nghị: 0.3)">
                  <NumberInput value={settings.ai_temperature || '0.3'} onChange={v => update('ai_temperature', v)} min={0} max={1} />
                </Field>
                <Field label="Lịch sử chat tối đa" hint="Số tin nhắn gửi kèm context cho AI">
                  <NumberInput value={settings.ai_max_history || '10'} onChange={v => update('ai_max_history', v)} min={1} max={50} />
                </Field>
                <Field label="Rate limit" hint="Số tin nhắn tối đa mỗi phút/user">
                  <NumberInput value={settings.rate_limit_per_min || '20'} onChange={v => update('rate_limit_per_min', v)} min={1} max={100} />
                </Field>
              </Section>

              {/* Exam */}
              <Section icon={FileText} iconBg="#ea580c" title="Cấu hình thi" description="Cài đặt thời gian và số câu hỏi">
                <Field label="Thời gian thi (phút)" hint="Thời gian tối đa cho mỗi bài thi">
                  <NumberInput value={settings.max_exam_time || '90'} onChange={v => update('max_exam_time', v)} min={10} max={240} />
                </Field>
                <Field label="Số câu hỏi mỗi đề" hint="Số câu hỏi mặc định khi tạo đề thi">
                  <NumberInput value={settings.questions_per_exam || '50'} onChange={v => update('questions_per_exam', v)} min={5} max={100} />
                </Field>
              </Section>

              {/* Danger zone */}
              <div className="bg-white rounded-[12px] overflow-hidden" style={{ border: '0.5px solid #fecaca' }}>
                <div className="px-6 py-4 border-b border-[#fee2e2] flex items-center gap-3 bg-[#fef2f2]">
                  <div className="w-9 h-9 rounded-lg bg-[#dc2626] flex items-center justify-center">
                    <AlertTriangle size={16} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#991b1b]">Vùng nguy hiểm</h3>
                    <p className="text-[11px] text-[#dc2626]/60">Các thao tác không thể hoàn tác</p>
                  </div>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-[#374151]">Xóa toàn bộ lịch sử chat</p>
                      <p className="text-[11px] text-[#94a3b8]">Xóa tất cả đoạn chat và tin nhắn của mọi người dùng</p>
                    </div>
                    <button disabled className="px-3 py-1.5 text-[12px] font-semibold text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg hover:bg-[#fee2e2] transition-colors opacity-50 cursor-not-allowed">
                      Sắp ra mắt
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-[#374151]">Reset cài đặt về mặc định</p>
                      <p className="text-[11px] text-[#94a3b8]">Khôi phục tất cả cài đặt về giá trị ban đầu</p>
                    </div>
                    <button disabled className="px-3 py-1.5 text-[12px] font-semibold text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg hover:bg-[#fee2e2] transition-colors opacity-50 cursor-not-allowed">
                      Sắp ra mắt
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
