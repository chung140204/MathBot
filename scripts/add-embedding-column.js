const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function run() {
  console.log('Checking embedding column...');
  const cols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'knowledge_chunks' AND column_name = 'embedding'`;

  if (cols.length > 0) {
    console.log('✅ Column "embedding" already exists');
  } else {
    await sql`ALTER TABLE knowledge_chunks ADD COLUMN embedding vector(1024)`;
    console.log('✅ Column "embedding" added (vector 1024)');
  }
}

run().catch(e => console.error('❌ Error:', e.message));
