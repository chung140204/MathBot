import { Topic } from '@prisma/client';
import { TOPIC_LABEL } from '@/shared/constants/topics';
import {
  THPT_WEIGHT,
  TOPIC_CATEGORY,
  TOPIC_DISPLAY,
  type TopicCategory,
} from '@/shared/constants/thpt-weights';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface TopicStats {
  topic: Topic;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number; // 0–100
  lastPracticed: Date | null;
}

export interface Suggestion {
  topic: string;
  label: string;
  reason: string;
  icon: string;
  accent: string;
  difficulty: string;
}

// ─── Scoring weights ────────────────────────────────────────────────────────

const W_WEAK = 0.40;
const W_STALE = 0.25;
const W_EXAM = 0.20;
const W_VARIETY = 0.15;

// ─── Signal functions ───────────────────────────────────────────────────────

function weaknessScore(stats: TopicStats | null): number {
  if (!stats) return 50; // no data = neutral
  const { accuracy } = stats;
  if (accuracy < 50) return Math.min(100, 100 - accuracy + 20);
  return 100 - accuracy;
}

function stalenessScore(stats: TopicStats | null): number {
  if (!stats || !stats.lastPracticed) return 70; // never practiced
  const days = Math.floor(
    (Date.now() - stats.lastPracticed.getTime()) / 86_400_000,
  );
  return Math.min(100, days * 5);
}

function examWeightScore(topic: Topic): number {
  return THPT_WEIGHT[topic] ?? 50;
}

/** Deterministic daily rotation based on userId + date string */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const ALL_TOPICS: Topic[] = [
  'FUNCTIONS',
  'DERIVATIVES',
  'EXPONENTIAL_LOG',
  'INTEGRALS',
  'SOLID_GEOMETRY',
  'ANALYTIC_GEOMETRY',
  'PROBABILITY',
  'VOLUME',
  'COMPLEX_NUMBERS',
  'SEQUENCES',
  'LIMITS',
];

function varietyBonus(topic: Topic, userId: string, dateStr: string): number {
  const seed = simpleHash(userId + dateStr);
  const pivot = seed % ALL_TOPICS.length;
  const idx = ALL_TOPICS.indexOf(topic);
  const distance = Math.min(
    Math.abs(idx - pivot),
    ALL_TOPICS.length - Math.abs(idx - pivot),
  );
  return Math.round(((ALL_TOPICS.length - distance) / ALL_TOPICS.length) * 100);
}

// ─── Difficulty suggestion ──────────────────────────────────────────────────

export function suggestDifficulty(stats: TopicStats | null): string {
  if (!stats || stats.totalQuestions < 5) return 'RECOGNITION';
  const { accuracy } = stats;
  if (accuracy >= 85) return 'ADVANCED';
  if (accuracy >= 70) return 'APPLICATION';
  if (accuracy >= 50) return 'COMPREHENSION';
  return 'RECOGNITION';
}

// ─── Reason text ────────────────────────────────────────────────────────────

function generateReason(
  topic: Topic,
  stats: TopicStats | null,
): string {
  if (!stats || stats.totalQuestions === 0) {
    return 'Bạn chưa luyện tập chủ đề này';
  }

  const { accuracy, lastPracticed } = stats;
  const days = lastPracticed
    ? Math.floor((Date.now() - lastPracticed.getTime()) / 86_400_000)
    : 999;

  if (accuracy < 40) return `Độ chính xác ${accuracy}% — cần ôn lại ngay`;
  if (accuracy < 60) return `Điểm yếu cần cải thiện (${accuracy}%)`;
  if (days > 14) return `Đã ${days} ngày chưa ôn — dễ quên`;
  if (days > 7) return 'Lâu chưa luyện tập, nên ôn lại';
  if (THPT_WEIGHT[topic] >= 80) return 'Chủ đề trọng tâm thi THPT';
  if (accuracy >= 85) return 'Thử thách mức độ khó hơn';
  return 'Ôn tập củng cố kiến thức';
}

// ─── Main algorithm ─────────────────────────────────────────────────────────

export function computeDailySuggestions(
  topicStatsMap: Map<Topic, TopicStats>,
  userId: string,
  dateStr?: string,
): Suggestion[] {
  const today = dateStr ?? new Date().toISOString().slice(0, 10);

  // Score each topic
  const scored = ALL_TOPICS.map((topic) => {
    const stats = topicStatsMap.get(topic) ?? null;
    const score =
      W_WEAK * weaknessScore(stats) +
      W_STALE * stalenessScore(stats) +
      W_EXAM * examWeightScore(topic) +
      W_VARIETY * varietyBonus(topic, userId, today);
    return { topic, stats, score };
  }).sort((a, b) => b.score - a.score);

  // Select top 3 with category diversity
  const selected: typeof scored = [];
  const usedCategories = new Set<TopicCategory>();

  // Pass 1: pick top from each unique category
  for (const item of scored) {
    if (selected.length >= 3) break;
    const cat = TOPIC_CATEGORY[item.topic];
    if (!usedCategories.has(cat)) {
      selected.push(item);
      usedCategories.add(cat);
    }
  }

  // Pass 2: fill remaining slots if we have < 3 (shouldn't happen with 3 categories)
  if (selected.length < 3) {
    for (const item of scored) {
      if (selected.length >= 3) break;
      if (!selected.includes(item)) {
        selected.push(item);
      }
    }
  }

  // Sort selected by score descending
  selected.sort((a, b) => b.score - a.score);

  return selected.map(({ topic, stats }) => {
    const display = TOPIC_DISPLAY[topic];
    return {
      topic,
      label: TOPIC_LABEL[topic],
      reason: generateReason(topic, stats),
      icon: display.icon,
      accent: display.accent,
      difficulty: suggestDifficulty(stats),
    };
  });
}
