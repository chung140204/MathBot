'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TOPIC_CONFIG, TOPIC_SUBSECTIONS } from '@/shared/constants/topics';
import { Topic } from '@prisma/client';

// ---------------------------------------------------------------------------
// Color map
// ---------------------------------------------------------------------------

const COLOR_MAP: Record<string, { dot: string; pillBg: string; pillText: string; activeBg: string; activeText: string }> = {
  green: { dot: 'bg-[#059669]', pillBg: 'bg-[#d1fae5]', pillText: 'text-[#059669]', activeBg: 'bg-[#e6f7f2]', activeText: 'text-[#059669]' },
  blue: { dot: 'bg-sky-500', pillBg: 'bg-sky-100', pillText: 'text-sky-700', activeBg: 'bg-sky-50', activeText: 'text-sky-700' },
  orange: { dot: 'bg-amber-500', pillBg: 'bg-amber-100', pillText: 'text-amber-700', activeBg: 'bg-amber-50', activeText: 'text-amber-700' },
  red: { dot: 'bg-red-500', pillBg: 'bg-red-100', pillText: 'text-red-700', activeBg: 'bg-red-50', activeText: 'text-red-700' },
  purple: { dot: 'bg-purple-500', pillBg: 'bg-purple-100', pillText: 'text-purple-700', activeBg: 'bg-purple-50', activeText: 'text-purple-700' },
};

// ---------------------------------------------------------------------------
// Menu items
// ---------------------------------------------------------------------------

function SvgIcon({ d }: { d: string }) {
  return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={d} /></svg>;
}

export const MAIN_MENU = [
  { href: '/dashboard', label: 'Dashboard', icon: <SvgIcon d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-3a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1v-7z" /> },
  { href: '/practice', label: 'Luyện tập', icon: <SvgIcon d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /> },
  { href: '/study', label: 'Ôn tập kiến thức', icon: <SvgIcon d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /> },
  { href: '/bookmarks', label: 'Bài đã lưu', icon: <SvgIcon d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> },
  { href: '/chat', label: 'AI Chat', icon: <SvgIcon d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /> },
  { href: '/progress', label: 'Tiến trình', icon: <SvgIcon d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /> },
  { href: '/plan', label: 'Kế hoạch', icon: <SvgIcon d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /> },
  { href: '/history', label: 'Lịch sử', icon: <SvgIcon d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
];

export const SETTINGS_MENU = [
  { href: '/settings', label: 'Cài đặt', icon: <SvgIcon d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" /> },
];

// ---------------------------------------------------------------------------
// NavLink
// ---------------------------------------------------------------------------

export function NavLink({ href, label, icon, collapsed }: { href: string; label: string; icon: React.ReactNode; collapsed?: boolean }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  return (
    <Link href={href}
      className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all group ${
        active ? 'bg-gradient-to-r from-[#d1fae5] to-[#e0f2fe] text-[#059669]' : 'text-gray-500 hover:bg-[#f0fdf9] hover:text-[#059669]'
      } ${collapsed ? 'justify-center' : ''}`}>
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">{icon}</div>
      {!collapsed && label}
      {collapsed && <span className="absolute left-full ml-2 px-2.5 py-1 bg-gray-800 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg">{label}</span>}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// TopicMenu
// ---------------------------------------------------------------------------

export function TopicMenu({ realStats, isVisible }: { realStats: Record<string, number> | null; isVisible: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTopic = searchParams.get('topic') || TOPIC_CONFIG[0].key;
  const activeSubIndex = parseInt(searchParams.get('sub') || '0', 10);
  const [openTopic, setOpenTopic] = useState<string | null>(activeTopic);

  useEffect(() => {
    if (pathname.startsWith('/study')) {
      const sp = new URLSearchParams(window.location.search);
      const t = sp.get('topic');
      if (t) setOpenTopic(t);
    }
  }, [pathname]);

  if (!isVisible) return null;

  return (
    <div className="space-y-0.5 mt-1">
      {TOPIC_CONFIG.map((topic) => {
        const isActive = pathname.startsWith('/study') && activeTopic === topic.key;
        const isOpen = openTopic === topic.key;
        const colors = COLOR_MAP[topic.color] || COLOR_MAP.green;
        const subs = TOPIC_SUBSECTIONS[topic.key as Topic] || [];
        const pct = realStats ? (realStats[topic.key] ?? 0) : 0;

        return (
          <div key={topic.key}>
            <button onClick={() => setOpenTopic(isOpen ? null : topic.key)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${isActive ? `${colors.activeBg} ${colors.activeText}` : 'text-gray-500 hover:bg-gray-50'}`}>
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot}`} />
              <span className="flex-1 text-left truncate">{topic.label}</span>
              {realStats && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.pillBg} ${colors.pillText}`}>{pct}%</span>}
              <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && subs.length > 0 && (
              <div className="ml-5 mt-0.5 space-y-px border-l border-gray-100 pl-2.5">
                {subs.map((sub, idx) => {
                  const subActive = isActive && activeSubIndex === idx;
                  return (
                    <Link key={idx} href={`/study?topic=${topic.key}&sub=${idx}`}
                      className={`block px-2.5 py-1.5 rounded-lg text-[11px] transition-all ${subActive ? `font-bold ${colors.activeText} ${colors.activeBg}` : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
                      {sub}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
