import { NextResponse } from 'next/server';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';
import {
  getTeacherMetrics, getTeacherAttempts, indexAttempts,
  calculateClassroomStats, calculateWeeklySubmissions, formatRecentSubmissions,
} from '@/features/teacher/lib/teacher-stats';

export async function GET() {
  if (!flags.enableClassroom) {
    return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  }
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const metrics = await getTeacherMetrics(auth.session.user.id);
    const classroomIds = metrics.classroomsWithMembers.map(c => c.id);
    const allAttempts = await getTeacherAttempts(classroomIds);
    const { byClassroom, byDate } = indexAttempts(allAttempts);

    return NextResponse.json({
      totalClassrooms: metrics.totalClassrooms,
      totalExamSets: metrics.totalExamSets,
      totalQuestions: metrics.totalQuestions,
      totalStudents: metrics.totalStudents,
      classrooms: calculateClassroomStats(metrics.classroomsWithMembers, byClassroom),
      weeklySubmissions: calculateWeeklySubmissions(byDate),
      recentSubmissions: formatRecentSubmissions(allAttempts),
    });
  } catch (error) {
    console.error('[teacher/stats]', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
