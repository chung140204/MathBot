/**
 * VDC retrieval/answer evaluation harness.
 *
 * Measures, on a curated gold set of "vận dụng cao" problems:
 *   - topicRecall : retrieval returns ≥1 chunk of the expected topic
 *   - vdcRecall   : retrieval returns ≥1 chunk that is (expected topic AND difficulty=ADVANCED)
 *   - answerAccuracy (only with --judge): LLM-as-judge compares the bot answer to the gold answer
 *
 * Run BEFORE and AFTER ingesting the VDC bank to see the delta.
 *   npx tsx scripts/test/eval-vdc.ts            # retrieval metrics only (cheap)
 *   npx tsx scripts/test/eval-vdc.ts --judge    # also generate + grade answers
 *   RAG_DIFFICULTY_AWARE=false npx tsx scripts/test/eval-vdc.ts   # baseline (old behavior)
 *
 * Needs .env with DATABASE_URL + an embedding/LLM key (GEMINI_API_KEY or NVIDIA).
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import OpenAI from 'openai';

interface EvalCase {
  query: string;
  topic: string;      // expected Topic enum value
  goldAnswer: string; // final answer, for --judge
}

// ~14 VDC problems spanning all 7 topics. Each corresponds to an ADVANCED chunk
// in the bank, so after ingest vdcRecall should rise sharply.
const CASES: EvalCase[] = [
  { query: "Cho hàm số y=f(x) có đạo hàm f'(x)=(x-7)(x^2-9). Có bao nhiêu giá trị nguyên dương m để g(x)=f(|x^3+5x|+m) có ít nhất 3 điểm cực trị?", topic: 'DERIVATIVES', goldAnswer: '6' },
  { query: 'Có bao nhiêu giá trị nguyên a thuộc (-10;+vô cực) để hàm số y=|x^3+(a+2)x+9-a^2| đồng biến trên khoảng (0;1)?', topic: 'DERIVATIVES', goldAnswer: '11' },
  { query: "Cho f(x)=x^3+ax^2+bx+c và g(x)=f(x)+f'(x)+f''(x) có hai giá trị cực trị là -3 và 6. Diện tích hình phẳng giới hạn bởi y=f(x)/(g(x)+6) và y=1 bằng bao nhiêu?", topic: 'INTEGRALS', goldAnswer: '2ln2' },
  { query: "Cho f(x)=ax^3+bx^2+cx+d (a>0) có hai cực trị x1,x2 với x1+x2=0. Diện tích hình phẳng giới hạn bởi y=f'(x)f''(x) và trục hoành bằng 9/4. Biết tích phân từ x1 đến x2 của f'(x)/(3^x+1) bằng -7/2. Tính tích phân từ 0 đến x2 của (x+2)f''(x)dx.", topic: 'INTEGRALS', goldAnswer: '13/2 (6,5)' },
  { query: 'Có bao nhiêu cặp số nguyên (x;y) thỏa mãn log_3(x^2+y^2+x)+log_2(x^2+y^2) ≤ log_3(x)+log_2(x^2+y^2+24x)?', topic: 'EXPONENTIAL_LOG', goldAnswer: '48' },
  { query: 'Cho hàm số f(x)=2/x^3+ln((x+3)/(x-3)). Có bao nhiêu số nguyên a thuộc (-vô cực;2100) thỏa mãn f(a-2024)+f(6a-27) ≥ 0?', topic: 'EXPONENTIAL_LOG', goldAnswer: '360' },
  { query: 'Có bao nhiêu số phức z thỏa mãn |z^2|=2|z-zbar| và |(z-4)(zbar-4i)|=|z+4i|^2?', topic: 'COMPLEX_NUMBERS', goldAnswer: '4' },
  { query: 'Trong không gian Oxyz cho A(0;0;10), B(3;4;6). Xét M thay đổi sao cho tam giác OAM không có góc tù và diện tích bằng 15. Giá trị nhỏ nhất của MB thuộc khoảng nào?', topic: 'SOLID_GEOMETRY', goldAnswer: 'căn 13 ≈ 3,6 thuộc (3;4)' },
  { query: 'Trong không gian Oxyz cho mặt cầu (S) tâm I(1;3;9) bán kính 3. M thuộc Ox, N thuộc Oz, MN tiếp xúc (S), mặt cầu ngoại tiếp tứ diện OIMN có bán kính 13/2. A là tiếp điểm của MN và (S). Tính AM·AN.', topic: 'SOLID_GEOMETRY', goldAnswer: '12 căn 3' },
  { query: 'Trong không gian Oxyz cho A(1;6;-1), B(2;-4;-1) và mặt cầu (S) tâm I(1;2;-1) đi qua A. M thuộc (S) sao cho tam giác IAM tù, diện tích 2căn7 và khoảng cách giữa BM và IA lớn nhất. Giá trị a+b+c thuộc khoảng nào?', topic: 'SOLID_GEOMETRY', goldAnswer: 'căn 6 ≈ 2,449 thuộc (2;5/2)' },
  { query: 'Cho khối lăng trụ đứng ABC.A\'B\'C\' có đáy là tam giác vuông cân tại A, AB=2a. Góc giữa đường thẳng BC\' và mặt phẳng (ACC\'A\') bằng 30 độ. Thể tích khối lăng trụ bằng bao nhiêu?', topic: 'VOLUME', goldAnswer: '4 căn 2 a^3' },
  { query: 'Cho khối nón đỉnh S, chiều cao 8 và thể tích 800π/3. A,B thuộc đường tròn đáy với AB=12. Khoảng cách từ tâm đường tròn đáy đến mặt phẳng (SAB) bằng bao nhiêu?', topic: 'VOLUME', goldAnswer: '4 căn 2' },
  { query: 'Tập S={41;42;43;44;45;46;47;48;49}. Chọn 6 số xếp vào A,B,C,M,N,P trên tam giác sao cho (A,M,B),(B,N,C),(C,P,A) là cấp số cộng. Xác suất bằng 4/a. Tìm a.', topic: 'PROBABILITY', goldAnswer: '5040' },
  { query: 'Có bốn ngăn giá sách và 8 quyển sách khác nhau, xếp sao cho mỗi ngăn có ít nhất một quyển và sách có thứ tự. Gọi T là số cách xếp đôi một khác nhau. Tính T/400.', topic: 'PROBABILITY', goldAnswer: '3528' },
];

const DIFFICULTY_AWARE = process.env.RAG_DIFFICULTY_AWARE !== 'false';

function makeClient(): { client: OpenAI; genModel: string; judgeModel: string } | null {
  if (process.env.GEMINI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.GEMINI_API_KEY, baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' });
    return { client, genModel: 'gemini-2.5-pro', judgeModel: 'gemini-2.5-flash' };
  }
  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: process.env.NVIDIA_BASE_URL || undefined });
    const m = process.env.NVIDIA_MODEL || 'meta/llama-3.1-70b-instruct';
    return { client, genModel: m, judgeModel: m };
  }
  return null;
}

async function generate(client: OpenAI, model: string, system: string, query: string): Promise<string> {
  const res = await client.chat.completions.create({
    model, temperature: 0.2, max_tokens: 4096,
    messages: [{ role: 'system', content: system }, { role: 'user', content: query }],
  });
  return res.choices[0]?.message?.content ?? '';
}

async function judgeAnswer(client: OpenAI, model: string, query: string, gold: string, bot: string): Promise<boolean> {
  const prompt = `Câu hỏi: ${query}\nĐáp án đúng: ${gold}\nLời giải của trợ lý:\n${bot.slice(0, 3000)}\n\nTrợ lý có đưa ra ĐÁP SỐ CUỐI trùng khớp đáp án đúng không? Chỉ trả lời một từ: ĐÚNG hoặc SAI.`;
  const res = await client.chat.completions.create({
    model, temperature: 0, max_tokens: 8,
    messages: [{ role: 'user', content: prompt }],
  });
  return /ĐÚNG/i.test(res.choices[0]?.message?.content ?? '');
}

async function main() {
  const doJudge = process.argv.includes('--judge');
  console.log(`\n=== VDC Eval — RAG_DIFFICULTY_AWARE=${DIFFICULTY_AWARE} — judge=${doJudge} ===\n`);

  // Dynamic import AFTER dotenv so @/shared/lib/db sees DATABASE_URL.
  const { ragSearch } = await import('@/features/knowledge/lib/rag/pipeline');
  const { buildSystemPrompt } = await import('@/features/knowledge/lib/rag/prompts');

  const llm = doJudge ? makeClient() : null;
  if (doJudge && !llm) console.warn('⚠️  No LLM key found — skipping judge.\n');

  let topicHits = 0, vdcHits = 0, correct = 0, judged = 0;

  for (const c of CASES) {
    let chunks: Array<{ topic: string; difficulty?: string; source: string; content: string }> = [];
    try {
      const r = await ragSearch(c.query, { mode: 'thinking' });
      chunks = r.chunks as any;
    } catch (e) {
      console.error(`  ✗ ragSearch error: ${(e as Error).message}`);
    }

    const topicHit = chunks.some((ch) => ch.topic === c.topic);
    const vdcHit = chunks.some((ch) => ch.topic === c.topic && ch.difficulty === 'ADVANCED');
    if (topicHit) topicHits++;
    if (vdcHit) vdcHits++;

    const mark = vdcHit ? '✅ VDC' : topicHit ? '🟡 topic' : '❌ miss';
    console.log(`${mark}  [${c.topic}] ${c.query.slice(0, 64)}…  (${chunks.length} chunks)`);

    if (doJudge && llm) {
      try {
        const ans = await generate(llm.client, llm.genModel, buildSystemPrompt(chunks as any, 'thinking'), c.query);
        const ok = await judgeAnswer(llm.client, llm.judgeModel, c.query, c.goldAnswer, ans);
        judged++; if (ok) correct++;
        console.log(`        judge: ${ok ? 'ĐÚNG' : 'SAI'}  (gold: ${c.goldAnswer})`);
      } catch (e) {
        console.error(`        judge error: ${(e as Error).message}`);
      }
      // Throttle to respect LLM rate limits (RPM) when batch-judging.
      await new Promise((r) => setTimeout(r, 12000));
    }
  }

  const n = CASES.length;
  console.log('\n═══════════════════════════════════');
  console.log(`topicRecall : ${topicHits}/${n} = ${(100 * topicHits / n).toFixed(0)}%`);
  console.log(`vdcRecall   : ${vdcHits}/${n} = ${(100 * vdcHits / n).toFixed(0)}%`);
  if (judged > 0) console.log(`answerAcc   : ${correct}/${judged} = ${(100 * correct / judged).toFixed(0)}%`);
  console.log('═══════════════════════════════════\n');

  // CI-friendly: non-zero exit if VDC retrieval is poor (tune threshold as the bank grows)
  process.exit(vdcHits === 0 ? 1 : 0);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });
