import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { AppError, ErrorCode } from '@/lib/errors';

export async function GET(
  request: Request,
  { params }: { params: { attemptId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', code: ErrorCode.AUTH_REQUIRED },
        { status: 401 }
      );
    }

    const { attemptId } = params;
    const userId = (session.user as any).id;

    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found', code: ErrorCode.EXAM_NOT_FOUND },
        { status: 404 }
      );
    }

    if (attempt.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden', code: ErrorCode.AUTH_FORBIDDEN },
        { status: 403 }
      );
    }

    // Previous attempt for comparison
    const previousAttempt = await prisma.examAttempt.findFirst({
      where: {
        userId,
        submittedAt: { lt: attempt.submittedAt }
      },
      orderBy: { submittedAt: 'desc' }
    });

    // Calculate topic stats
    const topicStats: Record<string, { correct: number, total: number, score: number }> = {};
    
    attempt.answers.forEach((ans: any) => {
      const topic = ans.question.topic;
      if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0, score: 0 };
      topicStats[topic].total++;
      topicStats[topic].score += ans.score;
      if (ans.isCorrect) topicStats[topic].correct++;
    });

    const formattedTopicStats = Object.entries(topicStats).map(([topic, stats]) => ({
      topic,
      label: topic.replace(/_/g, ' '), // Placeholder label conversion
      correct: stats.correct,
      total: stats.total,
      accuracy: Math.round((stats.score / stats.total) * 100)
    }));

    return NextResponse.json({
      attemptId: attempt.id,
      totalScore: attempt.totalScore,
      totalQuestions: attempt.totalQuestions,
      percentage: Math.round((attempt.totalScore / attempt.totalQuestions) * 100),
      timeTakenSecs: attempt.timeTakenSecs,
      examTitle: 'Bài thi tổng hợp', // Or fetch from an ExamSet if linked
      previousAttempt: previousAttempt ? { percentage: Math.round((previousAttempt.totalScore / previousAttempt.totalQuestions) * 100) } : null,
      topicStats: formattedTopicStats,
      results: attempt.answers.map((ans: any, idx) => ({
        questionId: ans.questionId,
        questionNumber: idx + 1,
        content: ans.question.content,
        userAnswer: ans.userAnswer,
        correctAnswer: (ans.question as any).format === 'MULTIPLE_CHOICE' ? (ans.question as any).answer : ((ans.question as any).format === 'SHORT_ANSWER' ? (ans.question as any).correctAnswer : 'True/False'),
        isCorrect: ans.isCorrect,
        score: ans.score,
        explanation: (ans.question as any).explanation,
        topic: (ans.question as any).topic,
        format: (ans.question as any).format,
        options: (ans.question as any).options,
        statements: (ans.question as any).format === 'TRUE_FALSE' ? {
          A: (ans.question as any).statementA,
          B: (ans.question as any).statementB,
          C: (ans.question as any).statementC,
          D: (ans.question as any).statementD,
          ansA: (ans.question as any).answerA,
          ansB: (ans.question as any).answerB,
          ansC: (ans.question as any).answerC,
          ansD: (ans.question as any).answerD,
        } : undefined
      }))
    });

  } catch (error) {
    console.error('[exam-results-get] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
