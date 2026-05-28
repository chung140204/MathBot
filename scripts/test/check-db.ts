import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter: new PrismaNeon(pool) } as any);

async function run() {
  const questions = await prisma.question.count();
  const byTopic = await prisma.question.groupBy({ by: ['topic'], _count: true });
  const chunks = await prisma.knowledgeChunk.count();

  console.log(`\n=== DB Status ===`);
  console.log(`Questions: ${questions}`);
  console.log(`Knowledge chunks: ${chunks}`);
  console.log(`\nBy topic:`);
  for (const t of byTopic) {
    console.log(`  ${t.topic}: ${(t as any)._count}`);
  }

  await prisma.$disconnect();
  await pool.end();
}

run().catch((e) => { console.error(e); process.exit(1); });
