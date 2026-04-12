import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { User, Question } from '@prisma/client';

interface Activity {
  type: string;
  message: string;
  time: Date;
  user: string;
  badge: string;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '5');

  try {
    // Activities usually come from various tables or a dedicated ActivityLog table.
    // If no ActivityLog exists, we combine recent actions manually as requested.
    
    let recentUsers: User[] = [];
    let recentQuestions: Question[] = [];

    try {
      recentUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (e) {
      console.error("[Activity API] Error fetching recent users:", e);
    }

    try {
      recentQuestions = await prisma.question.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
      });
    } catch (e) {
      console.error("[Activity API] Error fetching recent questions:", e);
    }

    const activities: Activity[] = [
      ...recentUsers.map((u: User) => ({
        type: 'USER_NEW',
        message: `Người dùng mới: ${u.name || 'Ẩn danh'}`,
        time: u.createdAt,
        user: u.name || 'Ẩn danh',
        badge: 'USER'
      })),
      ...recentQuestions.map((q: Question) => ({
        type: 'UPLOAD',
        message: `Câu hỏi mới được upload`,
        time: q.createdAt,
        user: 'Hệ thống',
        badge: 'UPLOAD'
      }))
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, limit);

    return NextResponse.json(activities);
  } catch (error: unknown) {
    console.error("[Activity API] General error:", error);
    return NextResponse.json([]);
  }
}
