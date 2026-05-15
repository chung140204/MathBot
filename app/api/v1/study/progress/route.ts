import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET: Lấy tiến độ ôn tập của user (% mỗi topic)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    // Đếm tổng study_contents mỗi topic
    const totalByTopic = await prisma.$queryRawUnsafe<{ topic: string; total: string }[]>(
      `SELECT topic, COUNT(*)::text as total FROM study_contents GROUP BY topic`
    );

    // Đếm số bài đã đọc mỗi topic
    const readByTopic = await prisma.$queryRawUnsafe<{ topic: string; read_count: string }[]>(
      `SELECT sc.topic, COUNT(sp.id)::text as read_count
       FROM study_progress sp
       JOIN study_contents sc ON sp."studyContentId" = sc.id
       WHERE sp."userId" = $1
       GROUP BY sc.topic`,
      userId
    );

    const readMap = new Map(readByTopic.map(r => [r.topic, parseInt(r.read_count)]));

    const progress = totalByTopic.map(t => ({
      topic: t.topic,
      total: parseInt(t.total),
      read: readMap.get(t.topic) || 0,
      percent: Math.round(((readMap.get(t.topic) || 0) / parseInt(t.total)) * 100),
    }));

    return NextResponse.json(progress);
  } catch (error: any) {
    console.error('[StudyProgress] GET error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
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
    const { studyContentId } = await req.json();

    if (!studyContentId) {
      return NextResponse.json({ error: 'studyContentId required' }, { status: 400 });
    }

    // Upsert: nếu đã đọc rồi thì bỏ qua
    await prisma.$executeRawUnsafe(
      `INSERT INTO study_progress (id, "userId", "studyContentId", "readAt")
       VALUES (gen_random_uuid()::text, $1, $2, NOW())
       ON CONFLICT ("userId", "studyContentId") DO NOTHING`,
      userId,
      studyContentId
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[StudyProgress] POST error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
