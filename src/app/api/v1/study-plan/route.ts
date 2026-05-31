import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { getUserTopicStats } from '@/features/study/lib/topic-stats';
import { computeStudyPlan, computeRoadmap } from '@/features/study/lib/planner';
import { getOrSetJson } from '@/shared/lib/cache';
import { ErrorCode } from '@/shared/lib/errors';

const STUDY_PLAN_TTL_S = 300; // 5 minutes — invalidated on exam submit

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', code: ErrorCode.AUTH_REQUIRED }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const payload = await getOrSetJson(`stats:studyplan:${userId}`, STUDY_PLAN_TTL_S, async () => {
    const [statsMap, user, avgRow] = await Promise.all([
      getUserTopicStats(userId),
      prisma.user.findUnique({
        where: { id: userId },
        select: { targetScore: true },
      }),
      prisma.$queryRaw<Array<{ avg_pct: number }>>`
        SELECT
          COALESCE(AVG(CAST("totalScore" AS float) / NULLIF("totalQuestions", 0) * 100), 0) AS avg_pct
        FROM "exam_attempts"
        WHERE "userId" = ${userId}
      `,
    ]);

    const averageScore = Math.round(avgRow[0]?.avg_pct ?? 0);

    return {
      plan: computeStudyPlan({
        statsMap,
        targetScore: user?.targetScore ?? null,
        averageScore,
      }),
      roadmap: computeRoadmap(statsMap),
    };
    });

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Study plan error:', error);
    return NextResponse.json({ error: 'Internal Server Error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
