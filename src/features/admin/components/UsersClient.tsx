'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-hot-toast';
import AdminSidebar from '@/shared/components/AdminSidebar';
import { Users, Search, RefreshCw, Shield, GraduationCap } from 'lucide-react';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { UsersTable, type UserRecord } from './users/UsersTable';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface UsersResponse {
  users: UserRecord[];
  total: number;
  totalPages: number;
}

interface Props {
  user: { id?: string; name?: string | null; email?: string | null; role?: string };
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LIMIT = 10;

const ROLE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'STUDENT', label: 'Học sinh' },
  { value: 'TEACHER', label: 'Giáo viên' },
  { value: 'ADMIN', label: 'Quản trị' },
] as const;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'name', label: 'Tên A-Z' },
] as const;

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
  const [selectedNewRole, setSelectedNewRole] = useState('');

  const handleRoleChange = async () => {
    if (!modal || modal.type !== 'role' || !selectedNewRole) return;
    setModalLoading(true);
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: modal.user.id, role: selectedNewRole }),
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

          <UsersTable
            users={users} loading={loading} userId={user.id} setModal={setModal}
            total={total} totalPages={totalPages} page={page}
            startItem={startItem} endItem={endItem} pageNumbers={pageNumbers} setPage={setPage}
          />
        </div>
      </main>

      {/* Modals */}
      {modal?.type === 'role' && (
        <ConfirmModal open title="Thay đổi vai trò"
          message={`Chọn vai trò mới cho "${modal.user.name || modal.user.email}" (hiện tại: ${modal.user.role === 'ADMIN' ? 'Quản trị' : modal.user.role === 'TEACHER' ? 'Giáo viên' : 'Học sinh'})`}
          confirmLabel="Cập nhật"
          loading={modalLoading} onConfirm={handleRoleChange} onCancel={() => { if (!modalLoading) { setModal(null); setSelectedNewRole(''); } }}>
          <select
            value={selectedNewRole}
            onChange={e => setSelectedNewRole(e.target.value)}
            className="w-full px-3 py-2 text-[13px] border border-[#e2e8f0] rounded-lg outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
          >
            <option value="">-- Chọn vai trò --</option>
            <option value="STUDENT">Học sinh</option>
            <option value="TEACHER">Giáo viên</option>
            <option value="ADMIN">Quản trị</option>
          </select>
        </ConfirmModal>
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
