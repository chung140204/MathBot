'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { MAIN_MENU, SETTINGS_MENU, NavLink, TopicMenu } from '@/features/layout/components/SidebarNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [realStats, setRealStats] = useState<Record<string, number> | null>(null);
  const [isTopicsOpen, setIsTopicsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchStudyProgress = useCallback(() => {
    fetch('/api/v1/study/progress')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const statsMap: Record<string, number> = {};
          data.forEach((p: any) => { statsMap[p.topic] = p.percent; });
          setRealStats(statsMap);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Fetch eagerly on /study, defer on other pages to avoid blocking render
    let cleanupIdle: (() => void) | undefined;
    if (pathname.startsWith('/study')) {
      fetchStudyProgress();
    } else {
      if (typeof requestIdleCallback !== 'undefined') {
        const id = requestIdleCallback(() => fetchStudyProgress());
        cleanupIdle = () => cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(() => fetchStudyProgress(), 2000);
        cleanupIdle = () => clearTimeout(id);
      }
    }

    const handler = () => fetchStudyProgress();
    window.addEventListener('study-progress-updated', handler);
    return () => {
      cleanupIdle?.();
      window.removeEventListener('study-progress-updated', handler);
    };
  }, [pathname, fetchStudyProgress]);

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0fdf9]">
        <div className="w-8 h-8 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user as { name?: string | null; id?: string; email?: string | null; role?: string };
  const initials = user.name
    ? user.name.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase()
    : 'U';

  const menuItems = [...MAIN_MENU];

  // Add "Lớp học" for students
  menuItems.push({
    href: '/classrooms',
    label: 'Lớp học',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  });

  if (user.role === 'TEACHER' || user.role === 'ADMIN') {
    menuItems.unshift({
      href: '/teacher',
      label: 'Quản lý giảng dạy',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
    });
  }

  if (user.role === 'ADMIN') {
    menuItems.unshift({
      href: '/admin',
      label: 'Quản trị hệ thống',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 15v2m-6 4h12l-4-4H8l-4 4zM7 10h10M7 7h10M7 13h10" />
        </svg>
      ),
    });
  }

  return (
    <div className="flex h-screen bg-[#f0fdf9] font-sans overflow-hidden">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={`
        ${isCollapsed ? 'md:w-[72px]' : 'md:w-[280px]'}
        fixed inset-y-0 left-0 z-50 w-[280px]
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0
        flex-shrink-0 bg-white border-r border-gray-100 flex flex-col shadow-sm
      `}>
        <div className={`${isCollapsed ? 'px-2 py-3' : 'px-4 py-4'} border-b border-gray-100 flex items-center justify-between`}>
          <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
            <div className={`relative ${isCollapsed ? 'w-10 h-10' : 'w-16 h-16'} flex-shrink-0 drop-shadow-md transition-all duration-300`}>
              <Image
                src="/logo.png"
                alt="MathBot Logo"
                fill
                sizes={isCollapsed ? '40px' : '64px'}
                className="object-contain mix-blend-multiply"
                priority
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-[20px] font-black leading-none tracking-tight bg-gradient-to-r from-[#059669] to-[#0ea5e9] bg-clip-text text-transparent">
                  MathBot
                </p>
                <p className="text-[11px] font-semibold leading-tight bg-gradient-to-r from-[#059669] to-[#0ea5e9] bg-clip-text text-transparent">
                  Toán không khó — chỉ cần đúng cách
                </p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            aria-label={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            className="hidden md:flex flex-shrink-0 w-7 h-7 rounded-lg bg-gray-50 hover:bg-[#f0fdf9] hover:text-[#059669] text-gray-400 items-center justify-center transition-colors"
          >
            <svg className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 no-scrollbar">
          <div className="mb-4">
            {!isCollapsed && <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 mb-1.5">MENU</p>}
            <ul className="space-y-0.5">
              {menuItems.map((link) => (
                <li key={link.href}>
                  {link.href === '/study' && pathname.startsWith('/study') && !isCollapsed ? (
                    <button
                      onClick={() => setIsTopicsOpen(!isTopicsOpen)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all group bg-gradient-to-r from-[#d1fae5] to-[#e0f2fe] text-[#059669]"
                    >
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {link.icon}
                      </div>
                      {link.label}
                      <svg className={`w-4 h-4 ml-auto transition-transform duration-200 ${isTopicsOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  ) : (
                    <NavLink href={link.href} label={link.label} icon={link.icon} collapsed={isCollapsed} />
                  )}

                  {link.href === '/study' && !isCollapsed && (
                    <React.Suspense fallback={null}>
                      <TopicMenu realStats={realStats} isVisible={isTopicsOpen} />
                    </React.Suspense>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            {!isCollapsed && <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-2 mb-1.5">ACCOUNT</p>}
            <ul className="space-y-0.5">
              {SETTINGS_MENU.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href} label={link.label} icon={link.icon} collapsed={isCollapsed} />
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <div className="flex-shrink-0 border-t border-gray-100 relative" ref={userMenuRef}>

          <div className="p-3">
            {isUserMenuOpen && (
              <div className="absolute bottom-full mb-2 left-4 right-4 bg-white border border-[#d1fae5] rounded-2xl shadow-[0_10px_40px_-10px_rgba(5,150,105,0.15)] p-2 z-50">
                <div className="p-3 border-b border-gray-50 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#059669] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{initials}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name ?? 'Học sinh'}</p>
                      <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
                
                <Link onClick={() => setIsUserMenuOpen(false)} href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-[#f0fdf9] hover:text-[#059669] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  Xem hồ sơ
                </Link>
                <Link onClick={() => setIsUserMenuOpen(false)} href="/progress" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-[#f0fdf9] hover:text-[#059669] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Tiến trình
                </Link>
                <Link onClick={() => setIsUserMenuOpen(false)} href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-700 hover:bg-[#f0fdf9] hover:text-[#059669] transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Cài đặt
                </Link>

                <div className="h-px bg-gray-50 my-1"></div>

                <button
                  onClick={() => { setIsUserMenuOpen(false); signOut({ callbackUrl: '/' }); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Đăng xuất
                </button>
              </div>
            )}

            <div
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all cursor-pointer select-none group ${isCollapsed ? 'justify-center' : ''} ${isUserMenuOpen ? 'bg-[#f0fdf9] ring-1 ring-[#059669]/20' : 'hover:bg-gray-50'}`}
            >
              <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center text-white font-bold text-[12px] flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">{initials}</div>
              {!isCollapsed && (
                <div className="min-w-0 flex-1">
                  <p className={`text-[13px] font-semibold truncate transition-colors ${isUserMenuOpen ? 'text-[#059669]' : 'text-gray-900'}`}>{user.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Mobile header bar */}
        <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="w-9 h-9 rounded-lg bg-gray-50 hover:bg-[#f0fdf9] text-gray-500 flex items-center justify-center"
            aria-label="Mở menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <p className="text-sm font-bold bg-gradient-to-r from-[#059669] to-[#0ea5e9] bg-clip-text text-transparent">MathBot</p>
        </div>
        <div key={pathname} className="animate-page-in flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
