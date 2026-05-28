import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { requireRole, verifyClassroomOwnership } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id } = await params;

    const ownership = await verifyClassroomOwnership(id, auth.session.user.id, auth.session.user.role);
    if (ownership.error) return ownership.response;

    const attempts = await prisma.examAttempt.findMany({
      where: {
        classAssignment: { classroomId: id },
      },
      select: {
        id: true,
        totalScore: true,
        totalQuestions: true,
        timeTakenSecs: true,
        submittedAt: true,
        user: { select: { name: true, email: true } },
        classAssignment: { select: { examSet: { select: { title: true } } } },
      },
      orderBy: { submittedAt: 'desc' },
      take: 200,
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error('[teacher/classrooms/[id]/results] GET error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
