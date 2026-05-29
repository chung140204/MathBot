import OpenAI from 'openai';
import prisma from '@/shared/lib/db';
import { ragSearch, RagSearchResult } from '@/features/knowledge/lib/rag/pipeline';
import { buildSystemPrompt, StudentProfileForPrompt } from '@/features/knowledge/lib/rag/prompts';
import { maybeUpdateStudentProfile } from './profile-summarizer';
import { z } from 'zod';

// ── Schema ─────────────────────────────────────────────────────────────────────

export const chatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
  })).min(1),
  sessionId: z.string().nullable().optional(),
  imageBase64: z.string().nullable().optional(),
  mode: z.enum(['fast', 'thinking', 'tutor']).optional().default('tutor'),
  // On regenerate/edit: the user message id to replace from. The server deletes
  // that message and everything after it before saving, so the conversation
  // doesn't accumulate duplicate/stale rows.
  replaceFromMessageId: z.string().nullable().optional(),
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
  const replaceFromMessageId = params.replaceFromMessageId ?? null;
  let sessionId = params.sessionId ?? null;
  const rawLastMessage = messages[messages.length - 1].content;
  const lastUserMessage = rawLastMessage.replace(/!\[image\]\(data:image\/[^)]+\)\n?\n?/g, '').trim();
  const encoder = new TextEncoder();

  const resolveSession = async (): Promise<{ id: string; isNew: boolean }> => {
    if (sessionId) {
      const existing = await prisma.chatSession.findFirst({ where: { id: sessionId, userId }, select: { id: true } });
      if (existing) return { id: sessionId, isNew: false };
      // sessionId was provided but not found for this user (stale client id, a
      // deleted conversation, or another account). Recover gracefully by starting
      // a fresh session instead of returning 404 and dead-ending the user.
      console.warn('[Chat] sessionId not found, creating a new session:', sessionId);
    }
    const newTitle = lastUserMessage.substring(0, 50) + (lastUserMessage.length > 50 ? '...' : '');
    const newSession = await prisma.chatSession.create({ data: { userId, title: newTitle } });
    return { id: newSession.id, isNew: true };
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

  // Persist the user's question on its own — called BEFORE the AI runs so the
  // question survives even if the model fails (no more empty chats on reopen).
  const saveUserMessage = async (): Promise<string | null> => {
    try {
      const msg = await prisma.chatMessage.create({ data: { chatSessionId: sessionId!, role: 'user', content: rawLastMessage } });
      await prisma.chatSession.update({ where: { id: sessionId! }, data: { updatedAt: new Date() } });
      return msg.id;
    } catch (dbError) {
      console.error('[Chat] Failed to save user message:', dbError);
      return null;
    }
  };

  // Persist the assistant's answer after streaming completes.
  const saveAssistantMessage = async (assistantContent: string): Promise<string | null> => {
    try {
      const msg = await prisma.chatMessage.create({ data: { chatSessionId: sessionId!, role: 'assistant', content: assistantContent } });
      await prisma.chatSession.update({ where: { id: sessionId! }, data: { updatedAt: new Date() } });
      return msg.id;
    } catch (dbError) {
      console.error('[Chat] Failed to save assistant message:', dbError);
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
        await saveUserMessage();
        await saveAssistantMessage(fullResponse.trim());
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

      // RAG runs INSIDE the stream so the client receives rag_searching immediately.
      // The student profile is fetched in parallel so the tutor can personalise.
      const [ragResult, studentProfile] = await Promise.all([
        ragSearch(lastUserMessage, { mode, history: messages }).catch(() => ({ chunks: [] } as RagSearchResult)),
        prisma.studentProfile
          .findUnique({
            where: { userId },
            select: {
              level: true, weakTopics: true, strongTopics: true,
              lastStudied: true, recurringErrors: true, goals: true, summary: true,
              user: { select: { name: true } },
            },
          })
          .catch(() => null),
      ]);

      const profileForPrompt: StudentProfileForPrompt | null = studentProfile
        ? {
            studentName: studentProfile.user?.name?.split(' ').pop() ?? null,
            level: studentProfile.level,
            weakTopics: studentProfile.weakTopics,
            strongTopics: studentProfile.strongTopics,
            lastStudied: studentProfile.lastStudied,
            recurringErrors: studentProfile.recurringErrors,
            goals: studentProfile.goals,
            summary: studentProfile.summary,
          }
        : null;

      const { chunks, rewrittenQuery } = ragResult;
      // Cap how many chunks go into the prompt to keep the request small (cost,
      // latency, provider token limits). Retrieval may rank more (VDC topK=8), but
      // ~5 worked examples are plenty for the LLM to imitate. Configurable via env.
      const maxCtxChunks = parseInt(process.env.RAG_PROMPT_MAX_CHUNKS || '5', 10);
      const promptChunks = chunks.slice(0, maxCtxChunks);
      if (rewrittenQuery) send(`data: ${JSON.stringify({ event: 'rewrite', original: lastUserMessage, rewritten: rewrittenQuery })}\n\n`);
      if (promptChunks.length > 0) {
        const sourcesPayload = promptChunks.map(c => ({
          source: c.source, topic: c.topic,
          similarity: 'finalScore' in c ? (c as any).finalScore : c.similarity,
        }));
        send(`data: ${JSON.stringify({ event: 'sources', data: sourcesPayload })}\n\n`);
      }

      // Regenerate/edit: drop the superseded message(s) so the conversation
      // doesn't accumulate duplicate/stale rows. Deletes the target user message
      // and everything created at-or-after it in this session, then re-saves below.
      if (replaceFromMessageId && !isNewSession) {
        try {
          const target = await prisma.chatMessage.findFirst({
            where: { id: replaceFromMessageId, chatSessionId: sessionId! },
            select: { createdAt: true },
          });
          if (target) {
            await prisma.chatMessage.deleteMany({
              where: { chatSessionId: sessionId!, createdAt: { gte: target.createdAt } },
            });
          }
        } catch (e) {
          console.error('[Chat] replace/truncate failed:', e);
        }
      }

      // Save the question NOW, before the model runs. If the AI later fails or
      // returns nothing, the question is already persisted — reopening the chat
      // shows it (instead of an empty window).
      const userMsgId = await saveUserMessage();

      const systemPrompt = { role: 'system' as const, content: buildSystemPrompt(promptChunks, mode, profileForPrompt) };

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

      // Chat uses NVIDIA as the PRIMARY provider (free + reliable). Gemini/Groq
      // keys remain in .env for RAG/embeddings/OCR, but are intentionally not used
      // here so chat doesn't waste 429/413 fallback hops when Gemini quota is out.
      chatClient = nvidia;
      chatModel = imageBase64
        ? (process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct')
        : mode === 'fast'
          ? (process.env.NVIDIA_FAST_MODEL || process.env.NVIDIA_MODEL || 'qwen/qwen3-next-80b-a3b-instruct')
          : (process.env.NVIDIA_MODEL || 'qwen/qwen3-next-80b-a3b-instruct');

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

      // Chat fallback chain = NVIDIA only: primary model + one NVIDIA backup model.
      // (Gemini/Groq remain available to other features via their .env keys.)
      const fallbackChain: Array<{ client: OpenAI; model: string }> = [];
      fallbackChain.push({ client: chatClient, model: chatModel });
      if (!imageBase64) {
        const backupModel = process.env.NVIDIA_BACKUP_MODEL || 'meta/llama-3.3-70b-instruct';
        if (backupModel !== chatModel) fallbackChain.push({ client: nvidia, model: backupModel });
      }

      let response: any;
      let lastError: any;
      const originalLastMessage = apiMessages.length > 0 ? { ...apiMessages[apiMessages.length - 1] } : null;
      for (const { client, model } of fallbackChain) {
        try {
          // Strip image for text-only models (Groq), restore for vision models
          const lastIdx = apiMessages.length - 1;
          if (client === groq && imageBase64) {
            if (Array.isArray(apiMessages[lastIdx].content)) {
              const textPart = apiMessages[lastIdx].content.find((p: any) => p.type === 'text');
              apiMessages[lastIdx] = { role: 'user', content: textPart?.text || '' };
            }
            console.log('[Chat] Stripped image for text-only model');
          } else if (originalLastMessage && client !== groq) {
            apiMessages[lastIdx] = { ...originalLastMessage };
          }
          chatModel = model;
          console.log(`[Chat] Trying ${model}...`);
          response = await createStream(client, model);
          console.log(`[Chat] ${model} connected successfully`);
          break;
        } catch (err: any) {
          lastError = err;
          const status = err?.status;
          // 413 = request too large (e.g. Groq free-tier TPM limit) → fall through
          // to a provider with a larger context (NVIDIA) instead of failing.
          if (status === 429 || status === 403 || status === 503 || status === 413) {
            console.log(`[Chat] ${model} returned ${status}, trying next fallback...`);
            await new Promise(r => setTimeout(r, 1000));
            continue;
          }
          throw err; // Non-retryable error
        }
      }

      // If all fallbacks failed with 429/503 and we have an image, try NVIDIA vision extraction
      if (!response && imageBase64) {
        console.log('[Chat] All models failed, trying NVIDIA Vision extraction...');
        await nvidiaVisionFallback();
      } else if (!response) {
        throw lastError;
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
        const assistantMsgId = await saveAssistantMessage(fullResponse);
        if (userMsgId && assistantMsgId) {
          send(`data: ${JSON.stringify({ event: 'saved', userMessageId: userMsgId, assistantMessageId: assistantMsgId })}\n\n`);
        } else {
          send(`data: ${JSON.stringify({ event: 'warning', message: 'Tin nhắn có thể chưa được lưu. Vui lòng kiểm tra lịch sử chat.' })}\n\n`);
        }

        // Fire-and-forget: refresh the long-term learning profile after the turn.
        // Never blocks the response; internally debounced + guarded.
        const transcript = [
          ...recentMessages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'assistant', content: fullResponse },
        ];
        void maybeUpdateStudentProfile(userId, transcript).catch((e) =>
          console.error('[Chat] profile update failed:', e),
        );
      }
      send('data: [DONE]\n\n');
      close();
    },
  });
}
