import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { Topic } from '@prisma/client';
import { computeDailySuggestions, type TopicStats } from '@/lib/suggestions/daily';
import { format, subDays } from 'date-fns';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    // Lightweight query: per-topic accuracy + last practiced date
    const attempts = await prisma.examAttempt.findMany({
      where: { userId },
      select: {
        submittedAt: true,
        answers: {
          select: {
            score: true,
            question: { select: { topic: true } },
          },
        },
      },
    });

    // Build per-topic stats
    const statsMap = new Map<Topic, TopicStats>();

    for (const attempt of attempts) {
      for (const ans of attempt.answers) {
        const topic = ans.question.topic;
        let entry = statsMap.get(topic);
        if (!entry) {
          entry = {
            topic,
            totalQuestions: 0,
            correctAnswers: 0,
            accuracy: 0,
            lastPracticed: null,
          };
          statsMap.set(topic, entry);
        }
        entry.totalQuestions += 1;
        entry.correctAnswers += ans.score;

        if (!entry.lastPracticed || attempt.submittedAt > entry.lastPracticed) {
          entry.lastPracticed = attempt.submittedAt;
        }
      }
    }

    // Compute accuracy percentage
    for (const entry of statsMap.values()) {
      entry.accuracy = entry.totalQuestions > 0
        ? Math.round((entry.correctAnswers / entry.totalQuestions) * 100)
        : 0;
    }

    const suggestions = computeDailySuggestions(statsMap, userId);

    // Quick streak calculation
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

    return NextResponse.json({ suggestions, currentStreak });
  } catch (error) {
    console.error('[Suggestions] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
