import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { requireRole, verifyClassroomOwnership } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

type Ctx = { params: Promise<{ id: string; attemptId: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id, attemptId } = await params;

    const ownership = await verifyClassroomOwnership(id, auth.session.user.id, auth.session.user.role);
    if (ownership.error) return ownership.response;

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        user: { select: { name: true, email: true } },
        answers: {
          include: { question: true },
        },
        classAssignment: { include: { examSet: { select: { title: true } } } },
      },
    });

    if (!attempt || attempt.classAssignment?.classroomId !== id) {
      return NextResponse.json({ error: 'Attempt not found', code: ErrorCode.EXAM_NOT_FOUND }, { status: 404 });
    }

    return NextResponse.json(attempt);
  } catch (error) {
    console.error('[teacher/classrooms/[id]/results/[attemptId]] GET error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
