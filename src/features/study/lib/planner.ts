import { Topic } from '@prisma/client';
import { suggestDifficulty, type TopicStats } from '@/features/study/lib/daily';
import { THPT_WEIGHT, TOPIC_DISPLAY } from '@/shared/constants/thpt-weights';
import { TOPIC_LABEL } from '@/shared/constants/topics';

// ─── Topics ─────────────────────────────────────────────────────────────────

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

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FocusTopic {
  topic: Topic;
  label: string;
  accuracy: number;
  difficulty: string;
}

export interface StudyPlan {
  hasTarget: boolean;
  targetPct: number;
  currentPct: number;
  gapPct: number;
  dailyQuota: number;
  focusTopics: FocusTopic[];
}

export interface RoadmapItem {
  topic: Topic;
  label: string;
  icon: string;
  accent: string;
  accuracy: number;
  status: 'mastered' | 'learning' | 'todo';
  masteryTarget: number;
  recommendedDifficulty: string;
  priority: number;
}

// ─── Tuning constants ─────────────────────────────────────────────────────────

/** accuracy ≥ ngưỡng này (%) → coi như đã vững chủ đề; cũng là mốc mục tiêu. */
const MASTERY_THRESHOLD = 80;
/** accuracy ≥ ngưỡng này (%) → đang học; dưới ngưỡng coi như chưa bắt đầu. */
const LEARNING_THRESHOLD = 40;
/** Số chủ đề trọng tâm gợi ý mỗi ngày. */
const FOCUS_TOPIC_COUNT = 3;
/** Khoảng cách tới mục tiêu (điểm %) phân bậc số câu luyện/ngày. */
const QUOTA_LARGE_GAP_PCT = 30;
const QUOTA_MEDIUM_GAP_PCT = 15;
/** Số câu luyện đề xuất mỗi ngày theo từng bậc khoảng cách. */
const DAILY_QUOTA = { large: 15, medium: 10, small: 5, noTarget: 10 } as const;

// ─── Helpers ────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ─── Study plan ─────────────────────────────────────────────────────────────

export function computeStudyPlan(args: {
  statsMap: Map<Topic, TopicStats>;
  targetScore: string | null;
  averageScore: number;
}): StudyPlan {
  const { statsMap, targetScore, averageScore } = args;

  const parsed = parseFloat(targetScore ?? '');
  const hasTarget = targetScore != null && !Number.isNaN(parsed);

  const targetPct = hasTarget ? clamp(parsed * 10, 0, 100) : 0;
  const currentPct = Math.round(averageScore);
  const gapPct = hasTarget ? Math.max(0, targetPct - currentPct) : 0;

  let dailyQuota: number;
  if (!hasTarget) {
    dailyQuota = DAILY_QUOTA.noTarget;
  } else if (gapPct >= QUOTA_LARGE_GAP_PCT) {
    dailyQuota = DAILY_QUOTA.large;
  } else if (gapPct >= QUOTA_MEDIUM_GAP_PCT) {
    dailyQuota = DAILY_QUOTA.medium;
  } else {
    dailyQuota = DAILY_QUOTA.small;
  }

  const focusTopics: FocusTopic[] = ALL_TOPICS.map((topic) => {
    const stats = statsMap.get(topic) ?? null;
    const accuracy = stats?.accuracy ?? 0;
    const priority = (100 - accuracy) * (THPT_WEIGHT[topic] / 100);
    return { topic, stats, accuracy, priority };
  })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, FOCUS_TOPIC_COUNT)
    .map(({ topic, stats, accuracy }) => ({
      topic,
      label: TOPIC_LABEL[topic],
      accuracy,
      difficulty: suggestDifficulty(stats),
    }));

  return { hasTarget, targetPct, currentPct, gapPct, dailyQuota, focusTopics };
}

// ─── Roadmap ────────────────────────────────────────────────────────────────

export function computeRoadmap(
  statsMap: Map<Topic, TopicStats>,
): RoadmapItem[] {
  return ALL_TOPICS.map((topic) => {
    const stats = statsMap.get(topic) ?? null;
    const accuracy = stats?.accuracy ?? 0;
    const priority = (100 - accuracy) * (THPT_WEIGHT[topic] / 100);

    let status: 'mastered' | 'learning' | 'todo';
    if (!stats || stats.totalQuestions === 0) {
      status = 'todo';
    } else if (accuracy >= MASTERY_THRESHOLD) {
      status = 'mastered';
    } else if (accuracy >= LEARNING_THRESHOLD) {
      status = 'learning';
    } else {
      status = 'todo';
    }

    const display = TOPIC_DISPLAY[topic];

    return {
      topic,
      label: TOPIC_LABEL[topic],
      icon: display.icon,
      accent: display.accent,
      accuracy,
      status,
      masteryTarget: MASTERY_THRESHOLD,
      recommendedDifficulty: suggestDifficulty(stats),
      priority,
    };
  }).sort((a, b) => b.priority - a.priority);
}
