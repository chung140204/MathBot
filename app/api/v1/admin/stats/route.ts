import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { startOfToday, subDays } from 'date-fns';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  try {
    const today = startOfToday();

    // Fetch stats sequentially to avoid connection pooling issues with Neon adapter
    let totalUsers = 0;
    let totalQuestions = 0;
    let examsToday = 0;
    let aiChatsToday = 0;

    try {
      totalUsers = await prisma.user.count();
    } catch (e) {
      console.error('Error counting users:', e);
    }

    try {
      totalQuestions = await prisma.question.count({ where: { isActive: true } });
    } catch (e) {
      console.error('Error counting questions:', e);
    }

    try {
      examsToday = await prisma.examAttempt.count({ where: { submittedAt: { gte: today } } });
    } catch (e) {
      console.error('Error counting exams:', e);
    }

    try {
      aiChatsToday = await prisma.chatMessage.count({ where: { createdAt: { gte: today }, role: 'assistant' } });
    } catch (e) {
      console.error('Error counting AI chats:', e);
    }

    // Compute real trends: compare last 7 days vs previous 7 days
    const weekAgo = subDays(today, 7);
    const twoWeeksAgo = subDays(today, 14);

    let usersThisWeek = 0, usersPrevWeek = 0;
    let examsThisWeek = 0, examsPrevWeek = 0;
    let chatsThisWeek = 0, chatsPrevWeek = 0;

    try {
      [usersThisWeek, usersPrevWeek] = await Promise.all([
        prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
        prisma.user.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
      ]);
    } catch { /* keep 0 */ }

    try {
      [examsThisWeek, examsPrevWeek] = await Promise.all([
        prisma.examAttempt.count({ where: { submittedAt: { gte: weekAgo } } }),
        prisma.examAttempt.count({ where: { submittedAt: { gte: twoWeeksAgo, lt: weekAgo } } }),
      ]);
    } catch { /* keep 0 */ }

    try {
      [chatsThisWeek, chatsPrevWeek] = await Promise.all([
        prisma.chatMessage.count({ where: { createdAt: { gte: weekAgo }, role: 'assistant' } }),
        prisma.chatMessage.count({ where: { createdAt: { gte: twoWeeksAgo, lt: weekAgo }, role: 'assistant' } }),
      ]);
    } catch { /* keep 0 */ }

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
