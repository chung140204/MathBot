-- AlterEnum: Add TEACHER role
ALTER TYPE "UserRole" ADD VALUE 'TEACHER';

-- AlterTable: Add createdById to questions
ALTER TABLE "questions" ADD COLUMN "createdById" TEXT;

-- AlterTable: Add classAssignmentId to exam_attempts
ALTER TABLE "exam_attempts" ADD COLUMN "classAssignmentId" TEXT;

-- CreateTable: classrooms
CREATE TABLE "classrooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "teacherId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "classrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable: class_members
CREATE TABLE "class_members" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable: exam_sets
CREATE TABLE "exam_sets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdById" TEXT NOT NULL,
    "timeLimit" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "exam_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable: exam_set_questions
CREATE TABLE "exam_set_questions" (
    "id" TEXT NOT NULL,
    "examSetId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "exam_set_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable: class_assignments
CREATE TABLE "class_assignments" (
    "id" TEXT NOT NULL,
    "classroomId" TEXT NOT NULL,
    "examSetId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "class_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "classrooms_code_key" ON "classrooms"("code");
CREATE INDEX "classrooms_teacherId_idx" ON "classrooms"("teacherId");

CREATE INDEX "class_members_userId_idx" ON "class_members"("userId");
CREATE UNIQUE INDEX "class_members_classroomId_userId_key" ON "class_members"("classroomId", "userId");

CREATE INDEX "exam_sets_createdById_idx" ON "exam_sets"("createdById");

CREATE INDEX "exam_set_questions_examSetId_sortOrder_idx" ON "exam_set_questions"("examSetId", "sortOrder");
CREATE UNIQUE INDEX "exam_set_questions_examSetId_questionId_key" ON "exam_set_questions"("examSetId", "questionId");

CREATE INDEX "class_assignments_classroomId_idx" ON "class_assignments"("classroomId");
CREATE UNIQUE INDEX "class_assignments_classroomId_examSetId_key" ON "class_assignments"("classroomId", "examSetId");

CREATE INDEX "exam_attempts_classAssignmentId_idx" ON "exam_attempts"("classAssignmentId");
CREATE INDEX "questions_createdById_idx" ON "questions"("createdById");

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "exam_attempts" ADD CONSTRAINT "exam_attempts_classAssignmentId_fkey" FOREIGN KEY ("classAssignmentId") REFERENCES "class_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "classrooms" ADD CONSTRAINT "classrooms_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "class_members" ADD CONSTRAINT "class_members_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "class_members" ADD CONSTRAINT "class_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "exam_sets" ADD CONSTRAINT "exam_sets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "exam_set_questions" ADD CONSTRAINT "exam_set_questions_examSetId_fkey" FOREIGN KEY ("examSetId") REFERENCES "exam_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "exam_set_questions" ADD CONSTRAINT "exam_set_questions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "class_assignments" ADD CONSTRAINT "class_assignments_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "classrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "class_assignments" ADD CONSTRAINT "class_assignments_examSetId_fkey" FOREIGN KEY ("examSetId") REFERENCES "exam_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
