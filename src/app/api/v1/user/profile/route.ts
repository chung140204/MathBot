import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  grade: z.string().max(10).optional().nullable(),
  targetScore: z.string().max(5).optional().nullable(),
  image: z.string().max(500).optional().nullable(),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        grade: true,
        targetScore: true,
        image: true,
        settings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const body = await request.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dữ liệu không hợp lệ', details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, email, grade, targetScore, image, settings } = parsed.data;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(grade !== undefined && { grade }),
        ...(targetScore !== undefined && { targetScore }),
        ...(image !== undefined && { image }),
        ...(settings !== undefined && { settings: settings as any }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        grade: true,
        targetScore: true,
        image: true,
        settings: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
