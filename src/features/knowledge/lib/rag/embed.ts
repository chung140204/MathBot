import OpenAI from 'openai';

// Gemini embedding via REST API (OpenAI SDK does not support Gemini embeddings)
// Using outputDimensionality=768 to stay within pgvector HNSW/IVFFlat 2000-dim limit
const GEMINI_EMBED_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-embedding-001:embedContent';

// NVIDIA fallback client (used when GEMINI_API_KEY is not set)
const nvidiaClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});

const NVIDIA_EMBED_MODEL = process.env.EMBED_MODEL || 'nvidia/nv-embedqa-e5-v5';

// ── Embedding Cache (in-memory LRU) ──────────────────────────────────
const EMBED_CACHE_MAX = 500;
const EMBED_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface EmbedCacheEntry {
  embedding: number[];
  expiresAt: number;
}

const embedCache = new Map<string, EmbedCacheEntry>();

function getCachedEmbedding(text: string): number[] | null {
  const key = text.slice(0, 2000);
  const entry = embedCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    embedCache.delete(key);
    return null;
  }
  // LRU touch: delete + re-insert moves to end of iteration order
  embedCache.delete(key);
  embedCache.set(key, entry);
  return entry.embedding;
}

function setCachedEmbedding(text: string, embedding: number[]): void {
  const key = text.slice(0, 2000);
  if (embedCache.size >= EMBED_CACHE_MAX) {
    const oldest = embedCache.keys().next().value;
    if (oldest !== undefined) embedCache.delete(oldest);
  }
  embedCache.set(key, { embedding, expiresAt: Date.now() + EMBED_CACHE_TTL_MS });
}

async function geminiEmbed(text: string): Promise<number[]> {
  const key = process.env.GEMINI_API_KEY!;
  const res = await fetch(`${GEMINI_EMBED_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text: text.slice(0, 2000) }] },
      outputDimensionality: 768,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw Object.assign(
      new Error(`Gemini embed ${res.status}: ${err?.error?.message ?? ''}`),
      { status: res.status },
    );
  }
  const data = await res.json() as any;
  return data.embedding.values as number[];
}

async function nvidiaEmbed(text: string): Promise<number[]> {
  const response = await nvidiaClient.embeddings.create({
    model: NVIDIA_EMBED_MODEL,
    input: text.slice(0, 500),
    encoding_format: 'float',
    input_type: 'query',
  } as any);
  return response.data[0].embedding;
}

export async function createEmbedding(text: string): Promise<number[]> {
  if (process.env.GEMINI_API_KEY) {
    return geminiEmbed(text);
  }
  return nvidiaEmbed(text);
}

async function embedWithRetry(text: string): Promise<number[]> {
  const cached = getCachedEmbedding(text);
  if (cached) return cached;

  try {
    const result = await createEmbedding(text);
    setCachedEmbedding(text, result);
    return result;
  } catch (error: any) {
    if (error?.status === 429) {
      await new Promise((r) => setTimeout(r, 2000));
      const result = await createEmbedding(text);
      setCachedEmbedding(text, result);
      return result;
    }
    throw error;
  }
}

export async function createEmbeddings(
  texts: string[],
  concurrency: number = 2,
): Promise<number[][]> {
  if (texts.length === 0) return [];

  const results: number[][] = new Array(texts.length);

  // Deduplicate: map normalized text → list of original indices
  const uniqueMap = new Map<string, number[]>();
  texts.forEach((t, i) => {
    const key = t.slice(0, 2000);
    if (!uniqueMap.has(key)) uniqueMap.set(key, []);
    uniqueMap.get(key)!.push(i);
  });

  const uniqueTexts = [...uniqueMap.keys()];

  // Process in chunks of `concurrency` to limit parallel API calls
  for (let i = 0; i < uniqueTexts.length; i += concurrency) {
    const chunk = uniqueTexts.slice(i, i + concurrency);
    const embeddings = await Promise.all(chunk.map((text) => embedWithRetry(text)));

    chunk.forEach((text, chunkIdx) => {
      const indices = uniqueMap.get(text)!;
      for (const idx of indices) {
        results[idx] = embeddings[chunkIdx];
      }
    });
  }

  return results;
}
