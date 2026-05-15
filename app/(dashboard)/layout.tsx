'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

// ─── Constants & Config ──────────────────────────────────────────────────────

import { TOPIC_CONFIG, TOPIC_SUBSECTIONS } from '@/lib/constants/topics';
import { Topic } from '@prisma/client';

const COLOR_MAP = {
  green: { dot: 'bg-[#059669]', pillBg: 'bg-[#d1fae5]', pillText: 'text-[#059669]', activeBg: 'bg-[#e6f7f2]', activeText: 'text-[#059669]' },
  blue: { dot: 'bg-sky-500', pillBg: 'bg-sky-100', pillText: 'text-sky-700', activeBg: 'bg-sky-50', activeText: 'text-sky-700' },
  orange: { dot: 'bg-amber-500', pillBg: 'bg-amber-100', pillText: 'text-amber-700', activeBg: 'bg-amber-50', activeText: 'text-amber-700' },
  red: { dot: 'bg-red-500', pillBg: 'bg-red-100', pillText: 'text-red-700', activeBg: 'bg-red-50', activeText: 'text-red-700' },
  purple: { dot: 'bg-purple-500', pillBg: 'bg-purple-100', pillText: 'text-purple-700', activeBg: 'bg-purple-50', activeText: 'text-purple-700' },
};


const MAIN_MENU = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" />
      </svg>
    ),
  },
  {
    href: '/practice',
    label: 'Luyện tập',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/study',
    label: 'Ôn tập kiến thức',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    href: '/bookmarks',
    label: 'Bài đã lưu',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    href: '/chat',
    label: 'AI Chat',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    href: '/progress',
    label: 'Tiến trình',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

const SETTINGS_MENU = [
  {
    href: '/settings',
    label: 'Cài đặt',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];



function NavLink({ href, label, icon, collapsed }: { href: string; label: string; icon: React.ReactNode; collapsed?: boolean }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all group ${
        active
          ? 'bg-gradient-to-r from-[#d1fae5] to-[#e0f2fe] text-[#059669]'
          : 'text-gray-500 hover:bg-[#f0fdf9] hover:text-[#059669]'
      } ${collapsed ? 'justify-center' : ''}`}
    >
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {icon}
      </div>
      {!collapsed && label}
    </Link>
  );
}

function TopicMenu({ realStats, isVisible }: { realStats: Record<string, number> | null; isVisible: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTopic = searchParams.get('topic') || TOPIC_CONFIG[0].key;
  const activeSubIndex = parseInt(searchParams.get('sub') || '0', 10);
  
  const [openTopic, setOpenTopic] = useState<string | null>(activeTopic);

  useEffect(() => {
    if (pathname.startsWith('/study')) {
      setOpenTopic(activeTopic);
    }
  }, [pathname, activeTopic]);

  if (!pathname.startsWith('/study') || !isVisible) return null;

  return (
    <div className="mt-2 pl-3 pb-2 pt-1 border-l-2 border-slate-100 ml-5 relative before:content-[''] before:absolute before:-top-4 before:bottom-0 before:-left-0.5 before:w-[2px] before:bg-slate-100/50">
      <ul className="space-y-0.5">
        {TOPIC_CONFIG.map((topic) => {
          const colors = COLOR_MAP[topic.color as keyof typeof COLOR_MAP];
          const acc = realStats ? (realStats[topic.key] ?? 0) : 0;
          const isExpanded = openTopic === topic.key;
          const subs = TOPIC_SUBSECTIONS[topic.key as Topic] || [];

          return (
            <li key={topic.key} className="relative z-10 flex flex-col">
              <button
                onClick={() => {
                  setOpenTopic(isExpanded ? null : topic.key);
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group
                  ${isExpanded ? colors.activeBg : 'hover:bg-slate-50'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-transform ${colors.dot} ${isExpanded ? 'scale-125' : ''}`} />
                  <span className={`text-[13px] transition-colors
                    ${isExpanded ? `${colors.activeText} font-bold` : 'text-slate-600 font-semibold group-hover:text-slate-900'}
                  `}>
                    {topic.label}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold ${colors.pillBg} ${colors.pillText} ml-2 whitespace-nowrap
                  ${isExpanded ? 'opacity-100' : 'opacity-90 group-hover:opacity-100 transition-opacity'}
                `}>
                  {acc}%
                </span>
              </button>

              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out pl-6 ${isExpanded ? 'mt-0.5 mb-1.5' : ''}`}
                style={{ maxHeight: isExpanded ? `${subs.length * 36}px` : '0px' }}
              >
                <div className="flex flex-col border-l border-slate-100 pl-2 space-y-0.5 py-0.5">
                  {subs.map((sub: string, idx: number) => {
                    const isSubActive = activeTopic === topic.key && activeSubIndex === idx;
                    return (
                      <Link
                        key={idx}
                        href={`/study?topic=${topic.key}&sub=${idx}`}
                        className={`text-left px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors block
                          ${isSubActive 
                            ? 'bg-slate-100 text-slate-800' 
                            : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}
                        `}
                      >
                        {sub}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [realStats, setRealStats] = useState<Record<string, number> | null>(null);
  const [isTopicsOpen, setIsTopicsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchStudyProgress = () => {
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
  };

  useEffect(() => {
    fetchStudyProgress();

    // Re-fetch when study page marks content as read
    const handler = () => fetchStudyProgress();
    window.addEventListener('study-progress-updated', handler);
    return () => window.removeEventListener('study-progress-updated', handler);
  }, []);

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
      <aside className={`${isCollapsed ? 'w-[72px]' : 'w-[280px]'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col shadow-sm transition-all duration-300 ease-in-out`}>
        <div className={`${isCollapsed ? 'px-2 py-3' : 'px-4 py-4'} border-b border-gray-100 flex items-center justify-between`}>
          <div className="flex items-center gap-3 min-w-0">
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
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
            className="flex-shrink-0 w-7 h-7 rounded-lg bg-gray-50 hover:bg-[#f0fdf9] hover:text-[#059669] text-gray-400 flex items-center justify-center transition-colors"
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

      <main className="flex-1 overflow-y-auto flex flex-col">{children}</main>
    </div>
  );
}
