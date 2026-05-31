import 'dotenv/config';
import { ragSearch } from '../../src/features/knowledge/lib/rag/pipeline';
import type { KnowledgeChunkResult } from '../../src/features/knowledge/lib/rag/types';

/**
 * Integration benchmark for the adaptive RAG pipeline. Needs a real .env
 * (DATABASE_URL + embedding/LLM keys) and a seeded knowledge base.
 *
 * Measures per-query RAG latency and shows which escalation path was taken
 * (watch the [RAG] logs printed by pipeline.ts). Use it to compare
 * before/after the latency changes, and to confirm the cheap path is fast
 * while VDC/follow-up queries still retrieve good chunks.
 *
 * Run: npx tsx scripts/test/bench-rag.ts
 */

interface Case {
  q: string;
  mode: 'fast' | 'thinking' | 'tutor';
  expect: string; // human-readable expected route
  history?: Array<{ role: string; content: string }>;
}

const CASES: Case[] = [
  // Cheap default path — no sub-LLM calls, should be the fastest.
  { q: 'Tính đạo hàm của hàm số y = x^3 - 3x^2 + 2', mode: 'tutor', expect: 'cheap (no rewrite/HyDE)' },
  { q: 'Tính tích phân từ 0 đến 1 của x^2 dx', mode: 'fast', expect: 'cheap (no rewrite/HyDE)' },

  // VDC / ADVANCED — forces HyDE + decomposition escalation.
  { q: 'Tìm tất cả giá trị của tham số m để hàm số y = x^3 - 3mx + 1 có 2 cực trị', mode: 'tutor', expect: 'escalate: HyDE (VDC)' },
  { q: 'Có bao nhiêu giá trị nguyên của m để phương trình có nghiệm', mode: 'thinking', expect: 'escalate: HyDE (VDC)' },

  // Follow-up — triggers query rewrite (+ LLM classify), needs history.
  {
    q: 'Giải thích thêm bước vừa rồi',
    mode: 'tutor',
    expect: 'escalate: rewrite (follow-up)',
    history: [
      { role: 'user', content: 'Tính đạo hàm của y = x^3 - 3x^2 + 2' },
      { role: 'assistant', content: "y' = 3x^2 - 6x = 3x(x - 2)." },
    ],
  },
];

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function runOnce(c: Case): Promise<{ ms: number; n: number; top?: string; score?: number; rewritten?: string }> {
  const t0 = performance.now();
  const result = await ragSearch(c.q, { mode: c.mode, history: c.history });
  const ms = Math.round(performance.now() - t0);
  const top = result.chunks[0] as (KnowledgeChunkResult & { finalScore?: number }) | undefined;
  return { ms, n: result.chunks.length, top: top?.source, score: top?.finalScore, rewritten: result.rewrittenQuery };
}

async function main() {
  console.log('Adaptive RAG benchmark — latency + retrieval per query');
  console.log('(non-follow-up queries run twice: COLD then WARM to show cache hit)\n');
  for (const c of CASES) {
    const cacheable = !c.history;
    const cold = await runOnce(c);
    console.log(`Q: ${c.q}`);
    console.log(`  mode=${c.mode}  expect=${c.expect}`);
    console.log(
      `  COLD → ${cold.ms}ms, ${cold.n} chunks, top=${cold.top ?? 'none'}` +
        `${cold.score !== undefined ? ` (score ${cold.score.toFixed(2)})` : ''}` +
        `${cold.rewritten ? `  rewritten="${cold.rewritten}"` : ''}`,
    );
    if (cacheable) {
      // The cache write is fire-and-forget in production; give it a moment to
      // land before the warm run so this demo reliably shows the hit.
      await sleep(400);
      const warm = await runOnce(c);
      const speedup = warm.ms > 0 ? (cold.ms / warm.ms).toFixed(1) : '∞';
      console.log(`  WARM → ${warm.ms}ms, ${warm.n} chunks  (${speedup}x faster — cache hit)`);
    } else {
      console.log('  (follow-up: not cached)');
    }
    console.log();
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
