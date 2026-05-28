'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Loader2,
  Play,
  Sparkles,
  ListChecks,
  BarChart3,
} from 'lucide-react';
import { TOPICS } from '@/shared/constants/topics';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExamSetupModalProps {
  onStart: (config: { topics: string[]; totalQuestions: number }) => void;
  isLoading: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const QUESTION_PRESETS = [10, 20, 30, 50] as const;

const DIFFICULTY_DISTRIBUTION = [
  { key: 'RECOGNITION', label: 'Nhận biết', ratio: 0.4, color: 'bg-emerald-500' },
  { key: 'COMPREHENSION', label: 'Thông hiểu', ratio: 0.3, color: 'bg-sky-500' },
  { key: 'APPLICATION', label: 'Vận dụng', ratio: 0.2, color: 'bg-amber-500' },
  { key: 'ADVANCED', label: 'Vận dụng cao', ratio: 0.1, color: 'bg-rose-500' },
] as const;

const MINUTES_PER_QUESTION = 1.5;

const TOPIC_ICONS: Record<string, string> = {
  DERIVATIVES: '∂',
  INTEGRALS: '∫',
  FUNCTIONS: 'ƒ',
  LIMITS: '∞',
  COMPLEX_NUMBERS: 'ℂ',
  PROBABILITY: 'P',
  SEQUENCES: '∑',
  EXPONENTIAL_LOG: 'eˣ',
  VOLUME: 'V',
  ANALYTIC_GEOMETRY: 'Oxy',
  SOLID_GEOMETRY: '3D',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ExamSetupModal({ onStart, isLoading }: ExamSetupModalProps) {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(
    TOPICS.map((t) => t.id),
  );
  const [totalQuestions, setTotalQuestions] = useState<number>(50);

  const allSelected = selectedTopics.length === TOPICS.length;
  const noneSelected = selectedTopics.length === 0;

  const distribution = useMemo(
    () =>
      DIFFICULTY_DISTRIBUTION.map((d) => ({
        ...d,
        count: Math.round(totalQuestions * d.ratio),
      })),
    [totalQuestions],
  );

  const estimatedMinutes = Math.round(totalQuestions * MINUTES_PER_QUESTION);

  const toggleTopic = useCallback((id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedTopics((prev) =>
      prev.length === TOPICS.length ? [] : TOPICS.map((t) => t.id),
    );
  }, []);

  const handleStart = useCallback(() => {
    if (noneSelected || isLoading) return;
    onStart({ topics: selectedTopics, totalQuestions });
  }, [noneSelected, isLoading, onStart, selectedTopics, totalQuestions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-teal-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 shadow-sm">
            <BookOpen className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Thi ngay
          </h1>
          <p className="mt-2 text-base text-gray-500">
            Chọn chủ đề và bắt đầu làm bài
          </p>
        </header>

        {/* Topic Selection */}
        <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-gray-800">Chủ đề</h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Đã chọn {selectedTopics.length}/{TOPICS.length}
              </span>
            </div>

            <button
              type="button"
              onClick={toggleAll}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
            >
              {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {TOPICS.map((topic) => {
              const isActive = selectedTopics.includes(topic.id);
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => toggleTopic(topic.id)}
                  className={`group relative flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50/70 shadow-sm shadow-emerald-100'
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold transition-colors duration-200 ${
                      isActive
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    }`}
                  >
                    {TOPIC_ICONS[topic.id] ?? '?'}
                  </span>

                  <span
                    className={`text-sm font-medium leading-tight transition-colors ${
                      isActive ? 'text-emerald-800' : 'text-gray-700'
                    }`}
                  >
                    {topic.label}
                  </span>

                  <CheckCircle2
                    className={`ml-auto h-5 w-5 shrink-0 transition-all duration-200 ${
                      isActive
                        ? 'scale-100 text-emerald-500 opacity-100'
                        : 'scale-75 text-gray-300 opacity-0'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </section>

        {/* Question Count */}
        <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-gray-800">Số câu hỏi</h2>
          </div>

          <div className="mb-5 flex flex-wrap gap-3">
            {QUESTION_PRESETS.map((n) => {
              const isActive = totalQuestions === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setTotalQuestions(n)}
                  className={`relative rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {n} câu
                  {n === 50 && (
                    <span
                      className={`absolute -top-2 -right-2 flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive
                          ? 'bg-white text-emerald-600'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <Sparkles className="h-3 w-3" />
                      THPT
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Difficulty distribution */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
              Phân bổ độ khó
            </p>

            <div className="mb-3 flex h-2.5 overflow-hidden rounded-full">
              {distribution.map((d) => (
                <div
                  key={d.key}
                  className={`${d.color} transition-all duration-300`}
                  style={{ width: `${d.ratio * 100}%` }}
                />
              ))}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-1.5">
              {distribution.map((d) => (
                <div key={d.key} className="flex items-center gap-1.5 text-sm text-gray-600">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${d.color}`} />
                  <span>
                    {d.label}:{' '}
                    <span className="font-semibold text-gray-800">{d.count} câu</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Estimated Time */}
        <div className="mb-8 flex items-center justify-center gap-2 text-gray-500">
          <Clock className="h-5 w-5 text-emerald-500" />
          <span className="text-sm">
            Thời gian ước tính:{' '}
            <span className="font-semibold text-gray-800">{estimatedMinutes} phút</span>
          </span>
        </div>

        {/* Start Button */}
        <div className="flex justify-center">
          <button
            type="button"
            disabled={noneSelected || isLoading}
            onClick={handleStart}
            className={`flex items-center gap-2.5 rounded-2xl px-10 py-4 text-lg font-bold shadow-lg transition-all duration-200 ${
              noneSelected
                ? 'cursor-not-allowed bg-gray-200 text-gray-400 shadow-none'
                : isLoading
                  ? 'cursor-wait bg-emerald-600 text-white/80 shadow-emerald-200'
                  : 'bg-emerald-600 text-white shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Đang chuẩn bị đề...
              </>
            ) : (
              <>
                <Play className="h-5 w-5" />
                Bắt đầu làm bài
              </>
            )}
          </button>
        </div>

        {noneSelected && (
          <p className="mt-3 text-center text-sm text-rose-500">
            Vui lòng chọn ít nhất một chủ đề để bắt đầu
          </p>
        )}
      </div>
    </div>
  );
}
