import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/shared/lib/db';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  isActive: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

async function verifyOwnership(id: string, userId: string, role: string) {
  const classroom = await prisma.classroom.findUnique({ where: { id } });
  if (!classroom) return { error: true as const, status: 404, code: ErrorCode.CLASSROOM_NOT_FOUND };
  if (role !== 'ADMIN' && classroom.teacherId !== userId) return { error: true as const, status: 403, code: ErrorCode.AUTH_FORBIDDEN };
  return { error: false as const, classroom };
}

export async function GET(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id } = await params;

    // Single query — includes ownership check via teacherId
    const classroom = await prisma.classroom.findUnique({
      where: { id },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true } } } },
        assignments: {
          where: { isActive: true },
          include: {
            examSet: { select: { id: true, title: true, _count: { select: { questions: true } } } },
            _count: { select: { examAttempts: true } },
          },
          orderBy: { assignedAt: 'desc' },
        },
        _count: { select: { members: true } },
      },
    });

    if (!classroom) return NextResponse.json({ error: 'Not found', code: ErrorCode.CLASSROOM_NOT_FOUND }, { status: 404 });
    if (auth.session.user.role !== 'ADMIN' && classroom.teacherId !== auth.session.user.id) {
      return NextResponse.json({ error: 'Access denied', code: ErrorCode.AUTH_FORBIDDEN }, { status: 403 });
    }

    return NextResponse.json(classroom);
  } catch (error) {
    console.error('[teacher/classrooms/[id]] GET error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id } = await params;
    const own = await verifyOwnership(id, auth.session.user.id, auth.session.user.role);
    if (own.error) return NextResponse.json({ error: 'Not found', code: own.code }, { status: own.status });

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR, details: parsed.error.flatten() }, { status: 400 });

    const updated = await prisma.classroom.update({ where: { id }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('[teacher/classrooms/[id]] PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id } = await params;
    const own = await verifyOwnership(id, auth.session.user.id, auth.session.user.role);
    if (own.error) return NextResponse.json({ error: 'Not found', code: own.code }, { status: own.status });

    await prisma.classroom.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[teacher/classrooms/[id]] DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
