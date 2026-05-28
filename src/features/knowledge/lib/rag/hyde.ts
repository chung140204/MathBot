import OpenAI from 'openai';

const gemini = process.env.GEMINI_API_KEY
  ? new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    })
  : null;

const groq = process.env.GROQ_API_KEY
  ? new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    })
  : null;

const nvidia = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});

/**
 * HyDE — Hypothetical Document Embeddings.
 *
 * Generates a short hypothetical answer (2–3 sentences) for the given math query.
 * Embedding this answer instead of the raw query significantly improves cosine
 * similarity with knowledge chunks (which are written in document style, not query style).
 *
 * Returns null on timeout (2.5s) or any LLM error — caller falls back to raw query.
 */
export async function generateHypotheticalAnswer(query: string): Promise<string | null> {
  const controller = new AbortController();
  const HYDE_TIMEOUT_MS = parseInt(process.env.HYDE_TIMEOUT_MS || '2500', 10);
  const timeout = setTimeout(() => controller.abort(), HYDE_TIMEOUT_MS);

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
        temperature: 0.1,
        max_tokens: 200,
        messages: [
          {
            role: 'system',
            content:
              'Trả lời ngắn gọn bằng tiếng Việt kỹ thuật. KHÔNG chào hỏi. Viết ngay 2–3 câu nêu công thức và phương pháp chính cho câu hỏi toán THPT. Ví dụ: "Nguyên hàm của f(x) tính bằng ∫f(x)dx + C. Dùng bảng nguyên hàm cơ bản hoặc tích phân từng phần."',
          },
          {
            role: 'user',
            content: `Câu hỏi toán: ${query}`,
          },
        ],
      },
      { signal: controller.signal },
    );

    return res.choices[0]?.message?.content?.trim() ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
