'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { difficultyLabel } from '@/shared/constants/difficulty';

// ─── Types (consume backend contract) ─────────────────────────────────────────

type FocusTopic = {
  topic: string;
  label: string;
  accuracy: number;
  difficulty: string;
};

type RoadmapItem = {
  topic: string;
  label: string;
  icon: string;
  accent: string;
  accuracy: number;
  status: 'mastered' | 'learning' | 'todo';
  masteryTarget: number;
  recommendedDifficulty: string;
  priority: number;
};

type StudyPlan = {
  hasTarget: boolean;
  targetPct: number;
  currentPct: number;
  gapPct: number;
  dailyQuota: number;
  focusTopics: FocusTopic[];
};

type StudyPlanData = {
  plan: StudyPlan;
  roadmap: RoadmapItem[];
};

// ─── Constants ─────────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<RoadmapItem['status'], { label: string; className: string }> = {
  mastered: { label: 'Đã vững', className: 'bg-emerald-50 text-emerald-600 border border-emerald-100' },
  learning: { label: 'Đang học', className: 'bg-amber-50 text-amber-600 border border-amber-100' },
  todo: { label: 'Cần bắt đầu', className: 'bg-gray-100 text-gray-500 border border-gray-200' },
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

function barColor(pct: number): string {
  if (pct >= 70) return '#059669';
  if (pct >= 40) return '#d97706';
  return '#dc2626';
}

// Quick-exam deep link — replicated from practice page buildExamUrl()
// (src/app/(dashboard)/practice/page.tsx): mode=quick, topic, autostart=true.
function buildQuickExamUrl(topic: string): string {
  const params = new URLSearchParams();
  params.set('mode', 'quick');
  params.set('topic', topic);
  params.set('autostart', 'true');
  return `/exam?${params.toString()}`;
}

// ─── Skeleton ───────────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 animate-pulse rounded-xl ${className}`} />;
}

// ─── Main page ──────────────────────────────────────────────────────────────────

export default function PlanPage() {
  useEffect(() => { document.title = 'Kế hoạch học | MathBot'; }, []);

  const [data, setData] = useState<StudyPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/v1/study-plan', { signal: controller.signal })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('fetch failed')))
      .then((d: StudyPlanData) => setData(d))
      .catch((err) => { if (err?.name !== 'AbortError') setError('Không thể tải dữ liệu. Vui lòng thử lại.'); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  const plan = data?.plan;
  const roadmap = data?.roadmap ?? [];

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto space-y-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          Kế hoạch học <span role="img" aria-label="map">🗺️</span>
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Mục tiêu cá nhân và lộ trình ôn tập được gợi ý riêng cho em
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl px-5 py-4 text-sm font-medium">
          {error}
        </div>
      )}

      {/* ── (a) Mục tiêu ── */}
      {loading ? (
        <Skeleton className="h-32" />
      ) : plan ? (
        <GoalCard plan={plan} />
      ) : null}

      {/* ── (b) Lộ trình ôn tập ── */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <h2 className="text-sm font-black text-gray-800 mb-4">
          <span role="img" aria-label="map">🗺️</span> Lộ trình ôn tập
        </h2>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
          </div>
        ) : roadmap.length > 0 ? (
          <div className="space-y-2.5">
            {roadmap.map(item => <RoadmapRow key={item.topic} item={item} />)}
          </div>
        ) : (
          <p className="text-xs text-gray-500 text-center py-8">
            Chưa có lộ trình. Hãy làm vài bài thi để hệ thống gợi ý cho em!
          </p>
        )}
      </section>
    </div>
  );
}

// ─── (a) Goal card ──────────────────────────────────────────────────────────────

