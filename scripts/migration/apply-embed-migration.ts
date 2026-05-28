import * as dotenv from 'dotenv';
dotenv.config({ path: '.env', override: true });

import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaNeon(pool) } as any);

async function main() {
  console.log('Applying embedding migration (→ vector(768), gemini-embedding-001)...');

  await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS knowledge_chunks_embedding_idx`);
  console.log('✅ Old index dropped');

  await prisma.$executeRawUnsafe(
    `ALTER TABLE knowledge_chunks ALTER COLUMN embedding TYPE vector(768) USING NULL`
  );
  console.log('✅ Column changed to vector(768), embeddings cleared');

  await prisma.$executeRawUnsafe(
    `CREATE INDEX knowledge_chunks_embedding_idx ON knowledge_chunks USING hnsw (embedding vector_cosine_ops)`
  );
  console.log('✅ HNSW index created');

  await prisma.$executeRawUnsafe(`
    INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
    VALUES (gen_random_uuid()::text, 'manual', NOW(), '20260516000000_embedding_3072', NULL, NULL, NOW(), 1)
    ON CONFLICT (migration_name) DO NOTHING
  `).catch(() => {});

  console.log('✅ Migration complete');
}

main()
  .catch((e) => { console.error('❌', e.message); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
