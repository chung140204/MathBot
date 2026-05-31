import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { getOrSetJson } from '@/shared/lib/cache';

const CONTENT_STATS_TTL_S = 300; // 5 minutes

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await getOrSetJson('stats:admin:content', CONTENT_STATS_TTL_S, async () => {
    let theory = 0;
    let practice = 0;
    let thptExams = 0;
    let knowledgeChunks = 0;

    const results = await Promise.allSettled([
      prisma.studyContent.count(),
      prisma.question.count({ where: { isActive: true, questionType: 'PRACTICE' } }),
      prisma.question.count({ where: { isActive: true, questionType: 'THPT_EXAM' } }),
      prisma.knowledgeChunk.count(),
    ]);

    if (results[0].status === 'fulfilled') theory = results[0].value;
    if (results[1].status === 'fulfilled') practice = results[1].value;
    if (results[2].status === 'fulfilled') thptExams = results[2].value;
    if (results[3].status === 'fulfilled') knowledgeChunks = results[3].value;

    return {
      theory,
      practice,
      thptExams,
      knowledgeChunks,
    };
    });

    return NextResponse.json(payload);
  } catch (error: unknown) {
    console.error('[Content Stats] Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
