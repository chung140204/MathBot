'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import StudyChatPanel from '@/features/study/components/StudyChatPanel';
import { StudyHeader } from '@/features/study/components/StudyHeader';
import { StudyChunkCard } from '@/features/study/components/StudyChunkCard';
import { getStudyContent } from './actions';
import { Topic } from '@prisma/client';
import { TOPIC_CONFIG, TOPIC_SUBSECTIONS } from '@/shared/constants/topics';

function StudyContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  const initTopic = searchParams.get('topic') || TOPIC_CONFIG[0].key;
  const initSub = parseInt(searchParams.get('sub') || '0', 10);

  const [selectedTopic, setSelectedTopic] = useState(initTopic);
  const [activeSubSectionIndex, setActiveSubSectionIndex] = useState(initSub);
  const [topicProgress, setTopicProgress] = useState<Record<string, number>>({});
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [chunks, setChunks] = useState<{ id: string; title?: string; source?: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [pendingAiQuestion, setPendingAiQuestion] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);

  const selectedTopicLabel = TOPIC_CONFIG.find(t => t.key === selectedTopic)?.label || selectedTopic;
  const subSections = TOPIC_SUBSECTIONS[selectedTopic as Topic] || [];
  const activeSubSectionLabel = subSections[activeSubSectionIndex] || '';

  useEffect(() => {
    if (selectedTopicLabel && activeSubSectionLabel) {
      document.title = `${selectedTopicLabel} — ${activeSubSectionLabel} | MathBot`;
    }
  }, [selectedTopicLabel, activeSubSectionLabel]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) { /* no-op for future use */ }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProgress = () => {
    fetch('/api/v1/study/progress')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map: Record<string, number> = {};
          data.forEach((p: { topic: string; percent: number }) => { map[p.topic] = p.percent; });
          setTopicProgress(map);
        }
      })
      .catch(err => console.error('Progress fetch failed:', err));
  };

  useEffect(() => {
    fetch('/api/v1/study/bookmarks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setIsBookmarked(data.some((b: { topic: string; subsection: string }) => b.topic === selectedTopic && b.subsection === activeSubSectionLabel));
        }
      })
      .catch(() => {});
  }, [selectedTopic, activeSubSectionLabel]);

  const toggleBookmark = () => {
    fetch('/api/v1/study/bookmarks', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: selectedTopic, subsection: activeSubSectionLabel }),
    }).then(res => res.json()).then(data => setIsBookmarked(data.bookmarked)).catch(console.error);
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchProgress();
    fetch('/api/v1/analytics/overview', { signal: controller.signal })
      .then(async res => { if (!res.ok) throw new Error(`API error ${res.status}`); return res.json(); })
      .then(data => { /* topicStats unused */ void data; })
      .catch(err => { if (err.name !== 'AbortError') console.error('Analytics fetch failed:', err); });
    return () => controller.abort();
  }, []);

  useEffect(() => { setSelectedTopic(initTopic); setActiveSubSectionIndex(initSub); }, [initTopic, initSub]);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      try {
        const data = await getStudyContent(selectedTopic, subSections[activeSubSectionIndex]);
        setExpandedSections({});
        setChunks(data || []);
      } catch (err) {
        console.error('Failed to load study content:', err);
        setChunks([]);
      } finally { setLoading(false); }
    }
    loadContent();
  }, [selectedTopic, activeSubSectionIndex]);

  const toggleSection = (id: string) => {
    const willExpand = !expandedSections[id];
    setExpandedSections(prev => ({ ...prev, [id]: willExpand }));
    if (willExpand && !readIds.has(id)) {
      setReadIds(prev => new Set(prev).add(id));
      fetch('/api/v1/study/progress', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studyContentId: id }),
      }).then(() => { fetchProgress(); window.dispatchEvent(new Event('study-progress-updated')); }).catch(console.error);
    }
  };

  void session;

  return (
    <div className="flex flex-col md:flex-row h-full overflow-hidden w-full bg-[#f8fafc]">
      <div className="flex-1 flex flex-col bg-white overflow-hidden border-r border-slate-200">
        <StudyHeader
          selectedTopicLabel={selectedTopicLabel}
          activeSubSectionLabel={activeSubSectionLabel}
          currentAccuracy={topicProgress[selectedTopic] || 0}
          chunkCount={chunks.length}
          isBookmarked={isBookmarked}
          selectedTopic={selectedTopic}
          onToggleBookmark={toggleBookmark}
        />

        <div className="px-8 py-4 border-b border-slate-50 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {subSections.map((sub, idx) => (
            <button key={idx}
              onClick={() => { setActiveSubSectionIndex(idx); router.replace(`/study?topic=${selectedTopic}&sub=${idx}`, { scroll: false }); }}
              className={`px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold border transition-all ${activeSubSectionIndex === idx ? 'bg-[#059669] text-white border-[#059669] shadow-md shadow-[#059669]/20' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
            >
              {idx + 1}. {sub}
            </button>
          ))}
        </div>

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
              chunks.map((chunk, idx) => (
                <StudyChunkCard
                  key={chunk.id}
                  chunk={chunk}
                  idx={idx}
                  isExpanded={!!expandedSections[chunk.id]}
                  onToggle={toggleSection}
                  onAskExplain={(q) => setPendingAiQuestion(q)}
                  onAskExample={(q) => setPendingAiQuestion(q)}
                  activeSubSectionLabel={activeSubSectionLabel}
                />
              ))
            )}
          </div>
        </div>
      </div>

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
          <StudyChatPanel topicContext={selectedTopic} topicLabel={selectedTopicLabel} pendingQuestion={pendingAiQuestion} onQuestionConsumed={() => setPendingAiQuestion('')} />
        </div>
      </div>

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
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-[#f0fdf9]"><div className="w-8 h-8 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin" /></div>}>
      <StudyContent />
    </Suspense>
  );
}
