// End-to-end test of the OCR-tolerance guard: feed the REAL garbled OCR text
// (what the live 11B vision actually produced for Câu 49) to the text solver
// with the updated system prompt, and check the model now reconstructs + solves
// instead of declaring the problem "vô nghĩa".
import { config } from 'dotenv';
config({ path: '.env' });
config({ path: '.env.local', override: true });
import OpenAI from 'openai';
import { buildSystemPrompt } from '../../src/features/knowledge/lib/rag/prompts';

const nvidia = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.NVIDIA_BASE_URL || undefined });

// Verbatim copy of what the 11B vision OCR returned (still has "đường", "mọi", f').
const GARBLED_OCR = `Câu 49: Cho hàm số y = f(x) có đạo hàm f'(x) = x^2 - 3x - 4, ∀ x ∈ R. Có bao nhiêu giá trị nguyên của tham số m sao cho ứng với mọi m, hàm số g(x) = f'(-x^3 + 3x^2 + m) có đường hai điểm cực trị thuộc khoảng (1;4)?
A. 9.  B. 7.  C. 8.  D. 10.`;

const REJECT_WORDS = ['vô nghĩa', 'sai sót nghiêm trọng', 'thiếu dữ kiện', 'không thể xác định', 'không giải được', 'lỗi đánh máy'];

async function run(model: string) {
  const system = buildSystemPrompt([], 'thinking', null);
  const t = Date.now();
  const r = await nvidia.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: `Giải bài tập trong ảnh\n\n[Nội dung từ ảnh]:\n${GARBLED_OCR}` },
    ],
    max_tokens: 2000,
    temperature: 0.2,
  });
  const out = r.choices[0]?.message?.content ?? '';
  const ms = Date.now() - t;
  const rejected = REJECT_WORDS.filter((w) => out.toLowerCase().includes(w.toLowerCase()));
  console.log(`\n======== ${model}  ${ms}ms ========`);
  console.log('REJECT phrases present:', rejected.length ? rejected : 'NONE ✅');
  console.log('Reconstructed "đúng hai điểm cực trị"?', /đúng\s+hai\s+điểm\s+cực\s+trị/i.test(out) ? 'yes ✅' : 'not explicitly');
  console.log('--- first 1400 chars ---');
  console.log(out.slice(0, 1400));
}

async function main() {
  const model = process.env.NVIDIA_MODEL || 'qwen/qwen3-next-80b-a3b-instruct';
  await run(model);
}
main().catch((e) => { console.error('ERR', e?.status, e?.message); process.exit(1); });
