import 'dotenv/config';
import { getCachedRag, setCachedRag, bustRagCache } from '../../src/features/knowledge/lib/rag/rag-cache';
import { cacheEnabled } from '../../src/shared/lib/cache';
import type { KnowledgeChunkResult } from '../../src/features/knowledge/lib/rag/types';

/**
 * Integration tests for the RAG result cache (Phase 2.3). Needs Upstash env
 * (UPSTASH_REDIS_REST_URL / _TOKEN); skips gracefully if the cache is disabled.
 *
 * Run: npx tsx scripts/test/check-rag-cache.ts
 */

let passed = 0;
let failed = 0;

function assert(label: string, cond: boolean): void {
  if (cond) { passed++; console.log(`  ✅ ${label}`); }
  else { failed++; console.log(`  ❌ ${label}`); }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// A unique probe query so the test never collides with real cached traffic.
const Q = `__test_cache_probe__ ${Date.now()}`;
const TOPIC = 'DERIVATIVES';

const fakeChunks: KnowledgeChunkResult[] = [
  { id: 'c1', content: 'đạo hàm của x^2 là 2x', topic: 'DERIVATIVES', source: 'TEST-1', similarity: 0.9 },
  { id: 'c2', content: 'quy tắc chuỗi', topic: 'DERIVATIVES', source: 'TEST-2', similarity: 0.7 },
];

async function main() {
  if (!cacheEnabled) {
    console.log('⚠️  Cache disabled (no Upstash env) — skipping RAG cache tests.');
    console.log('   The pipeline still works correctly; cache becomes a no-op.');
    process.exit(0);
  }

  console.log('\n[rag-cache] set → get round-trip:');
  let hit = await getCachedRag(Q, TOPIC);
  assert('cold lookup is a miss (null)', hit === null);

  await setCachedRag(Q, TOPIC, fakeChunks);
  await sleep(300); // let the write land
  hit = await getCachedRag(Q, TOPIC);
  assert('warm lookup returns chunks', Array.isArray(hit) && hit.length === 2);
  assert('chunk content preserved', hit?.[0]?.source === 'TEST-1' && hit?.[1]?.source === 'TEST-2');

  console.log('\n[rag-cache] query normalization (case / whitespace insensitive):');
  const messy = `  ${Q.toUpperCase()}   `; // upper + padded + double spaces
  const hitMessy = await getCachedRag(messy, TOPIC);
  assert('normalized variant hits the same entry', Array.isArray(hitMessy) && hitMessy.length === 2);

  console.log('\n[rag-cache] topic is part of the key (different topic → miss):');
  const otherTopic = await getCachedRag(Q, 'INTEGRALS');
  assert('different topic is a miss', otherTopic === null);

  console.log('\n[rag-cache] bustRagCache invalidates existing entries:');
  await bustRagCache();
  await sleep(300);
  const afterBust = await getCachedRag(Q, TOPIC);
  assert('entry unreachable after epoch bump', afterBust === null);

  console.log('\n[rag-cache] cache works again after bust (new epoch):');
  await setCachedRag(Q, TOPIC, fakeChunks);
  await sleep(300);
  const reCached = await getCachedRag(Q, TOPIC);
  assert('re-set + get works under new epoch', Array.isArray(reCached) && reCached.length === 2);

  console.log(`\n──────────────────────────────\nPASS ${passed} / ${passed + failed}`);
  if (failed > 0) { console.error(`FAILED ${failed} test case(s)`); process.exit(1); }
  console.log('All RAG cache test cases passed ✅');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
