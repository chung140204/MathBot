-- CreateTable: long-term learning profile for the tutor's memory
CREATE TABLE IF NOT EXISTS "student_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "level" TEXT,
    "strongTopics" "Topic"[] DEFAULT '{}',
    "weakTopics" "Topic"[] DEFAULT '{}',
    "recurringErrors" TEXT,
    "goals" TEXT,
    "lastStudied" TEXT,
    "summary" TEXT,
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "student_profiles_userId_key" ON "student_profiles"("userId");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
