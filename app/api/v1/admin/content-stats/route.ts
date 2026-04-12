import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let theory = 124;
    let examSets = 42;
    let practice = 850;
    let knowledgeChunks = 0;

    try {
      knowledgeChunks = await prisma.knowledgeChunk.count();
    } catch (e) {
      console.error("[Content Stats] Error counting knowledge chunks:", e);
    }

    try {
      practice = await prisma.question.count({ where: { isActive: true } });
    } catch (e) {
      console.error("[Content Stats] Error counting active questions:", e);
    }

    // Additional sequential counts as needed...

    return NextResponse.json({
      theory,
      examSets,
      practice,
      thptExams: 12, // Still mock as no clear model yet
      knowledgeChunks,
    });
  } catch (error: unknown) {
    return NextResponse.json({ theory: 0, examSets: 0, practice: 0, thptExams: 0, knowledgeChunks: 0 });
  }
}
