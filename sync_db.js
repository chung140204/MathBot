const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env
const envPath = path.join('d:', 'DATN', 'mathbot', '.env');
const envConfig = dotenv.parse(fs.readFileSync(envPath));
const databaseUrl = envConfig.DATABASE_URL;

if (!databaseUrl) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function sync() {
  const client = await pool.connect();
  try {
    console.log('Connected to database');

    // 1. Check current columns
    const columnsRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'questions'
    `);
    const columns = columnsRes.rows.map(r => r.column_name);
    console.log('Current columns:', columns);

    // 2. Handle QuestionType enum and column
    console.log('Ensuring QuestionType enum exists...');
    await client.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QuestionType') THEN
          CREATE TYPE "QuestionType" AS ENUM ('PRACTICE', 'EXAM_SET', 'THPT_EXAM');
        END IF;
      END $$;
    `);

    if (columns.includes('type')) {
      console.log('Renaming column "type" to "questionType"...');
      await client.query('ALTER TABLE questions RENAME COLUMN "type" TO "questionType"');
    } else if (!columns.includes('questionType')) {
      console.log('Adding column "questionType"...');
      await client.query('ALTER TABLE questions ADD COLUMN "questionType" "QuestionType" DEFAULT \'PRACTICE\'');
    }

    // 3. Handle Topic enum values
    console.log('Updating Topic enum values...');
    
    // Get existing labels
    const topicsRes = await client.query(`
      SELECT enumlabel FROM pg_enum 
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
      WHERE pg_type.typname = 'Topic'
    `);
    const existingTopics = topicsRes.rows.map(r => r.enumlabel);
    console.log('Existing topics:', existingTopics);

    const neededTopics = [
      'DERIVATIVES', 'INTEGRALS', 'FUNCTIONS', 'LIMITS', 
      'COMPLEX_NUMBERS', 'PROBABILITY', 'SEQUENCES', 
      'EXPONENTIAL_LOG', 'VOLUME', 'ANALYTIC_GEOMETRY', 'SOLID_GEOMETRY'
    ];

    for (const topic of neededTopics) {
      if (!existingTopics.includes(topic)) {
        console.log(`Adding topic: ${topic}`);
        // ALTER TYPE cannot be run inside a transaction/DO block easily for enums in some PG versions
        try {
          await client.query(`ALTER TYPE "Topic" ADD VALUE '${topic}'`);
        } catch (e) {
          console.log(`Error adding ${topic}: ${e.message}`);
        }
      }
    }

    console.log('Sync complete!');
  } catch (err) {
    console.error('Error syncing database:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

sync();
