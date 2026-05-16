'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Users,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  GraduationCap,
  Trash2,
  UserCog,
  MessageSquare,
  FileText,
  AlertTriangle,
  X,
  Loader2,
  Lock,
  Unlock,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UserRecord {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'STUDENT';
  isLocked: boolean;
  createdAt: string;
  grade: number | null;
  _count: { examAttempts: number; chatSessions: number };
}

interface UsersResponse {
  users: UserRecord[];
  total: number;
  totalPages: number;
}

interface Props {
  user: { id?: string; name?: string | null; email?: string | null; role?: string };
}

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

const LIMIT = 10;

const ROLE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'STUDENT', label: 'Học sinh' },
  { value: 'ADMIN', label: 'Quản trị' },
] as const;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'name', label: 'Tên A-Z' },
] as const;

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

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Confirm modal
// ---------------------------------------------------------------------------

function ConfirmModal({ open, title, message, confirmLabel, danger, loading, onConfirm, onCancel }: {
  open: boolean; title: string; message: string; confirmLabel: string;
  danger?: boolean; loading?: boolean; onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  const color = danger ? '#dc2626' : '#059669';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={!loading ? onCancel : undefined} />
      <div className="relative bg-white rounded-[12px] shadow-xl max-w-[420px] w-full mx-4 p-6">
        <button onClick={onCancel} disabled={loading} className="absolute top-4 right-4 text-[#94a3b8] hover:text-[#374151] transition-colors">
          <X size={18} />
        </button>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: danger ? '#fef2f2' : '#f0fdf4' }}>
            <AlertTriangle size={20} style={{ color }} />
          </div>
          <div>
            <h3 className="text-[14px] font-bold text-[#0f172a] mb-1">{title}</h3>
            <p className="text-[13px] text-[#374151] leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 text-[13px] font-semibold text-[#374151] bg-[#f1f5f9] rounded-lg hover:bg-[#e2e8f0] transition-colors">
            Hủy
          </button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 text-[13px] font-semibold text-white rounded-lg transition-colors flex items-center gap-2" style={{ backgroundColor: color, opacity: loading ? 0.7 : 1 }}>
            {loading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function UsersClient({ user }: Props) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modal, setModal] = useState<{ type: 'role' | 'delete' | 'lock'; user: UserRecord } | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounce search
  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 300);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [search]);

  // Fetch
  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(LIMIT), sort });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (roleFilter) params.set('role', roleFilter);

      const res = await fetch(`/api/v1/admin/users?${params}`);
      if (!res.ok) throw new Error('Failed');
      const data: UsersResponse = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [page, debouncedSearch, roleFilter, sort]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Stats from current page (approximate — total comes from API)
  const studentCount = users.filter(u => u.role === 'STUDENT').length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;

  // Actions
  const handleRoleChange = async () => {
    if (!modal || modal.type !== 'role') return;
    setModalLoading(true);
    try {
      const newRole = modal.user.role === 'ADMIN' ? 'STUDENT' : 'ADMIN';
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: modal.user.id, role: newRole }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Lỗi cập nhật');
        return;
      }
      setModal(null);
      fetchUsers();
    } catch { toast.error('Lỗi kết nối'); } finally { setModalLoading(false); }
  };

  const handleDelete = async () => {
    if (!modal || modal.type !== 'delete') return;
    setModalLoading(true);
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: modal.user.id }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Lỗi xóa');
        return;
      }
      setModal(null);
      fetchUsers();
    } catch { toast.error('Lỗi kết nối'); } finally { setModalLoading(false); }
  };

  const handleToggleLock = async () => {
    if (!modal || modal.type !== 'lock') return;
    setModalLoading(true);
    try {
      const action = modal.user.isLocked ? 'unlock' : 'lock';
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: modal.user.id, action }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || 'Lỗi cập nhật');
        return;
      }
      setModal(null);
      fetchUsers();
    } catch { toast.error('Lỗi kết nối'); } finally { setModalLoading(false); }
  };

  const startItem = (page - 1) * LIMIT + 1;
  const endItem = Math.min(page * LIMIT, total);

  // Page numbers with ellipsis
  const pageNumbers = (() => {
    const items: (number | 'dots')[] = [];
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
        if (items.length > 0) {
          const last = items[items.length - 1];
          if (typeof last === 'number' && p - last > 1) items.push('dots');
        }
        items.push(p);
      }
    }
    return items;
  })();

  return (
    <>
      <AdminSidebar user={user} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 border-b border-[#e2e8f0] bg-white flex-shrink-0" style={{ height: 60 }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#ecfdf5] flex items-center justify-center">
              <Users size={16} className="text-[#059669]" />
            </div>
            <h1 className="text-[15px] font-bold text-[#0f172a]">Quản lý người dùng</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-semibold text-[#059669] bg-[#ecfdf5] px-3 py-1 rounded-full">
              Tổng: {total}
            </span>
            <button onClick={() => fetchUsers(true)} disabled={refreshing} className="w-8 h-8 rounded-lg border border-[#e2e8f0] flex items-center justify-center hover:bg-[#f1f5f9] transition-colors">
              <RefreshCw size={14} className={`text-[#64748b] ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px] max-w-[360px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tên hoặc email..."
                className="w-full h-9 pl-9 pr-3 text-[13px] text-[#374151] bg-white border border-[#e2e8f0] rounded-lg outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 transition-all placeholder:text-[#94a3b8]" />
            </div>
            <div className="flex items-center gap-1.5">
              {ROLE_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => { setRoleFilter(opt.value); setPage(1); }}
                  className={`px-3 py-1.5 text-[12px] font-semibold rounded-lg border transition-all ${roleFilter === opt.value ? 'bg-[#059669] text-white border-[#059669]' : 'bg-white text-[#64748b] border-[#e2e8f0] hover:border-[#059669] hover:text-[#059669]'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
              className="h-9 px-3 text-[12px] font-semibold text-[#374151] bg-white border border-[#e2e8f0] rounded-lg outline-none focus:border-[#059669] transition-colors cursor-pointer">
              {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-[12px] p-4 flex items-center gap-3" style={{ border: '0.5px solid #e2e8f0' }}>
              <div className="w-10 h-10 rounded-lg bg-[#ecfdf5] flex items-center justify-center"><Users size={18} className="text-[#059669]" /></div>
              <div><p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide">Tổng người dùng</p><p className="text-[20px] font-bold text-[#0f172a] leading-tight">{total}</p></div>
            </div>
            <div className="bg-white rounded-[12px] p-4 flex items-center gap-3" style={{ border: '0.5px solid #e2e8f0' }}>
              <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center"><GraduationCap size={18} className="text-[#0284c7]" /></div>
              <div><p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide">Học sinh</p><p className="text-[20px] font-bold text-[#0f172a] leading-tight">{studentCount}</p></div>
            </div>
            <div className="bg-white rounded-[12px] p-4 flex items-center gap-3" style={{ border: '0.5px solid #e2e8f0' }}>
              <div className="w-10 h-10 rounded-lg bg-[#faf5ff] flex items-center justify-center"><Shield size={18} className="text-[#7c3aed]" /></div>
              <div><p className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wide">Quản trị viên</p><p className="text-[20px] font-bold text-[#0f172a] leading-tight">{adminCount}</p></div>
            </div>
          </div>

          {/* Table */}
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
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-14 h-14 rounded-full bg-[#f1f5f9] flex items-center justify-center"><Users size={24} className="text-[#94a3b8]" /></div>
                        <p className="text-[14px] font-semibold text-[#374151]">Không tìm thấy người dùng</p>
                        <p className="text-[12px] text-[#94a3b8]">Thử thay đổi từ khóa hoặc bộ lọc</p>
                      </div>
                    </td>
                  </tr>
                ) : users.map(u => {
                  const isSelf = u.id === user.id;
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
                        {u.role === 'ADMIN' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#f3e8ff] text-[#7c3aed]"><Shield size={10} />Quản trị</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#eff6ff] text-[#0284c7]"><GraduationCap size={10} />Học sinh</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[12px] text-[#64748b]">{formatDate(u.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        {u.isLocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#fef2f2] text-[#dc2626]"><Lock size={10} />Đã khóa</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#ecfdf5] text-[#059669]"><Unlock size={10} />Hoạt động</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-[13px] font-semibold text-[#374151]">{u._count.examAttempts}</td>
                      <td className="px-4 py-3 text-center text-[13px] font-semibold text-[#374151]">{u._count.chatSessions}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isSelf && (
                            <>
                              <button onClick={() => setModal({ type: 'role', user: u })}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-[#374151] bg-[#f1f5f9] rounded-lg hover:bg-[#e2e8f0] transition-colors">
                                <UserCog size={12} />{u.role === 'ADMIN' ? 'Hạ quyền' : 'Nâng quyền'}
                              </button>
                              <button onClick={() => setModal({ type: 'lock', user: u })}
                                className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors ${u.isLocked ? 'text-[#059669] bg-[#ecfdf5] hover:bg-[#d1fae5]' : 'text-[#d97706] bg-[#fffbeb] hover:bg-[#fef3c7]'}`}>
                                {u.isLocked ? <><Unlock size={12} />Mở khóa</> : <><Lock size={12} />Khóa</>}
                              </button>
                              <button onClick={() => setModal({ type: 'delete', user: u })}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-[#dc2626] bg-[#fef2f2] rounded-lg hover:bg-[#fee2e2] transition-colors">
                                <Trash2 size={12} />Xóa
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {!loading && totalPages > 0 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#e2e8f0] bg-[#f8fafc]">
                <p className="text-[12px] text-[#64748b]">
                  Hiển thị <span className="font-semibold text-[#374151]">{total > 0 ? startItem : 0}-{endItem}</span> trong <span className="font-semibold text-[#374151]">{total}</span>
                </p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-10 h-10 rounded-lg border border-[#e2e8f0] flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft size={16} className="text-[#64748b]" />
                  </button>
                  {pageNumbers.map((item, i) =>
                    item === 'dots' ? (
                      <span key={`d${i}`} className="w-10 h-10 flex items-center justify-center text-[12px] text-[#94a3b8]">...</span>
                    ) : (
                      <button key={item} onClick={() => setPage(item as number)}
                        className={`w-10 h-10 rounded-lg text-[12px] font-semibold flex items-center justify-center transition-colors ${page === item ? 'bg-[#059669] text-white' : 'border border-[#e2e8f0] text-[#374151] hover:bg-white'}`}>
                        {item}
                      </button>
                    )
                  )}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-10 h-10 rounded-lg border border-[#e2e8f0] flex items-center justify-center hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronRight size={16} className="text-[#64748b]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {modal?.type === 'role' && (
        <ConfirmModal open title="Thay đổi vai trò"
          message={`Bạn có chắc muốn ${modal.user.role === 'ADMIN' ? 'hạ quyền' : 'nâng quyền'} người dùng "${modal.user.name || modal.user.email}" thành ${modal.user.role === 'ADMIN' ? 'Học sinh' : 'Quản trị viên'}?`}
          confirmLabel={modal.user.role === 'ADMIN' ? 'Hạ quyền' : 'Nâng quyền'}
          loading={modalLoading} onConfirm={handleRoleChange} onCancel={() => !modalLoading && setModal(null)} />
      )}
      {modal?.type === 'lock' && (
        <ConfirmModal open danger={!modal.user.isLocked} title={modal.user.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
          message={modal.user.isLocked
            ? `Bạn có chắc muốn mở khóa tài khoản "${modal.user.name || modal.user.email}"? Người dùng sẽ có thể đăng nhập lại.`
            : `Bạn có chắc muốn khóa tài khoản "${modal.user.name || modal.user.email}"? Người dùng sẽ không thể đăng nhập cho đến khi được mở khóa.`}
          confirmLabel={modal.user.isLocked ? 'Mở khóa' : 'Khóa'}
          loading={modalLoading} onConfirm={handleToggleLock} onCancel={() => !modalLoading && setModal(null)} />
      )}
      {modal?.type === 'delete' && (
        <ConfirmModal open danger title="Xóa người dùng"
          message={`Bạn có chắc muốn xóa "${modal.user.name || modal.user.email}"?\n\nDữ liệu bị xóa vĩnh viễn:\n• Lịch sử thi và kết quả\n• Cuộc hội thoại AI\n• Tiến trình ôn tập\n• Bài đã lưu\n\nHành động này không thể hoàn tác.`}
          confirmLabel="Xóa" loading={modalLoading} onConfirm={handleDelete} onCancel={() => !modalLoading && setModal(null)} />
      )}
    </>
  );
}
