/**
 * Re-embed all knowledge chunks using gemini-embedding-001 (768 dims).
 * Run once after migrating the DB column from vector(1024) to vector(768).
 *
 * Usage: npx tsx scripts/re-embed-chunks.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaNeon(pool) } as any);

const GEMINI_EMBED_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-embedding-001:embedContent';

async function embed(text: string): Promise<number[]> {
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
    throw new Error(`Gemini embed ${res.status}: ${err?.error?.message ?? ''}`);
  }
  const data = await res.json() as any;
  return data.embedding.values as number[];
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not set');
    process.exit(1);
  }

  const chunks = await prisma.$queryRawUnsafe<{ id: string; content: string; source: string }[]>(
    `SELECT id, content, source FROM knowledge_chunks ORDER BY id`
  );

  console.log(`\nRe-embedding ${chunks.length} chunks with gemini-embedding-001 (768 dims)...\n`);

  let done = 0;
  let failed = 0;

  for (const chunk of chunks) {
    try {
      const embedding = await embed(chunk.content);
      const vectorStr = `[${embedding.join(',')}]`;

      await prisma.$executeRawUnsafe(
        `UPDATE knowledge_chunks SET embedding = $1::vector WHERE id = $2`,
        vectorStr,
        chunk.id,
      );

      done++;
      if (done % 10 === 0 || done === chunks.length) {
        process.stdout.write(`\r  Progress: ${done}/${chunks.length} embedded`);
      }

      // Small delay to avoid rate limiting (1500 req/min = 25/s, we do ~5/s)
      await new Promise(r => setTimeout(r, 200));
    } catch (e: any) {
      failed++;
      console.error(`\n  ❌ Failed chunk ${chunk.id} (${chunk.source}): ${e.message}`);
      if (e.message?.includes('429')) {
        console.log('  Rate limited, waiting 5s...');
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }

  console.log(`\n\n=== Done ===`);
  console.log(`✅ Embedded: ${done}/${chunks.length}`);
  if (failed > 0) console.log(`❌ Failed:   ${failed}`);

  // Verify
  const result = await prisma.$queryRawUnsafe<{ cnt: string }[]>(
    `SELECT COUNT(*) as cnt FROM knowledge_chunks WHERE embedding IS NOT NULL`
  );
  console.log(`\nDB verify: ${result[0].cnt} chunks with embedding`);
}

main()
  .catch((e) => { console.error('Fatal:', e.message); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
