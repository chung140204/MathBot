import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authOptions } from '@/lib/auth';
import { AppError, ErrorCode } from '@/lib/errors';
import { generateExamQuestions } from '@/lib/exam-generator';

const TopicEnum = z.enum([
  'DERIVATIVES', 'INTEGRALS', 'FUNCTIONS', 'LIMITS', 'COMPLEX_NUMBERS',
  'PROBABILITY', 'SEQUENCES', 'EXPONENTIAL_LOG', 'VOLUME',
  'ANALYTIC_GEOMETRY', 'SOLID_GEOMETRY',
]);

const generateSchema = z.object({
  topics: z.array(TopicEnum).min(1, 'Cần chọn ít nhất một chủ đề'),
  totalQuestions: z.number().int().min(10).max(100).default(50),
  difficultyWeights: z.object({
    RECOGNITION: z.number().min(0).max(1),
    COMPREHENSION: z.number().min(0).max(1),
    APPLICATION: z.number().min(0).max(1),
    ADVANCED: z.number().min(0).max(1),
  }).refine(
    (w) => Math.abs(w.RECOGNITION + w.COMPREHENSION + w.APPLICATION + w.ADVANCED - 1) < 0.05,
    { message: 'Tổng weight phải xấp xỉ bằng 1' },
  ).optional(),
});

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

    const questions = await generateExamQuestions({
      topics: data.topics,
      totalQuestions: data.totalQuestions,
      difficultyWeights: data.difficultyWeights,
    });

    const examSessionId = crypto.randomUUID();

    return NextResponse.json({
      success: true,
      questions,
      examSessionId,
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
