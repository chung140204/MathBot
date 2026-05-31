import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import OpenAI from 'openai';
import { z } from 'zod';
import { authOptions } from '@/features/auth/lib/auth';
import { aiLimiter, enforceRateLimit } from '@/shared/lib/rate-limit';
import { buildAssistantSystemPrompt } from '@/features/assistant/lib/system-guide';
import { getUserTopicStats } from '@/features/study/lib/topic-stats';
import { TOPIC_LABEL } from '@/shared/constants/topics';
import { ErrorCode } from '@/shared/lib/errors';

/** Best-effort: summarise the student's weak topics for personalised guidance. */
async function buildUserContext(userId: string): Promise<string> {
  try {
    const stats = await getUserTopicStats(userId);
    const practiced = [...stats.values()].filter((s) => s.totalQuestions > 0);
    if (practiced.length === 0) {
      return 'Người dùng chưa làm bài luyện tập nào — hãy khuyến khích bắt đầu luyện tập.';
    }
    const weak = practiced
      .filter((s) => s.accuracy < 60)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);
    if (weak.length === 0) return '';
    const list = weak.map((s) => `${TOPIC_LABEL[s.topic] ?? s.topic} (${s.accuracy}%)`).join(', ');
    return `Điểm yếu hiện tại của người dùng: ${list}.`;
  } catch {
    return '';
  }
}

const requestSchema = z.object({
  message: z.string().min(1).max(2000),
  path: z.string().max(200).optional(),
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(4000) }))
    .max(10)
    .optional(),
});

const nvidia = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});

/**
 * POST /api/v1/assistant
 * Usage-guide assistant (NOT the math tutor). Streams an SSE response.
 * Each event: `data: {"t": "<token>"}`; terminates with `data: [DONE]`.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized', code: ErrorCode.AUTH_REQUIRED }, { status: 401 });
  }

  const limited = await enforceRateLimit(aiLimiter, `assistant:${session.user.id}`);
  if (limited) return limited;

  const parsed = requestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Yêu cầu không hợp lệ', code: ErrorCode.VALIDATION_ERROR }, { status: 400 });
  }
  const { message, path, history = [] } = parsed.data;

  const userContext = session.user.role === 'STUDENT' || !session.user.role
    ? await buildUserContext(session.user.id)
    : '';
  const systemPrompt = buildAssistantSystemPrompt(path, session.user.role, userContext);
  // Smarter-but-still-fast default: qwen3-next-80b is an MoE with only ~3B active
  // params, so it answers near-8B speed but follows the guide far more reliably.
  // Override with ASSISTANT_MODEL if needed.
  const model =
    process.env.ASSISTANT_MODEL ||
    process.env.NVIDIA_MODEL ||
    'qwen/qwen3-next-80b-a3b-instruct';

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;
      const send = (obj: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
        } catch {
          closed = true;
        }
      };
      try {
        const completion = await nvidia.chat.completions.create({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content: message },
          ],
          temperature: 0.3,
          max_tokens: 400,
          stream: true,
        });

        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) send({ t: token });
        }
      } catch (error) {
        console.error('[Assistant API] Error:', error);
        send({ t: '\n\n_Xin lỗi, trợ lý đang gặp sự cố. Vui lòng thử lại sau._' });
      } finally {
        if (!closed) {
          try {
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          } catch { /* already closed */ }
          controller.close();
        }
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
