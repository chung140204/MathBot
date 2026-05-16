import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

// GET: Lấy tiến độ ôn tập của user (% mỗi topic)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // Đếm tổng study_contents mỗi topic
    const totalByTopic = await prisma.$queryRaw<{ topic: string; total: string }[]>(
      Prisma.sql`SELECT topic, COUNT(*)::text as total FROM study_contents GROUP BY topic`
    );

    // Đếm số bài đã đọc mỗi topic
    const readByTopic = await prisma.$queryRaw<{ topic: string; read_count: string }[]>(
      Prisma.sql`SELECT sc.topic, COUNT(sp.id)::text as read_count
       FROM study_progress sp
       JOIN study_contents sc ON sp."studyContentId" = sc.id
       WHERE sp."userId" = ${userId}
       GROUP BY sc.topic`
    );

    const readMap = new Map(readByTopic.map(r => [r.topic, parseInt(r.read_count)]));

    const progress = totalByTopic.map(t => ({
      topic: t.topic,
      total: parseInt(t.total),
      read: readMap.get(t.topic) || 0,
      percent: parseInt(t.total) > 0 ? Math.round(((readMap.get(t.topic) || 0) / parseInt(t.total)) * 100) : 0,
    }));

    return NextResponse.json(progress);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Đánh dấu đã đọc 1 bài
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json();
    const parsed = z.object({ studyContentId: z.string().min(1).max(50) }).safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'studyContentId required' }, { status: 400 });
    }

    const { studyContentId } = parsed.data;

    // Upsert: nếu đã đọc rồi thì bỏ qua
    await prisma.$executeRaw(
      Prisma.sql`INSERT INTO study_progress (id, "userId", "studyContentId", "readAt")
       VALUES (gen_random_uuid()::text, ${userId}, ${studyContentId}, NOW())
       ON CONFLICT ("userId", "studyContentId") DO NOTHING`
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
