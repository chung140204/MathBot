import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { getUserTopicStats } from '@/features/study/lib/topic-stats';
import { getOrSetJson } from '@/shared/lib/cache';
import { subDays, format, isSameDay } from 'date-fns';
import { ErrorCode } from '@/shared/lib/errors';

const OVERVIEW_TTL_S = 180; // 3 minutes — invalidated immediately on exam submit

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', code: ErrorCode.AUTH_REQUIRED }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const payload = await getOrSetJson(`stats:overview:${userId}`, OVERVIEW_TTL_S, async () => {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Run all independent queries in parallel instead of fetching everything
    const [
      generalStats,
      scorePctStats,
      topicStatsMap,
      weeklyAttempts,
      recentAttempts,
      practiceDateRows,
      user,
    ] = await Promise.all([
      // 1. General stats via aggregate — no need to load all records
      prisma.examAttempt.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: { totalScore: true, timeTakenSecs: true },
      }),

      // 2. Avg/best score as percentages — computed in DB, avoids loading all rows
      prisma.$queryRaw<Array<{ avg_pct: number; max_pct: number }>>`
        SELECT
          COALESCE(AVG(CAST("totalScore" AS float) / NULLIF("totalQuestions", 0) * 100), 0) AS avg_pct,
          COALESCE(MAX(CAST("totalScore" AS float) / NULLIF("totalQuestions", 0) * 100), 0) AS max_pct
        FROM "exam_attempts"
        WHERE "userId" = ${userId}
      `,

      // 3. Topic stats via shared aggregation helper
      getUserTopicStats(userId),

      // 4. Weekly scores — only last 7 days instead of ALL attempts
      prisma.examAttempt.findMany({
        where: { userId, submittedAt: { gte: sevenDaysAgo } },
        select: { totalScore: true, totalQuestions: true, submittedAt: true },
        orderBy: { submittedAt: 'asc' },
      }),

      // 5. Recent attempts — only 5, no answers needed
      prisma.examAttempt.findMany({
        where: { userId },
        orderBy: { submittedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          topics: true,
          totalScore: true,
          totalQuestions: true,
          timeTakenSecs: true,
          submittedAt: true,
        },
      }),

      // 6. Streak — only distinct dates, no answers
      prisma.$queryRaw<Array<{ practice_date: string }>>`
        SELECT DISTINCT TO_CHAR("submittedAt", 'YYYY-MM-DD') AS practice_date
        FROM "exam_attempts"
        WHERE "userId" = ${userId}
        ORDER BY practice_date DESC
      `,

      // 7. Target score for the dashboard header
      prisma.user.findUnique({
        where: { id: userId },
        select: { targetScore: true },
      }),
    ]);

    const totalExams = generalStats._count.id;

    if (totalExams === 0) {
      return {
        totalExams: 0,
        averageScore: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalStudyTimeSecs: 0,
        topicStats: [],
        weeklyScores: Array.from({ length: 7 }).map((_, i) => ({
          date: format(subDays(now, 6 - i), 'yyyy-MM-dd'),
          score: null,
        })),
        recentAttempts: [],
        weakTopics: [],
        currentStreak: 0,
        bestStreak: 0,
        streakCalendar: Array.from({ length: 7 }).map((_, i) => {
          const date = subDays(now, 6 - i);
          return { date: format(date, 'yyyy-MM-dd'), practiced: false, isToday: isSameDay(date, now) };
        }),
        targetScore: user?.targetScore ?? null,
      };
    }

    // Process general stats
    const totalStudyTimeSecs = generalStats._sum.timeTakenSecs ?? 0;
    const totalCorrectRaw = generalStats._sum.totalScore ?? 0;

    const averageScore = Math.round(scorePctStats[0]?.avg_pct ?? 0);
    const bestScore = Math.round(scorePctStats[0]?.max_pct ?? 0);

    // Process topic stats from shared aggregation helper
    const topicStats = Array.from(topicStatsMap.values()).map(s => ({
      topic: s.topic,
      totalQuestions: s.totalQuestions,
      correctAnswers: s.correctAnswers,
      accuracy: s.accuracy,
    }));

    // Process weekly scores — only 7 days of data
    const weeklyScores = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(now, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayAttempts = weeklyAttempts.filter(a => isSameDay(new Date(a.submittedAt), date));

      if (dayAttempts.length === 0) {
        return { date: dateStr, score: null };
      }

      const avgDayScore = dayAttempts.reduce((sum, a) => sum + (a.totalScore / a.totalQuestions) * 100, 0) / dayAttempts.length;
      return { date: dateStr, score: Math.round(avgDayScore) };
    });

    // Recent attempts — already fetched with take: 5
    const formattedRecent = recentAttempts.map(a => ({
      id: a.id,
      topics: a.topics,
      totalScore: a.totalScore,
      totalQuestions: a.totalQuestions,
      timeTakenSecs: a.timeTakenSecs,
      submittedAt: a.submittedAt.toISOString(),
    }));

    // Weak topics
    const weakTopics = topicStats
      .filter(t => t.accuracy < 50)
      .sort((a, b) => a.accuracy - b.accuracy)
      .map(t => t.topic);

    // Streak calculation — from distinct dates only
    const practiceDates = practiceDateRows.map(r => r.practice_date);

    const todayStr = format(now, 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(now, 1), 'yyyy-MM-dd');

    let currentStreak = 0;
    if (practiceDates.length > 0) {
      const hasToday = practiceDates[0] === todayStr;
      const hasYesterday = practiceDates[0] === yesterdayStr || (hasToday && practiceDates[1] === yesterdayStr);

      if (hasToday || hasYesterday) {
        let checkDate = hasToday ? new Date(todayStr) : new Date(yesterdayStr);
        while (true) {
          const checkDateStr = format(checkDate, 'yyyy-MM-dd');
          if (practiceDates.includes(checkDateStr)) {
            currentStreak++;
            checkDate = subDays(checkDate, 1);
          } else {
            break;
          }
        }
      }
    }

    let bestStreak = 0;
    if (practiceDates.length > 0) {
      let tempStreak = 0;
      let lastDate: Date | null = null;

      practiceDates.forEach((dateStr) => {
        const currentDate = new Date(dateStr);
        if (!lastDate) {
          tempStreak = 1;
        } else {
          const diff = Math.round((lastDate.getTime() - currentDate.getTime()) / 86400000);
          if (diff === 1) {
            tempStreak++;
          } else {
            bestStreak = Math.max(bestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        lastDate = currentDate;
      });
      bestStreak = Math.max(bestStreak, tempStreak);
    }

    const streakCalendar = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(now, 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        date: dateStr,
        practiced: practiceDates.includes(dateStr),
        isToday: isSameDay(date, now),
      };
    });

    return {
      totalExams,
      averageScore,
      bestScore,
      totalCorrect: Math.round(totalCorrectRaw),
      totalStudyTimeSecs,
      topicStats,
      weeklyScores,
      recentAttempts: formattedRecent,
      weakTopics,
      currentStreak,
      bestStreak,
      streakCalendar,
      targetScore: user?.targetScore ?? null,
    };
    });

    return NextResponse.json(payload);
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
