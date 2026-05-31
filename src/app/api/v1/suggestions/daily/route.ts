import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { computeDailySuggestions } from '@/features/study/lib/daily';
import { getUserTopicStats } from '@/features/study/lib/topic-stats';
import { getOrSetJson } from '@/shared/lib/cache';
import { format, subDays } from 'date-fns';
import { ErrorCode } from '@/shared/lib/errors';

const SUGGESTIONS_TTL_S = 300; // 5 minutes — invalidated on exam submit

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', code: ErrorCode.AUTH_REQUIRED }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const payload = await getOrSetJson(`stats:suggestions:${userId}`, SUGGESTIONS_TTL_S, async () => {
    // Per-topic accuracy + last practiced date via shared aggregation helper
    const statsMap = await getUserTopicStats(userId);

    const suggestions = computeDailySuggestions(statsMap, userId);

    // Distinct practice dates for the streak calculation
    const attempts = await prisma.examAttempt.findMany({
      where: { userId },
      select: { submittedAt: true },
    });

    const practiceDates = Array.from(new Set(
      attempts.map(a => format(a.submittedAt, 'yyyy-MM-dd'))
    )).sort((a, b) => b.localeCompare(a));

    let currentStreak = 0;
    if (practiceDates.length > 0) {
      const todayStr = format(new Date(), 'yyyy-MM-dd');
      const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');
      if (practiceDates[0] === todayStr || practiceDates[0] === yesterdayStr) {
        let checkDate = practiceDates[0] === todayStr ? new Date() : subDays(new Date(), 1);
        while (practiceDates.includes(format(checkDate, 'yyyy-MM-dd'))) {
          currentStreak++;
          checkDate = subDays(checkDate, 1);
        }
      }
    }

    return { suggestions, currentStreak };
    });

    return NextResponse.json(payload);
  } catch (error) {
    console.error('[Suggestions] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
