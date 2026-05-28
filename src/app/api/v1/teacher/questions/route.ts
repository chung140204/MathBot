import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/shared/lib/db';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  topic: z.string().optional(),
  difficulty: z.string().optional(),
  format: z.string().optional(),
  source: z.enum(['mine', 'system', 'all']).default('all'),
});

export async function GET(request: NextRequest) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = querySchema.safeParse(params);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR }, { status: 400 });

    const { page, limit, topic, difficulty, format, source } = parsed.data;

    // Filter by source: mine = teacher's own, system = createdById is null, all = both
    const ownerFilter =
      source === 'mine' ? { createdById: auth.session.user.id } :
      source === 'system' ? { createdById: null } :
      { OR: [{ createdById: auth.session.user.id }, { createdById: null }] };

    const where: Record<string, unknown> = { ...ownerFilter, isActive: true };
    if (topic) where.topic = topic;
    if (difficulty) where.difficulty = difficulty;
    if (format) where.format = format;

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({ questions, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('[teacher/questions] GET error:', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
