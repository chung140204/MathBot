import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/shared/lib/db';
import { requireRole, verifyClassroomOwnership } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

type Ctx = { params: Promise<{ id: string; assignmentId: string }> };

const patchSchema = z.object({
  dueAt: z.string().datetime().nullable().optional(),
  maxAttempts: z.number().int().min(1).max(10).nullable().optional(),
});

export async function PATCH(req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id, assignmentId } = await params;

    const ownership = await verifyClassroomOwnership(id, auth.session.user.id, auth.session.user.role);
    if (ownership.error) return ownership.response;

    const assignment = await prisma.classAssignment.findUnique({ where: { id: assignmentId } });
    if (!assignment || assignment.classroomId !== id) {
      return NextResponse.json({ error: 'Assignment not found', code: ErrorCode.ASSIGNMENT_NOT_FOUND }, { status: 404 });
    }

    const body = await req.json();
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR, details: parsed.error.flatten() }, { status: 400 });

    const updated = await prisma.classAssignment.update({
      where: { id: assignmentId },
      data: {
        ...(parsed.data.dueAt !== undefined ? { dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null } : {}),
        ...(parsed.data.maxAttempts !== undefined ? { maxAttempts: parsed.data.maxAttempts } : {}),
      },
      include: { examSet: { select: { title: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('[teacher/classrooms/[id]/assign/[assignmentId]] PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id, assignmentId } = await params;

    const ownership = await verifyClassroomOwnership(id, auth.session.user.id, auth.session.user.role);
    if (ownership.error) return ownership.response;

    const assignment = await prisma.classAssignment.findUnique({ where: { id: assignmentId } });
    if (!assignment || assignment.classroomId !== id) {
      return NextResponse.json({ error: 'Assignment not found', code: ErrorCode.ASSIGNMENT_NOT_FOUND }, { status: 404 });
    }

    await prisma.classAssignment.update({ where: { id: assignmentId }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[teacher/classrooms/[id]/assign/[assignmentId]] DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
