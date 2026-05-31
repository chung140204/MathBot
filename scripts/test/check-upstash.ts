import 'dotenv/config';
import { Redis } from '@upstash/redis';

async function main() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  console.log('URL present:', !!url, '| TOKEN present:', !!token);
  if (!url || !token) {
    console.error('❌ Missing env vars — rate limiting would be DISABLED.');
    process.exit(1);
  }
  const redis = new Redis({ url, token });
  const key = '__mathbot_upstash_check__';
  await redis.set(key, 'ok', { ex: 30 });
  const val = await redis.get<string>(key);
  await redis.del(key);
  console.log('Round-trip set/get:', val);
  console.log(val === 'ok' ? '✅ Upstash connection OK — rate limiting will be ACTIVE.' : '❌ Unexpected value');
  process.exit(val === 'ok' ? 0 : 1);
}

main().catch((e) => {
  console.error('❌ Upstash connection FAILED:', e?.message ?? e);
  process.exit(1);
});
