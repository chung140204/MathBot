'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';

interface Session {
  id: string;
  title: string;
  updatedAt: string;
}

interface SessionGroup {
  label: string;
  sessions: Session[];
}

interface ChatSidebarProps {
  userId?: string;
  activeSessionId: string | null;
  refreshKey: number;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}

export default function ChatSidebar({
  userId,
  activeSessionId,
  refreshKey,
  onSelectSession,
  onNewSession,
}: ChatSidebarProps) {
  const { data: session } = useSession();
  const user = session?.user as { name?: string | null };
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(-2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'U';

  const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSessions = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/v1/chat/sessions?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch sessions');
      const data: Session[] = await res.json();
      
      const today: Session[] = [];
      const yesterday: Session[] = [];
      const lastWeek: Session[] = [];
      const older: Session[] = [];

      data.forEach((s) => {
        const date = parseISO(s.updatedAt);
        if (isToday(date)) {
          today.push(s);
        } else if (isYesterday(date)) {
          yesterday.push(s);
        } else if (isThisWeek(date)) {
          lastWeek.push(s);
        } else {
          older.push(s);
        }
      });

      const groups: SessionGroup[] = [];
      if (today.length > 0) groups.push({ label: 'HÔM NAY', sessions: today });
      if (yesterday.length > 0) groups.push({ label: 'HÔM QUA', sessions: yesterday });
      if (lastWeek.length > 0) groups.push({ label: '7 NGÀY TRƯỚC', sessions: lastWeek });
      if (older.length > 0) groups.push({ label: 'CŨ HƠN', sessions: older });

      setSessionGroups(groups);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [userId, refreshKey]);

  const handleDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    if (!confirm('Bạn có chắc chắn muốn xóa cuộc hội thoại này?')) return;
    
    try {
      const res = await fetch(`/api/v1/chat/sessions?sessionId=${sessionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (activeSessionId === sessionId) {
          onNewSession();
        }
        fetchSessions();
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
  };

  return (
    <div className="w-[300px] h-full bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center text-white font-black text-lg">
            M
          </div>
          <span className="text-xl font-bold tracking-tight text-[#059669]">MathBot</span>
        </div>
        <button 
          onClick={onNewSession}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
        >
          <span>+</span>
          <span>Mới</span>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {isLoading && sessionGroups.length === 0 ? (
          <div className="text-center text-sm text-gray-400 mt-10">Đang tải...</div>
        ) : sessionGroups.length === 0 ? (
          <div className="text-center text-sm text-gray-400 mt-10">Chưa có cuộc hội thoại nào</div>
        ) : (
          sessionGroups.map((group) => (
            <div key={group.label}>
              <h3 className="text-[10px] font-black text-gray-400 tracking-widest px-3 mb-2">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.sessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => onSelectSession(s.id)}
                    className={`w-full text-left px-3 py-3 rounded-xl transition-all group relative cursor-pointer ${
                      activeSessionId === s.id
                        ? 'bg-[#e6f6f1] text-[#059669]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className={`text-sm font-bold pr-6 truncate ${activeSessionId === s.id ? 'text-[#059669]' : 'text-gray-700'}`}>
                      {s.title}
                    </p>
                    <button
                      onClick={(e) => handleDelete(e, s.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-colors"
                      title="Xóa"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* User Card */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#059669] to-[#0891b2] flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-[#059669] font-bold flex items-center gap-1">
              Online
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
