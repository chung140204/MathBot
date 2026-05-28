import { NextResponse } from 'next/server';
import prisma from '@/shared/lib/db';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

type Ctx = { params: Promise<{ id: string; assignmentId: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const { id, assignmentId } = await params;

    // 1. Verify ownership + fetch assignment in parallel
    const [classroom, assignment] = await Promise.all([
      prisma.classroom.findUnique({ where: { id }, select: { id: true, teacherId: true } }),
      prisma.classAssignment.findUnique({
        where: { id: assignmentId },
        include: {
          examSet: {
            include: {
              questions: {
                include: { question: { select: { id: true, content: true } } },
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      }),
    ]);

    if (!classroom) return NextResponse.json({ error: 'Not found', code: ErrorCode.CLASSROOM_NOT_FOUND }, { status: 404 });
    if (auth.session.user.role !== 'ADMIN' && classroom.teacherId !== auth.session.user.id) {
      return NextResponse.json({ error: 'Access denied', code: ErrorCode.AUTH_FORBIDDEN }, { status: 403 });
    }
    if (!assignment || assignment.classroomId !== id) {
      return NextResponse.json({ error: 'Assignment not found', code: ErrorCode.ASSIGNMENT_NOT_FOUND }, { status: 404 });
    }

    const questionIds = assignment.examSet.questions.map(esq => esq.question.id);

    // 2. Run all stats queries in parallel (instead of sequential)
    const [totalMembers, attempts, answerStats] = await Promise.all([
      prisma.classMember.count({ where: { classroomId: id } }),

      prisma.examAttempt.findMany({
        where: { classAssignmentId: assignmentId },
        select: { userId: true, totalScore: true, totalQuestions: true },
      }),

      // GROUP BY query — returns 1 row per question instead of thousands of answer rows
      prisma.$queryRaw<
        Array<{ questionId: string; correct_count: bigint; wrong_count: bigint }>
      >`
        SELECT ea."questionId",
               COUNT(CASE WHEN ea."isCorrect" = true THEN 1 END)::bigint AS correct_count,
               COUNT(CASE WHEN ea."isCorrect" = false THEN 1 END)::bigint AS wrong_count
        FROM "ExamAnswer" ea
        JOIN "ExamAttempt" att ON ea."examAttemptId" = att."id"
        WHERE att."classAssignmentId" = ${assignmentId}
          AND ea."questionId" IN (SELECT unnest(${questionIds}::text[]))
        GROUP BY ea."questionId"
      `,
    ]);

    const uniqueStudentIds = new Set(attempts.map(a => a.userId));
    const totalSubmitted = uniqueStudentIds.size;
    const totalAttempts = attempts.length;

    const avgScore = totalAttempts > 0
      ? attempts.reduce((sum, a) => sum + (a.totalScore / a.totalQuestions) * 10, 0) / totalAttempts
      : null;

    // Build answer map from aggregated stats (not individual rows)
    const answerMap = new Map<string, { correct: number; wrong: number }>();
    for (const row of answerStats) {
      answerMap.set(row.questionId, {
        correct: Number(row.correct_count),
        wrong: Number(row.wrong_count),
      });
    }

    const questions = assignment.examSet.questions.map((esq, idx) => {
      const q = esq.question;
      const stats = answerMap.get(q.id) ?? { correct: 0, wrong: 0 };
      const total = stats.correct + stats.wrong;
      return {
        index: idx + 1,
        id: q.id,
        content: q.content.length > 120 ? q.content.slice(0, 120) + '…' : q.content,
        totalAnswers: total,
        correctCount: stats.correct,
        wrongCount: stats.wrong,
        correctPct: total > 0 ? Math.round((stats.correct / total) * 100) : 0,
        wrongPct: total > 0 ? Math.round((stats.wrong / total) * 100) : 0,
      };
    });

    return NextResponse.json({
      assignmentId,
      examSetTitle: assignment.examSet.title,
      totalMembers,
      totalSubmitted,
      totalAttempts,
      avgScore: avgScore !== null ? Math.round(avgScore * 10) / 10 : null,
      questions,
    });
  } catch (error) {
    console.error('[teacher/classrooms/[id]/assignments/[assignmentId]/analytics] GET error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
