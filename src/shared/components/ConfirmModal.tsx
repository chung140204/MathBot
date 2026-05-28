'use client';

import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export function ConfirmModal({ open, title, message, confirmLabel, danger, loading, onConfirm, onCancel, children }: ConfirmModalProps) {
  if (!open) return null;
  const color = danger ? '#dc2626' : '#059669';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={!loading ? onCancel : undefined} />
      <div className="relative bg-white rounded-[12px] shadow-xl max-w-[420px] w-full mx-4 p-6">
        <button onClick={onCancel} disabled={loading} className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#374151] transition-colors"><X size={18} /></button>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: danger ? '#fef2f2' : '#f0fdf4' }}>
            <AlertTriangle size={20} style={{ color }} />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#0f172a] mb-1">{title}</h3>
            <p className="text-[13px] text-[#374151] leading-relaxed">{message}</p>
          </div>
        </div>
        {children && <div className="mt-4">{children}</div>}
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 text-[13px] font-semibold text-[#374151] bg-[#f1f5f9] rounded-lg hover:bg-[#e2e8f0] transition-colors">Hủy</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 text-[13px] font-semibold text-white rounded-lg transition-colors flex items-center gap-2" style={{ backgroundColor: color, opacity: loading ? 0.7 : 1 }}>
            {loading && <Loader2 size={14} className="animate-spin" />}{confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
