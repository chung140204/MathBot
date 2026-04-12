-- CreateEnum
CREATE TYPE "QuestionFormat" AS ENUM ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER');

-- AlterTable
ALTER TABLE "exam_answers" ADD COLUMN     "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "shortAnswer" TEXT,
ADD COLUMN     "tfAnswerA" BOOLEAN,
ADD COLUMN     "tfAnswerB" BOOLEAN,
ADD COLUMN     "tfAnswerC" BOOLEAN,
ADD COLUMN     "tfAnswerD" BOOLEAN;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "answerA" BOOLEAN,
ADD COLUMN     "answerB" BOOLEAN,
ADD COLUMN     "answerC" BOOLEAN,
ADD COLUMN     "answerD" BOOLEAN,
ADD COLUMN     "correctAnswer" TEXT,
ADD COLUMN     "format" "QuestionFormat" NOT NULL DEFAULT 'MULTIPLE_CHOICE',
ADD COLUMN     "statementA" TEXT,
ADD COLUMN     "statementB" TEXT,
ADD COLUMN     "statementC" TEXT,
ADD COLUMN     "statementD" TEXT;

-- CreateTable
CREATE TABLE "exam_sets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Exam',
    "examYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_sets_pkey" PRIMARY KEY ("id")
);
