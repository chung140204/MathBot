'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import { TOPIC_LABEL } from '@/lib/constants/topics';
import { Topic } from '@prisma/client';
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  FileCheck,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Search,
  Bell,
  ChevronRight,
  Plus,
  Upload,
  Database,
  LucideIcon
} from 'lucide-react';

// --- Interfaces ---

interface DashboardUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

interface Stats {
  totalUsers: number;
  usersTrend: string;
  totalQuestions: number;
  questionsTrend: string;
  examsToday: number;
  examsTrend: string;
  aiChatsToday: number;
  aiTrend: string;
}

interface WeeklyDataItem {
  day: string;
  count: number;
}

interface ContentStats {
  theory: number;
  examSets: number;
  practice: number;
  thptExams: number;
  knowledgeChunks: number;
}

interface RecentUser {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  _count: {
    examAttempts: number;
  };
}

interface ActivityItem {
  type: string;
  message: string;
  time: string;
  user: string;
}

interface TopicStat {
  topic: string;
  _count: number;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  iconBg: string;
  isLoading?: boolean;
}

interface SectionHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

// --- Components ---

const MetricCard = ({ 
  title, 
  value, 
  detail, 
  icon: Icon, 
  trend, 
  trendValue, 
  iconBg, 
  isLoading 
}: MetricCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-[12px] animate-pulse" style={{ border: '0.5px solid #e2e8f0' }}>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-slate-100"></div>
          <div className="w-12 h-5 rounded bg-slate-100"></div>
        </div>
        <div className="h-7 w-20 bg-slate-100 rounded mb-2"></div>
        <div className="h-4 w-32 bg-slate-100 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]" 
         style={{ border: '0.5px solid #e2e8f0' }}>
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#10b981]" style={{ backgroundColor: iconBg }}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${trend === 'up' ? 'bg-[#d1fae5] text-[#065f46]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
            {trend === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {trendValue}
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
};

const SectionHeader = ({ title, actions }: SectionHeaderProps) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-[#0f172a] text-[14px] font-bold">{title}</h2>
    <div className="flex gap-2">{actions}</div>
  </div>
);

// --- Main Page Client ---

export default function DashboardClient({ user }: { user: DashboardUser }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyDataItem[]>([]);
  const [contentStats, setContentStats] = useState<ContentStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [questionsByTopic, setQuestionsByTopic] = useState<TopicStat[]>([]);
  
  // Granular loading states
  const [loading, setLoading] = useState({
    stats: true,
    weekly: true,
    content: true,
    users: true,
    topic: true,
    activity: true
  });

  const fetchData = async () => {
    // Reset loading states
    setLoading({
      stats: true,
      weekly: true,
      content: true,
      users: true,
      topic: true,
      activity: true
    });

    // Fetch stats
    try {
      const res = await fetch('/api/v1/admin/stats');
      const s = await res.json();
      setStats(s);
    } catch (e) { 
      console.error('Error fetching stats:', e); 
    }
    setLoading(prev => ({ ...prev, stats: false }));

    // Fetch weekly
    try {
      const res = await fetch('/api/v1/admin/stats/users-weekly');
      const w = await res.json();
      setWeeklyData(w.data || []);
    } catch (e) { 
      console.error('Error fetching weekly data:', e); 
    }
    setLoading(prev => ({ ...prev, weekly: false }));

    // Fetch content
    try {
      const res = await fetch('/api/v1/admin/content-stats');
      const c = await res.json();
      setContentStats(c);
    } catch (e) { 
      console.error('Error fetching content stats:', e); 
    }
    setLoading(prev => ({ ...prev, content: false }));

    // Fetch users
    try {
      const res = await fetch('/api/v1/admin/users/recent');
      const u = await res.json();
      setRecentUsers(u);
    } catch (e) { 
      console.error('Error fetching recent users:', e); 
    }
    setLoading(prev => ({ ...prev, users: false }));

    // Fetch topics
    try {
      const res = await fetch('/api/v1/admin/questions/by-topic');
      const q = await res.json();
      setQuestionsByTopic(q);
    } catch (e) { 
      console.error('Error fetching questions by topic:', e); 
    }
    setLoading(prev => ({ ...prev, topic: false }));

    // Fetch activity
    try {
      const res = await fetch('/api/v1/admin/activity');
      const a = await res.json();
      setActivity(a);
    } catch (e) { 
      console.error('Error fetching activity:', e); 
    }
    setLoading(prev => ({ ...prev, activity: false }));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <AdminSidebar user={user} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Topbar */}
        <header className="h-[60px] bg-white border-b flex items-center justify-between px-6 flex-shrink-0" style={{ borderColor: '#e2e8f0' }}>
          <div className="flex items-center gap-4">
            <h1 className="text-[#0f172a] text-[15px] font-bold">Dashboard Tổng Quan</h1>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
              <input 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                className="bg-[#f8fafc] border-none rounded-lg pl-9 pr-4 py-1.5 text-[12px] w-[240px] focus:ring-1 focus:ring-[#059669]/30 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData} 
              disabled={Object.values(loading).some(v => v)}
              className="p-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors"
            >
              <RefreshCcw size={18} className={Object.values(loading).some(v => v) ? 'animate-spin' : ''} />
            </button>
            <button className="p-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg relative">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Scroll content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Row 1: 4 metric cards */}
          <div className="grid grid-cols-4 gap-6">
            <MetricCard 
              title="Tổng người dùng" 
              value={stats?.totalUsers || 0} 
              detail="Tăng trưởng đều đặn"
              icon={Users} 
              trend="up" 
              trendValue={stats?.usersTrend} 
              iconBg="#f0fdf9"
              isLoading={loading.stats}
            />
            <MetricCard 
              title="Ngân hàng câu hỏi" 
              value={stats?.totalQuestions || 0} 
              detail="Đã duyệt & đang hoạt động"
              icon={FileCheck} 
              trend="up" 
              trendValue={stats?.questionsTrend} 
              iconBg="#e0f2fe"
              isLoading={loading.stats}
            />
            <MetricCard 
              title="Lượt thi hôm nay" 
              value={stats?.examsToday || 0} 
              detail="Giao dịch thi trực tuyến"
              icon={BookOpen} 
              trend="up" 
              trendValue={stats?.examsTrend} 
              iconBg="#fef3c7"
              isLoading={loading.stats}
            />
            <MetricCard 
              title="AI Chat hôm nay" 
              value={stats?.aiChatsToday || 0} 
              detail="Tương tác với MathBot"
              icon={MessageSquare} 
              trend="up" 
              trendValue={stats?.aiTrend} 
              iconBg="#ede9fe"
              isLoading={loading.stats}
            />
          </div>

          {/* Row 2: Chart + Quick actions */}
          <div className="grid grid-cols-[3fr_2fr] gap-6">
            <div className="bg-white p-6 rounded-[12px]" style={{ border: '0.5px solid #e2e8f0' }}>
              <SectionHeader title="Tăng trưởng người dùng mới (7 ngày qua)" />
              <div className="h-[200px] flex items-end justify-between gap-4 mt-8 px-2">
                {loading.weekly ? (
                  <div className="w-full h-full animate-pulse bg-slate-50 rounded-lg"></div>
                ) : (
                  weeklyData.map((d: WeeklyDataItem, i: number) => {
                    const maxCount = Math.max(...weeklyData.map((x: WeeklyDataItem) => x.count), 1);
                    const height = (d.count / maxCount) * 100;
                    const isWeekend = d.day === 'T7' || d.day === 'CN';
                    const gradient = isWeekend 
                      ? 'linear-gradient(180deg, #94a3b8, #f1f5f9)' 
                      : i % 2 === 0 
                        ? 'linear-gradient(180deg, #059669, #d1fae5)'
                        : 'linear-gradient(180deg, #0891b2, #e0f2fe)';

                    return (
                      <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full flex flex-col items-center flex-1 justify-end">
                           <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0f172a] text-white text-[10px] py-1 px-2 rounded mb-1 whitespace-nowrap z-10">
                            {d.count} users
                          </div>
                          <div 
                            className="w-full max-w-[32px] rounded-t-lg transition-all duration-500" 
                            style={{ 
                              height: `${height}%`, 
                              background: gradient,
                              borderBottom: 'none'
                            }}
                          ></div>
                        </div>
                        <span className="text-[#94a3b8] text-[10px] font-bold">{d.day}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[12px]" style={{ border: '0.5px solid #e2e8f0' }}>
              <SectionHeader title="Thao tác nhanh" />
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Upload lý thuyết', icon: Upload, href: '/admin/upload?tab=theory', color: '#059669' },
                  { label: 'Thêm câu hỏi', icon: Plus, href: '/admin/questions/new', color: '#0891b2' },
                  { label: 'Tạo bộ đề mới', icon: BookOpen, href: '/admin/exams/new', color: '#7c3aed' },
                  { label: 'Quản lý RAG', icon: Database, href: '/admin/rag', color: '#64748b' },
                ].map((item) => (
                  <Link 
                    key={item.label}
                    href={item.href}
                    className="flex flex-col items-center justify-center p-4 rounded-xl border border-dashed border-[#e2e8f0] hover:border-solid hover:border-[#059669]/30 hover:bg-[#f0fdf9] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 bg-slate-50 group-hover:bg-white transition-colors">
                      <item.icon size={20} style={{ color: item.color }} />
                    </div>
                    <span className="text-[#374151] text-[11px] font-medium text-center">{item.label}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-[#f1f5f9]">
                 <div className="bg-gradient-to-br from-[#f0fdf9] to-[#e0f2fe] p-4 rounded-xl relative overflow-hidden">
                    <div className="relative z-10">
                      <h4 className="text-[#059669] text-[12px] font-bold mb-1">Cần hỗ trợ?</h4>
                      <p className="text-[#64748b] text-[10px] mb-3">Xem tài liệu hướng dẫn quản trị MathBot</p>
                      <button className="text-[10px] font-bold text-white bg-[#0f172a] px-3 py-1.5 rounded-lg">Xem tài liệu</button>
                    </div>
                    <Database className="absolute -bottom-4 -right-4 text-[#059669]/5" size={80} />
                 </div>
              </div>
            </div>
          </div>

          {/* Row 3: Table + Content status + Activity */}
          <div className="grid grid-cols-[2fr_1fr_1fr] gap-6">
            <div className="bg-white p-6 rounded-[12px]" style={{ border: '0.5px solid #e2e8f0' }}>
              <SectionHeader 
                title="Người dùng mới nhất" 
                actions={<Link href="/admin/users" className="text-[#059669] text-[11px] font-bold flex items-center gap-1 hover:underline">Tất cả <ChevronRight size={12}/></Link>} 
              />
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#f1f5f9]">
                      <th className="pb-3 text-[#94a3b8] text-[10px] uppercase font-bold">Thành viên</th>
                      <th className="pb-3 text-[#94a3b8] text-[10px] uppercase font-bold">Vai trò</th>
                      <th className="pb-3 text-[#94a3b8] text-[10px] uppercase font-bold text-center">Lượt thi</th>
                      <th className="pb-3 text-[#94a3b8] text-[10px] uppercase font-bold text-right">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1f5f9]">
                    {loading.users ? (
                      <tr><td colSpan={4} className="py-8 text-center animate-pulse text-slate-400">Đang tải người dùng...</td></tr>
                    ) : recentUsers.map((u: RecentUser) => (
                      <tr key={u.id} className="hover:bg-[#f8fafc] transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-[#e0f2fe] text-[#075985] flex items-center justify-center text-[10px] font-bold">
                              {u.name?.[0]}
                            </div>
                            <div>
                              <p className="text-[#0f172a] text-[12px] font-bold leading-none">{u.name}</p>
                              <p className="text-[#94a3b8] text-[10px] mt-1">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-[#ede9fe] text-[#4c1d95]' : 'bg-[#e0f2fe] text-[#075985]'}`}>
                            {u.role === 'ADMIN' ? 'Quản trị' : 'Học sinh'}
                          </span>
                        </td>
                        <td className="py-3 text-center text-[#374151] text-[11px]">{u._count?.examAttempts || 0}</td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#065f46] text-[10px] font-bold">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#059669]"></div>
                            Hoạt động
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[12px]" style={{ border: '0.5px solid #e2e8f0' }}>
              <SectionHeader title="Trạng thái nội dung" />
              <div className="space-y-4">
                {loading.content ? (
                  <div className="space-y-4 animate-pulse">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-4 bg-slate-100 rounded"></div>)}
                  </div>
                ) : [
                  { label: 'Lý thuyết', count: contentStats?.theory, color: '#059669' },
                  { label: 'Bộ đề ôn tập', count: contentStats?.examSets, color: '#0891b2' },
                  { label: 'Câu hỏi ôn luyện', count: contentStats?.practice, color: '#f59e0b' },
                  { label: 'Đề thi THPT', count: contentStats?.thptExams, color: '#7c3aed' },
                  { label: 'RAG Knowledge', count: contentStats?.knowledgeChunks, color: '#94a3b8' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[#374151] text-[11px] font-medium">{item.label}</span>
                    </div>
                    <span className="text-[#0f172a] text-[12px] font-bold">{item.count || 0}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                 <p className="text-[#94a3b8] text-[10px] mb-2 uppercase font-bold tracking-widest">Hiệu suất index</p>
                 <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#059669] to-[#0891b2]" style={{ width: '85%' }}></div>
                 </div>
                 <div className="flex justify-between mt-1.5">
                    <span className="text-[#94a3b8] text-[10px]">Đã tối ưu 85%</span>
                    <span className="text-[#059669] text-[10px] font-bold">Khỏe mạnh</span>
                 </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[12px]" style={{ border: '0.5px solid #e2e8f0' }}>
              <SectionHeader title="Hoạt động gần đây" />
              <div className="relative space-y-6 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[0.5px] before:bg-[#f1f5f9]">
                {loading.activity ? (
                  <div className="space-y-6 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-10 bg-slate-50 rounded pl-6"></div>)}
                  </div>
                ) : activity.map((act: ActivityItem, idx: number) => (
                  <div key={idx} className="relative pl-6">
                    <div 
                      className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 border-white ring-1 ring-[#f1f5f9]"
                      style={{ backgroundColor: act.type === 'UPLOAD' ? '#059669' : act.type === 'USER_NEW' ? '#0891b2' : '#7c3aed' }}
                    ></div>
                    <p className="text-[#0f172a] text-[11px] font-bold leading-tight">{act.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[#94a3b8] text-[10px]">{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                       <span className="text-[#94a3b8] text-[10px]">•</span>
                       <span className="text-[#059669] text-[10px] font-medium">{act.user}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-2 rounded-lg bg-[#f8fafc] text-[#64748b] text-[10px] font-bold hover:bg-[#f1f5f9] transition-colors border border-transparent hover:border-[#e2e8f0]">
                Xem nhật ký hệ thống
              </button>
            </div>
          </div>

          {/* Row 4: Topic distribution */}
          <div className="bg-white p-6 rounded-[12px]" style={{ border: '0.5px solid #e2e8f0' }}>
            <SectionHeader title="Phân bổ câu hỏi theo chủ đề (Thống kê thực tế)" />
            <div className="grid grid-cols-4 gap-6">
              {loading.topic ? (
                <div className="col-span-4 grid grid-cols-4 gap-6 animate-pulse">
                   {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-slate-50 rounded"></div>)}
                </div>
              ) : questionsByTopic.length === 0 ? (
                <div className="col-span-4 py-8 text-center text-[#94a3b8] text-[12px] italic">Chưa có dữ liệu thống kê câu hỏi</div>
              ) : (
                questionsByTopic.map((qt: TopicStat) => (
                   <div key={qt.topic} className="flex flex-col gap-2">
                      <div className="flex justify-between items-end">
                        <span className="text-[#374151] text-[11px] font-bold truncate pr-2" title={qt.topic}>
                          {TOPIC_LABEL[qt.topic as Topic] ?? qt.topic}
                        </span>
                        <span className="text-[#64748b] text-[10px]">{qt._count} câu</span>
                      </div>
                      <div className="w-full h-1 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#059669]/60" 
                          style={{ width: `${Math.min((qt._count / 200) * 100, 100)}%` }}
                        ></div>
                      </div>
                   </div>
                ))
              )}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
