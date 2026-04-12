'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TOPICS as CENTRAL_TOPICS } from '@/lib/constants/topics';

// Map central topics to local format (key instead of id)
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
    desc: '10 câu · Không giới hạn thời gian · Phù hợp ôn lướt',
    badge: 'Dễ bắt đầu',
    badgeClass: 'bg-[#f0fdf9] text-[#059669] border border-[#059669]/20',
    count: 10,
    timeMins: null,
  },
  {
    key: 'standard' as ExamMode,
    icon: '🎯',
    title: 'Thi chuẩn',
    desc: '20 câu · 30 phút · Mô phỏng đề thi thật',
    badge: 'Phổ biến nhất',
    badgeClass: 'bg-blue-50 text-[#0891b2] border border-[#0891b2]/20',
    count: 20,
    timeMins: 30,
  },
  {
    key: 'thpt' as ExamMode,
    icon: '🏆',
    title: 'Thi thử THPT',
    desc: '40 câu · 60 phút · Độ khó như đề thi quốc gia',
    badge: 'Thử thách',
    badgeClass: 'bg-purple-50 text-purple-600 border border-purple-200',
    count: 40,
    timeMins: 60,
  },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PracticePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [mode, setMode] = useState<ExamMode>('quick');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [starting, setStarting] = useState(false);

  const userName = (session?.user as { name?: string })?.name ?? 'bạn';
  const currentMode = EXAM_MODES.find((m) => m.key === mode)!;

  // Streak (would come from API in real usage — shown as static for now)
  const streak = 7;

  function toggleTopic(key: string) {
    setSelectedTopics((prev) =>
      prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]
    );
  }

  function selectAllTopics() {
    setSelectedTopics(TOPICS.map((t) => t.key));
  }

  function clearTopics() {
    setSelectedTopics([]);
  }

  function buildExamUrl(customTopics?: string[]) {
    const topics = customTopics ?? selectedTopics;
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('count', String(currentMode.count));
    if (currentMode.timeMins) params.set('time', String(currentMode.timeMins));
    if (topics.length > 0) params.set('topics', topics.join(','));
    if (difficulty !== 'all') params.set('difficulty', difficulty);
    return `/exam?${params.toString()}`;
  }

  function handleQuickStart() {
    setStarting(true);
    router.push(buildExamUrl([])); // all topics, no filter
  }

  function handleCustomStart() {
    setStarting(true);
    router.push(buildExamUrl());
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1100px] mx-auto space-y-7">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            Thi ngẫu nhiên{' '}
            <span className="text-amber-400">⚡</span>
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Bắt đầu ngay — câu hỏi được chọn ngẫu nhiên từ toàn bộ ngân hàng
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#059669] via-[#0a9578] to-[#0891b2] p-8 lg:p-10 text-white shadow-xl">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute top-[-20%] right-[10%] w-[35%] h-[140%] rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-30%] left-[30%] w-[40%] h-[120%] rounded-full bg-[#0891b2]/20 blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8">
          {/* Left content */}
          <div className="flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/60 mb-3">
              THI NHANH
            </p>
            <h2 className="text-4xl lg:text-5xl font-black leading-tight mb-4 tracking-tight">
              Sẵn sàng chiến đấu?
            </h2>
            <p className="text-2xl mb-4 leading-none">⚡</p>
            <p className="text-white/80 text-base leading-relaxed mb-8 max-w-md">
              Hệ thống sẽ tự chọn câu hỏi ngẫu nhiên từ 11 chủ đề Toán 12.
              Không cần chuẩn bị — bắt đầu ngay!
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleQuickStart}
                disabled={starting}
                className="px-7 py-3.5 bg-white text-gray-900 font-black rounded-2xl hover:bg-gray-50 active:scale-95 transition-all shadow-lg disabled:opacity-70 flex items-center gap-2"
              >
                {starting ? (
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                ) : null}
                Thi ngay →
              </button>
              <button
                onClick={() => {
                  document
                    .getElementById('custom-section')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 bg-white/10 border border-white/25 text-white font-black rounded-2xl hover:bg-white/20 active:scale-95 transition-all"
              >
                Tự chọn đề
              </button>
            </div>
          </div>

          {/* Right stat */}
          <div className="flex-shrink-0 text-right lg:text-right">
            <p className="text-8xl lg:text-9xl font-black leading-none tracking-tighter text-white drop-shadow-lg">
              200+
            </p>
            <p className="text-white/70 font-semibold text-base mt-1">câu hỏi trong kho</p>
          </div>
        </div>
      </div>

      {/* ── Chọn chế độ thi ── */}
      <section>
        <h2 className="text-base font-black text-gray-900 mb-4">Chọn chế độ thi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {EXAM_MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
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

      {/* ── Tùy chỉnh nhanh ── */}
      <section id="custom-section" className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black text-gray-900">Tùy chỉnh nhanh</h2>
          <span className="text-xs text-gray-400 font-medium">Bỏ qua để thi ngẫu nhiên tất cả chủ đề</span>
        </div>

        {/* Topic chips */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black text-gray-600 uppercase tracking-wider">
              Chủ đề{' '}
              <span className="text-[#059669] font-black">
                {selectedTopics.length === 0
                  ? '(tất cả)'
                  : `(${selectedTopics.length}/${TOPICS.length})`}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                onClick={selectAllTopics}
                className="text-[11px] font-bold text-[#059669] hover:underline"
              >
                Chọn tất cả
              </button>
              <span className="text-gray-300">·</span>
              <button
                onClick={clearTopics}
                className="text-[11px] font-bold text-gray-400 hover:text-red-500 hover:underline"
              >
                Xóa
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const active = selectedTopics.includes(t.key);
              return (
                <button
                  key={t.key}
                  onClick={() => toggleTopic(t.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
                    ${
                      active
                        ? 'bg-[#059669] text-white border-[#059669] shadow-sm'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-[#059669] hover:text-[#059669]'
                    }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Difficulty chips */}
        <div>
          <p className="text-xs font-black text-gray-600 uppercase tracking-wider mb-3">
            Mức độ
          </p>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.key}
                onClick={() => setDifficulty(d.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all
                  ${
                    difficulty === d.key
                      ? 'bg-[#0891b2] text-white border-[#0891b2] shadow-sm'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#0891b2] hover:text-[#0891b2]'
                  }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary + start button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <div className="text-sm text-gray-500 space-y-0.5">
            <p>
              <span className="font-bold text-gray-800">{currentMode.count} câu</span>
              {currentMode.timeMins
                ? ` · ${currentMode.timeMins} phút`
                : ' · Không giới hạn thời gian'}
            </p>
            <p>
              {selectedTopics.length === 0
                ? 'Tất cả 11 chủ đề'
                : `${selectedTopics.length} chủ đề đã chọn`}
              {difficulty !== 'all'
                ? ` · ${DIFFICULTIES.find((d) => d.key === difficulty)?.label}`
                : ''}
            </p>
          </div>
          <button
            onClick={handleCustomStart}
            disabled={starting}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white font-black rounded-2xl shadow-lg shadow-[#059669]/25 hover:shadow-xl hover:shadow-[#059669]/30 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-70"
          >
            {starting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
            Bắt đầu thi
          </button>
        </div>
      </section>

      {/* ── Gợi ý ôn tập ── */}
      <section>
        <h2 className="text-base font-black text-gray-900 mb-4">Gợi ý ôn tập hôm nay</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            {
              topic: 'DERIVATIVES',
              label: 'Đạo hàm',
              reason: 'Chủ đề trọng tâm thi THPT',
              icon: '📐',
              accent: '#059669',
            },
            {
              topic: 'PROBABILITY',
              label: 'Xác suất - Tổ hợp',
              reason: 'Điểm yếu cần cải thiện',
              icon: '🎲',
              accent: '#dc2626',
            },
            {
              topic: 'EXPONENTIAL_LOG',
              label: 'Hàm số mũ - Logarit',
              reason: 'Ôn lại kiến thức cơ bản',
              icon: '🔢',
              accent: '#d97706',
            },
          ].map((item) => (
            <button
              key={item.topic}
              onClick={() => {
                setSelectedTopics([item.topic]);
                setMode('quick');
                document
                  .getElementById('custom-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all text-left group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: `${item.accent}12` }}
              >
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-gray-800 group-hover:text-[#059669] transition-colors">
                  {item.label}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">{item.reason}</p>
              </div>
              <svg
                className="w-4 h-4 text-gray-300 group-hover:text-[#059669] group-hover:translate-x-0.5 transition-all ml-auto flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
