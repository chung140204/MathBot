import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const bookmarkSchema = z.object({
  topic: z.string().min(1).max(50),
  subsection: z.string().min(1).max(200),
});

// GET: Lấy danh sách bookmarks của user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.user.id;
    const bookmarks = await prisma.$queryRaw<{ id: string; topic: string; subsection: string; createdAt: Date }[]>(
      Prisma.sql`SELECT id, topic, subsection, "createdAt" FROM study_bookmarks WHERE "userId" = ${userId} ORDER BY "createdAt" DESC`
    );
    return NextResponse.json(bookmarks);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Toggle bookmark (lưu hoặc bỏ lưu)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const parsed = bookmarkSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'topic and subsection required' }, { status: 400 });
    }

    const { topic, subsection } = parsed.data;
    const userId = session.user.id;

    // Check if already bookmarked
    const existing = await prisma.$queryRaw<{ id: string }[]>(
      Prisma.sql`SELECT id FROM study_bookmarks WHERE "userId" = ${userId} AND topic = ${topic} AND subsection = ${subsection}`
    );

    if (existing.length > 0) {
      // Remove bookmark
      await prisma.$executeRaw(
        Prisma.sql`DELETE FROM study_bookmarks WHERE "userId" = ${userId} AND topic = ${topic} AND subsection = ${subsection}`
      );
      return NextResponse.json({ bookmarked: false });
    } else {
      // Add bookmark
      await prisma.$executeRaw(
        Prisma.sql`INSERT INTO study_bookmarks (id, "userId", topic, subsection, "createdAt") VALUES (gen_random_uuid()::text, ${userId}, ${topic}, ${subsection}, NOW())`
      );
      return NextResponse.json({ bookmarked: true });
    }
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
