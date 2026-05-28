'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { TOPICS as CENTRAL_TOPICS } from '@/shared/constants/topics';
import { PracticeCustomizePanel } from '@/features/practice/components/PracticeCustomizePanel';
import { PracticeHeroCard } from '@/features/practice/components/PracticeHeroCard';
import { PracticeSuggestions } from '@/features/practice/components/PracticeSuggestions';

const TOPICS = CENTRAL_TOPICS.map(t => ({ key: t.id, label: t.label }));

// ─── Types ───────────────────────────────────────────────────────────────────

type ExamMode = 'quick' | 'standard' | 'thpt';
type Difficulty = 'all' | 'RECOGNITION' | 'COMPREHENSION' | 'APPLICATION' | 'ADVANCED';

// ─── Constants ───────────────────────────────────────────────────────────────

const DIFFICULTIES: { key: Difficulty; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'RECOGNITION', label: 'Nhận biết' },
  { key: 'COMPREHENSION', label: 'Thông hiểu' },
  { key: 'APPLICATION', label: 'Vận dụng' },
  { key: 'ADVANCED', label: 'Vận dụng cao' },
];

const EXAM_MODES = [
  {
    key: 'quick' as ExamMode,
    icon: '⚡',
    title: 'Thi nhanh',
    desc: '10 câu · 20 phút · 1 chủ đề',
    badge: 'Dễ bắt đầu',
    badgeClass: 'bg-[#f0fdf9] text-[#059669] border border-[#059669]/20',
    count: 10,
    timeMins: 20,
  },
  {
    key: 'standard' as ExamMode,
    icon: '🎯',
    title: 'Thi chuẩn',
    desc: '30 câu · 45 phút · Nhiều chủ đề',
    badge: 'Phổ biến nhất',
    badgeClass: 'bg-blue-50 text-[#0891b2] border border-[#0891b2]/20',
    count: 30,
    timeMins: 45,
  },
  {
    key: 'thpt' as ExamMode,
    icon: '🏆',
    title: 'Thi thử THPT',
    desc: '22 câu · 90 phút · Cấu trúc đề thi quốc gia 2025',
    badge: 'Thử thách',
    badgeClass: 'bg-purple-50 text-purple-600 border border-purple-200',
    count: 22,
    timeMins: 90,
  },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PracticePage() {
  useEffect(() => { document.title = 'Luyện tập | MathBot'; }, []);
  const { data: session } = useSession();
  const router = useRouter();

  const [mode, setMode] = useState<ExamMode>('quick');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [starting, setStarting] = useState(false);

  // ─── Daily suggestions ──────────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState<
    { topic: string; label: string; reason: string; icon: string; accent: string; difficulty: string }[] | null
  >(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetch('/api/v1/suggestions/daily')
      .then((r) => r.json())
      .then((d) => {
        setSuggestions(d.suggestions ?? []);
        if (typeof d.currentStreak === 'number') setStreak(d.currentStreak);
      })
      .catch(() =>
        setSuggestions([
          { topic: 'FUNCTIONS', label: 'Khảo sát hàm số', reason: 'Chủ đề trọng tâm thi THPT', icon: '📈', accent: '#d97706', difficulty: 'RECOGNITION' },
          { topic: 'DERIVATIVES', label: 'Đạo hàm', reason: 'Chủ đề trọng tâm thi THPT', icon: '📐', accent: '#059669', difficulty: 'RECOGNITION' },
          { topic: 'PROBABILITY', label: 'Xác suất – Tổ hợp', reason: 'Chủ đề trọng tâm thi THPT', icon: '🎲', accent: '#dc2626', difficulty: 'RECOGNITION' },
        ]),
      );
  }, []);

  const currentMode = EXAM_MODES.find((m) => m.key === mode)!;

  function toggleTopic(key: string) {
    if (mode === 'quick') {
      // Quick mode: single-select only
      setSelectedTopics(prev => prev[0] === key ? [] : [key]);
    } else {
      setSelectedTopics((prev) =>
        prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
      );
    }
  }

  function selectAllTopics() {
    if (mode === 'quick') return; // not applicable for quick mode
    setSelectedTopics(TOPICS.map((t) => t.key));
  }

  function clearTopics() {
    setSelectedTopics([]);
  }

  function buildExamUrl() {
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('autostart', 'true');

    if (mode === 'quick') {
      if (selectedTopics.length > 0) {
        params.set('topic', selectedTopics[0]);
      }
      if (difficulty !== 'all') params.set('difficulty', difficulty);
    } else if (mode === 'standard') {
      if (selectedTopics.length > 0) params.set('topics', selectedTopics.join(','));
      if (difficulty !== 'all') params.set('difficulty', difficulty);
    }
    // thpt: no extra params needed
    return `/exam?${params.toString()}`;
  }

  function handleQuickStart() {
    setStarting(true);
    // For quick mode without topic selected, pick a random one
    if (mode === 'quick' && selectedTopics.length === 0) {
      const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)].key;
      const params = new URLSearchParams();
      params.set('mode', 'quick');
      params.set('autostart', 'true');
      params.set('topic', randomTopic);
      if (difficulty !== 'all') params.set('difficulty', difficulty);
      router.push(`/exam?${params.toString()}`);
      return;
    }
    router.push(buildExamUrl());
  }

  function handleCustomStart() {
    // Validate: quick mode needs exactly 1 topic
    if (mode === 'quick' && selectedTopics.length === 0) {
      toast.error('Vui lòng chọn 1 chủ đề cho chế độ Thi nhanh.');
      return;
    }
    setStarting(true);
    router.push(buildExamUrl());
  }

  // Reset topic selection when switching modes
  function handleModeChange(newMode: ExamMode) {
    setMode(newMode);
    setSelectedTopics([]);
    setDifficulty('all');
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto space-y-7">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            Luyện tập{' '}
            <span className="text-amber-400">⚡</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Chọn chế độ thi phù hợp và bắt đầu luyện đề
          </p>
        </div>
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5 flex-shrink-0">
            <span className="text-base">🔥</span>
            <span className="text-xs font-black text-amber-700">{streak} ngày streak</span>
          </div>
        )}
      </div>

      {/* ── Hero card ── */}
      <PracticeHeroCard
        mode={mode} currentMode={currentMode} starting={starting}
        onQuickStart={handleQuickStart}
        onScrollToCustomize={() => document.getElementById('custom-section')?.scrollIntoView({ behavior: 'smooth' })}
      />

      {/* ── Chọn chế độ thi ── */}
      <section>
        <h2 className="text-base font-black text-gray-900 mb-4">Chọn chế độ thi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {EXAM_MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => handleModeChange(m.key)}
              className={`relative text-left p-5 rounded-2xl border-2 transition-all hover:shadow-md active:scale-[0.98]
                ${
                  mode === m.key
                    ? 'border-[#059669] bg-[#f0fdf9] shadow-md shadow-[#059669]/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <span className="text-3xl block mb-3">{m.icon}</span>
              <p className="font-black text-gray-900 text-base mb-1">{m.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">{m.desc}</p>
              <span className={`inline-block text-[11px] font-black px-2.5 py-1 rounded-lg ${m.badgeClass}`}>
                {m.badge}
              </span>
              {mode === m.key && (
                <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── THPT info card (only in thpt mode) ── */}
      {mode === 'thpt' && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-base font-black text-gray-900">Cấu trúc đề thi THPT Quốc gia 2025</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-xs font-black text-emerald-600 uppercase tracking-wider mb-1">Phần I — Trắc nghiệm</p>
              <p className="text-2xl font-black text-emerald-700">12 câu</p>
              <p className="text-xs text-emerald-600 mt-1">0.25 điểm/câu · Tổng 3.0đ</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-black text-blue-600 uppercase tracking-wider mb-1">Phần II — Đúng/Sai</p>
              <p className="text-2xl font-black text-blue-700">4 câu</p>
              <p className="text-xs text-blue-600 mt-1">Tối đa 1.0đ/câu · Tổng 4.0đ</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs font-black text-amber-600 uppercase tracking-wider mb-1">Phần III — Trả lời ngắn</p>
              <p className="text-2xl font-black text-amber-700">6 câu</p>
              <p className="text-xs text-amber-600 mt-1">0.5 điểm/câu · Tổng 3.0đ</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              <span className="font-bold text-gray-800">22 câu</span> · 90 phút · Thang điểm 10 · Tất cả 11 chủ đề
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-500">
            <p className="font-bold text-gray-600 mb-1">Thang điểm Đúng/Sai (theo đề thi thật):</p>
            <p>0-1 ý đúng = 0đ · 2 ý đúng = 0.25đ · 3 ý đúng = 0.5đ · 4 ý đúng = 1.0đ</p>
          </div>
        </section>
      )}

      {/* ── Tùy chỉnh nhanh (extracted component) ── */}
      <PracticeCustomizePanel
        mode={mode} topics={TOPICS} selectedTopics={selectedTopics} difficulty={difficulty}
        currentModeCount={currentMode.count} currentModeTimeMins={currentMode.timeMins}
        starting={starting} onToggleTopic={toggleTopic} onSelectAll={selectAllTopics}
        onClearTopics={clearTopics} onSetDifficulty={setDifficulty} onStart={handleCustomStart}
      />


      {/* ── Gợi ý ôn tập ── */}
      <PracticeSuggestions
        suggestions={suggestions}
        onSelectSuggestion={(item) => {
          handleModeChange('quick');
          setSelectedTopics([item.topic]);
          if (item.difficulty !== 'RECOGNITION') setDifficulty(item.difficulty as Difficulty);
          document.getElementById('custom-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />
    </div>
  );
}
