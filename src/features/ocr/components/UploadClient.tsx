'use client';

import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import AdminSidebar from '@/shared/components/AdminSidebar';
import {
  FileSpreadsheet, History, PenLine, FileCheck, ImagePlus,
} from 'lucide-react';

import ManualInputForm from '@/features/admin/components/ManualInputForm';
import ExcelTab from '@/features/ocr/components/ExcelTab';
import HistoryTab from '@/features/ocr/components/HistoryTab';
import ImageTabContent from '@/features/ocr/components/ImageTabContent';
import ThptTabContent from '@/features/ocr/components/ThptTabContent';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
}

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

const TABS = [
  { id: 'manual', label: 'Nhập tay', icon: PenLine },
  { id: 'excel', label: 'Excel / CSV', icon: FileSpreadsheet },
  { id: 'image', label: 'Tải ảnh', icon: ImagePlus },
  { id: 'thpt', label: 'Đề THPT', icon: FileCheck },
  { id: 'history', label: 'Lịch sử', icon: History },
] as const;

type TabId = (typeof TABS)[number]['id'];

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function UploadClient({
  user,
  apiBasePath = '/api/v1/admin/upload',
  hideSidebar = false,
}: {
  user: AuthUser;
  apiBasePath?: string;
  hideSidebar?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TabId>('manual');

  return (
    <>
      <Toaster position="top-right" />
      {!hideSidebar && <AdminSidebar user={user} />}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Topbar */}
        <header className="h-[60px] bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <h1 className="text-[#0f172a] text-[18px] font-bold">Upload nội dung</h1>
            <p className="text-[#94a3b8] text-[12px]">Upload câu hỏi, lý thuyết và bộ đề vào hệ thống</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-[#e2e8f0] px-8 flex-shrink-0">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-[13px] font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#059669] text-[#059669]'
                    : 'border-transparent text-[#94a3b8] hover:text-[#64748b]'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'manual' && (
            <div className="max-width-6xl mx-auto">
              <ManualInputForm onSuccess={() => setActiveTab('history')} />
            </div>
          )}

          {activeTab === 'excel' && <ExcelTab apiBasePath={apiBasePath} />}

          {activeTab === 'image' && <ImageTabContent apiBasePath={apiBasePath} />}

          {activeTab === 'thpt' && <ThptTabContent apiBasePath={apiBasePath} />}

          {activeTab === 'history' && <HistoryTab apiBasePath={apiBasePath} />}
        </div>
      </main>
    </>
  );
}
