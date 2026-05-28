const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env' });

async function main() {
  const sql = neon(process.env.DATABASE_URL);

  console.log('Creating system_settings table...');

  await sql`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
    )
  `;

  // Seed default settings
  const defaults = [
    ['site_name', 'MathBot'],
    ['site_description', 'Hỗ trợ học Toán hiệu quả cho học sinh lớp 12'],
    ['maintenance_mode', 'false'],
    ['allow_registration', 'true'],
    ['max_exam_time', '90'],
    ['questions_per_exam', '50'],
    ['ai_model', 'nvidia/nemotron-3-super-120b-a12b'],
    ['ai_fast_model', 'meta/llama-3.1-8b-instruct'],
    ['ai_temperature', '0.3'],
    ['ai_max_history', '10'],
    ['rate_limit_per_min', '20'],
  ];

  for (const [key, value] of defaults) {
    await sql`
      INSERT INTO system_settings (key, value, "updatedAt")
      VALUES (${key}, ${value}, now())
      ON CONFLICT (key) DO NOTHING
    `;
  }

  console.log('Done! system_settings table created with defaults.');
}

main().catch(console.error);
