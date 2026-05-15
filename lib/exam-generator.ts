import { Difficulty, QuestionFormat, Topic } from '@prisma/client';
import prisma from '@/lib/db';
import { AppError, ErrorCode } from '@/lib/errors';

// ─── Types ──────────────────────────────────────────────────────────────────────

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

export interface ExamResult {
  questions: ExamQuestion[];
  mode: 'quick' | 'standard' | 'thpt';
  timeLimit: number;        // seconds
  scoring: {
    pointPerMC: number;
    pointPerTFItem: number;
    pointPerSA: number;
    totalPoints: number;
  };
}

// ─── Constants ──────────────────────────────────────────────────────────────────

const DEFAULT_WEIGHTS: Record<string, number> = {
  RECOGNITION: 0.4,
  COMPREHENSION: 0.3,
  APPLICATION: 0.2,
  ADVANCED: 0.1,
};

const ALL_TOPICS: Topic[] = [
  'DERIVATIVES', 'INTEGRALS', 'FUNCTIONS', 'LIMITS', 'COMPLEX_NUMBERS',
  'PROBABILITY', 'SEQUENCES', 'EXPONENTIAL_LOG', 'VOLUME',
  'ANALYTIC_GEOMETRY', 'SOLID_GEOMETRY',
] as Topic[];

/** THPT 2025 blueprint: 22 slots with fixed format × difficulty distribution */
const THPT_SLOTS: { format: QuestionFormat; difficulty: Difficulty }[] = [
  // Part I: 12 MC (4 REC + 4 COM + 3 APP + 1 ADV)
  { format: 'MULTIPLE_CHOICE', difficulty: 'RECOGNITION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'RECOGNITION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'RECOGNITION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'RECOGNITION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'COMPREHENSION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'COMPREHENSION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'COMPREHENSION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'COMPREHENSION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'APPLICATION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'APPLICATION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'APPLICATION' },
  { format: 'MULTIPLE_CHOICE', difficulty: 'ADVANCED' },
  // Part II: 4 TF (1 REC + 1 COM + 1 APP + 1 ADV)
  { format: 'TRUE_FALSE', difficulty: 'RECOGNITION' },
  { format: 'TRUE_FALSE', difficulty: 'COMPREHENSION' },
  { format: 'TRUE_FALSE', difficulty: 'APPLICATION' },
  { format: 'TRUE_FALSE', difficulty: 'ADVANCED' },
  // Part III: 6 SA (2 REC + 2 COM + 1 APP + 1 ADV)
  { format: 'SHORT_ANSWER', difficulty: 'RECOGNITION' },
  { format: 'SHORT_ANSWER', difficulty: 'RECOGNITION' },
  { format: 'SHORT_ANSWER', difficulty: 'COMPREHENSION' },
  { format: 'SHORT_ANSWER', difficulty: 'COMPREHENSION' },
  { format: 'SHORT_ANSWER', difficulty: 'APPLICATION' },
  { format: 'SHORT_ANSWER', difficulty: 'ADVANCED' },
];

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

// ─── Helpers ────────────────────────────────────────────────────────────────────

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

// ─── Quick Mode: 10 questions, 1 topic, optional difficulty ─────────────────

export async function generateQuickExam(
  topic: string,
  difficulty?: string
): Promise<ExamResult> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { isActive: true, topic: topic as Topic };
  if (difficulty) where.difficulty = difficulty as Difficulty;

  let candidates = await prisma.question.findMany({ where, select: SAFE_SELECT });

  // Fallback: remove difficulty filter if not enough
  if (candidates.length < 10 && difficulty) {
    candidates = await prisma.question.findMany({
      where: { isActive: true, topic: topic as Topic },
      select: SAFE_SELECT,
    });
  }

  if (candidates.length < 10) {
    throw new AppError(
      `Không đủ câu hỏi cho chủ đề này. Tìm thấy ${candidates.length}, cần ít nhất 10.`,
      ErrorCode.EXAM_INSUFFICIENT_QUESTIONS,
      400,
      { available: candidates.length, minimum: 10 },
    );
  }

  const questions = shuffle(candidates).slice(0, 10).map(toExamQuestion);

  return {
    questions,
    mode: 'quick',
    timeLimit: 20 * 60, // 20 minutes
    scoring: {
      pointPerMC: 1,
      pointPerTFItem: 0.25,
      pointPerSA: 1,
      totalPoints: 10,
    },
  };
}

