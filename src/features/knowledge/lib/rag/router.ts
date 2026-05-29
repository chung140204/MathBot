import OpenAI from 'openai';
import type { ClassifyResult, Difficulty } from './types';

const gemini = process.env.GEMINI_API_KEY
  ? new OpenAI({ apiKey: process.env.GEMINI_API_KEY, baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' })
  : null;

const groq = process.env.GROQ_API_KEY
  ? new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' })
  : null;

const nvidia = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});

const TOPIC_KEYWORDS: Record<string, string[]> = {
  DERIVATIVES: [
    'đạo hàm', "f'(x)", "y'", 'cực trị', 'cực đại', 'cực tiểu',
    'đồng biến', 'nghịch biến', 'tiếp tuyến', 'tiệm cận',
    'khảo sát', 'bảng biến thiên', 'điểm uốn', 'gtln', 'gtnn',
    'giá trị lớn nhất', 'giá trị nhỏ nhất',
    'lớn nhất', 'nhỏ nhất', 'tối ưu', 'tối đa', 'tối thiểu',
    'lợi nhuận', 'chi phí', 'doanh thu', 'sản xuất',
    'diện tích lớn nhất', 'thể tích lớn nhất',
  ],
  INTEGRALS: [
    'tích phân', 'nguyên hàm', 'diện tích hình phẳng',
    'thể tích tròn xoay', '∫', 'newton-leibniz',
    'đổi biến', 'từng phần', 'tích phân xác định',
  ],
  FUNCTIONS: [
    'hàm số', 'đồ thị', 'tương giao', 'bậc 3', 'bậc 4',
    'phân thức', 'trùng phương', 'số nghiệm',
    'F(x)', 'G(x)', 'f(x)', 'g(x)',
  ],
  LIMITS: [
    'giới hạn', 'lim', 'liên tục', 'vô cùng', 'vô định',
    'dãy số hội tụ',
  ],
  COMPLEX_NUMBERS: [
    'số phức', 'phần thực', 'phần ảo', 'mô-đun', 'liên hợp',
    'mặt phẳng phức', 'dạng lượng giác',
  ],
  PROBABILITY: [
    'xác suất', 'tổ hợp', 'chỉnh hợp', 'hoán vị', 'nhị thức',
    'biến cố', 'kỳ vọng', 'phương sai', 'phân phối',
  ],
  SEQUENCES: [
    'cấp số cộng', 'cấp số nhân', 'dãy số', 'công sai', 'công bội',
    'quy nạp',
  ],
  EXPONENTIAL_LOG: [
    'mũ', 'logarit', 'log', 'lũy thừa', 'lãi suất',
    'phương trình mũ', 'phương trình logarit',
  ],
  VOLUME: [
    'thể tích', 'hình chóp', 'hình trụ', 'hình nón', 'hình cầu',
    'lăng trụ', 'mặt cầu', 'khối đa diện', 'hình hộp',
  ],
  ANALYTIC_GEOMETRY: [
    'đường thẳng', 'đường tròn', 'elip', 'parabol', 'oxy',
    'tọa độ', 'tiếp tuyến đường tròn', 'phương trình đường',
  ],
  SOLID_GEOMETRY: [
    'hình học không gian', 'vuông góc mặt phẳng', 'song song',
    'góc nhị diện', 'chéo nhau', 'thiết diện', 'oxyz',
    'khoảng cách hai đường',
  ],
};

const VALID_TOPICS = new Set(Object.keys(TOPIC_KEYWORDS));
const VALID_DIFFICULTIES = new Set(['RECOGNITION', 'COMPREHENSION', 'APPLICATION', 'ADVANCED']);

