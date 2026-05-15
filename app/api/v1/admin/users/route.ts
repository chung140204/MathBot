import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return { error: true as const, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { error: false as const, session };
}

const roleEnum = z.enum(['STUDENT', 'ADMIN']);

const getUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  role: roleEnum.optional(),
  sort: z.enum(['newest', 'oldest', 'name']).default('newest'),
});

const updateRoleSchema = z.object({
  userId: z.string().min(1),
  role: roleEnum,
});

const toggleLockSchema = z.object({
  userId: z.string().min(1),
  action: z.enum(['lock', 'unlock']),
});

const deleteUserSchema = z.object({
  userId: z.string().min(1),
});

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const { searchParams } = new URL(req.url);
    const parsed = getUsersSchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search') ?? undefined,
      role: searchParams.get('role') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }

    const { page, limit, search, role, sort } = parsed.data;

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    let orderBy: Prisma.UserOrderByWithRelationInput;
    switch (sort) {
      case 'oldest': orderBy = { createdAt: 'asc' }; break;
      case 'name': orderBy = { name: 'asc' }; break;
      default: orderBy = { createdAt: 'desc' }; break;
    }

    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isLocked: true,
          createdAt: true,
          grade: true,
          _count: { select: { examAttempts: true, chatSessions: true } },
        },
      }),
    ]);

    return NextResponse.json({ users, total, totalPages: Math.ceil(total / limit), page, limit });
  } catch (error) {
    console.error('[Admin Users GET]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const body = await req.json();

    // Try lock/unlock first
    const lockParsed = toggleLockSchema.safeParse(body);
    if (lockParsed.success) {
      const { userId, action } = lockParsed.data;
      if (userId === auth.session.user.id) {
        return NextResponse.json({ error: 'Cannot lock your own account' }, { status: 400 });
      }
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { isLocked: action === 'lock' },
        select: { id: true, email: true, name: true, role: true, isLocked: true },
      });
      return NextResponse.json({ user: updated });
    }

    // Otherwise try role update
    const parsed = updateRoleSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    const { userId, role } = parsed.data;
    if (userId === auth.session.user.id) {
      return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, name: true, role: true, isLocked: true },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error('[Admin Users PATCH]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;

    const body = await req.json();
    const parsed = deleteUserSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

    const { userId } = parsed.data;
    if (userId === auth.session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('[Admin Users DELETE]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
