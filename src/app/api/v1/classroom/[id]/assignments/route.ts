import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { requireRole, verifyClassMembership } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('STUDENT', 'TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id } = await params;

    const membership = await verifyClassMembership(id, auth.session.user.id);
    if (membership.error) return membership.response;

    const assignments = await prisma.classAssignment.findMany({
      where: { classroomId: id, isActive: true },
      include: {
        examSet: {
          select: { id: true, title: true, description: true, timeLimit: true, _count: { select: { questions: true } } },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });

    // Get all attempts for this student across these assignments (ordered latest first)
    const allAttempts = await prisma.examAttempt.findMany({
      where: {
        userId: auth.session.user.id,
        classAssignmentId: { in: assignments.map(a => a.id) },
      },
      select: { classAssignmentId: true, totalScore: true, totalQuestions: true, id: true },
      orderBy: { submittedAt: 'desc' },
    });

    // Group attempts by assignmentId
    const attemptsByAssignment = new Map<string, typeof allAttempts>();
    for (const a of allAttempts) {
      if (!a.classAssignmentId) continue;
      if (!attemptsByAssignment.has(a.classAssignmentId)) attemptsByAssignment.set(a.classAssignmentId, []);
      attemptsByAssignment.get(a.classAssignmentId)!.push(a);
    }

    const result = assignments.map(a => {
      const attempts = attemptsByAssignment.get(a.id) ?? [];
      return {
        ...a,
        maxAttempts: a.maxAttempts,
        attemptCount: attempts.length,
        latestAttempt: attempts[0] ?? null,
        canRetry: (a.maxAttempts === null || attempts.length < a.maxAttempts) && !(a.dueAt && new Date(a.dueAt) < new Date()),
        isExpired: a.dueAt ? new Date(a.dueAt) < new Date() : false,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('[classroom/[id]/assignments] GET error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
