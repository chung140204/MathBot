import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get('userId');
  const sessionId = searchParams.get('sessionId');

  try {
    if (sessionId) {
      // Get messages for a specific session
      const messages = await prisma.chatMessage.findMany({
        where: { chatSessionId: sessionId, chatSession: { userId } },
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json(messages);
    } else if (requestedUserId) {
      // Validate requested user ID matches session user ID
      if (requestedUserId !== userId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      // Get 50 latest sessions for the user
      const sessions = await prisma.chatSession.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        take: 50,
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Only get the last message for preview
          }
        }
      });
      return NextResponse.json(sessions);
    } else {
      return NextResponse.json({ error: 'Missing userId or sessionId parameter' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error fetching chat data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const newSession = await prisma.chatSession.create({
      data: {
        userId,
        title: 'New conversation'
      }
    });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    const { sessionId, title } = await request.json();
    if (!sessionId || !title?.trim()) {
      return NextResponse.json({ error: 'Missing sessionId or title' }, { status: 400 });
    }

    const chatSession = await prisma.chatSession.findUnique({ where: { id: sessionId } });
    if (!chatSession || chatSession.userId !== userId) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title: title.trim().slice(0, 100) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error renaming session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing sessionId parameter' }, { status: 400 });
  }

  try {
    // Check if session belongs to user
    const chatSession = await prisma.chatSession.findUnique({
      where: { id: sessionId }
    });

    if (!chatSession || chatSession.userId !== userId) {
      return NextResponse.json({ error: 'Session not found or forbidden' }, { status: 403 });
    }

    await prisma.chatSession.delete({
      where: { id: sessionId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
