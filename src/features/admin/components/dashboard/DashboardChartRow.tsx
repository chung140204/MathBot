'use client';

import Link from 'next/link';
import { Upload, Plus, BookOpen, Users, ChevronRight } from 'lucide-react';
import { SectionHeader, type WeeklyDataItem, type Stats } from './DashboardWidgets';

interface DashboardChartRowProps {
  weeklyData: WeeklyDataItem[];
  loadingWeekly: boolean;
  stats: Stats | null;
}

export function DashboardChartRow({ weeklyData, loadingWeekly, stats }: DashboardChartRowProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 lg:gap-6">
      <div className="bg-white p-6 rounded-[12px]" style={{ border: '0.5px solid #e2e8f0' }}>
        <SectionHeader title="Tăng trưởng người dùng mới (7 ngày qua)" />
        <div className="h-[200px] flex items-end justify-between gap-4 mt-8 px-2">
          {loadingWeekly ? (
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
                      style={{ height: `${height}%`, background: gradient, borderBottom: 'none' }}
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
        <div className="space-y-2">
          {[
            { label: 'Upload lý thuyết', desc: 'Tải nội dung ôn tập theo chủ đề', icon: Upload, href: '/admin/upload', color: '#059669', bg: '#f0fdf9' },
            { label: 'Thêm câu hỏi', desc: 'Nhập thủ công hoặc từ Excel', icon: Plus, href: '/admin/upload?tab=manual', color: '#0891b2', bg: '#e0f2fe' },
            { label: 'Upload đề thi', desc: 'OCR trích xuất từ ảnh đề', icon: BookOpen, href: '/admin/upload?tab=ocr', color: '#7c3aed', bg: '#ede9fe' },
            { label: 'Quản lý người dùng', desc: `${stats?.totalUsers || 0} người dùng trong hệ thống`, icon: Users, href: '/admin/users', color: '#d97706', bg: '#fef3c7' },
          ].map((item) => (
            <Link key={item.label} href={item.href}
              className="flex items-center gap-3 p-3 rounded-xl border border-[#e2e8f0] hover:border-[#059669]/30 hover:shadow-sm transition-all group">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: item.bg }}>
                <item.icon size={17} style={{ color: item.color }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-[#0f172a] group-hover:text-[#059669] transition-colors">{item.label}</p>
                <p className="text-[10px] text-[#94a3b8] truncate">{item.desc}</p>
              </div>
              <ChevronRight size={14} className="text-[#cbd5e1] group-hover:text-[#059669] transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-[#f1f5f9]">
          <div className="bg-gradient-to-br from-[#f0fdf9] to-[#e0f2fe] p-4 rounded-xl">
            <h4 className="text-[#059669] text-[12px] font-bold mb-3">Tổng quan hệ thống</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-[11px]">
                <span className="text-[#64748b]">Người dùng</span>
                <span className="font-bold text-[#0f172a]">{stats?.totalUsers || 0}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#64748b]">Câu hỏi</span>
                <span className="font-bold text-[#0f172a]">{stats?.totalQuestions || 0}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-[#64748b]">Lượt thi hôm nay</span>
                <span className="font-bold text-[#0f172a]">{stats?.examsToday || 0}</span>
              </div>
            </div>
            <Link href="/" target="_blank" className="mt-3 block text-center text-[10px] font-bold text-white bg-[#0f172a] px-3 py-1.5 rounded-lg hover:bg-[#1e293b] transition-colors">
              Xem trang học sinh →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
