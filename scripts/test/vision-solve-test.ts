// Experiment for "approach 4": send the problem image DIRECTLY to a
// vision-capable model and check whether it reads the statement verbatim
// (esp. "có ĐÚNG hai điểm cực trị THUỘC KHOẢNG (1;4)") instead of the current
// single weak-OCR pass that misread it as "đường ... (1;4)".
import 'dotenv/config';
import { config } from 'dotenv';
import OpenAI from 'openai';
import { readFileSync } from 'fs';

config({ path: '.env' });
config({ path: '.env.local', override: true });

const imgPath = process.argv[2] || 'd:/DATN/chat-img-0.jpg';
const buf = readFileSync(imgPath);
const dataUrl = `data:image/jpeg;base64,${buf.toString('base64')}`;

const gemini = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});
const nvidia = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});

// The exact prompt the live chat OCR uses today (the broken one).
const CURRENT_OCR_PROMPT =
  'Đọc và chép lại nội dung bài toán trong ảnh, ngắn gọn và chính xác. Không cần định dạng LaTeX, cứ ghi công thức tự nhiên. Chỉ trả về đề bài, không giải.';

// Proposed verbatim OCR prompt (extraction only — solver stays the text model).
const VERBATIM_OCR_PROMPT =
  'Chép lại CHÍNH XÁC, NGUYÊN VĂN toàn bộ nội dung bài toán trong ảnh: giữ đúng TỪNG CHỮ, từng dấu tiếng Việt, mọi ký hiệu và công thức toán, và chép ĐẦY ĐỦ tất cả các phương án A, B, C, D. ' +
  'TUYỆT ĐỐI KHÔNG tóm tắt, KHÔNG rút gọn, KHÔNG sửa hay suy diễn đề. Nếu không chắc một chữ, cứ chép đúng như nhìn thấy. Chỉ trả về đề bài, không giải, không nhận xét.';

// Approach 4 prompt: read verbatim, then solve — print the read-back so we can audit it.
const VISION_SOLVE_PROMPT =
  'Bạn là gia sư Toán. Hãy làm 2 việc:\n' +
  '1) ĐỀ ĐỌC ĐƯỢC: chép lại NGUYÊN VĂN 100% đề trong ảnh, giữ đúng từng chữ, dấu tiếng Việt, ký hiệu toán và đủ các phương án A/B/C/D. Không tóm tắt, không sửa đề.\n' +
  '2) LỜI GIẢI: giải bài và chọn đáp án.\n' +
  'Bắt đầu bằng dòng "ĐỀ ĐỌC ĐƯỢC:" rồi đến "LỜI GIẢI:".';

async function call(label: string, client: OpenAI, model: string, prompt: string, maxTokens = 1500) {
  const t = Date.now();
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const r = await client.chat.completions.create({
        model,
        messages: [{ role: 'user', content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: dataUrl } },
        ] as any }],
        max_tokens: maxTokens,
        temperature: 0,
      });
      const out = r.choices[0]?.message?.content ?? '(empty)';
      console.log(`\n================ ${label}  [${model}]  ${Date.now() - t}ms (attempt ${attempt}) ================`);
      console.log(out.trim());
      return;
    } catch (e: any) {
      const status = e?.status;
      if ((status === 429 || status >= 500) && attempt < 4) {
        const wait = status === 429 ? 8000 * attempt : 3000 * attempt;
        console.log(`   [${label}] ${status} on attempt ${attempt}, retry in ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      console.log(`\n================ ${label}  [${model}] ================`);
      console.log('ERROR:', status, e?.message?.slice(0, 200));
      return;
    }
  }
}

async function main() {
  console.log('Image:', imgPath, `(${Math.round(buf.length / 1024)}KB)`);
  const only = process.argv[3]; // optional: run a single variant
  // 0) THE FIX UNDER TEST: 11B + verbatim prompt (extraction only). Run twice to check stability.
  if (!only || only === 'verbatim') {
    const M = process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-11b-vision-instruct';
    await call('0a) 11B + VERBATIM prompt (run 1)', nvidia, M, VERBATIM_OCR_PROMPT, 1024);
    await call('0b) 11B + VERBATIM prompt (run 2)', nvidia, M, VERBATIM_OCR_PROMPT, 1024);
  }
  if (only === 'verbatim') return;
  // 2. Approach 4: Gemini 2.5 Flash, image direct, read-verbatim + solve.
  if (!only || only === 'gemini')
    await call('2) APPROACH 4 — Gemini 2.5 Flash', gemini,
      process.env.GEMINI_VISION_MODEL || 'gemini-2.5-flash', VISION_SOLVE_PROMPT);
  // 2b. Gemini 2.0 Flash (separate quota bucket, often available when 2.5 is 429).
  if (!only || only === 'gflash2')
    await call('2b) APPROACH 4 — Gemini 2.0 Flash', gemini, 'gemini-2.0-flash', VISION_SOLVE_PROMPT);
  // 3. Approach 4 variant: NVIDIA 90B vision direct solve (stay on NVIDIA).
  if (!only || only === 'nvidia90')
    await call('3) APPROACH 4 — NVIDIA 90B vision', nvidia,
      'meta/llama-3.2-90b-vision-instruct', VISION_SOLVE_PROMPT);
  // 3b. NVIDIA Qwen2.5-VL-72B — strong open VL model, good at math + Vietnamese.
  if (!only || only === 'qwenvl')
    await call('3b) APPROACH 4 — NVIDIA Qwen2.5-VL-72B', nvidia, 'qwen/qwen2.5-vl-72b-instruct', VISION_SOLVE_PROMPT);
  // 1. (last) Reproduce the live bug for reference.
  if (!only || only === 'current')
    await call('1) CURRENT OCR (11B, "ngắn gọn")', nvidia,
      process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-11b-vision-instruct', CURRENT_OCR_PROMPT, 1024);
}
main().catch((e) => { console.error(e); process.exit(1); });
