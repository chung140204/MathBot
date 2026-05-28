import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaNeon(pool) } as any);

async function run() {
  const chunks = await prisma.knowledgeChunk.findMany({
    select: { id: true, topic: true, source: true, content: true },
    orderBy: { topic: 'asc' },
  });

  console.log(`\n=== RAG Knowledge Chunks ===`);
  console.log(`Total: ${chunks.length}\n`);

  for (const c of chunks) {
    const result: any[] = await prisma.$queryRawUnsafe(
      `SELECT (embedding IS NOT NULL) as has_embed FROM knowledge_chunks WHERE id = $1`,
      c.id,
    );
    const embed = result[0]?.has_embed ? '✅ embedded' : '❌ NO embedding';
    console.log(`[${c.topic}] ${c.source} — ${embed}`);
    console.log(`  ${c.content.slice(0, 100).replace(/\n/g, ' ')}...`);
    console.log();
  }

  await prisma.$disconnect();
  await pool.end();
}

run().catch((e) => { console.error(e); process.exit(1); });
