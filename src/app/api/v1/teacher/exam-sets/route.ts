import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/shared/lib/db';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  timeLimit: z.number().int().min(60).optional(),
  questionIds: z.array(z.string()).min(1),
});

export async function GET() {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const examSets = await prisma.examSet.findMany({
      where: { createdById: auth.session.user.id, isActive: true },
      include: { _count: { select: { questions: true, assignments: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(examSets);
  } catch (error) {
    console.error('[teacher/exam-sets] GET error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR, details: parsed.error.flatten() }, { status: 400 });

    const { title, description, timeLimit, questionIds } = parsed.data;

    // Verify question ownership
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds }, isActive: true },
      select: { id: true, createdById: true },
    });

    const invalidIds = questionIds.filter(qId => {
      const q = questions.find(qq => qq.id === qId);
      return !q || (q.createdById !== null && q.createdById !== auth.session.user.id && auth.session.user.role !== 'ADMIN');
    });

    if (invalidIds.length > 0) {
      return NextResponse.json({ error: 'Some questions not found or not owned', code: ErrorCode.VALIDATION_ERROR }, { status: 400 });
    }

    const examSet = await prisma.examSet.create({
      data: {
        title,
        description: description ?? null,
        timeLimit: timeLimit ?? null,
        createdById: auth.session.user.id,
        questions: {
          create: questionIds.map((qId, idx) => ({ questionId: qId, sortOrder: idx })),
        },
      },
      include: { _count: { select: { questions: true } } },
    });

    return NextResponse.json(examSet, { status: 201 });
  } catch (error) {
    console.error('[teacher/exam-sets] POST error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
