import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/shared/lib/db';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';
import { generateClassCode } from '@/features/classroom/lib/class-code';

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export async function GET() {
  if (!flags.enableClassroom) {
    return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  }
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const classrooms = await prisma.classroom.findMany({
      where: { teacherId: auth.session.user.id, isActive: true },
      include: { _count: { select: { members: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(classrooms);
  } catch (error) {
    console.error('[teacher/classrooms] GET error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!flags.enableClassroom) {
    return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  }
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const body = await request.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR, details: parsed.error.flatten() }, { status: 400 });
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateClassCode();
      try {
        const classroom = await prisma.classroom.create({
          data: {
            name: parsed.data.name,
            description: parsed.data.description ?? null,
            code,
            teacherId: auth.session.user.id,
          },
          include: { _count: { select: { members: true } } },
        });
        return NextResponse.json(classroom, { status: 201 });
      } catch (e: unknown) {
        if (typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P2002') continue;
        throw e;
      }
    }
    return NextResponse.json({ error: 'Failed to generate unique code', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  } catch (error) {
    console.error('[teacher/classrooms] POST error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
