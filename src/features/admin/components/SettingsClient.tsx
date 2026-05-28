'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/shared/components/AdminSidebar';
import { Settings, Save, Globe, Bot, FileText, ShieldCheck, Loader2, Check, AlertTriangle } from 'lucide-react';
import { Toggle, Section, Field, TextInput, NumberInput } from './settings/SettingsUI';

interface Props {
  user: { id?: string; name?: string | null; email?: string | null; role?: string };
}

type SettingsMap = Record<string, string>;

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
    // Validate before save
    const temp = parseFloat(settings.ai_temperature || '0');
    if (isNaN(temp) || temp < 0 || temp > 1) {
      setError('Temperature phải từ 0 đến 1');
      return;
    }
    const rateLimit = parseInt(settings.ai_rate_limit || '0');
    if (isNaN(rateLimit) || rateLimit < 1 || rateLimit > 100) {
      setError('Rate limit phải từ 1 đến 100');
      return;
    }

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
                    <button
                      onClick={async () => {
                        if (!confirm('Xóa toàn bộ lịch sử chat?\n\nTất cả cuộc hội thoại và tin nhắn sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.')) return;
                        try {
                          const res = await fetch('/api/v1/admin/settings', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'clear_chats' }) });
                          if (res.ok) alert('Đã xóa toàn bộ lịch sử chat.');
                          else alert('Lỗi khi xóa.');
                        } catch { alert('Lỗi kết nối.'); }
                      }}
                      className="px-3 py-1.5 text-[12px] font-semibold text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg hover:bg-[#fee2e2] transition-colors"
                    >
                      Xóa tất cả
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[13px] font-semibold text-[#374151]">Reset cài đặt về mặc định</p>
                      <p className="text-[11px] text-[#94a3b8]">Khôi phục tất cả cài đặt về giá trị ban đầu</p>
                    </div>
                    <button
                      onClick={() => {
                        if (!confirm('Reset tất cả cài đặt về mặc định?')) return;
                        setSettings({ ...original });
                        setSaved(false);
                      }}
                      className="px-3 py-1.5 text-[12px] font-semibold text-[#dc2626] bg-[#fef2f2] border border-[#fecaca] rounded-lg hover:bg-[#fee2e2] transition-colors"
                    >
                      Reset
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
