import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { startOfDay, subDays, format, isSameDay } from 'date-fns';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // 1. Fetch all attempts for this user with answers and question topics
    const attempts = await prisma.examAttempt.findMany({
      where: { userId },
      include: {
        answers: {
          select: {
            score: true,
            question: {
              select: { topic: true }
            }
          }
        }
      },
      orderBy: { submittedAt: 'desc' },
    });

    if (attempts.length === 0) {
      return NextResponse.json({
        totalExams: 0,
        averageScore: 0,
        bestScore: 0,
        totalCorrect: 0,
        totalStudyTimeSecs: 0,
        topicStats: [],
        weeklyScores: Array.from({ length: 7 }).map((_, i) => ({
          date: format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'),
          score: null,
        })),
        recentAttempts: [],
        weakTopics: [],
      });
    }

    // 2. Aggregate general stats
    const totalExams = attempts.length;
    const totalStudyTimeSecs = attempts.reduce((sum, a) => sum + a.timeTakenSecs, 0);
    const totalCorrect = attempts.reduce((sum, a) => sum + a.totalScore, 0);
    
    const scoresPct = attempts.map(a => (a.totalScore / a.totalQuestions) * 100);
    const averageScore = Math.round(scoresPct.reduce((sum, s) => sum + s, 0) / totalExams);
    const bestScore = Math.round(Math.max(...scoresPct));

    // 3. Aggregate topic stats
    const topicMap: Record<string, { totalQuestions: number; correctAnswers: number }> = {};
    
    attempts.forEach(attempt => {
      attempt.answers.forEach(ans => {
        const topic = (ans.question as any)?.topic;
        if (!topic) return;

        if (!topicMap[topic]) {
          topicMap[topic] = { totalQuestions: 0, correctAnswers: 0 };
        }
        topicMap[topic].totalQuestions += 1;
        topicMap[topic].correctAnswers += ans.score;
      });
    });

    const topicStats = Object.entries(topicMap).map(([topic, stats]) => ({
      topic,
      totalQuestions: stats.totalQuestions,
      correctAnswers: Math.round(stats.correctAnswers * 10) / 10,
      accuracy: stats.totalQuestions > 0 ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) : 0,
    }));

    // 4. Weekly scores (over the last 7 days)
    const weeklyScores = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const dayAttempts = attempts.filter(a => isSameDay(new Date(a.submittedAt), date));
      
      if (dayAttempts.length === 0) {
        return { date: dateStr, score: null };
      }
      
      const avgDayScore = dayAttempts.reduce((sum, a) => sum + (a.totalScore / a.totalQuestions) * 100, 0) / dayAttempts.length;
      return { date: dateStr, score: Math.round(avgDayScore) };
    });

    // 5. Recent attempts
    const recentAttempts = attempts.slice(0, 5).map(a => ({
      id: a.id,
      topics: a.topics,
      totalScore: a.totalScore,
      totalQuestions: a.totalQuestions,
      timeTakenSecs: a.timeTakenSecs,
      submittedAt: a.submittedAt.toISOString(),
    }));

    // 6. Weak topics (accuracy < 50%)
    const weakTopics = topicStats
      .filter(t => t.accuracy < 50)
      .sort((a, b) => a.accuracy - b.accuracy)
      .map(t => t.topic);

    // 7. Streak calculation
    // Get unique practice dates sorted desc
    const practiceDates = Array.from(new Set(
      attempts.map(a => format(new Date(a.submittedAt), 'yyyy-MM-dd'))
    )).sort((a, b) => b.localeCompare(a));

    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const yesterdayStr = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    let currentStreak = 0;
    if (practiceDates.length > 0) {
      const hasToday = practiceDates[0] === todayStr;
      const hasYesterday = practiceDates[0] === yesterdayStr || (hasToday && practiceDates[1] === yesterdayStr);

      if (hasToday || hasYesterday) {
        let current = hasToday ? new Date(todayStr) : new Date(yesterdayStr);
        currentStreak = 0;
        
        // Find consecutive days in practiceDates
        let checkDate = current;
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

    // Calculate best streak
    let bestStreak = 0;
    if (practiceDates.length > 0) {
      let tempStreak = 0;
      let lastDate: Date | null = null;

      // practiceDates is sorted desc, so we iterate forwards (descending dates)
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

    // 7-day streak calendar (last 7 days including today)
    const streakCalendar = Array.from({ length: 7 }).map((_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      return {
        date: dateStr,
        practiced: practiceDates.includes(dateStr),
        isToday: isSameDay(date, new Date()),
      };
    });

    return NextResponse.json({
      totalExams,
      averageScore,
      bestScore,
      totalCorrect: Math.round(totalCorrect),
      totalStudyTimeSecs,
      topicStats,
      weeklyScores,
      recentAttempts,
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