// ── Difficulty (VDC) keyword heuristic ───────────────────────────────
// Sync fallback used when the LLM omits difficulty, and for fast-mode upgrade.
const VDC_PATTERNS: RegExp[] = [
  /tìm\s+(tất cả|mọi)\s+giá trị.*\bm\b/i,
  /\btham số\b/i,
  /f'\s*\(/i,
  /hàm hợp/i,
  /(gtln|gtnn|giá trị lớn nhất|giá trị nhỏ nhất|max|min).*(điều kiện|ràng buộc|đoạn|\[)/i,
  /số nghiệm.*(tham số|\bm\b)/i,
  /bao nhiêu giá trị nguyên/i,
];

export function classifyDifficultyKeywords(message: string): Difficulty | null {
  return VDC_PATTERNS.some((p) => p.test(message)) ? 'ADVANCED' : null;
}

// ── Topic Classification Cache ───────────────────────────────────────
const TOPIC_CACHE_MAX = 200;
const TOPIC_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface ClassifyCacheEntry {
  result: ClassifyResult;
  expiresAt: number;
}

const topicCache = new Map<string, ClassifyCacheEntry>();

function topicCacheKey(msg: string): string {
  return msg.toLowerCase().trim().slice(0, 500);
}

const CLASSIFICATION_PROMPT = `Phân loại câu hỏi toán THPT. Trả về theo ĐÚNG định dạng "TOPIC|DIFFICULTY" (không thêm gì khác).

TOPIC là MỘT trong các chủ đề sau (hoặc NONE):
- DERIVATIVES: đạo hàm, cực trị, tiếp tuyến, bảng biến thiên, đồng biến, nghịch biến, GTLN-GTNN
- INTEGRALS: tích phân, nguyên hàm, diện tích hình phẳng
- FUNCTIONS: hàm số, đồ thị, tương giao, số nghiệm phương trình
- LIMITS: giới hạn, liên tục
- COMPLEX_NUMBERS: số phức, phần thực, phần ảo, mô-đun
- PROBABILITY: xác suất, tổ hợp, chỉnh hợp, hoán vị
- SEQUENCES: cấp số cộng, cấp số nhân, dãy số
- EXPONENTIAL_LOG: mũ, logarit, phương trình mũ/logarit, lãi suất
- VOLUME: thể tích, hình chóp, hình trụ, hình nón, lăng trụ
- ANALYTIC_GEOMETRY: đường thẳng, đường tròn, elip, tọa độ Oxy
- SOLID_GEOMETRY: hình học không gian, vuông góc mặt phẳng, Oxyz

DIFFICULTY là MỘT trong: RECOGNITION | COMPREHENSION | APPLICATION | ADVANCED.
Chọn ADVANCED (vận dụng cao) khi: tìm tất cả/mọi giá trị tham số m; hàm hợp f(g(x)), đồ thị f'(x); GTLN/GTNN có điều kiện/ràng buộc; số nghiệm theo tham số; bài nhiều bước phối hợp nhiều kỹ thuật.

Ví dụ: "DERIVATIVES|ADVANCED", "PROBABILITY|APPLICATION", "NONE|RECOGNITION".`;

// Decisive keywords that strongly identify a topic — given extra weight so a
// generic word (e.g. "giá trị nhỏ nhất") cannot mis-route an Oxyz/số phức/… problem.
const STRONG_KEYWORDS: Record<string, string[]> = {
  SOLID_GEOMETRY: ['oxyz', 'trong không gian'],
  COMPLEX_NUMBERS: ['số phức'],
  PROBABILITY: ['xác suất', 'tổ hợp', 'chỉnh hợp', 'hoán vị'],
  INTEGRALS: ['tích phân', 'nguyên hàm'],
  EXPONENTIAL_LOG: ['logarit'],
};
const STRONG_WEIGHT = 3;

export function classifyTopic(message: string): string | null {
  const lower = message.toLowerCase();

  let bestTopic: string | null = null;
  let bestScore = 0;

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw.toLowerCase())) {
        score++;
      }
    }
    for (const kw of STRONG_KEYWORDS[topic] ?? []) {
      if (lower.includes(kw)) {
        score += STRONG_WEIGHT;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestScore >= 1 ? bestTopic : null;
}

function parseClassification(raw?: string): ClassifyResult {
  if (!raw) return { topic: null, difficulty: null };
  const parts = raw.trim().toUpperCase().split('|').map((s) => s.trim());
  const t = parts[0];
  const d = parts[1];
  const topic = t && t !== 'NONE' && VALID_TOPICS.has(t) ? t : null;
  const difficulty = d && VALID_DIFFICULTIES.has(d) ? (d as Difficulty) : null;
  return { topic, difficulty };
}

async function classifyWithLLM(message: string): Promise<ClassifyResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const client = gemini ?? groq ?? nvidia;
    const model = gemini
      ? 'gemini-2.5-flash'
      : groq
      ? (process.env.GROQ_FAST_MODEL || 'llama-3.1-8b-instant')
      : (process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct');

    const res = await client.chat.completions.create(
      {
        model,
        temperature: 0,
        max_tokens: 32,
        messages: [
          { role: 'system', content: CLASSIFICATION_PROMPT },
          { role: 'user', content: message },
        ],
      },
      { signal: controller.signal },
    );

    return parseClassification(res.choices[0]?.message?.content ?? undefined);
  } catch {
    return { topic: null, difficulty: null };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Classify a query into { topic, difficulty }.
 * Difficulty detection is gated by RAG_DIFFICULTY_AWARE (default on);
 * when off, difficulty is always null and topic logic is unchanged.
 */
export async function smartClassify(message: string): Promise<ClassifyResult> {
  const difficultyAware = process.env.RAG_DIFFICULTY_AWARE !== 'false';

  const key = topicCacheKey(message);
  const cached = topicCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    console.log('[Router] Cache hit:', cached.result.topic, cached.result.difficulty ?? '');
    return cached.result;
  }

  const llm = await classifyWithLLM(message);
  const topic = llm.topic ?? classifyTopic(message);
  const difficulty: Difficulty | null = difficultyAware
    ? (llm.difficulty ?? classifyDifficultyKeywords(message))
    : null;
  const result: ClassifyResult = { topic, difficulty };

  if (llm.topic) {
    console.log('[Router] LLM classified:', llm.topic, llm.difficulty ?? '(no diff)');
  } else {
    console.log('[Router] Keyword fallback:', topic);
  }

  // Evict oldest if full
  if (topicCache.size >= TOPIC_CACHE_MAX) {
    const oldest = topicCache.keys().next().value;
    if (oldest !== undefined) topicCache.delete(oldest);
  }
  topicCache.set(key, { result, expiresAt: Date.now() + TOPIC_CACHE_TTL_MS });

  return result;
}

/** Backward-compatible wrapper — returns only the topic. */
export async function smartClassifyTopic(message: string): Promise<string | null> {
  return (await smartClassify(message)).topic;
}
