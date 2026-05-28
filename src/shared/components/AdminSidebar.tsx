'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Settings,
  LogOut,
  PlusCircle
} from 'lucide-react';

const navGroups = [
  {
    label: 'QUẢN TRỊ',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Người dùng', href: '/admin/users', icon: Users },
      { name: 'Upload nội dung', href: '/admin/upload', icon: PlusCircle },
    ]
  },
  {
    label: 'HỆ THỐNG',
    items: [
      { name: 'Cài đặt', href: '/admin/settings', icon: Settings },
    ]
  }
];

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 rounded-lg bg-[#0f172a] text-white flex items-center justify-center shadow-lg"
        aria-label="Mở menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

    <aside className={`
      fixed inset-y-0 left-0 z-50 w-[230px] transform transition-transform duration-300
      ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0
      h-screen bg-[#0f172a] flex flex-col flex-shrink-0 border-r border-white/5
    `}>
      {/* Header: logo + slogan */}
      <div className="p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#059669] to-[#0891b2] flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(5,150,105,0.3)]">
            M
          </div>
          <div>
            <h1 className="text-white font-bold text-[15px] tracking-tight leading-none">MathBot</h1>
            <p className="text-[#34d399] text-[9px] font-bold mt-1 tracking-widest uppercase opacity-80">Admin Panel</p>
          </div>
        </div>
        
        <div className="px-1 py-2 bg-white/5 rounded-lg border border-white/5">
          <p className="text-[10px] text-white/50 text-center font-medium italic">"Hỗ trợ học Toán hiệu quả"</p>
        </div>
      </div>

      {/* Nav: Scrollable */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-7 custom-scrollbar">
        {navGroups.map((group) => (
          <div key={group.label}>
            <h3 className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em] mb-3 px-3">
              {group.label}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group
                      ${isActive 
                        ? 'bg-gradient-to-br from-[#059669]/20 to-[#0891b2]/15 text-[#34d399] border-l-[3px] border-[#059669]' 
                        : 'text-white/50 hover:bg-white/5 hover:text-[#e2e8f0] border-l-[3px] border-transparent'}
                    `}
                  >
                    <item.icon size={16} className={isActive ? 'text-[#34d399]' : 'text-white/30 group-hover:text-white/60'} />
                    <span className="text-[12px] font-semibold">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer: User Profile */}
      <div className="p-4 border-t border-white/5 bg-[#0f172a]/80 backdrop-blur-md">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
          {user?.image ? (
            <img src={user.image} alt="" className="w-8 h-8 rounded-lg object-cover border border-white/10" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#334155] to-[#1e293b] flex items-center justify-center text-white text-[11px] font-bold border border-white/10 shadow-inner">
              {user?.name?.[0] || 'A'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-[11px] font-bold truncate leading-none mb-1">{user?.name || 'Admin'}</p>
            <p className="text-white/30 text-[9px] truncate tracking-tight">{user?.email || 'admin@mathbot.vn'}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            title="Đăng xuất"
            className="text-white/20 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
    </>
  );
}
