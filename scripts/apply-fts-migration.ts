import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local', override: true });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Applying FTS migration...');
  console.log('DB URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));

  await prisma.$executeRawUnsafe(
    `ALTER TABLE knowledge_chunks
     ADD COLUMN IF NOT EXISTS content_tsv tsvector
     GENERATED ALWAYS AS (to_tsvector('simple', content)) STORED`,
  );
  console.log('✅ Column content_tsv added');

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_content_tsv
     ON knowledge_chunks USING GIN (content_tsv)`,
  );
  console.log('✅ GIN index created');

  // Mark migration as applied in _prisma_migrations
  await prisma.$executeRawUnsafe(`
    INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
    VALUES (
      gen_random_uuid()::text,
      'manual',
      NOW(),
      '20260515000000_add_knowledge_fts',
      NULL, NULL, NOW(), 1
    )
    ON CONFLICT (migration_name) DO NOTHING
  `).catch(() => {}); // ignore if _prisma_migrations doesn't support this

  console.log('✅ Done');
}

main()
  .catch((e) => { console.error('❌', e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
