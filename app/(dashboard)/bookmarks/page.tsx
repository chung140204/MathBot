'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TOPIC_LABEL, TOPIC_SUBSECTIONS, TOPIC_CONFIG } from '@/lib/constants/topics';
import { Topic } from '@prisma/client';

interface Bookmark {
  id: string;
  topic: string;
  subsection: string;
  createdAt: string;
}

const TOPIC_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  DERIVATIVES: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: 'bg-emerald-500' },
  INTEGRALS: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: 'bg-sky-500' },
  FUNCTIONS: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'bg-amber-500' },
  PROBABILITY: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: 'bg-rose-500' },
  COMPLEX_NUMBERS: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: 'bg-violet-500' },
  EXPONENTIAL_LOG: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'bg-blue-500' },
  SOLID_GEOMETRY: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: 'bg-purple-500' },
  SEQUENCES: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: 'bg-teal-500' },
  LIMITS: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', icon: 'bg-indigo-500' },
  ANALYTIC_GEOMETRY: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', icon: 'bg-orange-500' },
  VOLUME: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: 'bg-cyan-500' },
};

const DEFAULT_COLOR = { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: 'bg-slate-500' };

export default function BookmarksPage() {
  useEffect(() => { document.title = 'Bài đã lưu | MathBot'; }, []);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetch('/api/v1/study/bookmarks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBookmarks(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const removeBookmark = async (topic: string, subsection: string) => {
    await fetch('/api/v1/study/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, subsection }),
    });
    setBookmarks(prev => prev.filter(b => !(b.topic === topic && b.subsection === subsection)));
  };

  const filteredBookmarks = filter === 'all' ? bookmarks : bookmarks.filter(b => b.topic === filter);

  // Group by topic
  const grouped = filteredBookmarks.reduce<Record<string, Bookmark[]>>((acc, b) => {
    if (!acc[b.topic]) acc[b.topic] = [];
    acc[b.topic].push(b);
    return acc;
  }, {});

  // Unique topics for filter
  const uniqueTopics = [...new Set(bookmarks.map(b => b.topic))];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return d.toLocaleDateString('vi-VN');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-200">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            Bài đã lưu
          </h1>
          <p className="text-sm text-slate-400 mt-1 ml-[52px]">
            {bookmarks.length > 0 ? `${bookmarks.length} phần kiến thức đã bookmark` : 'Bookmark bài học yêu thích để ôn lại'}
          </p>
        </div>
        {bookmarks.length > 0 && (
          <Link
            href="/study"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#059669] text-white text-sm font-bold rounded-xl hover:bg-[#047857] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ôn tập thêm
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-60 gap-3">
          <div className="w-10 h-10 border-3 border-rose-100 border-t-rose-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Đang tải...</p>
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-6">
            <svg className="w-10 h-10 text-rose-300 -rotate-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-lg font-black text-slate-700 mb-2">Chưa có bài nào được lưu</h2>
          <p className="text-sm text-slate-400 mb-6 max-w-sm mx-auto">
            Khi ôn tập kiến thức, ấn nút <span className="text-rose-500 font-semibold">Lưu</span> để bookmark phần bạn muốn ôn lại sau.
          </p>
          <Link
            href="/study"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#059669] text-white text-sm font-bold rounded-xl hover:bg-[#047857] transition-all shadow-lg shadow-emerald-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Bắt đầu ôn tập
          </Link>
        </div>
      ) : (
        <>
          {/* Filter chips */}
          {uniqueTopics.length > 1 && (
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  filter === 'all'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                Tất cả ({bookmarks.length})
              </button>
              {uniqueTopics.map(topic => {
                const colors = TOPIC_COLORS[topic] || DEFAULT_COLOR;
                const count = bookmarks.filter(b => b.topic === topic).length;
                return (
                  <button
                    key={topic}
                    onClick={() => setFilter(topic)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                      filter === topic
                        ? `${colors.icon} text-white shadow-sm`
                        : `${colors.bg} ${colors.text} hover:opacity-80`
                    }`}
                  >
                    {TOPIC_LABEL[topic as Topic]} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Bookmark cards */}
          <div className="space-y-8">
            {Object.entries(grouped).map(([topic, items]) => {
              const colors = TOPIC_COLORS[topic] || DEFAULT_COLOR;
              const topicSubs = TOPIC_SUBSECTIONS[topic as Topic] || [];

              return (
                <div key={topic}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${colors.icon}`} />
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                      {TOPIC_LABEL[topic as Topic] || topic}
                    </h2>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {items.map(b => {
                      const subIndex = topicSubs.indexOf(b.subsection);

                      return (
                        <div
                          key={b.id}
                          className={`relative rounded-2xl border ${colors.border} ${colors.bg} p-4 hover:shadow-md transition-all group overflow-hidden`}
                        >
                          {/* Decorative corner */}
                          <div className={`absolute top-0 right-0 w-16 h-16 ${colors.icon} opacity-5 rounded-bl-[40px]`} />

                          <Link
                            href={`/study?topic=${topic}&sub=${subIndex >= 0 ? subIndex : 0}`}
                            className="block"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl ${colors.icon} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold ${colors.text} group-hover:underline underline-offset-2`}>
                                  {b.subsection}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {formatDate(b.createdAt)}
                                </p>
                              </div>
                            </div>
                          </Link>

                          <button
                            onClick={() => removeBookmark(b.topic, b.subsection)}
                            className="absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100"
                            title="Bỏ lưu"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
