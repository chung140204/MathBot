import OpenAI from 'openai';
import { classifyTopic } from './router';
import type { RewriteResult } from './types';

const FOLLOW_UP_PATTERNS: RegExp[] = [
  /câu trên|bài trên|ở trên|bài đó|phương pháp đó|kết quả đó|câu này|bài này/i,
  /tiếp tục|giải tiếp|làm tiếp|bước tiếp|phần tiếp/i,
  /cách khác|phương pháp khác|cách khác đi|giải khác/i,
  /tại sao|vì sao|giải thích|không hiểu|ý là gì|rõ hơn|chi tiết hơn/i,
  /nếu thay|nếu đổi|thay đổi|với m\s*=|với a\s*=|khi x\s*=|nếu x\s*=/i,
];

export function detectFollowUp(query: string): boolean {
  for (const pattern of FOLLOW_UP_PATTERNS) {
    if (pattern.test(query)) return true;
  }
  if (query.length < 20 && classifyTopic(query) === null) return true;
  return false;
}

async function llmRewrite(
  query: string,
  history: Array<{ role: string; content: string }>,
  signal?: AbortSignal,
): Promise<string> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.NVIDIA_BASE_URL || undefined,
  });

  const model =
    process.env.NVIDIA_FAST_MODEL || process.env.NVIDIA_MODEL || 'gpt-4o';

  const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
    {
      role: 'system',
      content:
        'Bạn là hệ thống viết lại câu hỏi. Nhiệm vụ: biến câu hỏi follow-up thành câu hỏi ĐỘC LẬP có đầy đủ ngữ cảnh để tìm kiếm tài liệu toán học.\nChỉ trả về MỘT câu hỏi đã viết lại, không giải thích thêm.',
    },
    ...history.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: `Viết lại câu hỏi sau thành câu hỏi độc lập:\n${query}`,
    },
  ];

  const response = await client.chat.completions.create(
    { model, temperature: 0, max_tokens: 256, messages },
    { signal },
  );

  return response.choices[0].message.content?.trim() ?? query;
}

export async function rewriteQuery(
  query: string,
  history: Array<{ role: string; content: string }>,
): Promise<RewriteResult> {
  if (!detectFollowUp(query) || history.length < 2) {
    return { originalQuery: query, rewrittenQuery: query, isFollowUp: false };
  }

  const recentHistory = history.slice(-6).map((msg) => ({
    role: msg.role,
    content: msg.role === 'assistant' ? msg.content.slice(0, 200) : msg.content,
  }));

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const rewrittenQuery = await llmRewrite(query, recentHistory, controller.signal);
    clearTimeout(timeout);

    return { originalQuery: query, rewrittenQuery, isFollowUp: true };
  } catch {
    const lastUserMsg = [...history].reverse().find((msg) => msg.role === 'user');
    const fallback = lastUserMsg ? `${lastUserMsg.content}. ${query}` : query;

    return { originalQuery: query, rewrittenQuery: fallback, isFollowUp: true };
  }
}