function GoalCard({ plan }: { plan: StudyPlan }) {
  const focusLabels = plan.focusTopics.map(t => t.label).join(', ');

  // CTA when no target set yet — mirrors TargetProgress no-target state.
  if (!plan.hasTarget) {
    return (
      <div className="space-y-3">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <p className="text-sm font-black text-gray-900">Đặt mục tiêu điểm số</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Đặt mục tiêu điểm thi để hệ thống xây lộ trình phù hợp với em.
              </p>
            </div>
          </div>
          <Link
            href="/settings"
            className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white text-xs font-black rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            Đặt mục tiêu ngay
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
        <QuotaLine dailyQuota={plan.dailyQuota} focusLabels={focusLabels} />
      </div>
    );
  }

  const currentOnTen = (plan.currentPct / 10).toFixed(1);
  const targetOnTen = (plan.targetPct / 10).toFixed(1);
  const gapOnTen = (plan.gapPct / 10).toFixed(1);
  const achieved = plan.targetPct > 0
    ? Math.min(100, Math.round((plan.currentPct / plan.targetPct) * 100))
    : 0;
  const reached = plan.currentPct >= plan.targetPct;

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎯</span>
          <h2 className="text-sm font-black text-gray-800">Mục tiêu của em</h2>
        </div>

        <div className="flex items-end justify-between gap-2 mb-2">
          <p className="text-xs font-semibold text-gray-500">
            Điểm TB hiện tại: <span className="font-black text-gray-800">{currentOnTen}</span>
            {' / '}Mục tiêu: <span className="font-black text-[#059669]">{targetOnTen}</span>
          </p>
          <span className="text-sm font-black" style={{ color: barColor(achieved) }}>{achieved}%</span>
        </div>

        {/* Thanh tiến độ: currentPct tiến tới targetPct */}
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${achieved}%`, backgroundColor: barColor(achieved) }}
          />
        </div>

        <p className="text-xs font-semibold mt-2.5">
          {reached ? (
            <span className="text-[#059669]">🎉 Em đã đạt mục tiêu! Tiếp tục duy trì phong độ.</span>
          ) : (
            <span className="text-gray-500">
              Còn cách mục tiêu <span className="font-black text-amber-600">{gapOnTen} điểm</span>. Cố lên!
            </span>
          )}
        </p>
      </div>
      <QuotaLine dailyQuota={plan.dailyQuota} focusLabels={focusLabels} />
    </div>
  );
}

function QuotaLine({ dailyQuota, focusLabels }: { dailyQuota: number; focusLabels: string }) {
  return (
    <p className="text-xs font-semibold text-gray-600 px-1">
      📌 Mỗi ngày luyện ~<span className="font-black text-gray-800">{dailyQuota}</span> câu
      {focusLabels && (
        <> — ưu tiên: <span className="font-black text-[#059669]">{focusLabels}</span></>
      )}
    </p>
  );
}

// ─── (b) Roadmap row ────────────────────────────────────────────────────────────

function RoadmapRow({ item }: { item: RoadmapItem }) {
  const badge = STATUS_BADGE[item.status];
  const diffLabel = difficultyLabel(item.recommendedDifficulty);

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-[#f0fdf9] transition-colors">
      {/* Icon with accent */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: `${item.accent}18` }}
      >
        <span style={{ color: item.accent }}>{item.icon}</span>
      </div>

      {/* Label + accuracy bar */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-xs font-bold text-gray-800 truncate">{item.label}</p>
          <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg flex-shrink-0 ${badge.className}`}>
            {badge.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${item.accuracy}%`, backgroundColor: barColor(item.accuracy) }}
            />
          </div>
          <span
            className="text-[11px] font-black w-9 text-right"
            style={{ color: barColor(item.accuracy) }}
          >
            {item.accuracy}%
          </span>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Gợi ý: {diffLabel}</p>
      </div>

      {/* Luyện ngay deep link */}
      <Link
        href={buildQuickExamUrl(item.topic)}
        className="flex-shrink-0 inline-flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:border-[#059669] hover:text-[#059669] transition-all"
      >
        Luyện ngay
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </div>
  );
}
