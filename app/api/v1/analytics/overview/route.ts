import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function computeStreaks(allAttempts: { submittedAt: Date }[]): {
  currentStreak: number;
  bestStreak: number;
} {
  if (allAttempts.length === 0) return { currentStreak: 0, bestStreak: 0 };

  // Unique practice dates, sorted ascending
  const practiceDates = [
    ...new Set(allAttempts.map((a) => dateStr(a.submittedAt))),
  ].sort();

  // Best streak (longest consecutive run)
  let best = 1;
  let run = 1;
  for (let i = 1; i < practiceDates.length; i++) {
    const prev = new Date(practiceDates[i - 1]);
    const curr = new Date(practiceDates[i]);
    prev.setUTCDate(prev.getUTCDate() + 1);
    if (dateStr(prev) === practiceDates[i]) {
      run++;
      if (run > best) best = run;
    } else {
      run = 1;
    }
  }

  // Current streak (consecutive days ending at today or yesterday)
  const today = dateStr(new Date());
  const yesterday = dateStr(
    new Date(Date.now() - 86400000)
  );
  const lastDate = practiceDates[practiceDates.length - 1];

  let current = 0;
  if (lastDate === today || lastDate === yesterday) {
    current = 1;
    let check = new Date(lastDate);
    for (let i = practiceDates.length - 2; i >= 0; i--) {
      check.setUTCDate(check.getUTCDate() - 1);
      if (practiceDates[i] === dateStr(check)) {
        current++;
      } else {
        break;
      }
    }
  }

  return { currentStreak: current, bestStreak: Math.max(best, current) };
}

// ─── Route ───────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized', code: 'AUTH_REQUIRED' },
      { status: 401 }
    );
  }

  const userId = (session.user as { id: string }).id;
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') ?? 'all'; // '7d' | '30d' | 'all'

  // All attempts ever (used for streak + recent history)
  const allAttempts = await prisma.examAttempt.findMany({
    where: { userId },
    include: {
      answers: {
        include: { question: { select: { topic: true } } },
      },
    },
    orderBy: { submittedAt: 'asc' },
  });

  // Period-filtered attempts (used for stats)
  let periodCutoff: Date | null = null;
  if (period === '7d') {
    periodCutoff = new Date(Date.now() - 7 * 86400000);
  } else if (period === '30d') {
    periodCutoff = new Date(Date.now() - 30 * 86400000);
  }

  const attempts = periodCutoff
    ? allAttempts.filter((a) => a.submittedAt >= periodCutoff!)
    : allAttempts;

  // ── Core stats (period-scoped) ──
  const totalExams = attempts.length;

  const averageScore =
    totalExams > 0
      ? attempts.reduce(
          (sum, a) => sum + (a.totalQuestions > 0 ? (a.totalScore / a.totalQuestions) * 100 : 0),
          0
        ) / totalExams
      : 0;

  const bestScore =
    totalExams > 0
      ? Math.max(...attempts.map((a) => (a.totalQuestions > 0 ? (a.totalScore / a.totalQuestions) * 100 : 0)))
      : 0;

  const totalCorrect = attempts.reduce((sum, a) => sum + a.totalScore, 0);
  const totalStudyTimeSecs = attempts.reduce((sum, a) => sum + a.timeTakenSecs, 0);

  // ── Topic stats (period-scoped) ──
  const topicMap = new Map<string, { total: number; correct: number }>();
  for (const attempt of attempts) {
    if (!attempt.answers) continue;
    for (const answer of attempt.answers) {
      const topic = answer.question?.topic;
      if (!topic) continue;
      const existing = topicMap.get(topic) ?? { total: 0, correct: 0 };
      topicMap.set(topic, {
        total: existing.total + 1,
        correct: existing.correct + (answer.isCorrect ? 1 : 0),
      });
    }
  }

  const topicStats = Array.from(topicMap.entries()).map(([topic, stats]) => ({
    topic,
    totalQuestions: stats.total,
    correctAnswers: stats.correct,
    accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));

  const weakTopics = topicStats
    .filter((t) => (t.accuracy || 0) < 60)
    .map((t) => t.topic);

  // ── Weekly chart (always last 7 calendar days) ──
  const weeklyScores = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (6 - i));
    const ds = dateStr(d);
    const dayAttempts = allAttempts.filter(
      (a) => dateStr(a.submittedAt) === ds
    );
    const score =
      dayAttempts.length > 0
        ? dayAttempts.reduce(
            (sum, a) => sum + (a.totalScore / a.totalQuestions) * 100,
            0
          ) / dayAttempts.length
        : null;
    return { date: ds, score: score !== null ? Math.round(score) : null };
  });

  // ── Streak calendar (always last 7 days, all-time) ──
  const streakCalendar = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - (6 - i));
    const ds = dateStr(d);
    return {
      date: ds,
      practiced: allAttempts.some((a) => dateStr(a.submittedAt) === ds),
      isToday: i === 6,
    };
  });

  // ── Streak (all-time) ──
  const { currentStreak, bestStreak } = computeStreaks(allAttempts);

  // ── Recent 5 attempts (all-time, newest first) ──
  const recentAttempts = allAttempts
    .slice(-5)
    .reverse()
    .map((a) => ({
      id: a.id,
      topics: a.topics,
      totalScore: a.totalScore,
      totalQuestions: a.totalQuestions,
      timeTakenSecs: a.timeTakenSecs,
      submittedAt: a.submittedAt.toISOString(),
    }));

  // ── recentTrend – last 10 attempts (API spec) ──
  const recentTrend = allAttempts.slice(-10).map((a) => ({
    date: dateStr(a.submittedAt),
    score: a.totalQuestions > 0 ? Math.round((a.totalScore / a.totalQuestions) * 100) : 0,
  }));

  return NextResponse.json({
    period,
    totalExams,
    averageScore: Math.round(averageScore),
    bestScore: Math.round(bestScore),
    totalCorrect,
    totalStudyTimeSecs,
    topicStats,
    weakTopics,
    weeklyScores,
    streakCalendar,
    currentStreak,
    bestStreak,
    recentAttempts,
    recentTrend,
  });
}
