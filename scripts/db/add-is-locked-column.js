const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env' });

async function main() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('Adding isLocked column to users table...');

  await sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS "isLocked" BOOLEAN NOT NULL DEFAULT false
  `;

  console.log('Done! isLocked column added.');
}

main().catch(console.error);
