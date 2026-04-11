'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface SessionGroup {
  label: string;
  sessions: {
    id: string;
    title: string;
    lastActive: string;
    active?: boolean;
  }[];
}

const MOCK_SESSIONS: SessionGroup[] = [
  {
    label: 'HÔM NAY',
    sessions: [
      { id: '1', title: 'Đạo hàm hàm hợp', lastActive: '7 phút trước', active: true },
    ],
  },
  {
    label: 'HÔM QUA',
    sessions: [
      { id: '2', title: 'Tích phân từng phần', lastActive: 'Hôm qua · 14:32' },
      { id: '3', title: 'Bài toán xác suất', lastActive: 'Hôm qua · 09:15' },
    ],
  },
  {
    label: 'TUẦN TRƯỚC',
    sessions: [
      { id: '4', title: 'Khảo sát hàm số bậc 3', lastActive: '5 ngày trước' },
      { id: '5', title: 'Số phức và modulus', lastActive: '6 ngày trước' },
      { id: '6', title: 'Hình học không gian', lastActive: '1 tuần trước' },
    ],
  },
];

export default function ChatSidebar() {
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
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
          <span>+</span>
          <span>Mới</span>
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
        {MOCK_SESSIONS.map((group) => (
          <div key={group.label}>
            <h3 className="text-[10px] font-black text-gray-400 tracking-widest px-3 mb-2">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.sessions.map((s) => (
                <button
                  key={s.id}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-all group ${
                    s.active
                      ? 'bg-[#e6f6f1] text-[#059669]'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className={`text-sm font-bold ${s.active ? 'text-[#059669]' : 'text-gray-700'}`}>
                    {s.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{s.lastActive}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Card */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#059669] to-[#0891b2] flex items-center justify-center text-white font-bold text-sm">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">{user?.name || 'Nguyễn Thành'}</p>
            <p className="text-[11px] text-orange-500 font-bold flex items-center gap-1">
              🔥 7 ngày streak
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
