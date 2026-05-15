import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { ragSearch } from '@/lib/rag/pipeline';
import { buildSystemPrompt } from '@/lib/rag/prompts';
import { z } from 'zod';

const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
  })).min(1),
  sessionId: z.string().nullable().optional(),
  imageBase64: z.string().nullable().optional(),
  mode: z.enum(['fast', 'thinking']).optional().default('thinking'),
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});

// Simple in-memory rate limiter: max 20 requests per minute per user
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count++;
  return true;
}

function friendlyError(e: unknown): string {
  const err = e as any;
  if (err?.status === 429) return 'Hệ thống AI đang bận. Vui lòng đợi vài giây rồi thử lại.';
  if (err?.status >= 500) return 'Dịch vụ AI tạm thời gián đoạn. Vui lòng thử lại sau.';
  if (err?.name === 'AbortError') return 'Kết nối bị gián đoạn. Vui lòng thử lại.';
  return 'Đã xảy ra lỗi khi xử lý phản hồi. Vui lòng thử lại.';
}

async function withRetry<T>(fn: () => Promise<T>, retries = 1): Promise<T> {
  try {
    return await fn();
  } catch (e: any) {
    const isRetryable = (e?.status >= 500) || (e instanceof TypeError && e.message.includes('fetch'));
    if (retries > 0 && isRetryable) {
      await new Promise(r => setTimeout(r, 1000));
      return withRetry(fn, retries - 1);
    }
    throw e;
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: 'Bạn gửi tin nhắn quá nhanh. Vui lòng đợi một chút.' }, { status: 429 });
    }

    const body = await req.json();
    const parsed = chatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
    }

    const { messages, imageBase64, mode } = parsed.data;
    let sessionId = parsed.data.sessionId;

    const lastUserMessage = messages[messages.length - 1].content;
    let isNewSession = false;

    if (!sessionId) {
      isNewSession = true;
      const newTitle = lastUserMessage.substring(0, 50) + (lastUserMessage.length > 50 ? '...' : '');
      const newSession = await prisma.chatSession.create({
        data: {
          userId,
          title: newTitle,
        }
      });
      sessionId = newSession.id;
    } else {
      // Verify the session belongs to the current user
      const existingSession = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
        select: { id: true },
      });
      if (!existingSession) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
    }

    const encoder = new TextEncoder();

    const saveToDatabase = async (assistantContent: string): Promise<boolean> => {
      try {
        await Promise.all([
          prisma.chatMessage.create({
            data: {
              chatSessionId: sessionId,
              role: 'user',
              content: lastUserMessage,
            }
          }),
          prisma.chatMessage.create({
            data: {
              chatSessionId: sessionId,
              role: 'assistant',
              content: assistantContent,
            }
          })
        ]);

        await prisma.chatSession.update({
          where: { id: sessionId },
          data: { updatedAt: new Date() }
        });
        return true;
      } catch (dbError) {
        console.error('[Chat] Failed to save messages to database:', dbError);
        return false;
      }
    };

    if (!process.env.OPENAI_API_KEY) {
      const stream = new ReadableStream({
        async start(controller) {
          if (isNewSession) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'session', sessionId })}\n\n`));
          }
          const mockText = "Chào bạn! Đây là câu trả lời mẫu từ MathBot. Để sử dụng AI thật, hãy thêm OPENAI_API_KEY vào file .env nhé.\n\nPhần giải bài tập:\n1. Bước 1: Tính đạo hàm...\n2. Bước 2: Kết quả cuối cùng.";
          const words = mockText.split(' ');
          let fullResponse = "";
          for (const word of words) {
            fullResponse += word + ' ';
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: word + ' ' })}\n\n`));
            await new Promise(r => setTimeout(r, 50));
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
          await saveToDatabase(fullResponse.trim());
        },
      });
      return new NextResponse(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    const isNvidia = !!process.env.NVIDIA_BASE_URL;
    const maxHistory = parseInt(process.env.CHAT_MAX_HISTORY || '10', 10);

    const stream = new ReadableStream({
      async start(controller) {
        if (isNewSession) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'session', sessionId })}\n\n`));
        }

        // Send loading indicator immediately so user sees feedback
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'loading' })}\n\n`));

        // RAG: skip for fast mode to reduce latency
        const chunks = mode === 'fast' ? [] : await ragSearch(lastUserMessage);

        // Emit sources metadata so client can display citations
        if (chunks.length > 0) {
          const sourcesPayload = chunks.map(c => ({ source: c.source, topic: c.topic, similarity: c.similarity }));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'sources', data: sourcesPayload })}\n\n`));
        }

        const systemPrompt = {
          role: 'system' as const,
          content: buildSystemPrompt(chunks),
        };

        // Format messages for OpenAI API (Vision support), limit context window
        const recentMessages = messages.slice(-maxHistory);
        const apiMessages: Array<{ role: string; content: any }> = [...recentMessages];
        if (imageBase64 && apiMessages.length > 0) {
          const lastIndex = apiMessages.length - 1;
          const lastMsgText = apiMessages[lastIndex].content.replace(`![image](${imageBase64})\n\n`, '');
          apiMessages[lastIndex] = {
            role: 'user',
            content: [
              { type: 'text', text: lastMsgText || "Giải bài tập trong ảnh" },
              { type: 'image_url', image_url: { url: imageBase64 } }
            ]
          };
        }

        // Mode-specific parameters
        const modeConfig = {
          fast: { max_tokens: 1024, temperature: 0.3, enableThinking: false, reasoningBudget: 0 },
          thinking: { max_tokens: 4096, temperature: 0.2, enableThinking: true, reasoningBudget: 16384 },
        }[mode];

        const chatModel = imageBase64
          ? (process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct')
          : mode === 'fast'
            ? (process.env.NVIDIA_FAST_MODEL || process.env.NVIDIA_MODEL || 'gpt-4o')
            : (process.env.NVIDIA_MODEL || 'gpt-4o');

        const response = await withRetry(() => openai.chat.completions.create({
          model: chatModel,
          messages: [systemPrompt, ...apiMessages] as any,
          temperature: modeConfig.temperature,
          top_p: isNvidia ? 0.7 : undefined,
          max_tokens: modeConfig.max_tokens,
          stream: true,
          ...(isNvidia && !imageBase64 && modeConfig.enableThinking && {
            // @ts-ignore — NVIDIA-specific params
            extra_body: {
              chat_template_kwargs: { enable_thinking: true },
              reasoning_budget: modeConfig.reasoningBudget,
            },
          }),
        }));
        let fullResponse = "";
        let thinkingStarted = false;
        let thinkingDone = false;
        try {
          for await (const chunk of response) {
            const delta = chunk.choices[0]?.delta as any;
            const reasoning: string | undefined = delta?.reasoning_content;
            const content: string | undefined = delta?.content;

            if (reasoning) {
              if (!thinkingStarted) {
                thinkingStarted = true;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'thinking_start' })}\n\n`));
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ reasoning })}\n\n`));
            }

            if (content) {
              if (thinkingStarted && !thinkingDone) {
                thinkingDone = true;
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'thinking_end' })}\n\n`));
              }
              fullResponse += content;
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
        } catch (streamError) {
          console.error('[Chat] Stream error:', streamError);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'error', message: friendlyError(streamError) })}\n\n`));
        }
        if (fullResponse) {
          const saved = await saveToDatabase(fullResponse);
          if (!saved) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'warning', message: 'Tin nhắn có thể chưa được lưu. Vui lòng kiểm tra lịch sử chat.' })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

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
