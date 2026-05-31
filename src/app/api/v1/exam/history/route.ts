import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { ErrorCode } from '@/shared/lib/errors';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', code: ErrorCode.AUTH_REQUIRED }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const { searchParams } = new URL(req.url);
    const { page, limit } = querySchema.parse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    });

    const [total, attempts] = await Promise.all([
      prisma.examAttempt.count({ where: { userId } }),
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { submittedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          topics: true,
          mode: true,
          totalScore: true,
          totalQuestions: true,
          timeTakenSecs: true,
          submittedAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      attempts: attempts.map(a => ({
        id: a.id,
        topics: a.topics,
        mode: a.mode,
        totalScore: a.totalScore,
        totalQuestions: a.totalQuestions,
        timeTakenSecs: a.timeTakenSecs,
        submittedAt: a.submittedAt.toISOString(),
      })),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', code: ErrorCode.VALIDATION_ERROR }, { status: 400 });
    }
    console.error('[Exam History] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
