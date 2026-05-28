import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

export async function GET() {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('STUDENT', 'TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const memberships = await prisma.classMember.findMany({
      where: { userId: auth.session.user.id },
      include: {
        classroom: {
          include: {
            teacher: { select: { name: true } },
            _count: { select: { assignments: true, members: true } },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    const classes = memberships
      .filter(m => m.classroom.isActive)
      .map(m => ({
        id: m.classroom.id,
        name: m.classroom.name,
        code: m.classroom.code,
        teacherName: m.classroom.teacher.name,
        assignmentCount: m.classroom._count.assignments,
        memberCount: m.classroom._count.members,
        joinedAt: m.joinedAt,
      }));

    return NextResponse.json(classes);
  } catch (error) {
    console.error('[classroom/my-classes] GET error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
