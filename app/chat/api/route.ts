import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { ragSearch, RagSearchResult } from '@/lib/rag/pipeline';
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

// Gemini client (primary for chat)
const gemini = process.env.GEMINI_API_KEY
  ? new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    })
  : null;

// NVIDIA client (fallback if no Gemini key)
const nvidia = new OpenAI({
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

    // Resolve session and RAG search in parallel
    const resolveSession = async (): Promise<{ id: string; isNew: boolean }> => {
      if (!sessionId) {
        const newTitle = lastUserMessage.substring(0, 50) + (lastUserMessage.length > 50 ? '...' : '');
        const newSession = await prisma.chatSession.create({ data: { userId, title: newTitle } });
        return { id: newSession.id, isNew: true };
      }
      const existing = await prisma.chatSession.findFirst({
        where: { id: sessionId, userId },
        select: { id: true },
      });
      if (!existing) throw new Error('SESSION_NOT_FOUND');
      return { id: sessionId, isNew: false };
    };

    const ragPromise: Promise<RagSearchResult> = mode === 'fast'
      ? Promise.resolve({ chunks: [] })
      : ragSearch(lastUserMessage, { mode, history: messages });

    let sessionResult: { id: string; isNew: boolean };
    let ragResult: RagSearchResult;

    try {
      [sessionResult, ragResult] = await Promise.all([resolveSession(), ragPromise]);
    } catch (e: any) {
      if (e?.message === 'SESSION_NOT_FOUND') {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      throw e;
    }

    sessionId = sessionResult.id;
    const isNewSession = sessionResult.isNew;

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

    const maxHistory = parseInt(process.env.CHAT_MAX_HISTORY || '10', 10);

    const stream = new ReadableStream({
      async start(controller) {
        let closed = false;
        const send = (data: string) => {
          if (closed) return;
          try { controller.enqueue(encoder.encode(data)); } catch { closed = true; }
        };
        const close = () => {
          if (closed) return;
          closed = true;
          try { controller.close(); } catch { /* already closed */ }
        };

        if (isNewSession) {
          send(`data: ${JSON.stringify({ event: 'session', sessionId })}\n\n`);
        }

        // Send loading indicator immediately so user sees feedback
        send(`data: ${JSON.stringify({ event: 'loading' })}\n\n`);

        // RAG results already resolved in parallel with session management
        const { chunks, rewrittenQuery } = ragResult;

        // Emit rewrite event if query was rewritten (follow-up handling)
        if (rewrittenQuery) {
          send(`data: ${JSON.stringify({ event: 'rewrite', original: lastUserMessage, rewritten: rewrittenQuery })}\n\n`);
        }

        // Emit sources metadata so client can display citations
        if (chunks.length > 0) {
          const sourcesPayload = chunks.map(c => ({
            source: c.source,
            topic: c.topic,
            similarity: 'finalScore' in c ? (c as any).finalScore : c.similarity,
          }));
          send(`data: ${JSON.stringify({ event: 'sources', data: sourcesPayload })}\n\n`);
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

        // Model selection: Gemini Flash (fast/vision) → Gemini Pro (thinking) → NVIDIA fallback
        let chatClient: OpenAI;
        let chatModel: string;

        if (gemini) {
          chatClient = gemini;
          if (imageBase64 || mode === 'fast') {
            chatModel = 'gemini-2.5-flash';   // Vision + easy questions
          } else {
            chatModel = 'gemini-2.5-pro';     // Hard questions (thinking mode)
          }
        } else {
          chatClient = nvidia;
          chatModel = imageBase64
            ? (process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct')
            : (process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct');
        }

        console.log(`[Chat] model=${chatModel}, mode=${mode}, hasImage=${!!imageBase64}`);

        const createStream = (client: OpenAI, model: string) =>
          client.chat.completions.create({
            model,
            messages: [systemPrompt, ...apiMessages] as any,
            temperature: modeConfig.temperature,
            max_tokens: modeConfig.max_tokens,
            stream: true,
          });

        // Helper: when Gemini dies with image → NVIDIA Vision extracts text → 70b solves
        const nvidiaVisionFallback = async () => {
          if (imageBase64) {
            // Step 1: NVIDIA Vision reads the image
            const visionModel = process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct';
            console.log(`[Chat] Step 1: NVIDIA Vision (${visionModel}) reading image...`);
            try {
              const visionRes = await nvidia.chat.completions.create({
                model: visionModel,
                messages: [{
                  role: 'user',
                  content: [
                    { type: 'text', text: 'Đọc và trích xuất toàn bộ nội dung bài toán trong ảnh. Dùng LaTeX $...$ cho công thức. Chỉ trả về nội dung bài toán, không giải.' },
                    { type: 'image_url', image_url: { url: imageBase64 } },
                  ],
                }],
                max_tokens: 1024,
                temperature: 0,
              });
              const extractedText = visionRes.choices[0]?.message?.content ?? '';
              console.log(`[Chat] Vision extracted: ${extractedText.length} chars`);

              // Step 2: Replace image message with extracted text → 70b solves
              const lastIdx = apiMessages.length - 1;
              const origText = Array.isArray(apiMessages[lastIdx].content)
                ? apiMessages[lastIdx].content.find((p: any) => p.type === 'text')?.text || ''
                : apiMessages[lastIdx].content;
              apiMessages[lastIdx] = {
                role: 'user',
                content: `${origText}\n\n[Nội dung từ ảnh]:\n${extractedText}`,
              };
            } catch (visionErr) {
              console.log(`[Chat] NVIDIA Vision failed, stripping image`);
              const lastIdx = apiMessages.length - 1;
              if (Array.isArray(apiMessages[lastIdx].content)) {
                const textPart = apiMessages[lastIdx].content.find((p: any) => p.type === 'text');
                apiMessages[lastIdx] = { role: 'user', content: textPart?.text || '' };
              }
            }
          }
          chatModel = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';
          console.log(`[Chat] Step 2: NVIDIA 70b solving with text`);
          response = await createStream(nvidia, chatModel);
        };

        // Fallback chain: Gemini Pro → Gemini Flash → NVIDIA Vision+70b
        let response: any;
        try {
          response = await createStream(chatClient, chatModel);
        } catch (err: any) {
          const status = err?.status;
          if (status === 429 || status === 503) {
            // Try Flash if currently on Pro
            if (gemini && chatModel.includes('pro')) {
              chatModel = 'gemini-2.5-flash';
              console.log(`[Chat] Gemini Pro ${status}, fallback to ${chatModel}`);
              try {
                response = await createStream(chatClient, chatModel);
              } catch (flashErr: any) {
                // Flash also failed → NVIDIA Vision reads image → 70b solves
                console.log(`[Chat] Gemini Flash also failed (${flashErr?.status}), fallback to NVIDIA`);
                await nvidiaVisionFallback();
              }
            } else if (gemini) {
              // Flash failed → NVIDIA Vision reads image → 70b solves
              console.log(`[Chat] Gemini Flash ${status}, fallback to NVIDIA`);
              await nvidiaVisionFallback();
            } else {
              throw err;
            }
          } else {
            throw err;
          }
        }
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
                send(`data: ${JSON.stringify({ event: 'thinking_start' })}\n\n`);
              }
              send(`data: ${JSON.stringify({ reasoning })}\n\n`);
            }

            if (content) {
              if (thinkingStarted && !thinkingDone) {
                thinkingDone = true;
                send(`data: ${JSON.stringify({ event: 'thinking_end' })}\n\n`);
              }
              fullResponse += content;
              send(`data: ${JSON.stringify({ content })}\n\n`);
            }
          }
        } catch (streamError) {
          console.error('[Chat] Stream error:', streamError);
          send(`data: ${JSON.stringify({ event: 'error', message: friendlyError(streamError) })}\n\n`);
        }
        if (fullResponse) {
          const saved = await saveToDatabase(fullResponse);
          if (!saved) {
            send(`data: ${JSON.stringify({ event: 'warning', message: 'Tin nhắn có thể chưa được lưu. Vui lòng kiểm tra lịch sử chat.' })}\n\n`);
          }
        }
        send('data: [DONE]\n\n');
        close();
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
