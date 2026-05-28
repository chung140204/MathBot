/**
 * Migration script: Add ExamMode enum + mode column to exam_attempts
 * Run with: npx ts-node --project tsconfig.json prisma/migrate-exam-mode.ts
 *
 * Uses WebSocket adapter to bypass Neon TCP restriction on local/Windows.
 */

import { neonConfig, Pool } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });

  console.log('Connecting via WebSocket...');

  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ExamMode') THEN
        CREATE TYPE "ExamMode" AS ENUM ('QUICK', 'STANDARD', 'THPT');
      END IF;
    END $$;
  `);
  console.log('✓ ExamMode enum created (or already exists)');

  await pool.query(`
    ALTER TABLE exam_attempts
    ADD COLUMN IF NOT EXISTS mode "ExamMode" NOT NULL DEFAULT 'STANDARD';
  `);
  console.log('✓ mode column added to exam_attempts');

  await pool.end();
  console.log('Done!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
