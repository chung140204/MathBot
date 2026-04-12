import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { subDays, startOfDay, format } from 'date-fns';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
    
    const results = [];
    for (const date of last7Days) {
      try {
        const start = startOfDay(date);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        const count = await prisma.user.count({
          where: {
            createdAt: { gte: start, lt: end },
          },
        });

        // Convert to Vietnamese day labels
        const dayNames: { [key: string]: string } = {
          'Mon': 'T2', 'Tue': 'T3', 'Wed': 'T4', 'Thu': 'T5', 'Fri': 'T6', 'Sat': 'T7', 'Sun': 'CN'
        };
        const dayLabel = dayNames[format(date, 'iii')] || format(date, 'iii');

        results.push({ day: dayLabel, count });
      } catch (err) {
        console.error(`[Admin Weekly Stats] Error fetching for ${date}:`, err);
        results.push({ day: format(date, 'iii'), count: 0 });
      }
    }

    return NextResponse.json({ data: results });
  } catch (error: unknown) {
    return NextResponse.json({ data: [] });
  }
}
