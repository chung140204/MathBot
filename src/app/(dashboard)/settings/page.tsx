'use client';

import { useState, useEffect } from 'react';
import { useSettingsData } from '@/features/settings/hooks/useSettingsData';
import { SettingsAccountTab } from '@/features/settings/components/SettingsAccountTab';
import { SettingsSecurityTab } from '@/features/settings/components/SettingsSecurityTab';
import { SettingsNotificationsTab } from '@/features/settings/components/SettingsNotificationsTab';
import { SettingsAiTab } from '@/features/settings/components/SettingsAiTab';
import { SettingsPracticeTab } from '@/features/settings/components/SettingsPracticeTab';

type SettingsTab = 'account' | 'notifications' | 'ai-chat' | 'practice' | 'security';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'account', label: 'Tài khoản' },
  { id: 'notifications', label: 'Thông báo' },
  { id: 'ai-chat', label: 'AI & Chat' },
  { id: 'practice', label: 'Luyện tập' },
  { id: 'security', label: 'Bảo mật' },
];

export default function SettingsPage() {
  useEffect(() => { document.title = 'Cài đặt | MathBot'; }, []);
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const s = useSettingsData();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Cài đặt</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý tài khoản và tuỳ chỉnh trải nghiệm</p>
        </div>
        <button onClick={s.handleSave} disabled={s.isSaving}
          className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl shadow-sm hover:bg-gray-800 transition-all disabled:opacity-50">
          {s.isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-8">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold transition-all relative ${activeTab === tab.id ? 'text-[#059669]' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.label}
            {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#059669] rounded-full" />}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'account' && <SettingsAccountTab s={s} />}
      {activeTab === 'security' && <SettingsSecurityTab s={s} />}
      {activeTab === 'notifications' && <SettingsNotificationsTab s={s} />}
      {activeTab === 'ai-chat' && <SettingsAiTab s={s} />}
      {activeTab === 'practice' && <SettingsPracticeTab s={s} />}
    </div>
  );
}
