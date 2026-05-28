import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/shared/lib/auth-helpers';
import { z } from 'zod';
import {
  fetchUsersPaginated, toggleUserLock, updateUserRole, deleteUserById, UserError,
} from '@/features/admin/lib/user-management';

const roleEnum = z.enum(['STUDENT', 'TEACHER', 'ADMIN']);
const getUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().optional(),
  role: roleEnum.optional(),
  sort: z.enum(['newest', 'oldest', 'name']).default('newest'),
});
const toggleLockSchema = z.object({ userId: z.string().min(1), action: z.enum(['lock', 'unlock']) });
const updateRoleSchema = z.object({ userId: z.string().min(1), role: roleEnum });
const deleteUserSchema = z.object({ userId: z.string().min(1) });

function handleError(error: unknown) {
  if (error instanceof UserError) return NextResponse.json({ error: error.message }, { status: error.statusCode });
  console.error('[Admin Users]', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;
    const { searchParams } = new URL(req.url);
    const parsed = getUsersSchema.safeParse({
      page: searchParams.get('page') ?? undefined, limit: searchParams.get('limit') ?? undefined,
      search: searchParams.get('search') ?? undefined, role: searchParams.get('role') ?? undefined,
      sort: searchParams.get('sort') ?? undefined,
    });
    if (!parsed.success) return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    return NextResponse.json(await fetchUsersPaginated(parsed.data));
  } catch (error) { return handleError(error); }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;
    const body = await req.json();
    const lockParsed = toggleLockSchema.safeParse(body);
    if (lockParsed.success) {
      const user = await toggleUserLock(lockParsed.data.userId, lockParsed.data.action, auth.session.user.id);
      return NextResponse.json({ user });
    }
    const parsed = updateRoleSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    const user = await updateUserRole(parsed.data.userId, parsed.data.role, auth.session.user.id);
    return NextResponse.json({ user });
  } catch (error) { return handleError(error); }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.response;
    const body = await req.json();
    const parsed = deleteUserSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    await deleteUserById(parsed.data.userId, auth.session.user.id);
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) { return handleError(error); }
}
