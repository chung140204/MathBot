-- 1. Create QuestionType enum
-- These can fail if already exists, we will ignore via CLI if possible or just run individually
-- But DO block is fine for these.
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'QuestionType') THEN
    CREATE TYPE "QuestionType" AS ENUM ('PRACTICE', 'EXAM_SET', 'THPT_EXAM');
  END IF;
END $$;

-- 2. Rename or Add questionType column to questions table
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'type') THEN
    ALTER TABLE questions RENAME COLUMN "type" TO "questionType";
  ELSEIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'questionType') THEN
    ALTER TABLE questions ADD COLUMN "questionType" "QuestionType" DEFAULT 'PRACTICE';
  END IF;
END $$;

-- 3. Update Topic enum values (run individually)
ALTER TYPE "Topic" ADD VALUE 'FUNCTIONS';
ALTER TYPE "Topic" ADD VALUE 'LIMITS';
ALTER TYPE "Topic" ADD VALUE 'PROBABILITY';
ALTER TYPE "Topic" ADD VALUE 'VOLUME';
ALTER TYPE "Topic" ADD VALUE 'EXPONENTIAL_LOG'; -- In case it's missing or named differently

