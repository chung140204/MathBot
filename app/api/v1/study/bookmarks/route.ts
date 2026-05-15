import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

// GET: Lấy danh sách bookmarks của user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const bookmarks = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, topic, subsection, "createdAt" FROM study_bookmarks WHERE "userId" = $1 ORDER BY "createdAt" DESC`,
      session.user.id
    );
    return NextResponse.json(bookmarks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Toggle bookmark (lưu hoặc bỏ lưu)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { topic, subsection } = await req.json();
    if (!topic || !subsection) {
      return NextResponse.json({ error: 'topic and subsection required' }, { status: 400 });
    }

    // Check if already bookmarked
    const existing = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM study_bookmarks WHERE "userId" = $1 AND topic = $2 AND subsection = $3`,
      session.user.id, topic, subsection
    );

    if (existing.length > 0) {
      // Remove bookmark
      await prisma.$executeRawUnsafe(
        `DELETE FROM study_bookmarks WHERE "userId" = $1 AND topic = $2 AND subsection = $3`,
        session.user.id, topic, subsection
      );
      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await prisma.$executeRawUnsafe(
        `INSERT INTO study_bookmarks (id, "userId", topic, subsection, "createdAt") VALUES (gen_random_uuid()::text, $1, $2, $3, NOW())`,
        session.user.id, topic, subsection
      );
      return NextResponse.json({ bookmarked: true });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
