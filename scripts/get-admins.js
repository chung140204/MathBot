const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function check() {
  const sql = neon(process.env.DATABASE_URL);

  try {
    const result = await sql`SELECT email FROM users WHERE role = 'ADMIN'`;
    console.log('Admin emails:');
    console.log(result.map(r => r.email));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
