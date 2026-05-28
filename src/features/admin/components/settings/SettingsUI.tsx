'use client';

import React from 'react';

export function Toggle({ enabled, onChange, disabled }: { enabled: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={() => !disabled && onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-[#059669]' : 'bg-[#cbd5e1]'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

export function Section({ icon: Icon, iconBg, title, description, children }: {
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
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
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

export function TextInput({ value, onChange, placeholder, disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      className="w-full h-9 px-3 text-[13px] text-[#374151] bg-white border border-[#e2e8f0] rounded-lg outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 transition-all placeholder:text-[#94a3b8] disabled:bg-[#f8fafc] disabled:text-[#94a3b8]" />
  );
}

export function NumberInput({ value, onChange, min, max, disabled }: {
  value: string; onChange: (v: string) => void; min?: number; max?: number; disabled?: boolean;
}) {
  return (
    <input type="number" value={value} onChange={e => onChange(e.target.value)} min={min} max={max} disabled={disabled}
      className="w-full h-9 px-3 text-[13px] text-[#374151] bg-white border border-[#e2e8f0] rounded-lg outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 transition-all disabled:bg-[#f8fafc] disabled:text-[#94a3b8]" />
  );
}
