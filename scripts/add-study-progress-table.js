const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Checking study_progress table...');
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_name = 'study_progress'`;

  if (tables.length > 0) {
    console.log('✅ Table already exists');
  } else {
    await sql`
      CREATE TABLE study_progress (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        "studyContentId" TEXT NOT NULL,
        "readAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "studyContentId")
      )
    `;
    await sql`CREATE INDEX idx_study_progress_user ON study_progress("userId")`;
    console.log('✅ Table "study_progress" created');
  }
}

run().catch(e => console.error('❌ Error:', e.message));
