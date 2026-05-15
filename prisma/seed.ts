import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { allQuestions } from './seed-data';

// Use WebSocket connection — required for Neon on local/Windows
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter } as any);

// Knowledge chunks for RAG (content will be embedded at seed time)
const knowledgeChunks = [
  {
    content: `Đạo hàm của hàm số:
- $(x^n)' = nx^{n-1}$
- $(e^x)' = e^x$
- $(\\ln x)' = \\frac{1}{x}$
- $(\\sin x)' = \\cos x$
- $(\\cos x)' = -\\sin x$
- $(\\tan x)' = \\frac{1}{\\cos^2 x}$

Quy tắc đạo hàm:
- $(u + v)' = u' + v'$
- $(uv)' = u'v + uv'$
- $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$
- $(f(g(x)))' = f'(g(x)) \\cdot g'(x)$ (đạo hàm hợp)`,
    topic: 'DERIVATIVES',
    source: 'SGK Toán 12 - Chương 1: Đạo hàm',
  },
  {
    content: `Ứng dụng đạo hàm:
- Hàm số đồng biến trên khoảng $(a,b)$ khi $f'(x) > 0$ với mọi $x \\in (a,b)$
- Hàm số nghịch biến trên khoảng $(a,b)$ khi $f'(x) < 0$ với mọi $x \\in (a,b)$
- Cực đại: $f'(x)$ đổi dấu từ $+$ sang $-$
- Cực tiểu: $f'(x)$ đổi dấu từ $-$ sang $+$
- Giá trị lớn nhất, nhỏ nhất trên $[a,b]$: so sánh $f(a)$, $f(b)$ và các giá trị cực trị trong $(a,b)$`,
    topic: 'DERIVATIVES',
    source: 'SGK Toán 12 - Ứng dụng đạo hàm',
  },
  {
    content: `Nguyên hàm và tích phân:
- $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$ (với $n \\neq -1$)
- $\\int \\frac{1}{x} dx = \\ln|x| + C$
- $\\int e^x dx = e^x + C$
- $\\int \\sin x \\, dx = -\\cos x + C$
- $\\int \\cos x \\, dx = \\sin x + C$

Công thức Newton-Leibniz:
$$\\int_a^b f(x) dx = F(b) - F(a)$$

Ứng dụng: Diện tích hình phẳng giới hạn bởi $y = f(x)$, trục $Ox$, $x=a$, $x=b$:
$$S = \\int_a^b |f(x)| dx$$`,
    topic: 'INTEGRALS',
    source: 'SGK Toán 12 - Chương 3: Tích phân',
  },
  {
    content: `Phương pháp tính tích phân:
1. Đổi biến: Đặt $t = g(x)$, $dt = g'(x)dx$
   $$\\int f(g(x)) \\cdot g'(x) dx = \\int f(t) dt$$

2. Tích phân từng phần:
   $$\\int u \\, dv = uv - \\int v \\, du$$
   Quy tắc chọn $u$: Logarit → Đa thức → Lượng giác → Mũ

3. Thể tích vật thể tròn xoay quanh Ox:
   $$V = \\pi \\int_a^b [f(x)]^2 dx$$`,
    topic: 'INTEGRALS',
    source: 'SGK Toán 12 - Phương pháp tích phân',
  },
  {
    content: `Giới hạn của dãy số và hàm số:
- $\\lim_{n \\to \\infty} \\frac{1}{n^k} = 0$ (với $k > 0$)
- $\\lim_{x \\to a} f(x) = L$: khi $x$ tiến tới $a$ thì $f(x)$ tiến tới $L$
- $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$

Quy tắc tính giới hạn dạng $\\frac{0}{0}$:
- Phân tích nhân tử rồi rút gọn
- Nhân liên hợp (khi có căn thức)
- Dùng giới hạn lượng giác cơ bản

Giới hạn dạng $\\frac{\\infty}{\\infty}$ của phân thức: chia cả tử và mẫu cho lũy thừa cao nhất`,
    topic: 'LIMITS',
    source: 'SGK Toán 12 - Chương Giới hạn',
  },
  {
    content: `Số phức $z = a + bi$ (với $a, b \\in \\mathbb{R}$, $i^2 = -1$):
- Phần thực: $a$, phần ảo: $b$
- Mô-đun: $|z| = \\sqrt{a^2 + b^2}$
- Số phức liên hợp: $\\bar{z} = a - bi$
- $z \\cdot \\bar{z} = |z|^2 = a^2 + b^2$

Phép tính:
- $(a+bi) + (c+di) = (a+c) + (b+d)i$
- $(a+bi)(c+di) = (ac-bd) + (ad+bc)i$
- $\\frac{a+bi}{c+di} = \\frac{(a+bi)(c-di)}{c^2+d^2}$

Biểu diễn hình học: số phức $z = a + bi$ tương ứng điểm $M(a, b)$ trên mặt phẳng`,
    topic: 'COMPLEX_NUMBERS',
    source: 'SGK Toán 12 - Số phức',
  },
  {
    content: `Xác suất:
- Xác suất cổ điển: $P(A) = \\frac{n(A)}{n(\\Omega)}$
- Quy tắc cộng: $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$
- Hai biến cố xung khắc: $P(A \\cup B) = P(A) + P(B)$
- Xác suất của biến cố đối: $P(\\bar{A}) = 1 - P(A)$

Tổ hợp - Chỉnh hợp:
- $C_n^k = \\frac{n!}{k!(n-k)!}$
- $A_n^k = \\frac{n!}{(n-k)!}$
- Nhị thức Newton: $(a+b)^n = \\sum_{k=0}^n C_n^k a^{n-k} b^k$`,
    topic: 'PROBABILITY',
    source: 'SGK Toán 12 - Xác suất và Tổ hợp',
  },
  {
    content: `Cấp số cộng (CSC):
- Công sai: $d = u_{n+1} - u_n$
- Số hạng tổng quát: $u_n = u_1 + (n-1)d$
- Tổng $n$ số hạng đầu: $S_n = \\frac{n(u_1 + u_n)}{2} = \\frac{n[2u_1 + (n-1)d]}{2}$

Cấp số nhân (CSN):
- Công bội: $q = \\frac{u_{n+1}}{u_n}$
- Số hạng tổng quát: $u_n = u_1 \\cdot q^{n-1}$
- Tổng $n$ số hạng đầu: $S_n = \\frac{u_1(1-q^n)}{1-q}$ (với $q \\neq 1$)`,
    topic: 'SEQUENCES',
    source: 'SGK Toán 12 - Dãy số',
  },
  {
    content: `Hàm số mũ và logarit:
- $a^x \\cdot a^y = a^{x+y}$
- $(a^x)^y = a^{xy}$
- $\\log_a(xy) = \\log_a x + \\log_a y$
- $\\log_a\\frac{x}{y} = \\log_a x - \\log_a y$
- $\\log_a x^n = n \\log_a x$
- Đổi cơ số: $\\log_a x = \\frac{\\log_b x}{\\log_b a}$

Phương trình mũ: đưa về cùng cơ số hoặc đặt $t = a^x$
Phương trình logarit: điều kiện $x > 0$, dùng tính chất logarit`,
    topic: 'EXPONENTIAL_LOG',
    source: 'SGK Toán 12 - Hàm số mũ và logarit',
  },
  {
    content: `Thể tích khối đa diện:
- Hình hộp chữ nhật: $V = abc$
- Hình lập phương: $V = a^3$
- Hình chóp: $V = \\frac{1}{3} S_{đáy} \\cdot h$
- Hình lăng trụ: $V = S_{đáy} \\cdot h$

Thể tích khối tròn xoay:
- Hình trụ: $V = \\pi r^2 h$
- Hình nón: $V = \\frac{1}{3} \\pi r^2 h$
- Hình cầu: $V = \\frac{4}{3} \\pi R^3$
- Diện tích mặt cầu: $S = 4\\pi R^2$`,
    topic: 'VOLUME',
    source: 'SGK Toán 12 - Thể tích',
  },
  {
    content: `Hình học giải tích trong mặt phẳng Oxy:
- Khoảng cách hai điểm: $AB = \\sqrt{(x_B-x_A)^2 + (y_B-y_A)^2}$
- Phương trình đường thẳng: $ax + by + c = 0$
- Khoảng cách từ điểm đến đ��ờng thẳng: $d(M, \\Delta) = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2+b^2}}$
- Phương trình đường tròn: $(x-a)^2 + (y-b)^2 = R^2$
- Phương trình elip: $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$

Vị trí tương đối:
- Đường thẳng và đường tròn: so sánh $d$ với $R$
- Hai đường tròn: so sánh khoảng cách tâm với tổng/hiệu bán kính`,
    topic: 'ANALYTIC_GEOMETRY',
    source: 'SGK Toán 12 - Hình học giải tích Oxy',
  },
  {
    content: `Hình học không gian:
- Hai đường thẳng song song: cùng phương, không trùng nhau
- Đường thẳng song song mặt phẳng: không có điểm chung
- Hai mặt phẳng song song: không có điểm chung

Góc và khoảng cách:
- Góc giữa đường thẳng và mặt phẳng: góc giữa đường thẳng và hình chiếu của nó trên mặt phẳng
- Góc giữa hai mặt phẳng: góc giữa hai đường thẳng vuông góc với giao tuyến
- Khoảng cách từ điểm đến mặt phẳng: dùng thể tích ($V = \\frac{1}{3}Sh$)

Vuông góc:
- Đường th��ng vuông góc mặt phẳng: vuông góc với mọi đường thẳng trong mặt phẳng
- Định lý ba đường vuông góc`,
    topic: 'SOLID_GEOMETRY',
    source: 'SGK Toán 12 - Hình học không gian',
  },
];

