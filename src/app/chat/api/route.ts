import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { chatRequestSchema, checkRateLimit, createChatStream } from '@/features/chat/lib/chat-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!checkRateLimit(session.user.id))
      return NextResponse.json({ error: 'Bạn gửi tin nhắn quá nhanh. Vui lòng đợi một chút.' }, { status: 429 });

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });

    let stream: ReadableStream;
    try {
      stream = await createChatStream(session.user.id, parsed.data);
    } catch (e: any) {
      if (e?.status === 404) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      throw e;
    }

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
