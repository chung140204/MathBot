import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaNeon(pool) } as any);

async function run() {
  const total = await prisma.knowledgeChunk.count();

  const embedded: any[] = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*) as cnt FROM knowledge_chunks WHERE embedding IS NOT NULL`,
  );
  const notEmbedded: any[] = await prisma.$queryRawUnsafe(
    `SELECT COUNT(*) as cnt FROM knowledge_chunks WHERE embedding IS NULL`,
  );

  const byTopic = await prisma.knowledgeChunk.groupBy({
    by: ['topic'],
    _count: true,
    orderBy: { topic: 'asc' },
  });

  const sources = await prisma.knowledgeChunk.findMany({
    select: { source: true },
    distinct: ['source'],
    orderBy: { source: 'asc' },
  });

  console.log(`\n=== RAG Knowledge Base Status ===`);
  console.log(`Total chunks:      ${total}`);
  console.log(`With embedding:    ${Number(embedded[0].cnt)} ✅`);
  console.log(`Without embedding: ${Number(notEmbedded[0].cnt)} ❌`);
  console.log(`\nBy topic:`);
  for (const t of byTopic) {
    console.log(`  ${t.topic}: ${(t as any)._count}`);
  }
  console.log(`\nSources (${sources.length}):`);
  for (const s of sources) {
    console.log(`  - ${s.source}`);
  }

  await prisma.$disconnect();
  await pool.end();
}

run().catch((e) => { console.error(e); process.exit(1); });
