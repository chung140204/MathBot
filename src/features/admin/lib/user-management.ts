/**
 * User management business logic — extracted from admin/users/route.ts.
 */
import prisma from '@/shared/lib/db';
import { Prisma, UserRole } from '@prisma/client';

const USER_SELECT = {
  id: true, email: true, name: true, role: true, isLocked: true,
  createdAt: true, grade: true,
  _count: { select: { examAttempts: true, chatSessions: true } },
} as const;

export async function fetchUsersPaginated(opts: {
  page: number; limit: number; search?: string; role?: UserRole;
  sort: 'newest' | 'oldest' | 'name';
}) {
  const { page, limit, search, role, sort } = opts;
  const where: Prisma.UserWhereInput = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  const orderBy: Prisma.UserOrderByWithRelationInput =
    sort === 'oldest' ? { createdAt: 'asc' } : sort === 'name' ? { name: 'asc' } : { createdAt: 'desc' };

  const skip = (page - 1) * limit;
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, orderBy, skip, take: limit, select: USER_SELECT }),
  ]);

  return { users, total, totalPages: Math.ceil(total / limit), page, limit };
}

export async function toggleUserLock(userId: string, action: 'lock' | 'unlock', adminId: string) {
  if (userId === adminId) throw new UserError('Cannot lock your own account', 400);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new UserError('User not found', 404);
  return prisma.user.update({
    where: { id: userId },
    data: { isLocked: action === 'lock' },
    select: { id: true, email: true, name: true, role: true, isLocked: true },
  });
}

export async function updateUserRole(userId: string, role: UserRole, adminId: string) {
  if (userId === adminId) throw new UserError('Cannot change your own role', 400);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new UserError('User not found', 404);
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, email: true, name: true, role: true, isLocked: true },
  });
}

export async function deleteUserById(userId: string, adminId: string) {
  if (userId === adminId) throw new UserError('Cannot delete your own account', 400);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new UserError('User not found', 404);
  await prisma.user.delete({ where: { id: userId } });
}

export class UserError extends Error {
  constructor(message: string, public statusCode: number) { super(message); }
}
