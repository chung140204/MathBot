import OpenAI from 'openai';

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
  ],
  INTEGRALS: [
    'tích phân', 'nguyên hàm', 'diện tích hình phẳng',
    'thể tích tròn xoay', '∫', 'newton-leibniz',
    'đổi biến', 'từng phần', 'tích phân xác định',
  ],
  FUNCTIONS: [
    'hàm số', 'đồ thị', 'tương giao', 'bậc 3', 'bậc 4',
    'phân thức', 'trùng phương', 'số nghiệm',
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

// ── Topic Classification Cache ───────────────────────────────────────
const TOPIC_CACHE_MAX = 200;
const TOPIC_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface TopicCacheEntry {
  topic: string | null;
  expiresAt: number;
}

const topicCache = new Map<string, TopicCacheEntry>();

function topicCacheKey(msg: string): string {
  return msg.toLowerCase().trim().slice(0, 500);
}

const CLASSIFICATION_PROMPT = `Phân loại câu hỏi toán THPT vào ĐÚNG 1 chủ đề. Chỉ trả về TÊN chủ đề hoặc "NONE".

Các chủ đề:
- DERIVATIVES: đạo hàm, cực trị, tiếp tuyến, bảng biến thiên, đồng biến, nghịch biến
- INTEGRALS: tích phân, nguyên hàm, diện tích hình phẳng
- FUNCTIONS: hàm số, đồ thị, tương giao, số nghiệm phương trình
- LIMITS: giới hạn, liên tục
- COMPLEX_NUMBERS: số phức, phần thực, phần ảo, mô-đun
- PROBABILITY: xác suất, tổ hợp, chỉnh hợp, hoán vị
- SEQUENCES: cấp số cộng, cấp số nhân, dãy số
- EXPONENTIAL_LOG: mũ, logarit, phương trình mũ/logarit, lãi suất
- VOLUME: thể tích, hình chóp, hình trụ, hình nón, lăng trụ
- ANALYTIC_GEOMETRY: đường thẳng, đường tròn, elip, tọa độ Oxy
- SOLID_GEOMETRY: hình học không gian, vuông góc mặt phẳng, Oxyz`;

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
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestScore >= 1 ? bestTopic : null;
}

async function classifyTopicWithLLM(message: string): Promise<string | null> {
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
        max_tokens: 20,
        messages: [
          { role: 'system', content: CLASSIFICATION_PROMPT },
          { role: 'user', content: message },
        ],
      },
      { signal: controller.signal },
    );

    const raw = res.choices[0]?.message?.content?.trim().toUpperCase();
    if (!raw || raw === 'NONE') return null;
    return VALID_TOPICS.has(raw) ? raw : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function smartClassifyTopic(message: string): Promise<string | null> {
  const key = topicCacheKey(message);
  const cached = topicCache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    console.log('[Router] Cache hit:', cached.topic);
    return cached.topic;
  }

  const llmTopic = await classifyTopicWithLLM(message);
  const result = llmTopic ?? classifyTopic(message);

  if (llmTopic) {
    console.log('[Router] LLM classified:', llmTopic);
  } else {
    console.log('[Router] Keyword fallback:', result);
  }

  // Evict oldest if full
  if (topicCache.size >= TOPIC_CACHE_MAX) {
    const oldest = topicCache.keys().next().value;
    if (oldest !== undefined) topicCache.delete(oldest);
  }
  topicCache.set(key, { topic: result, expiresAt: Date.now() + TOPIC_CACHE_TTL_MS });

  return result;
}
