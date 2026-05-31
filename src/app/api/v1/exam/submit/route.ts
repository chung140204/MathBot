import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { cacheDel } from '@/shared/lib/cache';
import { scoreQuestion, THPT_SCORING, DEFAULT_SCORING } from '@/features/exam/lib/scoring';
import { ExamMode } from '@prisma/client';

/**
 * POST /api/v1/exam/submit
 * Submits exam answers, calculates score, and stores the attempt.
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { answers, timeTakenSecs, topics, mode } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 });
    }

    // Resolve exam mode
    const examMode: ExamMode = mode === 'THPT' ? 'THPT' : mode === 'QUICK' ? 'QUICK' : 'STANDARD';
    const isThpt = examMode === 'THPT';

    const questionIds = answers.map((a: { questionId: string }) => a.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } }
    });

    // Scoring config: THPT uses fixed scoring, others use defaults
    const scoringConfig = isThpt ? THPT_SCORING : DEFAULT_SCORING;

    let totalScore = 0;
    const answerRecords = [];

    for (const answerData of answers) {
      const question = questions.find((q: { id: string }) => q.id === answerData.questionId);
      if (!question) continue;

      const score = scoreQuestion(question, answerData, scoringConfig, isThpt ? 'THPT' : undefined);
      totalScore += score;

      const isCorrect = score > 0;

      answerRecords.push({
        questionId: question.id,
        userAnswer: answerData.userAnswer || answerData.selectedOpt || null,
        shortAnswer: answerData.shortAnswer || null,
        tfAnswerA: answerData.tfAnswerA ?? null,
        tfAnswerB: answerData.tfAnswerB ?? null,
        tfAnswerC: answerData.tfAnswerC ?? null,
        tfAnswerD: answerData.tfAnswerD ?? null,
        isCorrect,
        score,
      });
    }

    // Round totalScore to 2 decimal places
    totalScore = Math.round(totalScore * 100) / 100;

    const attempt = await prisma.examAttempt.create({
      data: {
        userId: session.user.id,
        totalScore,
        totalQuestions: questions.length,
        timeTakenSecs: timeTakenSecs || 0,
        topics: topics || [],
        answers: {
          create: answerRecords,
        },
      },
    });

    // Stats changed — drop this user's cached analytics so dashboards stay fresh.
    const uid = session.user.id;
    await Promise.all([
      cacheDel(`stats:overview:${uid}`),
      cacheDel(`stats:suggestions:${uid}`),
      cacheDel(`stats:studyplan:${uid}`),
    ]);

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      totalScore,
    });
  } catch (error) {
    console.error('[API_EXAM_SUBMIT] Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
