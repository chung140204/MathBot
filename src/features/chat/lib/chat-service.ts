import OpenAI from 'openai';
import prisma from '@/shared/lib/db';
import { ragSearch, RagSearchResult } from '@/features/knowledge/lib/rag/pipeline';
import { buildSystemPrompt } from '@/features/knowledge/lib/rag/prompts';
import { z } from 'zod';

// ── Schema ─────────────────────────────────────────────────────────────────────

export const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
  })).min(1),
  sessionId: z.string().nullable().optional(),
  imageBase64: z.string().nullable().optional(),
  mode: z.enum(['fast', 'thinking', 'tutor']).optional().default('thinking'),
});

export type ChatStreamParams = z.infer<typeof chatRequestSchema>;

// ── AI Clients ─────────────────────────────────────────────────────────────────

const gemini = process.env.GEMINI_API_KEY
  ? new OpenAI({ apiKey: process.env.GEMINI_API_KEY, baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' })
  : null;

const groq = process.env.GROQ_API_KEY
  ? new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' })
  : null;

const nvidia = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});

// ── Rate Limiter ───────────────────────────────────────────────────────────────

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

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

// ── Main Stream Factory ────────────────────────────────────────────────────────

export async function createChatStream(userId: string, params: ChatStreamParams): Promise<ReadableStream> {
  const { messages, imageBase64, mode } = params;
  let sessionId = params.sessionId ?? null;
  const lastUserMessage = messages[messages.length - 1].content;
  const encoder = new TextEncoder();

  const resolveSession = async (): Promise<{ id: string; isNew: boolean }> => {
    if (!sessionId) {
      const newTitle = lastUserMessage.substring(0, 50) + (lastUserMessage.length > 50 ? '...' : '');
      const newSession = await prisma.chatSession.create({ data: { userId, title: newTitle } });
      return { id: newSession.id, isNew: true };
    }
    const existing = await prisma.chatSession.findFirst({ where: { id: sessionId, userId }, select: { id: true } });
    if (!existing) throw new Error('SESSION_NOT_FOUND');
    return { id: sessionId, isNew: false };
  };

  // Session resolution stays outside the stream for proper HTTP 404 handling
  let sessionResult: { id: string; isNew: boolean };
  try {
    sessionResult = await resolveSession();
  } catch (e: any) {
    if (e?.message === 'SESSION_NOT_FOUND') throw Object.assign(new Error('Session not found'), { status: 404 });
    throw e;
  }

  sessionId = sessionResult.id;
  const isNewSession = sessionResult.isNew;

  const saveToDatabase = async (assistantContent: string): Promise<{ userMsgId: string; assistantMsgId: string } | null> => {
    try {
      const [userMsg, assistantMsg] = await Promise.all([
        prisma.chatMessage.create({ data: { chatSessionId: sessionId!, role: 'user', content: lastUserMessage } }),
        prisma.chatMessage.create({ data: { chatSessionId: sessionId!, role: 'assistant', content: assistantContent } }),
      ]);
      await prisma.chatSession.update({ where: { id: sessionId! }, data: { updatedAt: new Date() } });
      return { userMsgId: userMsg.id, assistantMsgId: assistantMsg.id };
    } catch (dbError) {
      console.error('[Chat] Failed to save messages to database:', dbError);
      return null;
    }
  };

  if (!process.env.OPENAI_API_KEY) {
    return new ReadableStream({
      async start(controller) {
        if (isNewSession) controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: 'session', sessionId })}\n\n`));
        const mockText = "Chào bạn! Đây là câu trả lời mẫu từ MathBot. Để sử dụng AI thật, hãy thêm OPENAI_API_KEY vào file .env nhé.\n\nPhần giải bài tập:\n1. Bước 1: Tính đạo hàm...\n2. Bước 2: Kết quả cuối cùng.";
        let fullResponse = '';
        for (const word of mockText.split(' ')) {
          fullResponse += word + ' ';
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: word + ' ' })}\n\n`));
          await new Promise(r => setTimeout(r, 50));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
        await saveToDatabase(fullResponse.trim());
      },
    });
  }

  const maxHistory = parseInt(process.env.CHAT_MAX_HISTORY || '10', 10);

  return new ReadableStream({
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

      if (isNewSession) send(`data: ${JSON.stringify({ event: 'session', sessionId })}\n\n`);
      send(`data: ${JSON.stringify({ event: 'rag_searching' })}\n\n`);

      // RAG runs INSIDE the stream so the client receives rag_searching immediately
      let ragResult: RagSearchResult;
      try {
        ragResult = await ragSearch(lastUserMessage, { mode, history: messages });
      } catch {
        ragResult = { chunks: [] };
      }

      const { chunks, rewrittenQuery } = ragResult;
      if (rewrittenQuery) send(`data: ${JSON.stringify({ event: 'rewrite', original: lastUserMessage, rewritten: rewrittenQuery })}\n\n`);
      if (chunks.length > 0) {
        const sourcesPayload = chunks.map(c => ({
          source: c.source, topic: c.topic,
          similarity: 'finalScore' in c ? (c as any).finalScore : c.similarity,
        }));
        send(`data: ${JSON.stringify({ event: 'sources', data: sourcesPayload })}\n\n`);
      }

      const systemPrompt = { role: 'system' as const, content: buildSystemPrompt(chunks, mode) };

      const recentMessages = messages.slice(-maxHistory).map(msg => {
        if (msg.role === 'assistant' && msg.content.length > 1500) return { ...msg, content: msg.content.slice(0, 1500) + '\n...[lược bỏ]' };
        if (msg.role === 'user') return { ...msg, content: msg.content.replace(/!\[image\]\(data:image\/[^;]+;base64,[^)]+\)\n?\n?/g, '[ảnh]\n') };
        return msg;
      });

      const apiMessages: Array<{ role: string; content: any }> = [...recentMessages];
      if (imageBase64 && apiMessages.length > 0) {
        const lastIndex = apiMessages.length - 1;
        const lastMsgText = apiMessages[lastIndex].content.replace(`![image](${imageBase64})\n\n`, '');
        apiMessages[lastIndex] = {
          role: 'user',
          content: [
            { type: 'text', text: lastMsgText || 'Giải bài tập trong ảnh' },
            { type: 'image_url', image_url: { url: imageBase64 } },
          ],
        };
      }

      const modeConfig = {
        fast: { max_tokens: 3000, temperature: 0.3 },
        thinking: { max_tokens: 4096, temperature: 0.2 },
        tutor: { max_tokens: 4096, temperature: 0.35 },
      }[mode];

      let chatClient: OpenAI;
      let chatModel: string;

      if (gemini) {
        chatClient = gemini;
        chatModel = imageBase64 ? 'gemini-2.5-flash' : 'gemini-2.5-pro';
      } else if (groq && !imageBase64) {
        chatClient = groq;
        chatModel = mode === 'fast'
          ? (process.env.GROQ_FAST_MODEL || 'llama-3.1-8b-instant')
          : (process.env.GROQ_MODEL || 'qwen/qwen3-32b');
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

      const nvidiaVisionFallback = async () => {
        if (imageBase64) {
          const visionModel = process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct';
          console.log(`[Chat] Step 1: NVIDIA Vision (${visionModel}) reading image...`);
          try {
            const visionRes = await nvidia.chat.completions.create({
              model: visionModel,
              messages: [{ role: 'user', content: [
                { type: 'text', text: 'Đọc và trích xuất toàn bộ nội dung bài toán trong ảnh. Dùng LaTeX $...$ cho công thức. Chỉ trả về nội dung bài toán, không giải.' },
                { type: 'image_url', image_url: { url: imageBase64 } },
              ] }],
              max_tokens: 1024,
              temperature: 0,
            });
            const extractedText = visionRes.choices[0]?.message?.content ?? '';
            console.log(`[Chat] Vision extracted: ${extractedText.length} chars`);
            const lastIdx = apiMessages.length - 1;
            const origText = Array.isArray(apiMessages[lastIdx].content)
              ? apiMessages[lastIdx].content.find((p: any) => p.type === 'text')?.text || ''
              : apiMessages[lastIdx].content;
            apiMessages[lastIdx] = { role: 'user', content: `${origText}\n\n[Nội dung từ ảnh]:\n${extractedText}` };
          } catch {
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

      let response: any;
      try {
        response = await createStream(chatClient, chatModel);
      } catch (err: any) {
        const status = err?.status;
        if (status === 429 || status === 503) {
          if (gemini && chatModel.includes('pro')) {
            chatModel = 'gemini-2.5-flash';
            console.log(`[Chat] Gemini Pro ${status}, fallback to ${chatModel}`);
            try {
              response = await createStream(chatClient, chatModel);
            } catch (flashErr: any) {
              console.log(`[Chat] Gemini Flash also failed (${flashErr?.status}), fallback to NVIDIA`);
              await nvidiaVisionFallback();
            }
          } else if (gemini) {
            console.log(`[Chat] Gemini Flash ${status}, fallback to NVIDIA`);
            await nvidiaVisionFallback();
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }

      let fullResponse = '';
      let thinkingStarted = false;
      let thinkingDone = false;
      try {
        for await (const chunk of response) {
          const delta = chunk.choices[0]?.delta as any;
          const reasoning: string | undefined = delta?.reasoning_content;
          const content: string | undefined = delta?.content;
          if (reasoning) {
            if (!thinkingStarted) { thinkingStarted = true; send(`data: ${JSON.stringify({ event: 'thinking_start' })}\n\n`); }
            send(`data: ${JSON.stringify({ reasoning })}\n\n`);
          }
          if (content) {
            if (thinkingStarted && !thinkingDone) { thinkingDone = true; send(`data: ${JSON.stringify({ event: 'thinking_end' })}\n\n`); }
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
        if (saved) {
          send(`data: ${JSON.stringify({ event: 'saved', userMessageId: saved.userMsgId, assistantMessageId: saved.assistantMsgId })}\n\n`);
        } else {
          send(`data: ${JSON.stringify({ event: 'warning', message: 'Tin nhắn có thể chưa được lưu. Vui lòng kiểm tra lịch sử chat.' })}\n\n`);
        }
      }
      send('data: [DONE]\n\n');
      close();
    },
  });
}
