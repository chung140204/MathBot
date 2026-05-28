'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/shared/components/AdminSidebar';
import { Users, BookOpen, MessageSquare, FileCheck, RefreshCcw, Search, Bell } from 'lucide-react';
import {
  MetricCard,
  type Stats, type WeeklyDataItem, type ContentStats, type RecentUser, type ActivityItem, type TopicStat,
} from './dashboard/DashboardWidgets';
import { DashboardChartRow } from './dashboard/DashboardChartRow';
import { DashboardDataRow } from './dashboard/DashboardDataRow';

interface DashboardUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: string;
}

// Types and components (MetricCard, SectionHeader) imported from ./dashboard/DashboardWidgets

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
    setLastUpdated(new Date());
  };

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

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
            {lastUpdated && !Object.values(loading).some(v => v) && (
              <span className="text-[11px] text-[#94a3b8] hidden sm:inline">
                Cập nhật {lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
            <button
              onClick={fetchData}
              disabled={Object.values(loading).some(v => v)}
              className="p-2 text-[#64748b] hover:bg-[#f1f5f9] rounded-lg transition-colors"
              title="Làm mới dữ liệu"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <MetricCard
              title="Tổng người dùng"
              value={stats?.totalUsers || 0}
              detail="So với tuần trước"
              icon={Users}
              trend={stats?.usersTrend?.startsWith('-') ? 'down' : 'up'}
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
              detail="Bài thi được hoàn thành hôm nay"
              icon={BookOpen}
              trend={stats?.examsTrend?.startsWith('-') ? 'down' : 'up'}
              trendValue={stats?.examsTrend}
              iconBg="#fef3c7"
              isLoading={loading.stats}
            />
            <MetricCard
              title="AI Chat hôm nay"
              value={stats?.aiChatsToday || 0}
              detail="Tương tác với MathBot"
              icon={MessageSquare}
              trend={stats?.aiTrend?.startsWith('-') ? 'down' : 'up'}
              trendValue={stats?.aiTrend}
              iconBg="#ede9fe"
              isLoading={loading.stats}
            />
          </div>

          <DashboardChartRow weeklyData={weeklyData} loadingWeekly={loading.weekly} stats={stats} />

          <DashboardDataRow
            loading={{ users: loading.users, content: loading.content, activity: loading.activity, topic: loading.topic }}
            recentUsers={recentUsers} contentStats={contentStats} activity={activity} questionsByTopic={questionsByTopic}
          />

        </div>
      </main>
    </>
  );
}
