import OpenAI from 'openai';
import { z } from 'zod';
import { Topic } from '@prisma/client';
import prisma from '@/shared/lib/db';
import { TOPIC_LABEL } from '@/shared/constants/topics';

// ── Config ───────────────────────────────────────────────────────────────────
// Debounce: don't re-summarise the same student more often than this.
const DEBOUNCE_MS = parseInt(process.env.PROFILE_UPDATE_DEBOUNCE_MS || '600000', 10); // 10 min
const MIN_MESSAGES = 4; // skip short / trivial exchanges
const SUMMARY_TIMEOUT_MS = parseInt(process.env.PROFILE_SUMMARY_TIMEOUT_MS || '8000', 10);

const VALID_TOPICS = new Set(Object.values(Topic) as string[]);

// ── LLM client (same selection pattern as query-rewriter.ts) ──────────────────
const geminiClient = process.env.GEMINI_API_KEY
  ? new OpenAI({
      apiKey: process.env.GEMINI_API_KEY,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    })
  : null;

const groqClient = process.env.GROQ_API_KEY
  ? new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    })
  : null;

const nvidiaClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});

// ── Output contract ───────────────────────────────────────────────────────────
const profileUpdateSchema = z.object({
  level: z.string().nullable().optional(),
  weakTopics: z.array(z.string()).optional().default([]),
  strongTopics: z.array(z.string()).optional().default([]),
  recurringErrors: z.string().nullable().optional(),
  lastStudied: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
});

type Msg = { role: string; content: string };

const TOPIC_ENUM_HINT = Object.entries(TOPIC_LABEL)
  .map(([k, v]) => `${k} (${v})`)
  .join(', ');

function buildPrompt(oldProfile: {
  level: string | null;
  weakTopics: Topic[];
  strongTopics: Topic[];
  recurringErrors: string | null;
  lastStudied: string | null;
  summary: string | null;
} | null, transcript: Msg[]): Array<{ role: 'system' | 'user'; content: string }> {
  const existing = oldProfile
    ? JSON.stringify({
        level: oldProfile.level,
        weakTopics: oldProfile.weakTopics,
        strongTopics: oldProfile.strongTopics,
        recurringErrors: oldProfile.recurringErrors,
        lastStudied: oldProfile.lastStudied,
        summary: oldProfile.summary,
      })
    : '(chưa có hồ sơ — học sinh mới)';

  // Only the tail of the conversation, assistant turns truncated for cost.
  const convo = transcript
    .slice(-12)
    .map((m) => `${m.role === 'user' ? 'HỌC SINH' : 'GIA SƯ'}: ${m.role === 'assistant' ? m.content.slice(0, 400) : m.content}`)
    .join('\n');

  return [
    {
      role: 'system',
      content:
        'Bạn là hệ thống cập nhật HỒ SƠ HỌC TẬP của học sinh dựa trên đoạn hội thoại học toán THPT.\n' +
        'Nhiệm vụ: HỢP NHẤT hồ sơ cũ với thông tin mới một cách BẢO THỦ — KHÔNG xóa thông tin cũ trừ khi có bằng chứng mâu thuẫn.\n' +
        `Chỉ dùng các mã chủ đề sau cho weakTopics/strongTopics: ${TOPIC_ENUM_HINT}.\n` +
        'Trả về DUY NHẤT một JSON hợp lệ (không markdown, không giải thích) theo schema:\n' +
        '{"level": "trung bình"|"khá"|"giỏi"|null, "weakTopics": string[], "strongTopics": string[], "recurringErrors": string|null, "lastStudied": string|null, "summary": string}\n' +
        '- level: ước lượng trình độ qua câu hỏi/lỗi của em.\n' +
        '- weakTopics: chủ đề em còn lúng túng (mã enum). strongTopics: chủ đề em làm tốt.\n' +
        '- recurringErrors: 1-2 lỗi hay mắc, ngắn gọn, tiếng Việt.\n' +
        '- lastStudied: chủ đề chính của buổi này, tiếng Việt (vd "Tích phân từng phần").\n' +
        '- summary: 3-5 câu tiếng Việt mô tả tình hình học tập, dùng cho buổi sau.',
    },
    {
      role: 'user',
      content: `HỒ SƠ CŨ:\n${existing}\n\nHỘI THOẠI BUỔI NÀY:\n${convo}\n\nTrả về JSON hồ sơ đã cập nhật:`,
    },
  ];
}

function extractJson(raw: string): unknown {
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found');
  return JSON.parse(cleaned.slice(start, end + 1));
}

function toValidTopics(arr: string[]): Topic[] {
  return Array.from(new Set(arr.filter((t) => VALID_TOPICS.has(t)))) as Topic[];
}

/**
 * Refresh the student's long-term profile after a chat turn.
 * Fire-and-forget — never throws to the caller; debounced and guarded so it
 * only runs on meaningful exchanges and not too frequently.
 */
export async function maybeUpdateStudentProfile(userId: string, transcript: Msg[]): Promise<void> {
  if (transcript.length < MIN_MESSAGES) return;

  const existing = await prisma.studentProfile.findUnique({ where: { userId } });

  // Debounce against the last update.
  if (existing && Date.now() - existing.updatedAt.getTime() < DEBOUNCE_MS) return;

  const client = geminiClient ?? groqClient ?? nvidiaClient;
  const model = geminiClient
    ? 'gemini-2.5-flash'
    : groqClient
    ? process.env.GROQ_FAST_MODEL || 'llama-3.1-8b-instant'
    : process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SUMMARY_TIMEOUT_MS);

  let parsed: z.infer<typeof profileUpdateSchema>;
  try {
    const res = await client.chat.completions.create(
      { model, temperature: 0, max_tokens: 600, messages: buildPrompt(existing, transcript) },
      { signal: controller.signal },
    );
    const raw = res.choices[0]?.message?.content ?? '';
    parsed = profileUpdateSchema.parse(extractJson(raw));
  } catch (e) {
    console.error('[ProfileSummarizer] LLM/parse failed:', e);
    return;
  } finally {
    clearTimeout(timeout);
  }

  // Conservative merge: keep old value when the model returns empty/null.
  const weakTopics = toValidTopics(parsed.weakTopics ?? []);
  const strongTopics = toValidTopics(parsed.strongTopics ?? []);

  const data = {
    level: parsed.level ?? existing?.level ?? null,
    weakTopics: weakTopics.length > 0 ? weakTopics : existing?.weakTopics ?? [],
    strongTopics: strongTopics.length > 0 ? strongTopics : existing?.strongTopics ?? [],
    recurringErrors: parsed.recurringErrors ?? existing?.recurringErrors ?? null,
    lastStudied: parsed.lastStudied ?? existing?.lastStudied ?? null,
    summary: parsed.summary ?? existing?.summary ?? null,
  };

  try {
    await prisma.studentProfile.upsert({
      where: { userId },
      create: { userId, sessionCount: 1, ...data },
      update: { sessionCount: { increment: 1 }, ...data },
    });
  } catch (e) {
    console.error('[ProfileSummarizer] DB upsert failed:', e);
  }
}
