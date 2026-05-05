'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import MathRenderer from '@/components/exam/MathRenderer';
import { getKnowledgeChunks } from './actions';
import StudyChatPanel from '@/components/study/StudyChatPanel';
import { Topic } from '@prisma/client';

import { TOPIC_CONFIG, TOPIC_SUBSECTIONS } from '@/lib/constants/topics';

const COLOR_MAP = {
  green: { dot: 'bg-[#059669]', pillBg: 'bg-[#d1fae5]', pillText: 'text-[#059669]', activeBg: 'bg-[#e6f7f2]', activeText: 'text-[#059669]' },
  blue: { dot: 'bg-sky-500', pillBg: 'bg-sky-100', pillText: 'text-sky-700', activeBg: 'bg-sky-50', activeText: 'text-sky-700' },
  orange: { dot: 'bg-amber-500', pillBg: 'bg-amber-100', pillText: 'text-amber-700', activeBg: 'bg-amber-50', activeText: 'text-amber-700' },
  red: { dot: 'bg-red-500', pillBg: 'bg-red-100', pillText: 'text-red-700', activeBg: 'bg-red-50', activeText: 'text-red-700' },
  purple: { dot: 'bg-purple-500', pillBg: 'bg-purple-100', pillText: 'text-purple-700', activeBg: 'bg-purple-50', activeText: 'text-purple-700' },
};


import { Suspense } from 'react';

function StudyContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initTopic = searchParams.get('topic') || TOPIC_CONFIG[0].key;
  const initSub = parseInt(searchParams.get('sub') || '0', 10);
  
  const [selectedTopic, setSelectedTopic] = useState(initTopic);
  const [activeSubSectionIndex, setActiveSubSectionIndex] = useState(initSub);
  const [topicStats, setTopicStats] = useState<any[]>([]);
  const [chunks, setChunks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const selectedTopicLabel = TOPIC_CONFIG.find(t => t.key === selectedTopic)?.label || selectedTopic;
  const subSections = TOPIC_SUBSECTIONS[selectedTopic as Topic] || [];
  const activeSubSectionLabel = subSections[activeSubSectionIndex] || '';

  // Update document title
  useEffect(() => {
    if (selectedTopicLabel && activeSubSectionLabel) {
      document.title = `${selectedTopicLabel} — ${activeSubSectionLabel} | MathBot`;
    }
  }, [selectedTopicLabel, activeSubSectionLabel]);

  // Handle click outside for user menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetch('/api/v1/analytics/overview')
      .then(async res => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data?.topicStats) setTopicStats(data.topicStats);
      })
      .catch(err => console.error('Analytics fetch failed:', err));
  }, []);

  useEffect(() => {
    setSelectedTopic(initTopic);
    setActiveSubSectionIndex(initSub);
  }, [initTopic, initSub]);

  useEffect(() => {
    async function loadChunks() {
      setLoading(true);
      try {
        const data = await getKnowledgeChunks(selectedTopic);
        // Default: first section open
        if (data && data.length > 0) {
          setExpandedSections({ [data[0].id]: true });
        } else {
          setExpandedSections({});
        }
        setChunks(data || []);
      } catch (err) {
        console.error('Failed to load chunks:', err);
        setChunks([]);
      } finally {
        setLoading(false);
      }
    }
    loadChunks();
  }, [selectedTopic]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const currentStat = topicStats.find(s => s.topic === selectedTopic);
  const currentAccuracy = currentStat ? Math.round(currentStat.accuracy) : 0;

  const user = session?.user as { name?: string | null, email?: string | null };
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(-2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden w-full bg-[#f8fafc]">
      
      {/* ── Middle (Theory Content) ── */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden border-r border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black text-slate-800">
              {selectedTopicLabel} <span className="text-slate-300 mx-1">—</span> {activeSubSectionLabel}
            </h1>
            
            <div className="flex items-center px-2.5 py-0.5 bg-[#d1fae5] rounded-full gap-1.5 border border-[#d1fae5]">
              <span className="text-[10px] font-bold text-[#059669]">Năng lực: {currentAccuracy}%</span>
            </div>
            
            <div className="flex items-center px-2.5 py-0.5 bg-blue-50 rounded-full gap-1.5 border border-blue-100">
              <span className="text-[10px] font-bold text-[#0891b2]">{chunks.length} phần</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 text-sm font-bold rounded-xl hover:bg-rose-100 transition-colors">
              📌 Lưu
            </button>
            <Link 
              href={`/exam?topic=${selectedTopic}`}
              className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-800 text-slate-800 text-sm font-black rounded-xl hover:bg-slate-50 transition-all group"
            >
              📝 Luyện tập
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
        
        {/* Sub-item Nav Pill row */}
        <div className="px-8 py-4 border-b border-slate-50 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {subSections.map((sub, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSubSectionIndex(idx)}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold border transition-all
                ${activeSubSectionIndex === idx 
                  ? 'bg-[#059669] text-white border-[#059669] shadow-md shadow-[#059669]/20' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}
              `}
            >
              {idx + 1}. {sub}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 bg-[#f8fafc]">
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-40 space-y-4">
                <div className="w-8 h-8 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin" />
                <p className="text-sm text-slate-400 font-medium italic">Đang tải kiến thức...</p>
              </div>
            ) : chunks.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-slate-500 font-bold mb-2">Chưa có dữ liệu bài học</p>
                <p className="text-xs text-slate-400">MathBot đang cập nhật nội dung cho phần này, vui lòng quay lại sau! 🚀</p>
              </div>
            ) : (
              chunks.map((chunk, idx) => {
                const isExpanded = !!expandedSections[chunk.id];
                
                return (
                  <div key={chunk.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-[#059669]/20 transition-all duration-300">
                    {/* Theory Accordion Header */}
                    <button 
                      onClick={() => toggleSection(chunk.id)}
                      className="w-full flex items-center justify-between p-5 text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-colors
                          ${isExpanded ? 'bg-[#059669] text-white' : 'bg-[#f0fdf9] text-[#059669] group-hover:bg-[#059669] group-hover:text-white'}
                        `}>
                          {idx + 1}
                        </div>
                        <h3 className="text-lg font-black text-slate-800">{chunk.source || `Phần ${idx + 1}`}</h3>
                      </div>
                      <svg 
                        className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-slate-500' : ''}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Theory Body */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out`}
                      style={{ maxHeight: isExpanded ? '2000px' : '0px' }}
                    >
                      <div className="px-6 pb-6 pt-0 border-t border-slate-50">
                        <div className="prose prose-slate max-w-none text-slate-700 font-medium py-4">
                          <MathRenderer content={chunk.content} />
                        </div>
                        
                        {/* Action buttons inside card */}
                        <div className="mt-4 flex items-center gap-3">
                          <button className="flex items-center gap-2 px-3 py-2 bg-[#f0fdf9] text-[#059669] text-[13px] font-bold rounded-xl border border-[#d1fae5] hover:bg-[#d1fae5] transition-colors">
                            🤖 Hỏi AI giải thích thêm
                          </button>
                          <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 text-slate-600 text-[13px] font-bold rounded-xl hover:bg-slate-100 transition-colors">
                            Tại sao (eˣ)&apos; = eˣ?
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Right Sidebar (AI Chat) ── */}
      <div className="w-full md:w-[320px] lg:w-[380px] flex-shrink-0 bg-white flex flex-col border-l border-slate-200">
        <div className="p-5 bg-white border-b border-slate-100 flex-shrink-0 shadow-sm z-10">
          <div className="flex items-center gap-2.5 mb-1">
            <span className="text-lg">🤖</span>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Hỏi AI ngay</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            <p className="text-[11px] font-bold text-[#059669]">AI đang đọc nội dung bạn đang học</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-hidden relative bg-white">
           <StudyChatPanel 
              topicContext={selectedTopic} 
              topicLabel={selectedTopicLabel}
           />
        </div>
      </div>

      {/* Styles for smooth transitions and hide scrollbars */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}

export default function StudyPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#f0fdf9]">
      <div className="w-8 h-8 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin" />
    </div>}>
      <StudyContent />
    </Suspense>
  );
}
