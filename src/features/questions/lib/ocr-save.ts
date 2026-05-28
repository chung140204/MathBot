/**
 * OCR save business logic — extracted from ocr/save/route.ts.
 * Builds Prisma inputs from validated questions and saves with auto-created ExamSet.
 */
import prisma from '@/shared/lib/db';
import { QuestionFormat, Topic, Difficulty, QuestionType } from '@prisma/client';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Zod schemas (exported for route handler)
// ---------------------------------------------------------------------------

const TopicEnum = z.enum([
  'DERIVATIVES', 'INTEGRALS', 'FUNCTIONS', 'LIMITS', 'COMPLEX_NUMBERS',
  'PROBABILITY', 'SEQUENCES', 'EXPONENTIAL_LOG', 'VOLUME',
  'ANALYTIC_GEOMETRY', 'SOLID_GEOMETRY',
]);

const DifficultyEnum = z.enum(['RECOGNITION', 'COMPREHENSION', 'APPLICATION', 'ADVANCED']);

const mcQuestionSchema = z.object({
  format: z.literal('MULTIPLE_CHOICE'),
  content: z.string().min(1), topic: TopicEnum, difficulty: DifficultyEnum,
  options: z.object({ A: z.string().min(1), B: z.string().min(1), C: z.string().min(1), D: z.string().min(1) }),
  answer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().optional().default(''), imageUrl: z.string().optional(),
});

const tfQuestionSchema = z.object({
  format: z.literal('TRUE_FALSE'),
  content: z.string().min(1), topic: TopicEnum, difficulty: DifficultyEnum,
  statementA: z.string().min(1), statementB: z.string().min(1),
  statementC: z.string().min(1), statementD: z.string().min(1),
  answerA: z.boolean(), answerB: z.boolean(), answerC: z.boolean(), answerD: z.boolean(),
  explanation: z.string().optional().default(''), imageUrl: z.string().optional(),
});

const saQuestionSchema = z.object({
  format: z.literal('SHORT_ANSWER'),
  content: z.string().min(1), topic: TopicEnum, difficulty: DifficultyEnum,
  correctAnswer: z.string().min(1),
  explanation: z.string().optional().default(''), imageUrl: z.string().optional(),
});

export const questionSchema = z.discriminatedUnion('format', [mcQuestionSchema, tfQuestionSchema, saQuestionSchema]);
export const saveSchema = z.object({
  questions: z.array(questionSchema).min(22, 'Đề thi phải có đủ 22 câu').max(50),
  examYear: z.string().optional(),
  examCode: z.string().optional(),
});

export type SaveInput = z.infer<typeof saveSchema>;
type ValidatedQuestion = z.infer<typeof questionSchema>;

// ---------------------------------------------------------------------------
// Business logic
// ---------------------------------------------------------------------------

const THPT_EXAM_TIME_LIMIT = 5400; // 90 minutes

function buildPrismaInputs(questions: ValidatedQuestion[], userId: string) {
  return questions.map((q) => {
    const base = {
      content: q.content, topic: q.topic as Topic, difficulty: q.difficulty as Difficulty,
      explanation: q.explanation || '', questionType: QuestionType.THPT_EXAM,
      format: q.format as QuestionFormat, options: {} as Record<string, string>,
      answer: '', imageUrl: q.imageUrl || null, createdById: userId,
    };
    if (q.format === 'MULTIPLE_CHOICE') return { ...base, options: q.options, answer: q.answer };
    if (q.format === 'TRUE_FALSE') return { ...base, statementA: q.statementA, statementB: q.statementB, statementC: q.statementC, statementD: q.statementD, answerA: q.answerA, answerB: q.answerB, answerC: q.answerC, answerD: q.answerD };
    return { ...base, correctAnswer: q.correctAnswer, answer: q.correctAnswer };
  });
}

/**
 * Create questions + auto-create ExamSet in a Prisma transaction.
 */
export async function saveOcrQuestionsWithExamSet(
  data: SaveInput,
  userId: string,
): Promise<{ created: number; examSet: { id: string; title: string } }> {
  const prismaInputs = buildPrismaInputs(data.questions, userId);

  return prisma.$transaction(async (tx) => {
    const questionIds: string[] = [];
    for (const input of prismaInputs) {
      const q = await tx.question.create({ data: input });
      questionIds.push(q.id);
    }

    const examSetTitle = data.examYear && data.examCode
      ? `Đề THPT ${data.examYear} - Mã ${data.examCode}`
      : `Đề upload ${new Date().toLocaleDateString('vi-VN')}`;

    const examSet = await tx.examSet.create({
      data: {
        title: examSetTitle,
        description: `${questionIds.length} câu — tạo từ upload đề thi`,
        timeLimit: THPT_EXAM_TIME_LIMIT,
        createdById: userId,
        questions: { create: questionIds.map((qId, idx) => ({ questionId: qId, sortOrder: idx })) },
      },
    });

    return { created: questionIds.length, examSet: { id: examSet.id, title: examSet.title } };
  });
}
