import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { requireRole, verifyClassroomOwnership } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';
import { generateClassCode } from '@/features/classroom/lib/class-code';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id } = await params;
    const ownership = await verifyClassroomOwnership(id, auth.session.user.id, auth.session.user.role);
    if (ownership.error) return ownership.response;

    for (let attempt = 0; attempt < 5; attempt++) {
      const newCode = generateClassCode();
      try {
        const updated = await prisma.classroom.update({ where: { id }, data: { code: newCode } });
        return NextResponse.json({ code: updated.code });
      } catch (e: unknown) {
        if (typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P2002') continue;
        throw e;
      }
    }
    return NextResponse.json({ error: 'Failed to generate unique code', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  } catch (error) {
    console.error('[teacher/classrooms/[id]/regenerate-code] error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
