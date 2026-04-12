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
    const questionsByTopic = await prisma.question.groupBy({
      by: ['topic'],
      _count: true,
      where: { isActive: true },
    });

    return NextResponse.json(questionsByTopic);
  } catch (error: unknown) {
    return NextResponse.json([]);
  }
}
