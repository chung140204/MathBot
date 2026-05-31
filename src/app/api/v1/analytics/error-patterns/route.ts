import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { Topic } from '@prisma/client';
import { TOPIC_LABEL } from '@/shared/constants/topics';
import { ErrorCode } from '@/shared/lib/errors';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized', code: ErrorCode.AUTH_REQUIRED }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const rows = await prisma.$queryRaw<
      Array<{
        topic: string;
        difficulty: string;
        wrong: number;
        total: number;
      }>
    >`
      SELECT q."topic" AS topic, q."difficulty" AS difficulty,
             COUNT(*) FILTER (WHERE ea."isCorrect" = false)::int AS wrong,
             COUNT(*)::int AS total
      FROM "exam_answers" ea
      JOIN "questions" q ON ea."questionId" = q."id"
      JOIN "exam_attempts" att ON ea."examAttemptId" = att."id"
      WHERE att."userId" = ${userId}
      GROUP BY q."topic", q."difficulty"
    `;

    const patterns = rows
      .filter((row) => row.total >= 2 && row.wrong > 0)
      .map((row) => ({
        topic: row.topic,
        difficulty: row.difficulty,
        wrong: row.wrong,
        total: row.total,
        rate: Math.round((row.wrong / row.total) * 100),
        label: TOPIC_LABEL[row.topic as Topic],
      }))
      .sort((a, b) => b.wrong - a.wrong || b.rate - a.rate)
      .slice(0, 6);

    return NextResponse.json({ patterns });
  } catch (error) {
    console.error('Error patterns error:', error);
    return NextResponse.json({ error: 'Internal Server Error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
