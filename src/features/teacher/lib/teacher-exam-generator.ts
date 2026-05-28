import { Difficulty, QuestionFormat, Topic } from '@prisma/client';
import prisma from '@/shared/lib/db';
import { AppError, ErrorCode } from '@/shared/lib/errors';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface PoolQuestion {
  id: string;
  content: string;
  format: QuestionFormat;
  options: unknown;
  topic: Topic;
  difficulty: Difficulty;
  imageUrl: string | null;
  optionAImageUrl: string | null;
  optionBImageUrl: string | null;
  optionCImageUrl: string | null;
  optionDImageUrl: string | null;
  statementA: string | null;
  statementB: string | null;
  statementC: string | null;
  statementD: string | null;
  statementAImageUrl: string | null;
  statementBImageUrl: string | null;
  statementCImageUrl: string | null;
  statementDImageUrl: string | null;
}

export interface GenerateStats {
  byTopic: Record<string, number>;
  byDifficulty: Record<string, number>;
  byFormat: Record<string, number>;
  total: number;
  poolSize: number;
}

export interface GenerateResult {
  questions: PoolQuestion[];
  stats: GenerateStats;
}

export interface GenerateRequest {
  mode: 'thpt' | 'custom';
  teacherId: string;
  source: 'all' | 'mine' | 'system';
  topics?: Topic[];
  totalQuestions?: number;
  difficultyWeights?: Record<string, number>;
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
  ...Array(4).fill({ format: 'MULTIPLE_CHOICE' as const, difficulty: 'RECOGNITION' as const }),
  ...Array(4).fill({ format: 'MULTIPLE_CHOICE' as const, difficulty: 'COMPREHENSION' as const }),
  ...Array(3).fill({ format: 'MULTIPLE_CHOICE' as const, difficulty: 'APPLICATION' as const }),
  { format: 'MULTIPLE_CHOICE', difficulty: 'ADVANCED' },
  // Part II: 4 TF (1 REC + 1 COM + 1 APP + 1 ADV)
  { format: 'TRUE_FALSE', difficulty: 'RECOGNITION' },
  { format: 'TRUE_FALSE', difficulty: 'COMPREHENSION' },
  { format: 'TRUE_FALSE', difficulty: 'APPLICATION' },
  { format: 'TRUE_FALSE', difficulty: 'ADVANCED' },
  // Part III: 6 SA (2 REC + 2 COM + 1 APP + 1 ADV)
  ...Array(2).fill({ format: 'SHORT_ANSWER' as const, difficulty: 'RECOGNITION' as const }),
  ...Array(2).fill({ format: 'SHORT_ANSWER' as const, difficulty: 'COMPREHENSION' as const }),
  { format: 'SHORT_ANSWER', difficulty: 'APPLICATION' },
  { format: 'SHORT_ANSWER', difficulty: 'ADVANCED' },
];

