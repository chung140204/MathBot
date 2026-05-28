import Link from 'next/link';
import { ChevronRight, LucideIcon } from 'lucide-react';

export interface TeacherStats {
  totalClassrooms: number;
  totalExamSets: number;
  totalQuestions: number;
  totalStudents: number;
  weeklySubmissions: Array<{ day: string; count: number }>;
  recentSubmissions: Array<{
    id: string;
    studentName: string;
    examSetTitle: string;
    score: number;
    totalQuestions: number;
    timeTakenSecs: number;
    submittedAt: string;
    classroomName: string;
  }>;
  classrooms: Array<{
    id: string;
    name: string;
    code: string;
    memberCount: number;
    assignmentCount: number;
    avgScore: number | null;
  }>;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  href: string;
  isLoading?: boolean;
}

export function MetricCard({ title, value, detail, icon: Icon, iconBg, iconColor, href, isLoading }: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-[12px] animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100" />
          <div className="w-12 h-5 rounded bg-slate-100" />
        </div>
        <div className="h-7 w-20 bg-slate-100 rounded mb-2" />
        <div className="h-4 w-32 bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <Link href={href} className="group">
      <div className="bg-white p-5 rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
           style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex justify-between items-start mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: iconBg, color: iconColor }}>
            <Icon size={20} />
          </div>
          <ChevronRight size={16} className="text-[#cbd5e1] group-hover:text-[#94a3b8] transition-colors" />
        </div>
        <h3 className="text-[#64748b] text-[11px] font-medium uppercase tracking-wider mb-1">{title}</h3>
        <p className="text-[#0f172a] text-[22px] font-bold leading-tight">{value}</p>
        <p className="text-[#94a3b8] text-[11px] mt-1">{detail}</p>
      </div>
    </Link>
  );
}

export function SectionHeader({ title, actions }: { title: string; actions?: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-[#0f172a] text-[15px] font-bold">{title}</h2>
      <div className="flex gap-2">{actions}</div>
    </div>
  );
}

export function CardSkeleton({ height = 'h-64' }: { height?: string }) {
  return <div className={`bg-white rounded-[12px] ${height} animate-pulse`} style={{ border: '0.5px solid #e2e8f0' }} />;
}
