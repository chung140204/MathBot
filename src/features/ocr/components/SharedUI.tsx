'use client';

import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

// ─── Badge ────────────────────────────────────────────────────────────────────

export interface BadgeProps {
  variant: 'green' | 'blue' | 'red' | 'amber' | 'purple' | 'gray';
  children: React.ReactNode;
  className?: string;
}

const badgeStyles: Record<BadgeProps['variant'], string> = {
  green: 'bg-[#d1fae5] text-[#065f46]',
  blue: 'bg-[#e0f2fe] text-[#075985]',
  red: 'bg-[#fee2e2] text-[#991b1b]',
  amber: 'bg-[#fef3c7] text-[#92400e]',
  purple: 'bg-[#ede9fe] text-[#4c1d95]',
  gray: 'bg-[#f1f5f9] text-[#64748b]',
};

export const Badge = ({ variant, children, className = '' }: BadgeProps) => (
  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeStyles[variant]} ${className}`}>
    {children}
  </span>
);

// ─── SuccessHero ──────────────────────────────────────────────────────────────

export interface SuccessStats {
  total: number;
  success: number;
  warning?: number;
}

export const SuccessHero = ({ stats, onReset }: { stats: SuccessStats; onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
    <div className="w-20 h-20 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#059669] mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
      <CheckCircle2 size={40} />
    </div>
    <h2 className="text-[#0f172a] text-[24px] font-bold mb-2">Upload Thành Công!</h2>
    <p className="text-[#64748b] text-[14px] max-w-md mb-8">
      Dữ liệu đã được xử lý và cập nhật vào hệ thống. Bạn có thể kiểm tra kết quả chi tiết bên dưới.
    </p>
    <div className="grid grid-cols-3 gap-8 w-full max-w-2xl mb-12">
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0]">
        <p className="text-[#94a3b8] text-[11px] uppercase font-bold tracking-widest mb-1">Tổng cộng</p>
        <p className="text-[#0f172a] text-[32px] font-black">{stats.total}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-[#059669]/20 shadow-[0_4px_12px_rgba(5,150,105,0.05)]">
        <p className="text-[#059669] text-[11px] uppercase font-bold tracking-widest mb-1">Thành công</p>
        <p className="text-[#059669] text-[32px] font-black">{stats.success}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0]">
        <p className="text-[#f59e0b] text-[11px] uppercase font-bold tracking-widest mb-1">Cảnh báo</p>
        <p className="text-[#f59e0b] text-[32px] font-black">{stats.warning || 0}</p>
      </div>
    </div>
    <button
      onClick={onReset}
      className="px-8 py-3 rounded-xl bg-[#0f172a] text-white text-[14px] font-bold hover:bg-[#1e293b] transition-all flex items-center gap-2 group"
    >
      Tiếp tục upload mới
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// ─── DIFFICULTIES constant ────────────────────────────────────────────────────

export const DIFFICULTIES = [
  { id: 'RECOGNITION', name: 'Nhận biết' },
  { id: 'COMPREHENSION', name: 'Thông hiểu' },
  { id: 'APPLICATION', name: 'Vận dụng' },
  { id: 'ADVANCED', name: 'Vận dụng cao' },
];
