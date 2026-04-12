const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
require('dotenv').config();

async function check() {
  const sql = neon(process.env.DIRECT_URL || process.env.DATABASE_URL);

  try {
    const result = await sql.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    console.log('Table query finished.');
    fs.writeFileSync('scripts/tables-result.json', JSON.stringify(result.rows, null, 2));
  } catch (err) {
    fs.writeFileSync('scripts/users-error.txt', err.message);
    console.error('Error:', err.message);
  }
}

check();
