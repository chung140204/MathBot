import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/shared/lib/db';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

const joinSchema = z.object({
  code: z.string().min(1),
});

export async function POST(request: Request) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('STUDENT', 'TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const body = await request.json();
    const parsed = joinSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR }, { status: 400 });

    const classroom = await prisma.classroom.findUnique({
      where: { code: parsed.data.code },
      include: { teacher: { select: { name: true } } },
    });

    if (!classroom || !classroom.isActive) {
      return NextResponse.json({ error: 'Invalid class code', code: ErrorCode.CLASSROOM_INVALID_CODE }, { status: 400 });
    }

    // Check already joined
    const existing = await prisma.classMember.findUnique({
      where: { classroomId_userId: { classroomId: classroom.id, userId: auth.session.user.id } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Already joined this class', code: ErrorCode.CLASSROOM_ALREADY_JOINED }, { status: 409 });
    }

    await prisma.classMember.create({
      data: { classroomId: classroom.id, userId: auth.session.user.id },
    });

    return NextResponse.json({
      id: classroom.id,
      name: classroom.name,
      code: classroom.code,
      teacherName: classroom.teacher.name,
    }, { status: 201 });
  } catch (error) {
    console.error('[classroom/join] POST error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
