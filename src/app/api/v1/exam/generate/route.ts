import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/features/auth/lib/auth';
import { AppError, ErrorCode } from '@/shared/lib/errors';
import {
  generateQuickExam,
  generateStandardExam,
  generateThptExam,
  generateAdaptiveExam,
} from '@/features/exam/lib/exam-generator';

const TopicEnum = z.enum([
  'DERIVATIVES', 'INTEGRALS', 'FUNCTIONS', 'LIMITS', 'COMPLEX_NUMBERS',
  'PROBABILITY', 'SEQUENCES', 'EXPONENTIAL_LOG', 'VOLUME',
  'ANALYTIC_GEOMETRY', 'SOLID_GEOMETRY',
]);

const DifficultyEnum = z.enum([
  'RECOGNITION', 'COMPREHENSION', 'APPLICATION', 'ADVANCED',
]);

const quickSchema = z.object({
  mode: z.literal('quick'),
  topic: TopicEnum,
  difficulty: DifficultyEnum.optional(),
});

const standardSchema = z.object({
  mode: z.literal('standard'),
  topics: z.array(TopicEnum).min(1, 'Cần chọn ít nhất một chủ đề'),
  difficulty: DifficultyEnum.optional(),
});

const thptSchema = z.object({
  mode: z.literal('thpt'),
});

const adaptiveSchema = z.object({
  mode: z.literal('adaptive'),
});

const generateSchema = z.discriminatedUnion('mode', [
  quickSchema,
  standardSchema,
  thptSchema,
  adaptiveSchema,
]);

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: ErrorCode.AUTH_REQUIRED, message: 'Unauthorized' } },
        { status: 401 },
      );
    }

    const body = await req.json();
    const data = generateSchema.parse(body);

    let result;

    switch (data.mode) {
      case 'quick':
        result = await generateQuickExam(data.topic, data.difficulty);
        break;
      case 'standard':
        result = await generateStandardExam(data.topics, data.difficulty);
        break;
      case 'thpt':
        result = await generateThptExam();
        break;
      case 'adaptive':
        result = await generateAdaptiveExam(session.user.id);
        break;
    }

    const examSessionId = crypto.randomUUID();

    return NextResponse.json({
      success: true,
      questions: result.questions,
      examSessionId,
      mode: result.mode,
      timeLimit: result.timeLimit,
      scoring: result.scoring,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: ErrorCode.VALIDATION_ERROR, message: 'Validation failed', details: error.issues } },
        { status: 400 },
      );
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message, details: error.details } },
        { status: error.statusCode },
      );
    }

    console.error('[API_EXAM_GENERATE]', error);
    return NextResponse.json(
      { error: { code: ErrorCode.INTERNAL_ERROR, message: 'Internal server error' } },
      { status: 500 },
    );
  }
}
