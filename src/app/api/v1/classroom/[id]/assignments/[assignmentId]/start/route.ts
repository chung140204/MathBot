import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { requireRole, verifyClassMembership } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';
import { stripQuestionAnswers } from '@/shared/lib/question-helpers';

type Ctx = { params: Promise<{ id: string; assignmentId: string }> };

export async function POST(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('STUDENT', 'TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id, assignmentId } = await params;

    const membership = await verifyClassMembership(id, auth.session.user.id);
    if (membership.error) return membership.response;

    const assignment = await prisma.classAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        examSet: {
          include: {
            questions: {
              include: { question: true },
              orderBy: { sortOrder: 'asc' },
            },
          },
        },
      },
    });

    if (!assignment || !assignment.isActive || assignment.classroomId !== id) {
      return NextResponse.json({ error: 'Assignment not found', code: ErrorCode.ASSIGNMENT_NOT_FOUND }, { status: 404 });
    }

    // Check expired
    if (assignment.dueAt && new Date(assignment.dueAt) < new Date()) {
      return NextResponse.json({ error: 'Assignment expired', code: ErrorCode.ASSIGNMENT_EXPIRED }, { status: 400 });
    }

    // Check attempt limit
    const attemptCount = await prisma.examAttempt.count({
      where: { userId: auth.session.user.id, classAssignmentId: assignmentId },
    });
    if (assignment.maxAttempts !== null && attemptCount >= assignment.maxAttempts) {
      return NextResponse.json({ error: 'Already submitted', code: ErrorCode.ASSIGNMENT_ALREADY_SUBMITTED }, { status: 409 });
    }

    // Strip answers from questions
    const questions = assignment.examSet.questions.map(esq => stripQuestionAnswers(esq.question));

    return NextResponse.json({
      assignmentId: assignment.id,
      title: assignment.examSet.title,
      description: assignment.examSet.description,
      timeLimit: assignment.examSet.timeLimit,
      questions,
    });
  } catch (error) {
    console.error('[classroom/[id]/assignments/[assignmentId]/start] error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
