/**
 * Teacher dashboard stats business logic — extracted from teacher/stats/route.ts.
 */
import prisma from '@/shared/lib/db';

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export async function getTeacherMetrics(teacherId: string) {
  const [totalClassrooms, totalExamSets, totalQuestions, classroomsWithMembers] = await Promise.all([
    prisma.classroom.count({ where: { teacherId, isActive: true } }),
    prisma.examSet.count({ where: { createdById: teacherId, isActive: true } }),
    prisma.question.count({ where: { createdById: teacherId, isActive: true } }),
    prisma.classroom.findMany({
      where: { teacherId, isActive: true },
      include: {
        _count: { select: { members: true } },
        assignments: { where: { isActive: true }, select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);
  const totalStudents = classroomsWithMembers.reduce((sum, c) => sum + c._count.members, 0);
  return { totalClassrooms, totalExamSets, totalQuestions, totalStudents, classroomsWithMembers };
}

// ---------------------------------------------------------------------------
// Attempts
// ---------------------------------------------------------------------------

export async function getTeacherAttempts(classroomIds: string[]) {
  if (classroomIds.length === 0) return [];
  return prisma.examAttempt.findMany({
    where: { classAssignment: { classroomId: { in: classroomIds }, isActive: true } },
    select: {
      id: true, totalScore: true, totalQuestions: true, timeTakenSecs: true, submittedAt: true,
      user: { select: { name: true } },
      classAssignment: { select: { classroomId: true, examSet: { select: { title: true } }, classroom: { select: { name: true } } } },
    },
    orderBy: { submittedAt: 'desc' },
  });
}

type Attempt = Awaited<ReturnType<typeof getTeacherAttempts>>[number];

// ---------------------------------------------------------------------------
// Classroom stats
// ---------------------------------------------------------------------------

export function calculateClassroomStats(
  classroomsWithMembers: Awaited<ReturnType<typeof getTeacherMetrics>>['classroomsWithMembers'],
  attemptsByClassroom: Map<string, Attempt[]>,
) {
  return classroomsWithMembers.map(c => {
    const classAttempts = attemptsByClassroom.get(c.id) ?? [];
    let avgScore: number | null = null;
    if (classAttempts.length > 0) {
      const totalPct = classAttempts.reduce((sum, a) => sum + (a.totalQuestions > 0 ? (a.totalScore / a.totalQuestions) * 10 : 0), 0);
      avgScore = Math.round((totalPct / classAttempts.length) * 10) / 10;
    }
    return { id: c.id, name: c.name, code: c.code, memberCount: c._count.members, assignmentCount: c.assignments.length, avgScore };
  });
}

// ---------------------------------------------------------------------------
// Weekly submissions
// ---------------------------------------------------------------------------

export function calculateWeeklySubmissions(attemptsByDate: Map<string, number>) {
  const now = new Date();
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const result: Array<{ day: string; count: number }> = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    result.push({ day: dayNames[date.getDay()], count: attemptsByDate.get(dateKey) ?? 0 });
  }
  return result;
}

// ---------------------------------------------------------------------------
// Recent submissions
// ---------------------------------------------------------------------------

export function formatRecentSubmissions(allAttempts: Attempt[]) {
  return allAttempts.slice(0, 5).map(a => ({
    id: a.id,
    studentName: a.user.name || 'Không tên',
    examSetTitle: a.classAssignment?.examSet.title || '',
    score: a.totalScore,
    totalQuestions: a.totalQuestions,
    timeTakenSecs: a.timeTakenSecs,
    submittedAt: a.submittedAt.toISOString(),
    classroomName: a.classAssignment?.classroom.name || '',
  }));
}

// ---------------------------------------------------------------------------
// Index helpers
// ---------------------------------------------------------------------------

export function indexAttempts(allAttempts: Attempt[]) {
  const byClassroom = new Map<string, Attempt[]>();
  const byDate = new Map<string, number>();
  for (const a of allAttempts) {
    const cId = a.classAssignment?.classroomId;
    if (cId) {
      if (!byClassroom.has(cId)) byClassroom.set(cId, []);
      byClassroom.get(cId)!.push(a);
    }
    const dateKey = a.submittedAt.toISOString().slice(0, 10);
    byDate.set(dateKey, (byDate.get(dateKey) ?? 0) + 1);
  }
  return { byClassroom, byDate };
}
