import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/features/auth/lib/auth';
import { ErrorCode } from '@/shared/lib/errors';
import prisma from '@/shared/lib/db';

type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

interface AppSession {
  user: {
    id: string;
    role: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

interface AuthSuccess {
  error: false;
  session: AppSession;
}

interface AuthFailure {
  error: true;
  response: NextResponse;
}

export async function requireRole(...roles: UserRole[]): Promise<AuthSuccess | AuthFailure> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Unauthorized', code: ErrorCode.AUTH_REQUIRED },
        { status: 401 }
      ),
    };
  }

  const user = session.user as AppSession['user'];

  if (!roles.includes(user.role as UserRole)) {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Access denied', code: ErrorCode.AUTH_FORBIDDEN },
        { status: 403 }
      ),
    };
  }
  return { error: false, session: { user } };
}

/** Shorthand for admin-only routes */
export async function requireAdmin(): Promise<AuthSuccess | AuthFailure> {
  return requireRole('ADMIN');
}

// ── Ownership / membership helpers ─────────────────────────────────────────

interface OwnershipSuccess { error: false; classroom: { id: string; teacherId: string; isActive: boolean; name: string; code: string } }
interface OwnershipFailure { error: true; response: NextResponse }

/** Verify the caller owns (or is ADMIN for) a classroom. */
export async function verifyClassroomOwnership(
  classroomId: string,
  userId: string,
  role: string,
): Promise<OwnershipSuccess | OwnershipFailure> {
  const classroom = await prisma.classroom.findUnique({ where: { id: classroomId } });
  if (!classroom || !classroom.isActive) {
    return { error: true, response: NextResponse.json({ error: 'Classroom not found', code: ErrorCode.CLASSROOM_NOT_FOUND }, { status: 404 }) };
  }
  if (role !== 'ADMIN' && classroom.teacherId !== userId) {
    return { error: true, response: NextResponse.json({ error: 'Access denied', code: ErrorCode.AUTH_FORBIDDEN }, { status: 403 }) };
  }
  return { error: false, classroom };
}

interface MembershipSuccess { error: false }
interface MembershipFailure { error: true; response: NextResponse }

/** Verify the caller is a member of the classroom. */
export async function verifyClassMembership(
  classroomId: string,
  userId: string,
): Promise<MembershipSuccess | MembershipFailure> {
  const member = await prisma.classMember.findUnique({
    where: { classroomId_userId: { classroomId, userId } },
  });
  if (!member) {
    return { error: true, response: NextResponse.json({ error: 'Not a member', code: ErrorCode.CLASSROOM_NOT_MEMBER }, { status: 403 }) };
  }
  return { error: false };
}
