import { cacheGetJson, cacheSetJson } from '@/shared/lib/cache';

/**
 * Lightweight circuit breaker backed by Upstash Redis.
 *
 * When an AI provider keeps failing (e.g. Gemini returns 429 because the daily
 * quota is exhausted), we "open the circuit": store a flag in Redis with a TTL.
 * While the flag exists, callers skip that provider entirely and go straight to
 * the fallback — no wasted retries/timeouts. When the TTL expires the flag
 * disappears on its own, so the next call tries the provider again (half-open):
 * if it works the circuit stays closed, if it fails it trips again.
 *
 * Graceful degradation: inherits cache.ts behaviour — when Redis is not
 * configured, `isProviderDown` is always false and `tripProvider` is a no-op,
 * so the system behaves exactly like before (always tries the primary provider).
 */

const DEFAULT_COOLDOWN_S = 5 * 60; // 5 minutes

function key(provider: string): string {
  return `ai:down:${provider}`;
}

/** True if the provider's circuit is currently open (provider considered down). */
export async function isProviderDown(provider: string): Promise<boolean> {
  return (await cacheGetJson<number>(key(provider))) !== null;
}

/** Open the circuit for `provider` for `cooldownSeconds` (auto-recovers on expiry). */
export async function tripProvider(
  provider: string,
  cooldownSeconds: number = DEFAULT_COOLDOWN_S,
): Promise<void> {
  await cacheSetJson(key(provider), 1, cooldownSeconds);
  console.warn(`[circuit-breaker] ${provider} marked DOWN for ${cooldownSeconds}s`);
}
