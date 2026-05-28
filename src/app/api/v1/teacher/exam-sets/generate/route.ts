import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { AppError } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';
import { generateExamSetForTeacher } from '@/features/teacher/lib/teacher-exam-generator';

const topicEnum = z.enum([
  'DERIVATIVES', 'INTEGRALS', 'FUNCTIONS', 'LIMITS', 'COMPLEX_NUMBERS',
  'PROBABILITY', 'SEQUENCES', 'EXPONENTIAL_LOG', 'VOLUME',
  'ANALYTIC_GEOMETRY', 'SOLID_GEOMETRY',
]);

const generateSchema = z.discriminatedUnion('mode', [
  z.object({
    mode: z.literal('thpt'),
    source: z.enum(['all', 'mine', 'system']).default('all'),
    topics: z.array(topicEnum).optional(),
  }),
  z.object({
    mode: z.literal('custom'),
    source: z.enum(['all', 'mine', 'system']).default('all'),
    totalQuestions: z.number().int().min(5).max(50).default(30),
    topics: z.array(topicEnum).min(1, 'Cần chọn ít nhất một chủ đề'),
    difficultyWeights: z.object({
      RECOGNITION: z.number().min(0).max(1),
      COMPREHENSION: z.number().min(0).max(1),
      APPLICATION: z.number().min(0).max(1),
      ADVANCED: z.number().min(0).max(1),
    }).optional(),
  }),
]);

export async function POST(request: Request) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const body = await request.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR, details: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const result = await generateExamSetForTeacher({
      mode: data.mode,
      teacherId: auth.session.user.id,
      source: data.source,
      topics: data.topics as import('@prisma/client').Topic[] | undefined,
      totalQuestions: data.mode === 'custom' ? data.totalQuestions : undefined,
      difficultyWeights: data.mode === 'custom' ? data.difficultyWeights : undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message, code: error.code, details: error.details }, { status: error.statusCode });
    }
    console.error('[teacher/exam-sets/generate] POST error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
