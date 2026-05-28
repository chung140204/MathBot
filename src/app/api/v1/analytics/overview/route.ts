import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { subDays, format, isSameDay } from 'date-fns';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const now = new Date();
    const sevenDaysAgo = subDays(now, 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    // Run all independent queries in parallel instead of fetching everything
    const [
      generalStats,
      topicStatsRaw,
      weeklyAttempts,
      recentAttempts,
      practiceDateRows,
    ] = await Promise.all([
      // 1. General stats via aggregate — no need to load all records
      prisma.examAttempt.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: { totalScore: true, timeTakenSecs: true },
      }),

      // 2. Topic stats via raw GROUP BY — replaces nested JS loops
      prisma.$queryRaw<
        Array<{ topic: string; total_questions: bigint; correct_score: number }>
      >`
        SELECT q."topic",
               COUNT(ea."id")::bigint AS total_questions,
               COALESCE(SUM(ea."score"), 0)::float AS correct_score
        FROM "ExamAnswer" ea
        JOIN "Question" q ON ea."questionId" = q."id"
        JOIN "ExamAttempt" att ON ea."examAttemptId" = att."id"
        WHERE att."userId" = ${userId}
        GROUP BY q."topic"
      `,

      // 3. Weekly scores — only last 7 days instead of ALL attempts
      prisma.examAttempt.findMany({
        where: { userId, submittedAt: { gte: sevenDaysAgo } },
        select: { totalScore: true, totalQuestions: true, submittedAt: true },
        orderBy: { submittedAt: 'asc' },
      }),

      // 4. Recent attempts — only 5, no answers needed
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

      // 5. Streak — only distinct dates, no answers
      prisma.$queryRaw<Array<{ practice_date: string }>>`
        SELECT DISTINCT TO_CHAR("submittedAt", 'YYYY-MM-DD') AS practice_date
        FROM "ExamAttempt"
        WHERE "userId" = ${userId}
        ORDER BY practice_date DESC
      `,
    ]);

    const totalExams = generalStats._count.id;

    if (totalExams === 0) {
      return NextResponse.json({
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
      });
    }

    // Process general stats
    const totalStudyTimeSecs = generalStats._sum.timeTakenSecs ?? 0;
    const totalCorrectRaw = generalStats._sum.totalScore ?? 0;

    // For averageScore and bestScore, we need score percentages
    // Use a lightweight query for just scores
    const scoreRows = await prisma.examAttempt.findMany({
      where: { userId },
      select: { totalScore: true, totalQuestions: true },
    });
    const scoresPct = scoreRows.map(a => (a.totalScore / a.totalQuestions) * 100);
    const averageScore = Math.round(scoresPct.reduce((sum, s) => sum + s, 0) / totalExams);
    const bestScore = Math.round(Math.max(...scoresPct));

    // Process topic stats from raw query
    const topicStats = topicStatsRaw.map(row => ({
      topic: row.topic,
      totalQuestions: Number(row.total_questions),
      correctAnswers: Math.round(Number(row.correct_score) * 10) / 10,
      accuracy: Number(row.total_questions) > 0
        ? Math.round((Number(row.correct_score) / Number(row.total_questions)) * 100)
        : 0,
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

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