// ─── Standard Mode: 30 questions, multi-topic, optional difficulty ──────────

export async function generateStandardExam(
  topics: string[],
  difficulty?: string
): Promise<ExamResult> {
  const totalQuestions = 30;
  const selectedIds = new Set<string>();
  const selected: ExamQuestion[] = [];

  if (difficulty) {
    // Single difficulty: distribute evenly across topics
    const perTopic = Math.floor(totalQuestions / topics.length);
    const remainder = totalQuestions % topics.length;

    for (let t = 0; t < topics.length; t++) {
      const needed = perTopic + (t < remainder ? 1 : 0);
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
        selected.push(toExamQuestion(q));
      }
    }

    // Fallback: fill shortfall without difficulty filter
    const shortfall = totalQuestions - selected.length;
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
        selected.push(toExamQuestion(q));
      }
    }
  } else {
    // All difficulties: use weighted distribution
    const weights = DEFAULT_WEIGHTS;
    const distribution = calcDistribution(totalQuestions, weights);

    for (const [diff, count] of Object.entries(distribution)) {
      if (count <= 0) continue;

      const perTopic = Math.floor(count / topics.length);
      const remainder = count % topics.length;

      for (let t = 0; t < topics.length; t++) {
        const needed = perTopic + (t < remainder ? 1 : 0);
        if (needed <= 0) continue;

        const candidates = await prisma.question.findMany({
          where: {
            isActive: true,
            topic: topics[t] as Topic,
            difficulty: diff as Difficulty,
            id: { notIn: Array.from(selectedIds) },
          },
          select: SAFE_SELECT,
        });

        const picked = shuffle(candidates).slice(0, needed);
        for (const q of picked) {
          selectedIds.add(q.id);
          selected.push(toExamQuestion(q));
        }
      }

      // Fallback per difficulty level
      const collected = selected.length;
      const expectedSoFar = Object.entries(distribution)
        .filter(([d]) => Object.keys(distribution).indexOf(d) <= Object.keys(distribution).indexOf(diff))
        .reduce((sum, [, c]) => sum + c, 0);
      const shortfall = expectedSoFar - collected;
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
          selected.push(toExamQuestion(q));
        }
      }
    }
  }

  if (selected.length < 10) {
    throw new AppError(
      `Chỉ tìm được ${selected.length} câu hỏi, cần ít nhất 10.`,
      ErrorCode.EXAM_INSUFFICIENT_QUESTIONS,
      400,
      { selected: selected.length, minimum: 10 },
    );
  }

  return {
    questions: shuffle(selected),
    mode: 'standard',
    timeLimit: 45 * 60, // 45 minutes
    scoring: {
      pointPerMC: 1,
      pointPerTFItem: 0.25,
      pointPerSA: 1,
      totalPoints: 30,
    },
  };
}

// ─── THPT Mode: 22 questions (12 MC + 4 TF + 6 SA), 90 minutes ────────────

