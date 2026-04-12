import { Difficulty, Topic } from '@prisma/client';
import prisma from '@/lib/db';
import { AppError, ErrorCode } from '@/lib/errors';

export interface ExamConfig {
  topics: string[];
  totalQuestions: number;
  difficultyWeights?: Record<string, number>;
}

export interface ExamQuestion {
  id: string;
  content: string;
  format: string;
  options?: Record<string, string>;
  topic: string;
  difficulty: string;
  imageUrl?: string;
  optionAImageUrl?: string;
  optionBImageUrl?: string;
  optionCImageUrl?: string;
  optionDImageUrl?: string;
  statementA?: string;
  statementB?: string;
  statementC?: string;
  statementD?: string;
  statementAImageUrl?: string;
  statementBImageUrl?: string;
  statementCImageUrl?: string;
  statementDImageUrl?: string;
}

const DEFAULT_WEIGHTS: Record<string, number> = {
  RECOGNITION: 0.4,
  COMPREHENSION: 0.3,
  APPLICATION: 0.2,
  ADVANCED: 0.1,
};

const MINIMUM_QUESTIONS = 10;

const SAFE_SELECT = {
  id: true,
  content: true,
  format: true,
  options: true,
  topic: true,
  difficulty: true,
  imageUrl: true,
  optionAImageUrl: true,
  optionBImageUrl: true,
  optionCImageUrl: true,
  optionDImageUrl: true,
  statementA: true,
  statementB: true,
  statementC: true,
  statementD: true,
  statementAImageUrl: true,
  statementBImageUrl: true,
  statementCImageUrl: true,
  statementDImageUrl: true,
} as const;

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function calcDistribution(total: number, weights: Record<string, number>): Record<string, number> {
  const keys = Object.keys(weights);
  const dist: Record<string, number> = {};
  let assigned = 0;

  for (let i = 0; i < keys.length; i++) {
    if (i === keys.length - 1) {
      dist[keys[i]] = total - assigned;
    } else {
      dist[keys[i]] = Math.round(total * weights[keys[i]]);
      assigned += dist[keys[i]];
    }
  }
  return dist;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toExamQuestion(row: any): ExamQuestion {
  const q: ExamQuestion = {
    id: row.id,
    content: row.content,
    format: row.format,
    topic: row.topic,
    difficulty: row.difficulty,
  };
  if (row.options) q.options = row.options as Record<string, string>;
  if (row.imageUrl) q.imageUrl = row.imageUrl;
  if (row.optionAImageUrl) q.optionAImageUrl = row.optionAImageUrl;
  if (row.optionBImageUrl) q.optionBImageUrl = row.optionBImageUrl;
  if (row.optionCImageUrl) q.optionCImageUrl = row.optionCImageUrl;
  if (row.optionDImageUrl) q.optionDImageUrl = row.optionDImageUrl;
  if (row.statementA) q.statementA = row.statementA;
  if (row.statementB) q.statementB = row.statementB;
  if (row.statementC) q.statementC = row.statementC;
  if (row.statementD) q.statementD = row.statementD;
  if (row.statementAImageUrl) q.statementAImageUrl = row.statementAImageUrl;
  if (row.statementBImageUrl) q.statementBImageUrl = row.statementBImageUrl;
  if (row.statementCImageUrl) q.statementCImageUrl = row.statementCImageUrl;
  if (row.statementDImageUrl) q.statementDImageUrl = row.statementDImageUrl;
  return q;
}

export async function generateExamQuestions(config: ExamConfig): Promise<ExamQuestion[]> {
  const { topics, totalQuestions, difficultyWeights } = config;
  const weights = difficultyWeights ?? DEFAULT_WEIGHTS;
  const distribution = calcDistribution(totalQuestions, weights);

  const totalAvailable = await prisma.question.count({
    where: { isActive: true, topic: { in: topics as Topic[] } },
  });

  if (totalAvailable < MINIMUM_QUESTIONS) {
    throw new AppError(
      `Không đủ câu hỏi. Tìm thấy ${totalAvailable}, cần ít nhất ${MINIMUM_QUESTIONS}.`,
      ErrorCode.EXAM_INSUFFICIENT_QUESTIONS,
      400,
      { available: totalAvailable, minimum: MINIMUM_QUESTIONS },
    );
  }

  const selectedIds = new Set<string>();
  const selected: ExamQuestion[] = [];

  for (const [difficulty, count] of Object.entries(distribution)) {
    if (count <= 0) continue;

    const perTopic = Math.floor(count / topics.length);
    const remainder = count % topics.length;
    let collected: ExamQuestion[] = [];

    for (let t = 0; t < topics.length; t++) {
      const needed = perTopic + (t < remainder ? 1 : 0);
      if (needed <= 0) continue;

      const candidates = await prisma.question.findMany({
        where: {
          isActive: true,
          topic: topics[t] as Topic,
          difficulty: difficulty as Difficulty,
          id: { notIn: Array.from(selectedIds) },
        },
        select: SAFE_SELECT,
      });

      const picked = shuffle(candidates).slice(0, needed);
      for (const q of picked) {
        selectedIds.add(q.id);
        collected.push(toExamQuestion(q));
      }
    }

    // Fallback: fill shortfall from any topic/difficulty
    const shortfall = count - collected.length;
    if (shortfall > 0) {
      const fallback = await prisma.question.findMany({
        where: {
          isActive: true,
          topic: { in: topics as Topic[] },
          id: { notIn: Array.from(selectedIds) },
        },
        select: SAFE_SELECT,
      });

      const picked = shuffle(fallback).slice(0, shortfall);
      for (const q of picked) {
        selectedIds.add(q.id);
        collected.push(toExamQuestion(q));
      }
    }

    selected.push(...collected);
  }

  if (selected.length < MINIMUM_QUESTIONS) {
    throw new AppError(
      `Chỉ chọn được ${selected.length} câu hỏi, cần ít nhất ${MINIMUM_QUESTIONS}.`,
      ErrorCode.EXAM_INSUFFICIENT_QUESTIONS,
      400,
      { selected: selected.length, minimum: MINIMUM_QUESTIONS },
    );
  }

  return shuffle(selected);
}
