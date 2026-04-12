import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { scoreQuestion } from '@/lib/scoring';

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
    const { answers, timeTakenSecs, topics } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 });
    }

    const questionIds = answers.map((a: { questionId: string }) => a.questionId);
    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } }
    });

    // 2. Fetch point settings (assume global for now or from first question's exam set)
    // In a real app, this might come from an ExamSet linked to the session
    const examSet = await prisma.examSet.findFirst() || {
      pointPerMC: 1,
      pointPerTFItem: 0.25,
      pointPerSA: 0.5
    };

    let totalScore = 0;
    const answerRecords = [];

    // 3. Process each answer
    for (const answerData of answers) {
      const question = questions.find((q: { id: string }) => q.id === answerData.questionId);
      if (!question) continue;

      const score = scoreQuestion(question, answerData, examSet);
      totalScore += score;

      // Determine correctness (for MC/SA it's binary, for TF it might be partial)
      // For simplicity, isCorrect is true if score > 0
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

    // 4. Create Exam Attempt and Answers
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
