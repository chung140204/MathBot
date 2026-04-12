import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limitNum = parseInt(searchParams.get('limit') || '5');
    const limit = isNaN(limitNum) ? 5 : Math.min(limitNum, 50);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: { examAttempts: true },
        },
      },
    });

    return NextResponse.json(users);
  } catch (error: unknown) {
    console.error('Error fetching recent users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
