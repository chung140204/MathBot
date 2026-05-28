'use client';

import { Users, ChevronLeft, ChevronRight, Shield, GraduationCap, FileText, MessageSquare, UserCog, Lock, Unlock, Trash2 } from 'lucide-react';

export interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  isLocked: boolean;
  createdAt: string;
  grade: number | null;
  _count: { examAttempts: number; chatSessions: number };
}

const AVATAR_COLORS = ['#059669', '#0284c7', '#7c3aed', '#db2777', '#ea580c', '#ca8a04', '#0d9488', '#4f46e5'];
function avatarColor(name: string | null) {
  if (!name) return AVATAR_COLORS[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-gray-200" /><div className="space-y-1.5"><div className="h-3.5 w-28 bg-gray-200 rounded" /><div className="h-3 w-40 bg-gray-100 rounded" /></div></div></td>
      <td className="px-4 py-3"><div className="h-5 w-16 bg-gray-200 rounded-full" /></td>
      <td className="px-4 py-3"><div className="h-3.5 w-20 bg-gray-200 rounded" /></td>
      <td className="px-4 py-3"><div className="h-3.5 w-8 bg-gray-200 rounded mx-auto" /></td>
      <td className="px-4 py-3"><div className="h-3.5 w-8 bg-gray-200 rounded mx-auto" /></td>
      <td className="px-4 py-3"><div className="h-7 w-20 bg-gray-200 rounded ml-auto" /></td>
    </tr>
  );
}

interface UsersTableProps {
  users: UserRecord[];
  loading: boolean;
  userId: string | undefined;
  setModal: (m: { type: 'role' | 'delete' | 'lock'; user: UserRecord } | null) => void;
  total: number;
  totalPages: number;
  page: number;
  startItem: number;
  endItem: number;
  pageNumbers: (number | 'dots')[];
  setPage: (p: number | ((prev: number) => number)) => void;
}

export function UsersTable({ users, loading, userId, setModal, total, totalPages, page, startItem, endItem, pageNumbers, setPage }: UsersTableProps) {
  return (
    <div className="bg-white rounded-[12px] overflow-hidden overflow-x-auto" style={{ border: '0.5px solid #e2e8f0' }}>
      <table className="w-full min-w-[700px]">
        <thead>
          <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
            <th className="text-left px-4 py-3 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Người dùng</th>
            <th className="text-left px-4 py-3 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Vai trò</th>
            <th className="text-left px-4 py-3 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Ngày tham gia</th>
            <th className="text-center px-4 py-3 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Trạng thái</th>
            <th className="text-center px-4 py-3 text-[11px] font-bold text-[#64748b] uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><FileText size={12} />Lượt thi</div></th>
            <th className="text-center px-4 py-3 text-[11px] font-bold text-[#64748b] uppercase tracking-wider"><div className="flex items-center justify-center gap-1"><MessageSquare size={12} />Chat</div></th>
            <th className="text-right px-4 py-3 text-[11px] font-bold text-[#64748b] uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : users.length === 0 ? (
            <tr><td colSpan={7} className="text-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center"><Users size={24} className="text-[#94a3b8]" /></div>
                <p className="text-[14px] font-semibold text-[#374151]">Không tìm thấy người dùng</p>
                <p className="text-[12px] text-[#94a3b8]">Thử thay đổi từ khóa hoặc bộ lọc</p>
              </div>
            </td></tr>
          ) : users.map(u => {
            const isSelf = u.id === userId;
            return (
              <tr key={u.id} className="border-b border-[#f1f5f9] last:border-b-0 hover:bg-[#f8fafc] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0" style={{ backgroundColor: avatarColor(u.name) }}>
                      {u.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-[#0f172a] truncate">
                        {u.name || 'Chưa đặt tên'}
                        {isSelf && <span className="ml-1.5 text-[10px] font-semibold text-[#059669] bg-[#ecfdf5] px-1.5 py-0.5 rounded">Bạn</span>}
                      </p>
                      <p className="text-[12px] text-[#94a3b8] truncate">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {u.role === 'ADMIN' ? <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#f3e8ff] text-[#7c3aed]"><Shield size={10} />Quản trị</span>
                    : u.role === 'TEACHER' ? <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#fef3c7] text-[#d97706]"><UserCog size={10} />Giáo viên</span>
                    : <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#eff6ff] text-[#0284c7]"><GraduationCap size={10} />Học sinh</span>}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#64748b]">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-center">
                  {u.isLocked
                    ? <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#fef2f2] text-[#dc2626]"><Lock size={10} />Đã khóa</span>
                    : <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#ecfdf5] text-[#059669]"><Unlock size={10} />Hoạt động</span>}
                </td>
                <td className="px-4 py-3 text-center text-[13px] font-semibold text-[#374151]">{u._count.examAttempts}</td>
                <td className="px-4 py-3 text-center text-[13px] font-semibold text-[#374151]">{u._count.chatSessions}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    {!isSelf && (
                      <>
                        <button onClick={() => setModal({ type: 'role', user: u })} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-[#374151] bg-[#f1f5f9] rounded-lg hover:bg-[#e2e8f0] transition-colors"><UserCog size={12} />Đổi vai trò</button>
                        <button onClick={() => setModal({ type: 'lock', user: u })} className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${u.isLocked ? 'text-[#059669] bg-[#ecfdf5] hover:bg-[#d1fae5]' : 'text-[#d97706] bg-[#fffbeb] hover:bg-[#fef3c7]'}`}>
                          {u.isLocked ? <><Unlock size={12} />Mở khóa</> : <><Lock size={12} />Khóa</>}
                        </button>
                        <button onClick={() => setModal({ type: 'delete', user: u })} className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-[#dc2626] bg-[#fef2f2] rounded-lg hover:bg-[#fee2e2] transition-colors"><Trash2 size={12} />Xóa</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {!loading && totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
          <p className="text-[12px] text-[#64748b]">Hiển thị <span className="font-semibold text-[#374151]">{total > 0 ? startItem : 0}-{endItem}</span> trong <span className="font-semibold text-[#374151]">{total}</span></p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-10 h-10 rounded-lg border border-[#e2e8f0] flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronLeft size={16} className="text-[#64748b]" />
            </button>
            {pageNumbers.map((item, i) =>
              item === 'dots'
                ? <span key={`d${i}`} className="w-10 h-10 flex items-center justify-center text-[12px] text-[#94a3b8]">...</span>
                : <button key={item} onClick={() => setPage(item as number)} className={`w-10 h-10 rounded-lg text-[12px] font-semibold flex items-center justify-center transition-colors ${page === item ? 'bg-[#059669] text-white' : 'border border-[#e2e8f0] text-[#374151] hover:bg-white'}`}>{item}</button>
            )}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-10 h-10 rounded-lg border border-[#e2e8f0] flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <ChevronRight size={16} className="text-[#64748b]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
