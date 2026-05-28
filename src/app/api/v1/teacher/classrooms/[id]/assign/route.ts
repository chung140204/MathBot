import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/shared/lib/db';
import { requireRole, verifyClassroomOwnership } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

const assignSchema = z.object({
  examSetId: z.string().min(1),
  dueAt: z.string().datetime().optional(),
  maxAttempts: z.number().int().min(1).max(10).optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id } = await params;

    const ownership = await verifyClassroomOwnership(id, auth.session.user.id, auth.session.user.role);
    if (ownership.error) return ownership.response;

    const body = await request.json();
    const parsed = assignSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR, details: parsed.error.flatten() }, { status: 400 });

    // Verify exam set ownership
    const examSet = await prisma.examSet.findUnique({ where: { id: parsed.data.examSetId } });
    if (!examSet || !examSet.isActive) return NextResponse.json({ error: 'Exam set not found', code: ErrorCode.EXAM_SET_NOT_FOUND }, { status: 404 });
    if (auth.session.user.role !== 'ADMIN' && examSet.createdById !== auth.session.user.id) {
      return NextResponse.json({ error: 'Access denied', code: ErrorCode.AUTH_FORBIDDEN }, { status: 403 });
    }

    const assignment = await prisma.classAssignment.create({
      data: {
        classroomId: id,
        examSetId: parsed.data.examSetId,
        dueAt: parsed.data.dueAt ? new Date(parsed.data.dueAt) : null,
        maxAttempts: parsed.data.maxAttempts ?? null,
      },
      include: { examSet: { select: { title: true } } },
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (e: unknown) {
    if (typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Exam set already assigned to this class', code: ErrorCode.VALIDATION_ERROR }, { status: 409 });
    }
    console.error('[teacher/classrooms/[id]/assign] POST error:', e);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
