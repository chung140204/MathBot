/**
 * Question upload business logic — extracted from teacher/questions/upload/route.ts.
 * Handles 3 modes: append to exam set, create new exam set, save to bank.
 */
import prisma from '@/shared/lib/db';
import { QuestionFormat, Topic, Difficulty, QuestionType } from '@prisma/client';
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Schemas (exported for route handler)
// ---------------------------------------------------------------------------

const TopicEnum = z.enum([
  'DERIVATIVES', 'INTEGRALS', 'FUNCTIONS', 'LIMITS', 'COMPLEX_NUMBERS',
  'PROBABILITY', 'SEQUENCES', 'EXPONENTIAL_LOG', 'VOLUME',
  'ANALYTIC_GEOMETRY', 'SOLID_GEOMETRY',
]);
const DifficultyEnum = z.enum(['RECOGNITION', 'COMPREHENSION', 'APPLICATION', 'ADVANCED']);

export const questionSchema = z.discriminatedUnion('format', [
  z.object({
    format: z.literal('MULTIPLE_CHOICE'), content: z.string().min(1), topic: TopicEnum, difficulty: DifficultyEnum,
    options: z.object({ A: z.string().min(1), B: z.string().min(1), C: z.string().min(1), D: z.string().min(1) }),
    answer: z.enum(['A', 'B', 'C', 'D']).optional(), explanation: z.string().optional().default(''), imageUrl: z.string().optional(),
  }),
  z.object({
    format: z.literal('TRUE_FALSE'), content: z.string().min(1), topic: TopicEnum, difficulty: DifficultyEnum,
    statementA: z.string().min(1), statementB: z.string().min(1), statementC: z.string().min(1), statementD: z.string().min(1),
    answerA: z.boolean().optional(), answerB: z.boolean().optional(), answerC: z.boolean().optional(), answerD: z.boolean().optional(),
    explanation: z.string().optional().default(''), imageUrl: z.string().optional(),
  }),
  z.object({
    format: z.literal('SHORT_ANSWER'), content: z.string().min(1), topic: TopicEnum, difficulty: DifficultyEnum,
    correctAnswer: z.string().optional(), explanation: z.string().optional().default(''), imageUrl: z.string().optional(),
  }),
]);

export const uploadSaveSchema = z.object({
  questions: z.array(questionSchema).min(1).max(50),
  title: z.string().min(1).max(200).optional(),
  examSetId: z.string().optional(),
});

export type UploadSaveInput = z.infer<typeof uploadSaveSchema>;

// ---------------------------------------------------------------------------
// Transform
// ---------------------------------------------------------------------------

export function buildPrismaInputs(questions: z.infer<typeof questionSchema>[], userId: string) {
  return questions.map((q) => {
    const base = {
      content: q.content, topic: q.topic as Topic, difficulty: q.difficulty as Difficulty,
      explanation: q.explanation || '', questionType: QuestionType.PRACTICE,
      format: q.format as QuestionFormat, options: {} as Record<string, string>,
      answer: '', imageUrl: q.imageUrl || null, createdById: userId,
    };
    if (q.format === 'MULTIPLE_CHOICE') return { ...base, options: q.options, answer: q.answer || '' };
    if (q.format === 'TRUE_FALSE') return { ...base, statementA: q.statementA, statementB: q.statementB, statementC: q.statementC, statementD: q.statementD, answerA: q.answerA, answerB: q.answerB, answerC: q.answerC, answerD: q.answerD };
    return { ...base, correctAnswer: q.correctAnswer || '', answer: q.correctAnswer || '' };
  });
}

// ---------------------------------------------------------------------------
// Save modes
// ---------------------------------------------------------------------------

export async function appendToExamSet(examSetId: string, prismaInputs: ReturnType<typeof buildPrismaInputs>, userId: string, userRole: string) {
  return prisma.$transaction(async (tx) => {
    const examSet = await tx.examSet.findUnique({ where: { id: examSetId }, select: { id: true, title: true, createdById: true, _count: { select: { questions: true } } } });
    if (!examSet) throw new UploadError('EXAM_SET_NOT_FOUND');
    if (userRole !== 'ADMIN' && examSet.createdById !== userId) throw new UploadError('ACCESS_DENIED');

    const startOrder = examSet._count.questions;
    const questionIds: string[] = [];
    for (const input of prismaInputs) { const q = await tx.question.create({ data: input }); questionIds.push(q.id); }
    await tx.examSetQuestion.createMany({ data: questionIds.map((qId, idx) => ({ examSetId, questionId: qId, sortOrder: startOrder + idx })) });
    return { created: questionIds.length, examSet: { id: examSet.id, title: examSet.title }, appended: true };
  });
}

export async function createExamSetWithQuestions(title: string, prismaInputs: ReturnType<typeof buildPrismaInputs>, userId: string) {
  return prisma.$transaction(async (tx) => {
    const questionIds: string[] = [];
    for (const input of prismaInputs) { const q = await tx.question.create({ data: input }); questionIds.push(q.id); }
    const examSet = await tx.examSet.create({
      data: { title, description: `${questionIds.length} câu — tạo từ upload ảnh`, createdById: userId, questions: { create: questionIds.map((qId, idx) => ({ questionId: qId, sortOrder: idx })) } },
    });
    return { created: questionIds.length, examSet: { id: examSet.id, title: examSet.title } };
  });
}

export async function saveToBank(prismaInputs: ReturnType<typeof buildPrismaInputs>) {
  const result = await prisma.question.createMany({ data: prismaInputs });
  return { created: result.count };
}

export class UploadError extends Error {
  constructor(public code: string) { super(code); }
}
