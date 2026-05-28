'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  BookOpen,
  Plus,
  Upload,
  RefreshCcw,
  ChevronRight,
  Clock,
  Award,
  BarChart3,
} from 'lucide-react';
import { MetricCard, SectionHeader, CardSkeleton, type TeacherStats } from './dashboard/TeacherDashboardWidgets';

// ── Main Component ─────────────────────────────────────────────────────────────

export default function TeacherDashboardClient({ userName }: { userName?: string }) {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/v1/teacher/stats');
      if (res.ok) setStats(await res.json());
    } catch { /* ignore */ } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  const handleRefresh = () => { setRefreshing(true); fetchStats(); };

  const maxWeekly = stats ? Math.max(...stats.weeklySubmissions.map(w => w.count), 1) : 1;
  const maxAvgScore = stats ? Math.max(...stats.classrooms.map(c => c.avgScore || 0), 1) : 10;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-6 md:p-8 w-full max-w-[1400px] mx-auto">

      {/* ═══ Section 1: Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[22px] font-bold text-[#0f172a]">
            Xin chào{userName ? `, ${userName}` : ''}
          </h1>
          <p className="text-[#94a3b8] text-[13px] mt-1">Tổng quan hoạt động giảng dạy</p>
        </div>
        <div className="flex gap-2">
          <Link href="/teacher/classrooms" className="flex items-center gap-1.5 px-3.5 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition text-[12px] font-semibold">
            <Plus size={14} /> Tạo lớp
          </Link>
          <Link href="/teacher/upload" className="flex items-center gap-1.5 px-3.5 py-2 bg-[#7c3aed] text-white rounded-lg hover:bg-[#6d28d9] transition text-[12px] font-semibold">
            <Upload size={14} /> Upload đề
          </Link>
          <button onClick={handleRefresh} disabled={refreshing}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9] transition"
            style={{ border: '0.5px solid #e2e8f0' }}
            title="Làm mới">
            <RefreshCcw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ═══ Section 2: Metric Cards ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard title="Lớp học" value={stats?.totalClassrooms ?? 0} detail="Đang hoạt động" icon={Users} iconBg="#eff6ff" iconColor="#2563eb" href="/teacher/classrooms" isLoading={loading} />
        <MetricCard title="Bộ đề thi" value={stats?.totalExamSets ?? 0} detail="Đã tạo" icon={FileText} iconBg="#f5f3ff" iconColor="#7c3aed" href="/teacher/exam-sets" isLoading={loading} />
        <MetricCard title="Câu hỏi" value={stats?.totalQuestions ?? 0} detail="Trong ngân hàng" icon={BookOpen} iconBg="#ecfdf5" iconColor="#059669" href="/teacher/questions" isLoading={loading} />
        <MetricCard title="Học sinh" value={stats?.totalStudents ?? 0} detail="Tổng các lớp" icon={Users} iconBg="#fffbeb" iconColor="#d97706" href="/teacher/classrooms" isLoading={loading} />
      </div>

      {/* ═══ Section 3: Weekly Chart + Recent Submissions ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

        {/* Bar Chart: Bài nộp 7 ngày */}
        {loading ? <CardSkeleton height="h-[300px]" /> : (
          <div className="lg:col-span-3 bg-white rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]" style={{ border: '0.5px solid #e2e8f0' }}>
            <SectionHeader title="Bài nộp 7 ngày qua" />
            <div className="flex items-end justify-between gap-2 h-[180px] mt-4">
              {stats?.weeklySubmissions.map((w, i) => {
                const heightPct = maxWeekly > 0 ? (w.count / maxWeekly) * 100 : 0;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col items-center justify-end h-[150px]">
                      {w.count > 0 && (
                        <span className="text-[10px] font-bold text-[#64748b] mb-1">{w.count}</span>
                      )}
                      <div
                        className="w-full max-w-[36px] rounded-t-md bg-gradient-to-t from-[#2563eb] to-[#7c3aed] transition-all duration-500 hover:opacity-80"
                        style={{ height: `${Math.max(heightPct, 4)}%`, minHeight: w.count > 0 ? '8px' : '3px', opacity: w.count === 0 ? 0.15 : 1 }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-[#94a3b8]">{w.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Submissions */}
        {loading ? <CardSkeleton height="h-[300px]" /> : (
          <div className="lg:col-span-2 bg-white rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]" style={{ border: '0.5px solid #e2e8f0' }}>
            <SectionHeader title="Bài nộp gần đây" />
            {stats?.recentSubmissions && stats.recentSubmissions.length > 0 ? (
              <div className="space-y-3 mt-2">
                {stats.recentSubmissions.map((sub) => {
                  const pct = sub.totalQuestions > 0 ? Math.round((sub.score / sub.totalQuestions) * 100) : 0;
                  const mins = Math.floor(sub.timeTakenSecs / 60);
                  return (
                    <div key={sub.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#f8fafc] transition">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold ${pct >= 70 ? 'bg-[#d1fae5] text-[#065f46]' : pct >= 50 ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                        {pct}%
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold text-[#0f172a] truncate">{sub.studentName}</p>
                        <p className="text-[10px] text-[#94a3b8] truncate">{sub.examSetTitle} &middot; {sub.classroomName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[11px] font-bold text-[#0f172a]">{sub.score}/{sub.totalQuestions}</p>
                        <p className="text-[10px] text-[#94a3b8] flex items-center gap-0.5 justify-end"><Clock size={9} />{mins}p</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-[#94a3b8]">
                <Award size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-[12px]">Chưa có bài nộp nào</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ Section 4: Classrooms + Avg Score Chart ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">

        {/* Classroom List */}
        {loading ? <CardSkeleton height="h-[280px]" /> : (
          <div className="lg:col-span-3 bg-white rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]" style={{ border: '0.5px solid #e2e8f0' }}>
            <SectionHeader title="Lớp học của tôi" actions={
              <Link href="/teacher/classrooms" className="text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition">Xem tất cả</Link>
            } />
            {stats?.classrooms && stats.classrooms.length > 0 ? (
              <div className="space-y-2 mt-2">
                {stats.classrooms.slice(0, 5).map((c) => (
                  <Link key={c.id} href={`/teacher/classrooms/${c.id}`}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f8fafc] transition group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#eff6ff' }}>
                        <Users size={16} style={{ color: '#2563eb' }} />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-[#0f172a] group-hover:text-[#2563eb] transition">{c.name}</p>
                        <p className="text-[10px] text-[#94a3b8]">
                          {c.code} &middot; {c.memberCount} HS &middot; {c.assignmentCount} bài giao
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-[#e2e8f0] group-hover:text-[#94a3b8] transition" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-[#94a3b8]">
                <Users size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-[12px]">Chưa có lớp học nào</p>
                <Link href="/teacher/classrooms" className="text-[11px] text-[#2563eb] hover:underline mt-1 inline-block">Tạo lớp đầu tiên</Link>
              </div>
            )}
          </div>
        )}

        {/* Avg Score by Classroom */}
        {loading ? <CardSkeleton height="h-[280px]" /> : (
          <div className="lg:col-span-2 bg-white rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]" style={{ border: '0.5px solid #e2e8f0' }}>
            <SectionHeader title="Điểm TB theo lớp" actions={
              <BarChart3 size={14} className="text-[#94a3b8]" />
            } />
            {stats?.classrooms && stats.classrooms.some(c => c.avgScore !== null) ? (
              <div className="space-y-3 mt-4">
                {stats.classrooms.filter(c => c.avgScore !== null).map((c) => {
                  const widthPct = ((c.avgScore ?? 0) / Math.max(maxAvgScore, 10)) * 100;
                  const scoreColor = (c.avgScore ?? 0) >= 7 ? '#059669' : (c.avgScore ?? 0) >= 5 ? '#d97706' : '#dc2626';
                  return (
                    <div key={c.id}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11px] font-semibold text-[#374151] truncate max-w-[120px]">{c.name}</span>
                        <span className="text-[12px] font-bold" style={{ color: scoreColor }}>{c.avgScore?.toFixed(1)}</span>
                      </div>
                      <div className="h-2.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${widthPct}%`, backgroundColor: scoreColor }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-[#94a3b8]">
                <BarChart3 size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-[12px]">Chưa có dữ liệu điểm</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ═══ Section 5: Quick Actions ═══ */}
      <div className="bg-white rounded-[12px] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)]" style={{ border: '0.5px solid #e2e8f0' }}>
        <SectionHeader title="Hành động nhanh" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
          {[
            { label: 'Upload đề thi', icon: Upload, href: '/teacher/upload', bg: 'from-[#7c3aed]/10 to-[#7c3aed]/5', color: '#7c3aed' },
            { label: 'Tạo bộ đề mới', icon: FileText, href: '/teacher/exam-sets/new', bg: 'from-[#2563eb]/10 to-[#2563eb]/5', color: '#2563eb' },
            { label: 'Tạo lớp mới', icon: Users, href: '/teacher/classrooms', bg: 'from-[#059669]/10 to-[#059669]/5', color: '#059669' },
            { label: 'Ngân hàng câu hỏi', icon: BookOpen, href: '/teacher/questions', bg: 'from-[#d97706]/10 to-[#d97706]/5', color: '#d97706' },
          ].map((action) => (
            <Link key={action.label} href={action.href}
              className={`flex flex-col items-center gap-2.5 p-5 rounded-xl bg-gradient-to-br ${action.bg} hover:shadow-sm transition-all group`}>
              <action.icon size={22} style={{ color: action.color }} className="group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-semibold text-[#374151] text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