async function seedKnowledgeChunks() {
  console.log('Seeding knowledge chunks...');

  // Clear existing chunks
  await prisma.$executeRawUnsafe('DELETE FROM knowledge_chunks');

  const OpenAI = (await import('openai')).default;
  const embeddingClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.NVIDIA_BASE_URL || undefined,
  });
  const embedModel = process.env.EMBED_MODEL || 'nvidia/nv-embedqa-e5-v5';

  for (const chunk of knowledgeChunks) {
    try {
      // Generate embedding (NVIDIA asymmetric models require input_type: 'passage')
      const embResponse = await embeddingClient.embeddings.create({
        model: embedModel,
        input: chunk.content.slice(0, 2000),
        encoding_format: 'float',
        input_type: 'passage',
        truncate: 'END',
      } as any);
      const embedding = embResponse.data[0].embedding;
      const vectorStr = `[${embedding.join(',')}]`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO knowledge_chunks (id, content, topic, source, embedding, "createdAt")
         VALUES (gen_random_uuid(), $1, $2, $3, $4::vector, NOW())`,
        chunk.content,
        chunk.topic,
        chunk.source,
        vectorStr
      );
      console.log(`  ✓ Inserted chunk: ${chunk.source}`);
    } catch (error) {
      console.error(`  ✗ Failed to insert chunk "${chunk.source}":`, error);
    }
  }

  console.log('Knowledge chunks seeding finished.');
}

async function main() {
  console.log('Start seeding...');

  // Clear dependent records first (foreign key constraints)
  await prisma.examAnswer.deleteMany();
  await prisma.question.deleteMany();
  console.log('Deleted existing questions');

  console.log(`Inserting ${allQuestions.length} questions...`);
  for (let i = 0; i < allQuestions.length; i++) {
    await prisma.question.create({ data: allQuestions[i] as any });
    if ((i + 1) % 50 === 0) console.log(`  ${i + 1}/${allQuestions.length} questions inserted`);
  }
  console.log(`All ${allQuestions.length} questions inserted.`);

  // Seed knowledge chunks with embeddings (requires OPENAI_API_KEY)
  if (process.env.OPENAI_API_KEY) {
    await seedKnowledgeChunks();
  } else {
    console.log('Skipping knowledge chunks — OPENAI_API_KEY not set.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
