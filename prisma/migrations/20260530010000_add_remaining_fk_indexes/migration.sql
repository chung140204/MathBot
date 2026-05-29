-- Index remaining FK columns that were only the 2nd column of a composite unique.
CREATE INDEX IF NOT EXISTS "class_assignments_examSetId_idx" ON "class_assignments"("examSetId");
CREATE INDEX IF NOT EXISTS "exam_set_questions_questionId_idx" ON "exam_set_questions"("questionId");
