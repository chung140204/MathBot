const { neon } = require('@neondatabase/serverless');
require('dotenv').config();

async function check() {
  const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

  try {
    console.log('Fetching users from Neon...');
    const result = await sql('SELECT * FROM "User"');
    console.log('Results count:', result.length);
    console.log('--- USER LIST ---');
    console.log(result);
    console.log('-----------------');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

check();
