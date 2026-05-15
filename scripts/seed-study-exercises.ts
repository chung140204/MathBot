/**
 * Seed bài tập mẫu cho tất cả topic còn thiếu.
 * Usage: npx tsx scripts/seed-study-exercises.ts
 */
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

interface StudyItem {
  topic: string;
  subsection: string;
  title: string;
  content: string;
  sortOrder: number;
}

const exercises: StudyItem[] = [
  // ═══ INTEGRALS ═══
  {
    topic: 'INTEGRALS', subsection: 'Bài tập', sortOrder: 1,
    title: 'Bài 1: Tính nguyên hàm cơ bản',
    content: `**Đề bài:** Tính $\\int (3x^2 - 2x + 1)\\,dx$

**Lời giải:**

$$\\int (3x^2 - 2x + 1)\\,dx = x^3 - x^2 + x + C$$

**Đáp án:** $x^3 - x^2 + x + C$`
  },
  {
    topic: 'INTEGRALS', subsection: 'Bài tập', sortOrder: 2,
    title: 'Bài 2: Tích phân xác định',
    content: `**Đề bài:** Tính $\\int_0^1 (2x + e^x)\\,dx$

**Lời giải:**

$$\\int_0^1 (2x + e^x)\\,dx = \\left[x^2 + e^x\\right]_0^1 = (1 + e) - (0 + 1) = e$$

**Đáp án:** $e \\approx 2{,}718$`
  },
  {
    topic: 'INTEGRALS', subsection: 'Bài tập', sortOrder: 3,
    title: 'Bài 3: Diện tích hình phẳng',
    content: `**Đề bài:** Tính diện tích hình phẳng giới hạn bởi $y = x^2$ và $y = x$.

**Lời giải:**

Giao điểm: $x^2 = x \\Rightarrow x = 0, x = 1$

Trên $[0, 1]$: $x \\geq x^2$

$$S = \\int_0^1 (x - x^2)\\,dx = \\left[\\frac{x^2}{2} - \\frac{x^3}{3}\\right]_0^1 = \\frac{1}{2} - \\frac{1}{3} = \\frac{1}{6}$$

**Đáp án:** $S = \\frac{1}{6}$`
  },

  // ═══ FUNCTIONS ═══
  {
    topic: 'FUNCTIONS', subsection: 'Bài tập', sortOrder: 1,
    title: 'Bài 1: Tìm cực trị hàm bậc 3',
    content: `**Đề bài:** Tìm cực đại, cực tiểu của hàm số $y = x^3 - 3x^2 + 4$.

**Lời giải:**

$y' = 3x^2 - 6x = 3x(x - 2)$

$y' = 0 \\Leftrightarrow x = 0$ hoặc $x = 2$

- $x = 0$: $y' $ đổi dấu từ $+$ sang $-$ → **cực đại**, $y_{CĐ} = 4$
- $x = 2$: $y'$ đổi dấu từ $-$ sang $+$ → **cực tiểu**, $y_{CT} = 0$

**Đáp án:** CĐ$(0, 4)$, CT$(2, 0)$`
  },
  {
    topic: 'FUNCTIONS', subsection: 'Bài tập', sortOrder: 2,
    title: 'Bài 2: Tìm tiệm cận',
    content: `**Đề bài:** Tìm tiệm cận đứng và tiệm cận ngang của $y = \\frac{2x + 1}{x - 1}$.

**Lời giải:**

**TCĐ:** $x - 1 = 0 \\Rightarrow x = 1$

Kiểm tra: $\\lim_{x \\to 1} \\frac{2x+1}{x-1} = \\pm\\infty$ ✓ → TCĐ: $x = 1$

**TCN:** $\\lim_{x \\to \\pm\\infty} \\frac{2x+1}{x-1} = \\frac{2}{1} = 2$ → TCN: $y = 2$

**Đáp án:** TCĐ: $x = 1$, TCN: $y = 2$`
  },

  // ═══ COMPLEX_NUMBERS ═══
  {
    topic: 'COMPLEX_NUMBERS', subsection: 'Bài tập', sortOrder: 1,
    title: 'Bài 1: Phép tính số phức',
    content: `**Đề bài:** Cho $z_1 = 3 + 2i$, $z_2 = 1 - i$. Tính $z_1 \\cdot z_2$ và $\\frac{z_1}{z_2}$.

**Lời giải:**

$z_1 \\cdot z_2 = (3+2i)(1-i) = 3 - 3i + 2i - 2i^2 = 3 - i + 2 = 5 - i$

$\\frac{z_1}{z_2} = \\frac{(3+2i)(1+i)}{(1-i)(1+i)} = \\frac{3 + 3i + 2i + 2i^2}{1 + 1} = \\frac{1 + 5i}{2} = \\frac{1}{2} + \\frac{5}{2}i$

**Đáp án:** $z_1 z_2 = 5 - i$, $\\frac{z_1}{z_2} = \\frac{1}{2} + \\frac{5}{2}i$`
  },
  {
    topic: 'COMPLEX_NUMBERS', subsection: 'Bài tập', sortOrder: 2,
    title: 'Bài 2: Mô-đun và biểu diễn hình học',
    content: `**Đề bài:** Tìm tập hợp điểm $M$ biểu diễn số phức $z$ thỏa $|z - 1 + 2i| = 3$.

**Lời giải:**

$|z - (1 - 2i)| = 3$

Tập hợp điểm $M$ biểu diễn $z$ là **đường tròn** tâm $I(1, -2)$, bán kính $R = 3$.

**Đáp án:** Đường tròn tâm $(1, -2)$, bán kính $3$`
  },

  // ═══ PROBABILITY ═══
  {
    topic: 'PROBABILITY', subsection: 'Bài tập', sortOrder: 1,
    title: 'Bài 1: Tổ hợp và xác suất',
    content: `**Đề bài:** Hộp có 6 bi đỏ, 4 bi xanh. Lấy ngẫu nhiên 3 bi. Tính xác suất được đúng 2 bi đỏ.

**Lời giải:**

Tổng số cách chọn 3 bi từ 10: $C_{10}^3 = 120$

Số cách chọn 2 đỏ, 1 xanh: $C_6^2 \\cdot C_4^1 = 15 \\cdot 4 = 60$

$$P = \\frac{60}{120} = \\frac{1}{2}$$

**Đáp án:** $P = \\frac{1}{2} = 50\\%$`
  },
  {
    topic: 'PROBABILITY', subsection: 'Bài tập', sortOrder: 2,
    title: 'Bài 2: Nhị thức Newton',
    content: `**Đề bài:** Tìm hệ số của $x^4$ trong khai triển $(2x - 1)^6$.

**Lời giải:**

Số hạng tổng quát: $T_{k+1} = C_6^k \\cdot (2x)^{6-k} \\cdot (-1)^k$

Cần: bậc $x$ = $6 - k = 4$ → $k = 2$

$T_3 = C_6^2 \\cdot (2x)^4 \\cdot (-1)^2 = 15 \\cdot 16x^4 \\cdot 1 = 240x^4$

**Đáp án:** Hệ số = $240$`
  },

  // ═══ EXPONENTIAL_LOG ═══
  {
    topic: 'EXPONENTIAL_LOG', subsection: 'Bài tập', sortOrder: 1,
    title: 'Bài 1: Phương trình mũ',
    content: `**Đề bài:** Giải phương trình $4^x - 3 \\cdot 2^x + 2 = 0$.

**Lời giải:**

Đặt $t = 2^x > 0$: $t^2 - 3t + 2 = 0$

$(t - 1)(t - 2) = 0$ → $t = 1$ hoặc $t = 2$

- $2^x = 1 \\Rightarrow x = 0$
- $2^x = 2 \\Rightarrow x = 1$

**Đáp án:** $x = 0$ hoặc $x = 1$`
  },
  {
    topic: 'EXPONENTIAL_LOG', subsection: 'Bài tập', sortOrder: 2,
    title: 'Bài 2: Phương trình logarit',
    content: `**Đề bài:** Giải phương trình $\\log_2(x + 3) + \\log_2(x - 1) = 3$.

**Lời giải:**

ĐK: $x + 3 > 0$ và $x - 1 > 0$ → $x > 1$

$\\log_2[(x+3)(x-1)] = 3$

$(x+3)(x-1) = 8$

$x^2 + 2x - 3 = 8$

$x^2 + 2x - 11 = 0$ → $x = \\frac{-2 + \\sqrt{48}}{2} = -1 + 2\\sqrt{3}$ (nhận, vì $> 1$)

**Đáp án:** $x = -1 + 2\\sqrt{3}$`
  },

  // ═══ SEQUENCES ═══
  {
    topic: 'SEQUENCES', subsection: 'Bài tập', sortOrder: 1,
    title: 'Bài 1: Cấp số cộng',
    content: `**Đề bài:** CSC $(u_n)$ có $u_1 = 5$, $d = -2$. Tìm $u_{10}$ và $S_{10}$.

**Lời giải:**

$u_{10} = u_1 + 9d = 5 + 9 \\cdot (-2) = -13$

$S_{10} = \\frac{10(u_1 + u_{10})}{2} = \\frac{10(5 + (-13))}{2} = \\frac{10 \\cdot (-8)}{2} = -40$

**Đáp án:** $u_{10} = -13$, $S_{10} = -40$`
  },
  {
    topic: 'SEQUENCES', subsection: 'Bài tập', sortOrder: 2,
    title: 'Bài 2: Cấp số nhân',
    content: `**Đề bài:** CSN $(u_n)$ có $u_1 = 3$, $q = 2$. Tìm $S_5$.

**Lời giải:**

$$S_5 = \\frac{u_1(q^5 - 1)}{q - 1} = \\frac{3(32 - 1)}{1} = 93$$

**Đáp án:** $S_5 = 93$`
  },

  // ═══ LIMITS ═══
  // Đã có subsection "Bài tập" rồi, thêm bài

  // ═══ SOLID_GEOMETRY ═══
  {
    topic: 'SOLID_GEOMETRY', subsection: 'Bài tập', sortOrder: 1,
    title: 'Bài 1: Góc giữa đường và mặt phẳng',
    content: `**Đề bài:** Chóp $S.ABC$ có $SA \\perp (ABC)$, $SA = 3$, $AB = 4$. Tính góc giữa $SB$ và $(ABC)$.

**Lời giải:**

$SA \\perp (ABC)$ → hình chiếu $SB$ lên $(ABC)$ là $AB$.

Góc giữa $SB$ và $(ABC)$ = $\\widehat{SBA}$

$$\\tan\\widehat{SBA} = \\frac{SA}{AB} = \\frac{3}{4}$$

$$\\widehat{SBA} = \\arctan\\frac{3}{4} \\approx 36°52'$$

**Đáp án:** $\\alpha = \\arctan\\frac{3}{4}$`
  },
  {
    topic: 'SOLID_GEOMETRY', subsection: 'Bài tập', sortOrder: 2,
    title: 'Bài 2: Khoảng cách từ điểm đến mặt phẳng',
    content: `**Đề bài:** Chóp đều $S.ABC$ cạnh đáy $a = 6$, cạnh bên $b = 5$. Tính khoảng cách từ $S$ đến $(ABC)$.

**Lời giải:**

$ABC$ tam giác đều cạnh $6$: $S_{ABC} = \\frac{36\\sqrt{3}}{4} = 9\\sqrt{3}$

Bán kính ngoại tiếp: $R = \\frac{6}{\\sqrt{3}} = 2\\sqrt{3}$

$$h = SH = \\sqrt{b^2 - R^2} = \\sqrt{25 - 12} = \\sqrt{13}$$

**Đáp án:** $d(S, (ABC)) = \\sqrt{13}$`
  },

  // ═══ ANALYTIC_GEOMETRY ═══
  {
    topic: 'ANALYTIC_GEOMETRY', subsection: 'Bài tập', sortOrder: 1,
    title: 'Bài 1: Khoảng cách điểm - đường thẳng',
    content: `**Đề bài:** Tính khoảng cách từ $M(3, -1)$ đến đường thẳng $3x - 4y + 2 = 0$.

**Lời giải:**

$$d = \\frac{|3 \\cdot 3 - 4 \\cdot (-1) + 2|}{\\sqrt{9 + 16}} = \\frac{|9 + 4 + 2|}{5} = \\frac{15}{5} = 3$$

**Đáp án:** $d = 3$`
  },
  {
    topic: 'ANALYTIC_GEOMETRY', subsection: 'Bài tập', sortOrder: 2,
    title: 'Bài 2: Phương trình đường tròn',
    content: `**Đề bài:** Viết PT đường tròn tâm $I(2, -1)$ đi qua $A(5, 3)$.

**Lời giải:**

$R = IA = \\sqrt{(5-2)^2 + (3+1)^2} = \\sqrt{9 + 16} = 5$

PT đường tròn: $(x - 2)^2 + (y + 1)^2 = 25$

**Đáp án:** $(x-2)^2 + (y+1)^2 = 25$`
  },

  // ═══ VOLUME ═══
  {
    topic: 'VOLUME', subsection: 'Bài tập', sortOrder: 1,
    title: 'Bài 1: Thể tích hình chóp',
    content: `**Đề bài:** Chóp $S.ABCD$ có đáy là hình vuông cạnh $a$, $SA \\perp (ABCD)$, $SA = 2a$. Tính thể tích.

**Lời giải:**

$S_{ABCD} = a^2$, $h = SA = 2a$

$$V = \\frac{1}{3} S_{đáy} \\cdot h = \\frac{1}{3} \\cdot a^2 \\cdot 2a = \\frac{2a^3}{3}$$

**Đáp án:** $V = \\frac{2a^3}{3}$`
  },
  {
    topic: 'VOLUME', subsection: 'Bài tập', sortOrder: 2,
    title: 'Bài 2: Mặt cầu ngoại tiếp',
    content: `**Đề bài:** Tìm bán kính mặt cầu ngoại tiếp hình hộp chữ nhật có 3 cạnh $1, 2, 2$.

**Lời giải:**

$$R = \\frac{\\sqrt{a^2 + b^2 + c^2}}{2} = \\frac{\\sqrt{1 + 4 + 4}}{2} = \\frac{3}{2}$$

**Đáp án:** $R = \\frac{3}{2}$`
  },
];

// Also need to add "Bài tập" subsection to TOPIC_SUBSECTIONS for topics that don't have it

async function main() {
  const { PrismaClient } = await import('@prisma/client');
  const { PrismaNeon } = await import('@prisma/adapter-neon');
  const { Pool, neonConfig } = await import('@neondatabase/serverless');
  const ws = (await import('ws')).default;

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  console.log('🚀 Seeding exercises...\n');

  let count = 0;
  for (const item of exercises) {
    try {
      await prisma.$executeRawUnsafe(
        `INSERT INTO study_contents (id, topic, subsection, title, content, "sortOrder", "createdAt")
         VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW())
         ON CONFLICT (topic, subsection, title) DO UPDATE SET content = $4`,
        item.topic, item.subsection, item.title, item.content, item.sortOrder
      );
      count++;
      console.log(`  ✓ [${item.topic}] ${item.title}`);
    } catch (e: any) {
      console.error(`  ✗ [${item.topic}] ${item.title}: ${e.message}`);
    }
  }

  console.log(`\n✅ Done! ${count} exercises inserted`);
  await prisma.$disconnect();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
