'use client';

import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

// ---------------------------------------------------------------------------
// Types (exported for parent)
// ---------------------------------------------------------------------------

export interface Stats {
  totalUsers: number; usersTrend: string;
  totalQuestions: number; questionsTrend: string;
  examsToday: number; examsTrend: string;
  aiChatsToday: number; aiTrend: string;
}
export interface WeeklyDataItem { day: string; count: number; }
export interface ContentStats { theory: number; practice: number; thptExams: number; knowledgeChunks: number; }
export interface RecentUser { id: string; name: string | null; email: string | null; role: string; _count: { examAttempts: number }; }
export interface ActivityItem { type: string; message: string; time: string; user: string; }
export interface TopicStat { topic: string; _count: number; }

// ---------------------------------------------------------------------------
// MetricCard
// ---------------------------------------------------------------------------

interface MetricCardProps {
  title: string; value: string | number; detail: string;
  icon: LucideIcon; trend?: 'up' | 'down'; trendValue?: string;
  iconBg: string; isLoading?: boolean;
}

export function MetricCard({ title, value, detail, icon: Icon, trend, trendValue, iconBg, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-[12px] animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex justify-between items-start mb-4"><div className="w-10 h-10 rounded-lg bg-slate-100" /><div className="w-12 h-5 rounded bg-slate-100" /></div>
        <div className="h-7 w-20 bg-slate-100 rounded mb-2" /><div className="h-4 w-32 bg-slate-100 rounded" />
      </div>
    );
  }
  return (
    <div className="bg-white p-5 rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]" style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#10b981]" style={{ backgroundColor: iconBg }}><Icon size={20} /></div>
        {trend && trendValue && (
          <div title="So với tuần trước" className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold cursor-default ${trend === 'up' ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
            {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-[#64748b] text-[11px] font-medium uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-[#0f172a] text-[20px] font-bold leading-tight">{value}</p>
        <p className="text-[#94a3b8] text-[10px] mt-1">{detail}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SectionHeader
// ---------------------------------------------------------------------------

export function SectionHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-[#0f172a] text-[14px] font-bold">{title}</h2>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
}
