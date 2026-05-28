/**
 * Apply chunk metadata migration: add difficulty, subTopic, relatedTopics columns
 *
 * Usage: npx tsx scripts/migration/apply-chunk-metadata.ts
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Adding metadata columns to knowledge_chunks...\n');

  const queries = [
    `ALTER TABLE "knowledge_chunks" ADD COLUMN IF NOT EXISTS "difficulty" "Difficulty"`,
    `ALTER TABLE "knowledge_chunks" ADD COLUMN IF NOT EXISTS "subTopic" TEXT`,
    `ALTER TABLE "knowledge_chunks" ADD COLUMN IF NOT EXISTS "relatedTopics" "Topic"[] DEFAULT '{}'`,
  ];

  for (const sql of queries) {
    try {
      await prisma.$executeRawUnsafe(sql);
      console.log(`  ✓ ${sql.slice(0, 80)}...`);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        console.log(`  ⏭ Column already exists, skipping`);
      } else {
        console.error(`  ✗ ${error.message}`);
      }
    }
  }

  console.log('\n✅ Migration complete!');
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
