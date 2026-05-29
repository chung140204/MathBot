-- Index the exam_answers.questionId foreign key (was missing).
CREATE INDEX IF NOT EXISTS "exam_answers_questionId_idx" ON "exam_answers"("questionId");
