const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function check() {
  const sql = neon(process.env.DATABASE_URL);

  try {
    const result = await sql`SELECT count(*) FROM users WHERE role = 'ADMIN'`;
    console.log('Admin count:', result[0].count);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
