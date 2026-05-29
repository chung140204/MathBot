import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { startOfToday, subDays } from 'date-fns';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  try {
    const today = startOfToday();
    const weekAgo = subDays(today, 7);
    const twoWeeksAgo = subDays(today, 14);

    const [
      totalUsers,
      totalQuestions,
      examsToday,
      aiChatsToday,
      usersThisWeek,
      usersPrevWeek,
      examsThisWeek,
      examsPrevWeek,
      chatsThisWeek,
      chatsPrevWeek,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.question.count({ where: { isActive: true } }),
      prisma.examAttempt.count({ where: { submittedAt: { gte: today } } }),
      prisma.chatMessage.count({ where: { createdAt: { gte: today }, role: 'assistant' } }),
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.user.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
      prisma.examAttempt.count({ where: { submittedAt: { gte: weekAgo } } }),
      prisma.examAttempt.count({ where: { submittedAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
      prisma.chatMessage.count({ where: { createdAt: { gte: weekAgo }, role: 'assistant' } }),
      prisma.chatMessage.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo }, role: 'assistant' } }),
    ]);

    const trendStr = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? `+${curr}` : '0';
      const pct = Math.round(((curr - prev) / prev) * 100);
      return pct >= 0 ? `+${pct}%` : `${pct}%`;
    };

    return NextResponse.json({
      totalUsers,
      totalQuestions,
      examsToday,
      aiChatsToday,
      usersTrend: trendStr(usersThisWeek, usersPrevWeek),
      questionsTrend: `+${totalQuestions}`,
      examsTrend: trendStr(examsThisWeek, examsPrevWeek),
      aiTrend: trendStr(chatsThisWeek, chatsPrevWeek),
    });
  } catch (error: unknown) {
    console.error('Admin Stats Error:', error);
    return NextResponse.json({ 
      totalUsers: 0, totalQuestions: 0, examsToday: 0, aiChatsToday: 0,
      usersTrend: '0%', questionsTrend: '0', examsTrend: '0%', aiTrend: '0%' 
    });
  }
}
