const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function check() {
  const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

  try {
    const result = await sql`SELECT email, role FROM users`;
    console.log('Users in DB:');
    console.table(result);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
