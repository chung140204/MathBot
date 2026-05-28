import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/shared/lib/db';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  timeLimit: z.number().int().min(60).nullable().optional(),
  questionIds: z.array(z.string()).min(1).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id } = await params;
    const examSet = await prisma.examSet.findUnique({
      where: { id },
      include: {
        questions: {
          include: { question: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!examSet) return NextResponse.json({ error: 'Not found', code: ErrorCode.EXAM_SET_NOT_FOUND }, { status: 404 });
    if (auth.session.user.role !== 'ADMIN' && examSet.createdById !== auth.session.user.id) {
      return NextResponse.json({ error: 'Access denied', code: ErrorCode.AUTH_FORBIDDEN }, { status: 403 });
    }

    return NextResponse.json(examSet);
  } catch (error) {
    console.error('[teacher/exam-sets/[id]] GET error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id } = await params;
    const examSet = await prisma.examSet.findUnique({ where: { id } });
    if (!examSet) return NextResponse.json({ error: 'Not found', code: ErrorCode.EXAM_SET_NOT_FOUND }, { status: 404 });
    if (auth.session.user.role !== 'ADMIN' && examSet.createdById !== auth.session.user.id) {
      return NextResponse.json({ error: 'Access denied', code: ErrorCode.AUTH_FORBIDDEN }, { status: 403 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR, details: parsed.error.flatten() }, { status: 400 });

    const { questionIds, ...fields } = parsed.data;

    if (questionIds) {
      // Verify ownership of all questions
      const questions = await prisma.question.findMany({
        where: { id: { in: questionIds }, isActive: true },
        select: { id: true, createdById: true },
      });
      const invalidIds = questionIds.filter(qId => {
        const q = questions.find(qq => qq.id === qId);
        return !q || (q.createdById !== null && q.createdById !== auth.session.user.id && auth.session.user.role !== 'ADMIN');
      });
      if (invalidIds.length > 0) {
        return NextResponse.json({ error: 'Some questions not accessible', code: ErrorCode.VALIDATION_ERROR }, { status: 400 });
      }

      await prisma.examSetQuestion.deleteMany({ where: { examSetId: id } });
      await prisma.examSetQuestion.createMany({
        data: questionIds.map((qId, idx) => ({ examSetId: id, questionId: qId, sortOrder: idx })),
      });
    }

    const updated = await prisma.examSet.update({
      where: { id },
      data: fields,
      include: { _count: { select: { questions: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[teacher/exam-sets/[id]] PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id } = await params;
    const examSet = await prisma.examSet.findUnique({ where: { id } });
    if (!examSet) return NextResponse.json({ error: 'Not found', code: ErrorCode.EXAM_SET_NOT_FOUND }, { status: 404 });
    if (auth.session.user.role !== 'ADMIN' && examSet.createdById !== auth.session.user.id) {
      return NextResponse.json({ error: 'Access denied', code: ErrorCode.AUTH_FORBIDDEN }, { status: 403 });
    }

    await prisma.examSet.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[teacher/exam-sets/[id]] DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
