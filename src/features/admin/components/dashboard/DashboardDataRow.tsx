'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  SectionHeader,
  type RecentUser, type ContentStats, type ActivityItem, type TopicStat,
} from './DashboardWidgets';
import { TOPIC_LABEL } from '@/shared/constants/topics';
import { Topic } from '@prisma/client';

interface LoadingState {
  users: boolean;
  content: boolean;
  activity: boolean;
  topic: boolean;
}

interface DashboardDataRowProps {
  loading: LoadingState;
  recentUsers: RecentUser[];
  contentStats: ContentStats | null;
  activity: ActivityItem[];
  questionsByTopic: TopicStat[];
}

export function DashboardDataRow({ loading, recentUsers, contentStats, activity, questionsByTopic }: DashboardDataRowProps) {
  return (
    <>
      {/* Row 3: Table + Content status + Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-4 lg:gap-6">
        <div className="bg-white p-6 rounded-[12px]" style={{ border: '0.5px solid #e2e8f0' }}>
          <SectionHeader
            title="Người dùng mới nhất"
            actions={<Link href="/admin/users" className="text-[#059669] text-[11px] font-bold flex items-center gap-1 hover:underline">Tất cả <ChevronRight size={12} /></Link>}
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
                ) : recentUsers.length === 0 ? (
                  <tr><td colSpan={4} className="py-8 text-center text-[#94a3b8] text-[12px]">Chưa có người dùng nào</td></tr>
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
                {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-slate-100 rounded"></div>)}
              </div>
            ) : [
              { label: 'Lý thuyết', count: contentStats?.theory, color: '#059669' },
              { label: 'Câu hỏi ôn luyện', count: contentStats?.practice, color: '#f59e0b' },
              { label: 'Đề thi THPT', count: contentStats?.thptExams, color: '#7c3aed' },
              { label: 'Knowledge chunks', count: contentStats?.knowledgeChunks, color: '#0891b2' },
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
                  <div className="h-full bg-[#059669]/60" style={{ width: `${Math.min((qt._count / 200) * 100, 100)}%` }}></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
