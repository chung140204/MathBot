import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';
import { ErrorCode } from './errors';

/**
 * Distributed rate limiting backed by Upstash Redis.
 *
 * Graceful degradation: if UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are
 * not set (local dev, CI, Docker build with placeholder envs), all limiters become
 * no-ops that always allow — so `npm run build` and dev keep working without Upstash.
 */

type WindowArg = Parameters<typeof Ratelimit.slidingWindow>[1];

interface LimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  pending: Promise<unknown>;
}

interface Limiter {
  limit(identifier: string): Promise<LimitResult>;
}

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis: Redis | null = url && token ? new Redis({ url, token }) : null;

if (!redis) {
  console.warn('[rate-limit] Upstash env vars missing — rate limiting DISABLED');
}

function makeLimiter(tokens: number, window: WindowArg, prefix: string): Limiter {
  if (redis) {
    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(tokens, window),
      prefix,
      analytics: false,
    });
  }
  // No-op limiter: always allow.
  return {
    async limit(): Promise<LimitResult> {
      return { success: true, limit: tokens, remaining: tokens, reset: 0, pending: Promise.resolve() };
    },
  };
}

/** Login + register: 5 requests / 60s. */
export const authLimiter = makeLimiter(5, '60 s', 'rl:auth');
/** Chat (AI): 20 requests / 60s. */
export const aiLimiter = makeLimiter(20, '60 s', 'rl:ai');
/** OCR (expensive): 10 requests / 60s. */
export const ocrLimiter = makeLimiter(10, '60 s', 'rl:ocr');

type HeaderBag =
  | Headers
  | Record<string, string | string[] | undefined>
  | undefined;

function readHeader(headers: HeaderBag, key: string): string | null {
  if (!headers) return null;
  if (typeof (headers as Headers).get === 'function') {
    return (headers as Headers).get(key);
  }
  const bag = headers as Record<string, string | string[] | undefined>;
  const value = bag[key] ?? bag[key.toLowerCase()];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

/**
 * Extract the client IP from a request. Works with both `NextRequest` (Headers object)
 * and the NextAuth `authorize` req (plain headers object).
 */
export function getClientIp(req: { headers?: HeaderBag } | undefined): string {
  const headers = req?.headers;
  const forwarded = readHeader(headers, 'x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  const realIp = readHeader(headers, 'x-real-ip');
  if (realIp) return realIp.trim();
  return 'unknown';
}

/**
 * Check a limiter and return a ready-to-send 429 response when blocked, or `null`
 * when the request is allowed.
 */
export async function enforceRateLimit(
  limiter: Limiter,
  identifier: string,
): Promise<NextResponse | null> {
  const { success } = await limiter.limit(identifier);
  if (success) return null;
  return NextResponse.json(
    { error: 'Quá nhiều yêu cầu, vui lòng thử lại sau.', code: ErrorCode.RATE_LIMITED },
    { status: 429, headers: { 'Retry-After': '60' } },
  );
}
