import { Topic } from '@prisma/client';
import prisma from '@/shared/lib/db';
import type { TopicStats } from '@/features/study/lib/daily';

/**
 * Build per-topic practice statistics for a user via a single raw GROUP BY query.
 *
 * Mirrors the aggregation used in the analytics overview route (JOIN
 * exam_answers -> questions -> exam_attempts, grouped by topic) but also
 * surfaces the most recent submission per topic so callers can populate
 * `lastPracticed`.
 *
 * `correctAnswers` carries the summed answer score (consistent with the rest of
 * the codebase), and `accuracy` is rounded to a 0–100 integer with a
 * divide-by-zero guard.
 */
export async function getUserTopicStats(
  userId: string,
): Promise<Map<Topic, TopicStats>> {
  const rows = await prisma.$queryRaw<
    Array<{
      topic: string;
      total_questions: bigint;
      correct_score: number;
      last_practiced: Date | null;
    }>
  >`
    SELECT q."topic",
           COUNT(ea."id")::bigint AS total_questions,
           COALESCE(SUM(ea."score"), 0)::float AS correct_score,
           MAX(att."submittedAt") AS last_practiced
    FROM "exam_answers" ea
    JOIN "questions" q ON ea."questionId" = q."id"
    JOIN "exam_attempts" att ON ea."examAttemptId" = att."id"
    WHERE att."userId" = ${userId}
    GROUP BY q."topic"
  `;

  const statsMap = new Map<Topic, TopicStats>();

  for (const row of rows) {
    const totalQuestions = Number(row.total_questions);
    const correctScore = Number(row.correct_score);

    statsMap.set(row.topic as Topic, {
      topic: row.topic as Topic,
      totalQuestions,
      correctAnswers: Math.round(correctScore * 10) / 10,
      accuracy:
        totalQuestions > 0
          ? Math.round((correctScore / totalQuestions) * 100)
          : 0,
      lastPracticed: row.last_practiced ? new Date(row.last_practiced) : null,
    });
  }

  return statsMap;
}
