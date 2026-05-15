import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';
import { QuestionFormat, Topic, Difficulty, QuestionType } from '@prisma/client';

const TopicEnum = z.enum([
  'DERIVATIVES', 'INTEGRALS', 'FUNCTIONS', 'LIMITS', 'COMPLEX_NUMBERS',
  'PROBABILITY', 'SEQUENCES', 'EXPONENTIAL_LOG', 'VOLUME',
  'ANALYTIC_GEOMETRY', 'SOLID_GEOMETRY',
]);

const DifficultyEnum = z.enum(['RECOGNITION', 'COMPREHENSION', 'APPLICATION', 'ADVANCED']);

const mcQuestionSchema = z.object({
  format: z.literal('MULTIPLE_CHOICE'),
  content: z.string().min(1),
  topic: TopicEnum,
  difficulty: DifficultyEnum,
  options: z.object({
    A: z.string().min(1),
    B: z.string().min(1),
    C: z.string().min(1),
    D: z.string().min(1),
  }),
  answer: z.enum(['A', 'B', 'C', 'D']),
  explanation: z.string().optional().default(''),
  imageUrl: z.string().optional(),
});

const tfQuestionSchema = z.object({
  format: z.literal('TRUE_FALSE'),
  content: z.string().min(1),
  topic: TopicEnum,
  difficulty: DifficultyEnum,
  statementA: z.string().min(1),
  statementB: z.string().min(1),
  statementC: z.string().min(1),
  statementD: z.string().min(1),
  answerA: z.boolean(),
  answerB: z.boolean(),
  answerC: z.boolean(),
  answerD: z.boolean(),
  explanation: z.string().optional().default(''),
  imageUrl: z.string().optional(),
});

const saQuestionSchema = z.object({
  format: z.literal('SHORT_ANSWER'),
  content: z.string().min(1),
  topic: TopicEnum,
  difficulty: DifficultyEnum,
  correctAnswer: z.string().min(1),
  explanation: z.string().optional().default(''),
  imageUrl: z.string().optional(),
});

const questionSchema = z.discriminatedUnion('format', [
  mcQuestionSchema,
  tfQuestionSchema,
  saQuestionSchema,
]);

const saveSchema = z.object({
  questions: z.array(questionSchema).min(1).max(50),
  examYear: z.string().optional(),
  examCode: z.string().optional(),
});

/**
 * POST /api/v1/admin/upload/ocr/save
 * Bulk-saves reviewed OCR-extracted questions to the database.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = saveSchema.parse(body);

    const prismaInputs = data.questions.map((q) => {
      const base = {
        content: q.content,
        topic: q.topic as Topic,
        difficulty: q.difficulty as Difficulty,
        explanation: q.explanation || '',
        questionType: QuestionType.THPT_EXAM,
        format: q.format as QuestionFormat,
        options: {} as Record<string, string>,
        answer: '',
        imageUrl: q.imageUrl || null,
      };

      if (q.format === 'MULTIPLE_CHOICE') {
        return {
          ...base,
          options: q.options,
          answer: q.answer,
        };
      }

      if (q.format === 'TRUE_FALSE') {
        return {
          ...base,
          statementA: q.statementA,
          statementB: q.statementB,
          statementC: q.statementC,
          statementD: q.statementD,
          answerA: q.answerA,
          answerB: q.answerB,
          answerC: q.answerC,
          answerD: q.answerD,
        };
      }

      // SHORT_ANSWER
      return {
        ...base,
        correctAnswer: q.correctAnswer,
        answer: q.correctAnswer,
      };
    });

    const result = await prisma.question.createMany({
      data: prismaInputs,
    });

    return NextResponse.json({
      success: true,
      created: result.count,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('[OCR_SAVE]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 },
    );
  }
}
