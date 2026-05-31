import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { chatRequestSchema, checkRateLimit, createChatStream } from '@/features/chat/lib/chat-service';
import { aiLimiter, enforceRateLimit } from '@/shared/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Bạn cần đăng nhập để sử dụng chat.' }, { status: 401 });

    const limited = await enforceRateLimit(aiLimiter, session.user.id);
    if (limited) return limited;

    if (!checkRateLimit(session.user.id))
      return NextResponse.json({ error: 'Bạn gửi tin nhắn quá nhanh. Vui lòng đợi một chút.' }, { status: 429 });

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: 'Yêu cầu không hợp lệ.' }, { status: 400 });

    let stream: ReadableStream;
    try {
      stream = await createChatStream(session.user.id, parsed.data);
    } catch (e: any) {
      if (e?.status === 404) return NextResponse.json({ error: 'Cuộc trò chuyện không tồn tại.' }, { status: 404 });
      throw e;
    }

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        // Disable proxy (nginx/Vercel) buffering so early SSE events
        // (session / rag_searching) reach the client immediately.
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Đã xảy ra lỗi. Vui lòng thử lại sau.' }, { status: 500 });
  }
}
