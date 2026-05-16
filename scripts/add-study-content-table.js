const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Checking study_contents table...');
  const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_name = 'study_contents'`;

  if (tables.length > 0) {
    console.log('✅ Table "study_contents" already exists');
  } else {
    await sql`
      CREATE TABLE study_contents (
        id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
        topic TEXT NOT NULL,
        subsection TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        "sortOrder" INTEGER DEFAULT 0,
        "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(topic, subsection, title)
      )
    `;
    await sql`CREATE INDEX idx_study_contents_topic_sub ON study_contents(topic, subsection)`;
    console.log('✅ Table "study_contents" created');
  }
}

run().catch(e => console.error('❌ Error:', e.message));
