import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { ErrorCode } from '@/shared/lib/errors';

// Returns the current student's learning profile (or null when none yet),
// used by the chat UI for a personalised greeting and topic-aware suggestions.
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized', code: ErrorCode.AUTH_REQUIRED }, { status: 401 });
    }

    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        level: true,
        weakTopics: true,
        strongTopics: true,
        lastStudied: true,
        sessionCount: true,
      },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
