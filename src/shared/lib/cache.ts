import { Redis } from '@upstash/redis';

/**
 * Generic JSON cache backed by Upstash Redis (L2 — persistent, shared across instances).
 *
 * Graceful degradation: if UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set,
 * every operation becomes a no-op (get → null, set → ignored), so the app keeps working
 * without Redis. All Redis errors are swallowed — a cache failure must never break a request.
 */

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis: Redis | null = url && token ? new Redis({ url, token }) : null;

export const cacheEnabled = redis !== null;

/** Read a JSON value. Returns null on miss, when disabled, or on any error. */
export async function cacheGetJson<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    return (await redis.get<T>(key)) ?? null;
  } catch (err) {
    console.warn('[cache] get failed:', (err as Error)?.message);
    return null;
  }
}

/** Write a JSON value with a TTL (seconds). No-op when disabled; errors are swallowed. */
export async function cacheSetJson<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (err) {
    console.warn('[cache] set failed:', (err as Error)?.message);
  }
}

/** Delete a cached key (used to invalidate stale data). No-op when disabled. */
export async function cacheDel(key: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    console.warn('[cache] del failed:', (err as Error)?.message);
  }
}

/**
 * Read-through cache: return the cached value for `key`, or run `producer()`,
 * store its result with `ttlSeconds`, and return it. On cache miss/disabled it
 * simply runs the producer, so behaviour is always correct.
 */
export async function getOrSetJson<T>(
  key: string,
  ttlSeconds: number,
  producer: () => Promise<T>,
): Promise<T> {
  const cached = await cacheGetJson<T>(key);
  if (cached !== null) return cached;
  const fresh = await producer();
  await cacheSetJson(key, fresh, ttlSeconds);
  return fresh;
}
