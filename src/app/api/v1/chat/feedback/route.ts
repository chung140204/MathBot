import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { z } from 'zod';

const feedbackSchema = z.object({
  messageId: z.string().min(1),
  feedback: z.enum(['up', 'down']).nullable(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = feedbackSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const { messageId, feedback } = parsed.data;

    // Verify ownership: message must belong to a session owned by this user
    const message = await prisma.chatMessage.findFirst({
      where: { id: messageId },
      include: { chatSession: { select: { userId: true } } },
    });

    if (!message || message.chatSession.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.chatMessage.update({
      where: { id: messageId },
      data: { feedback },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
