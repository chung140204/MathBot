import { cacheGetJson, cacheSetJson } from '@/shared/lib/cache';
import type { KnowledgeChunkResult } from './types';

/**
 * Short-TTL cache for final RAG retrieval results.
 *
 * Math questions repeat heavily across students (same textbook / exam problems),
 * so caching the reranked chunks for a normalized query skips the whole retrieval
 * stage (embed + vector + keyword + rerank, and any HyDE escalation) on a hit.
 *
 * Only the deterministic, non-follow-up path is cached — follow-ups depend on the
 * conversation history and an LLM rewrite, so they are never cached.
 *
 * Invalidation: the cache key embeds a global "epoch". Bumping the epoch
 * (`bustRagCache`, called after knowledge ingest) makes every existing key
 * unreachable; the old entries then expire on their own TTL. The epoch is itself
 * cached in-memory for a short window so the common path is a single Redis GET.
 */

const RAG_CACHE_TTL_S = parseInt(process.env.RAG_CACHE_TTL_S || '900', 10); // 15 min
const EPOCH_KEY = 'rag:epoch';
const EPOCH_TTL_S = 365 * 24 * 60 * 60; // 1 year — effectively persistent
const EPOCH_MEMO_MS = 60 * 1000; // re-read the epoch from Redis at most once/min

interface CachedRag {
  chunks: KnowledgeChunkResult[];
}

let epochMemo: { value: number; expiresAt: number } | null = null;

async function getEpoch(): Promise<number> {
  const now = Date.now();
  if (epochMemo && now < epochMemo.expiresAt) return epochMemo.value;
  const value = (await cacheGetJson<number>(EPOCH_KEY)) ?? 0;
  epochMemo = { value, expiresAt: now + EPOCH_MEMO_MS };
  return value;
}

// Small, dependency-free string hash (FNV-1a, 32-bit). A cache key only needs
// to be stable and collision-resistant enough for short-lived RAG results —
// cryptographic strength is unnecessary, and avoiding `crypto` keeps the bundler
// happy across runtimes.
function hashQuery(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

function buildKey(epoch: number, query: string, topic: string | null): string {
  const norm = query.toLowerCase().trim().replace(/\s+/g, ' ').slice(0, 500);
  return `rag:c:${epoch}:${topic ?? 'none'}:${hashQuery(norm)}`;
}

/** Look up cached chunks for a (query, topic) pair. Returns null on miss/disabled. */
export async function getCachedRag(
  query: string,
  topic: string | null,
): Promise<KnowledgeChunkResult[] | null> {
  const epoch = await getEpoch();
  const hit = await cacheGetJson<CachedRag>(buildKey(epoch, query, topic));
  return hit?.chunks ?? null;
}

/** Store reranked chunks for a (query, topic) pair. No-op when cache is disabled. */
export async function setCachedRag(
  query: string,
  topic: string | null,
  chunks: KnowledgeChunkResult[],
): Promise<void> {
  const epoch = await getEpoch();
  await cacheSetJson(buildKey(epoch, query, topic), { chunks }, RAG_CACHE_TTL_S);
}

/**
 * Invalidate every cached RAG result by advancing the epoch. Call after the
 * knowledge base changes (ingest / re-embed) so stale chunks aren't served.
 */
export async function bustRagCache(): Promise<void> {
  const current = (await cacheGetJson<number>(EPOCH_KEY)) ?? 0;
  await cacheSetJson(EPOCH_KEY, current + 1, EPOCH_TTL_S);
  epochMemo = null; // force a re-read on the next request
}