const SAFE_SELECT = {
  id: true, content: true, format: true, options: true, topic: true, difficulty: true,
  imageUrl: true, optionAImageUrl: true, optionBImageUrl: true, optionCImageUrl: true, optionDImageUrl: true,
  statementA: true, statementB: true, statementC: true, statementD: true,
  statementAImageUrl: true, statementBImageUrl: true, statementCImageUrl: true, statementDImageUrl: true,
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

function computeStats(questions: PoolQuestion[], poolSize: number): GenerateStats {
  const byTopic: Record<string, number> = {};
  const byDifficulty: Record<string, number> = {};
  const byFormat: Record<string, number> = {};
  for (const q of questions) {
    byTopic[q.topic] = (byTopic[q.topic] ?? 0) + 1;
    byDifficulty[q.difficulty] = (byDifficulty[q.difficulty] ?? 0) + 1;
    byFormat[q.format] = (byFormat[q.format] ?? 0) + 1;
  }
  return { byTopic, byDifficulty, byFormat, total: questions.length, poolSize };
}

// ─── Pool fetcher ───────────────────────────────────────────────────────────────

async function fetchPool(teacherId: string, source: 'all' | 'mine' | 'system'): Promise<PoolQuestion[]> {
  const ownerFilter =
    source === 'mine' ? { createdById: teacherId } :
    source === 'system' ? { createdById: null } :
    { OR: [{ createdById: teacherId }, { createdById: null }] };

  return prisma.question.findMany({
    where: { ...ownerFilter, isActive: true },
    select: SAFE_SELECT,
  }) as unknown as PoolQuestion[];
}

// ─── THPT Mode ──────────────────────────────────────────────────────────────────

async function generateThpt(teacherId: string, source: 'all' | 'mine' | 'system', topics?: Topic[]): Promise<GenerateResult> {
  const pool = await fetchPool(teacherId, source);
  if (pool.length < 22) {
    throw new AppError('Không đủ câu hỏi', ErrorCode.EXAM_INSUFFICIENT_QUESTIONS, 400, { available: pool.length, needed: 22 });
  }

  // Build topic assignments for 22 slots
  const topicList = topics && topics.length > 0 ? topics : ALL_TOPICS;
  const topicPool: Topic[] = [];
  // Each topic gets 2 slots; first topic (FUNCTIONS-like) gets 3 if enough topics
  for (const t of topicList) topicPool.push(t, t);
  if (topicList.length > 1) topicPool.push(topicList[0]); // first topic gets extra
  // Ensure we have at least 22 topic assignments
  while (topicPool.length < 22) {
    topicPool.push(topicList[topicPool.length % topicList.length]);
  }
  const shuffledTopics = shuffle(topicPool).slice(0, 22);

  const usedIds = new Set<string>();
  const selected: PoolQuestion[] = [];

  for (let i = 0; i < THPT_SLOTS.length; i++) {
    const slot = THPT_SLOTS[i];
    const topic = shuffledTopics[i];

    // Fallback cascade — all in-memory
    const pick = (candidates: PoolQuestion[]) => {
      const valid = shuffle(candidates.filter(q => !usedIds.has(q.id)));
      return valid[0] ?? null;
    };

    let q: PoolQuestion | null = null;

    // Level 0: exact match
    q = pick(pool.filter(p => p.format === slot.format && p.difficulty === slot.difficulty && p.topic === topic));
    // Level 1: relax difficulty
    if (!q) q = pick(pool.filter(p => p.format === slot.format && p.topic === topic));
    // Level 2: relax topic
    if (!q) q = pick(pool.filter(p => p.format === slot.format && p.difficulty === slot.difficulty));
    // Level 3: format only
    if (!q) q = pick(pool.filter(p => p.format === slot.format));

    if (q) {
      selected.push(q);
      usedIds.add(q.id);
    }
  }

  // Validate counts
  const mcCount = selected.filter(q => q.format === 'MULTIPLE_CHOICE').length;
  const tfCount = selected.filter(q => q.format === 'TRUE_FALSE').length;
  const saCount = selected.filter(q => q.format === 'SHORT_ANSWER').length;

  if (mcCount < 12 || tfCount < 4 || saCount < 6) {
    throw new AppError('Không đủ câu hỏi theo dạng', ErrorCode.EXAM_INSUFFICIENT_QUESTIONS, 400, {
      have: { mc: mcCount, tf: tfCount, sa: saCount },
      need: { mc: 12, tf: 4, sa: 6 },
      poolSize: pool.length,
    });
  }

  // Sort: MC → TF → SA, shuffle within each group
  const mc = shuffle(selected.filter(q => q.format === 'MULTIPLE_CHOICE'));
  const tf = shuffle(selected.filter(q => q.format === 'TRUE_FALSE'));
  const sa = shuffle(selected.filter(q => q.format === 'SHORT_ANSWER'));
  const final = [...mc, ...tf, ...sa];

  return { questions: final, stats: computeStats(final, pool.length) };
}

// ─── Custom Mode ────────────────────────────────────────────────────────────────

async function generateCustom(
  teacherId: string,
  source: 'all' | 'mine' | 'system',
  totalQuestions: number,
  topics: Topic[],
  difficultyWeights: Record<string, number>,
): Promise<GenerateResult> {
  const pool = await fetchPool(teacherId, source);
  // Filter pool to selected topics
  const topicPool = pool.filter(q => topics.includes(q.topic));

  if (topicPool.length === 0) {
    throw new AppError('Không có câu hỏi nào cho các chủ đề đã chọn', ErrorCode.EXAM_INSUFFICIENT_QUESTIONS, 400, { poolSize: 0, topics });
  }

  const dist = calcDistribution(totalQuestions, difficultyWeights);
  const usedIds = new Set<string>();
  const selected: PoolQuestion[] = [];

  // For each difficulty level, distribute across topics
  for (const [diff, count] of Object.entries(dist)) {
    if (count <= 0) continue;
    const perTopic = Math.floor(count / topics.length);
    let remainder = count - perTopic * topics.length;

    for (const topic of shuffle([...topics])) {
      const need = perTopic + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;

      // Filter from pool
      const candidates = shuffle(topicPool.filter(q =>
        q.difficulty === diff && q.topic === topic && !usedIds.has(q.id)
      ));

      const take = candidates.slice(0, need);
      for (const q of take) { selected.push(q); usedIds.add(q.id); }
    }

    // Fallback: if still short for this difficulty, take from any topic in pool
    const needed = count - selected.filter(q => q.difficulty === diff).length;
    if (needed > 0) {
      const fallback = shuffle(topicPool.filter(q =>
        q.difficulty === diff && !usedIds.has(q.id)
      )).slice(0, needed);
      for (const q of fallback) { selected.push(q); usedIds.add(q.id); }
    }
  }

  // Final fallback: if still short overall, take any unused from pool
  if (selected.length < totalQuestions) {
    const remaining = totalQuestions - selected.length;
    const fallback = shuffle(topicPool.filter(q => !usedIds.has(q.id))).slice(0, remaining);
    for (const q of fallback) { selected.push(q); usedIds.add(q.id); }
  }

  // Minimum viable: at least 50% of requested or 5
  const minViable = Math.min(5, Math.ceil(totalQuestions * 0.5));
  if (selected.length < minViable) {
    throw new AppError('Không đủ câu hỏi', ErrorCode.EXAM_INSUFFICIENT_QUESTIONS, 400, {
      available: topicPool.length,
      selected: selected.length,
      requested: totalQuestions,
    });
  }

  return { questions: shuffle(selected), stats: computeStats(selected, topicPool.length) };
}

// ─── Public entry point ─────────────────────────────────────────────────────────

export async function generateExamSetForTeacher(req: GenerateRequest): Promise<GenerateResult> {
  if (req.mode === 'thpt') {
    return generateThpt(req.teacherId, req.source, req.topics);
  }
  return generateCustom(
    req.teacherId,
    req.source,
    req.totalQuestions ?? 30,
    req.topics && req.topics.length > 0 ? req.topics : ALL_TOPICS,
    req.difficultyWeights ?? DEFAULT_WEIGHTS,
  );
}
