import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/shared/lib/db';
import { requireRole, verifyClassMembership } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';
import { scoreQuestion, DEFAULT_SCORING } from '@/features/exam/lib/scoring';

const answerSchema = z.object({
  questionId: z.string(),
  answer: z.string().nullable().optional(),
  shortAnswer: z.string().nullable().optional(),
  tfAnswerA: z.boolean().optional(),
  tfAnswerB: z.boolean().optional(),
  tfAnswerC: z.boolean().optional(),
  tfAnswerD: z.boolean().optional(),
});

const submitSchema = z.object({
  answers: z.array(answerSchema),
  timeTakenSecs: z.number().int().min(0),
});

type Ctx = { params: Promise<{ id: string; assignmentId: string }> };

export async function POST(request: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('STUDENT', 'TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id, assignmentId } = await params;

    const membership = await verifyClassMembership(id, auth.session.user.id);
    if (membership.error) return membership.response;

    const assignment = await prisma.classAssignment.findUnique({ where: { id: assignmentId } });
    if (!assignment || !assignment.isActive || assignment.classroomId !== id) {
      return NextResponse.json({ error: 'Assignment not found', code: ErrorCode.ASSIGNMENT_NOT_FOUND }, { status: 404 });
    }

    // Check attempt limit
    const attemptCount = await prisma.examAttempt.count({
      where: { userId: auth.session.user.id, classAssignmentId: assignmentId },
    });
    if (assignment.maxAttempts !== null && attemptCount >= assignment.maxAttempts) {
      return NextResponse.json({ error: 'Max attempts reached', code: ErrorCode.ASSIGNMENT_ALREADY_SUBMITTED }, { status: 409 });
    }

    const body = await request.json();
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR, details: parsed.error.flatten() }, { status: 400 });

    const { answers, timeTakenSecs } = parsed.data;
    const questionIds = answers.map(a => a.questionId);
    const questions = await prisma.question.findMany({ where: { id: { in: questionIds } } });
    const questionMap = new Map(questions.map(q => [q.id, q]));

    let totalScore = 0;
    const examAnswers: Array<{
      questionId: string; userAnswer: string | null; shortAnswer: string | null;
      isCorrect: boolean; score: number;
      tfAnswerA: boolean | null; tfAnswerB: boolean | null; tfAnswerC: boolean | null; tfAnswerD: boolean | null;
    }> = [];

    for (const ans of answers) {
      const q = questionMap.get(ans.questionId);
      if (!q) continue;

      const score = scoreQuestion(q, { userAnswer: ans.answer, shortAnswer: ans.shortAnswer, tfAnswerA: ans.tfAnswerA, tfAnswerB: ans.tfAnswerB, tfAnswerC: ans.tfAnswerC, tfAnswerD: ans.tfAnswerD }, DEFAULT_SCORING);
      const isCorrect = score > 0;
      totalScore += score;

      examAnswers.push({
        questionId: q.id,
        userAnswer: ans.answer || null,
        shortAnswer: ans.shortAnswer || null,
        isCorrect,
        score,
        tfAnswerA: ans.tfAnswerA ?? null,
        tfAnswerB: ans.tfAnswerB ?? null,
        tfAnswerC: ans.tfAnswerC ?? null,
        tfAnswerD: ans.tfAnswerD ?? null,
      });
    }

    // Get topics from questions
    const topics = [...new Set(questions.map(q => q.topic))];

    const attempt = await prisma.examAttempt.create({
      data: {
        userId: auth.session.user.id,
        totalScore,
        totalQuestions: answers.length,
        timeTakenSecs,
        topics,
        mode: 'STANDARD',
        classAssignmentId: assignmentId,
        answers: { create: examAnswers },
      },
    });

    // Build results with correct answers
    const results = examAnswers.map(ea => {
      const q = questionMap.get(ea.questionId);
      return {
        questionId: ea.questionId,
        userAnswer: ea.userAnswer,
        shortAnswer: ea.shortAnswer,
        correctAnswer: q?.answer || q?.correctAnswer || '',
        isCorrect: ea.isCorrect,
        score: ea.score,
        explanation: q?.explanation || '',
      };
    });

    return NextResponse.json({
      attemptId: attempt.id,
      totalScore,
      totalQuestions: answers.length,
      percentage: answers.length > 0 ? Math.round((totalScore / answers.length) * 100) : 0,
      results,
    });
  } catch (error) {
    console.error('[classroom/[id]/assignments/[assignmentId]/submit] error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
