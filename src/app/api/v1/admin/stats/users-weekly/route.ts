import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { getOrSetJson } from '@/shared/lib/cache';
import { subDays, format } from 'date-fns';

const DAY_LABELS: Record<string, string> = {
  Mon: 'T2', Tue: 'T3', Wed: 'T4', Thu: 'T5', Fri: 'T6', Sat: 'T7', Sun: 'CN',
};

const USERS_WEEKLY_TTL_S = 300; // 5 minutes

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const payload = await getOrSetJson('stats:admin:users-weekly', USERS_WEEKLY_TTL_S, async () => {
    const since = subDays(new Date(), 6);
    since.setHours(0, 0, 0, 0);

    const rows = await prisma.$queryRaw<Array<{ day: string; count: bigint }>>`
      SELECT TO_CHAR("createdAt", 'YYYY-MM-DD') AS day, COUNT(*)::bigint AS count
      FROM users
      WHERE "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `;

    const countByDay = new Map(rows.map(r => [r.day, Number(r.count)]));

    const results = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayLabel = DAY_LABELS[format(date, 'iii')] ?? format(date, 'iii');
      return { day: dayLabel, count: countByDay.get(dateStr) ?? 0 };
    });

    return { data: results };
    });

    return NextResponse.json(payload);
  } catch (error: unknown) {
    console.error('[Admin Weekly Stats] Error:', error);
    return NextResponse.json({ data: [] });
  }
}