export async function generateThptExam(): Promise<ExamResult> {
  // Step 1: Build topic pool (FUNCTIONS×3 + 10 others×2 = 23, take 22)
  const topicPool: Topic[] = [];
  for (const t of ALL_TOPICS) {
    topicPool.push(t);
    topicPool.push(t);
    if (t === 'FUNCTIONS') topicPool.push(t); // FUNCTIONS gets 3
  }
  const shuffledTopics = shuffle(topicPool).slice(0, THPT_SLOTS.length);

  // Step 2: Assign topic to each slot
  const slots = THPT_SLOTS.map((slot, i) => ({
    ...slot,
    topic: shuffledTopics[i],
  }));

  const selectedIds = new Set<string>();
  const selected: ExamQuestion[] = [];

  // Step 3: Fill each slot with a matching question (fallback cascade)
  for (const slot of slots) {
    let question: ExamQuestion | null = null;

    // Level 0: Exact match (format + difficulty + topic)
    const exact = await prisma.question.findMany({
      where: {
        isActive: true,
        format: slot.format,
        difficulty: slot.difficulty,
        topic: slot.topic,
        id: { notIn: Array.from(selectedIds) },
      },
      select: SAFE_SELECT,
      take: 10,
    });
    if (exact.length > 0) {
      question = toExamQuestion(shuffle(exact)[0]);
    }

    // Level 1: Relax difficulty (format + topic)
    if (!question) {
      const relaxDiff = await prisma.question.findMany({
        where: {
          isActive: true,
          format: slot.format,
          topic: slot.topic,
          id: { notIn: Array.from(selectedIds) },
        },
        select: SAFE_SELECT,
        take: 10,
      });
      if (relaxDiff.length > 0) {
        question = toExamQuestion(shuffle(relaxDiff)[0]);
      }
    }

    // Level 2: Relax topic (format + difficulty)
    if (!question) {
      const relaxTopic = await prisma.question.findMany({
        where: {
          isActive: true,
          format: slot.format,
          difficulty: slot.difficulty,
          id: { notIn: Array.from(selectedIds) },
        },
        select: SAFE_SELECT,
        take: 10,
      });
      if (relaxTopic.length > 0) {
        question = toExamQuestion(shuffle(relaxTopic)[0]);
      }
    }

    // Level 3: Format only (last resort)
    if (!question) {
      const formatOnly = await prisma.question.findMany({
        where: {
          isActive: true,
          format: slot.format,
          id: { notIn: Array.from(selectedIds) },
        },
        select: SAFE_SELECT,
        take: 10,
      });
      if (formatOnly.length > 0) {
        question = toExamQuestion(shuffle(formatOnly)[0]);
      }
    }

    if (question) {
      selectedIds.add(question.id);
      selected.push(question);
    }
  }

  // Step 4: Validate format counts
  const mcCount = selected.filter(q => q.format === 'MULTIPLE_CHOICE').length;
  const tfCount = selected.filter(q => q.format === 'TRUE_FALSE').length;
  const saCount = selected.filter(q => q.format === 'SHORT_ANSWER').length;

  if (mcCount < 12 || tfCount < 4 || saCount < 6) {
    throw new AppError(
      `Không đủ câu hỏi theo cấu trúc THPT. Cần: 12 TN + 4 ĐS + 6 TL. Có: ${mcCount} TN + ${tfCount} ĐS + ${saCount} TL.`,
      ErrorCode.EXAM_INSUFFICIENT_QUESTIONS,
      400,
      { mc: mcCount, tf: tfCount, sa: saCount },
    );
  }

  // Step 5: Sort by part order (MC → TF → SA), shuffle within each part
  const mcQuestions = shuffle(selected.filter(q => q.format === 'MULTIPLE_CHOICE'));
  const tfQuestions = shuffle(selected.filter(q => q.format === 'TRUE_FALSE'));
  const saQuestions = shuffle(selected.filter(q => q.format === 'SHORT_ANSWER'));
  const ordered = [...mcQuestions, ...tfQuestions, ...saQuestions];

  return {
    questions: ordered,
    mode: 'thpt',
    timeLimit: 90 * 60, // 90 minutes
    scoring: {
      pointPerMC: 0.25,
      pointPerTFItem: 0.25, // but THPT uses step scoring (handled in scoring.ts)
      pointPerSA: 0.5,
      totalPoints: 10,
    },
  };
}

// ─── Legacy function (kept for backward compatibility) ──────────────────────

export interface ExamConfig {
  topics: string[];
  totalQuestions: number;
  difficultyWeights?: Record<string, number>;
}

export async function generateExamQuestions(config: ExamConfig): Promise<ExamQuestion[]> {
  const { topics, totalQuestions, difficultyWeights } = config;
  const weights = difficultyWeights ?? DEFAULT_WEIGHTS;
  const distribution = calcDistribution(totalQuestions, weights);

  const totalAvailable = await prisma.question.count({
    where: { isActive: true, topic: { in: topics as Topic[] } },
  });

  if (totalAvailable < 10) {
    throw new AppError(
      `Không đủ câu hỏi. Tìm thấy ${totalAvailable}, cần ít nhất 10.`,
      ErrorCode.EXAM_INSUFFICIENT_QUESTIONS,
      400,
      { available: totalAvailable, minimum: 10 },
    );
  }

  const selectedIds = new Set<string>();
  const selected: ExamQuestion[] = [];

  for (const [difficulty, count] of Object.entries(distribution)) {
    if (count <= 0) continue;

    const perTopic = Math.floor(count / topics.length);
    const remainder = count % topics.length;
    const collected: ExamQuestion[] = [];

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

  if (selected.length < 10) {
    throw new AppError(
      `Chỉ chọn được ${selected.length} câu hỏi, cần ít nhất 10.`,
      ErrorCode.EXAM_INSUFFICIENT_QUESTIONS,
      400,
      { selected: selected.length, minimum: 10 },
    );
  }

  return shuffle(selected);
}
