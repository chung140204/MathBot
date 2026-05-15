const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Checking study_bookmarks table...');
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_name = 'study_bookmarks'`;

  if (tables.length > 0) {
    console.log('✅ Table already exists');
  } else {
    await sql`
      CREATE TABLE study_bookmarks (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        "userId" TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        topic TEXT NOT NULL,
        subsection TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", topic, subsection)
      )
    `;
    await sql`CREATE INDEX idx_study_bookmarks_user ON study_bookmarks("userId")`;
    console.log('✅ Table "study_bookmarks" created');
  }
}

run().catch(e => console.error('❌ Error:', e.message));
