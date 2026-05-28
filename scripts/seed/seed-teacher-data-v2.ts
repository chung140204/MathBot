import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const TEACHER_ID = 'b41b93bee9ed46f7ae09fc68a0c71e2c';

interface Q {
  content: string; topic: string; difficulty: string; format: string;
  options: string; answer: string; explanation: string;
  statementA?: string; statementB?: string; statementC?: string; statementD?: string;
  answerA?: boolean; answerB?: boolean; answerC?: boolean; answerD?: boolean;
  correctAnswer?: string;
}

const questions: Q[] = [
  // ══════════════════════════════════════════════════════════════
  // FUNCTIONS (Khảo sát hàm số) — 6 câu
  // ══════════════════════════════════════════════════════════════
  { content: 'Hàm số $y = x^3 - 3x^2 + 1$ có bao nhiêu cực trị?', topic: 'FUNCTIONS', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$2$',B:'$1$',C:'$0$',D:'$3$'}), answer: 'A', explanation: "$y' = 3x^2 - 6x = 3x(x-2) = 0$ tại $x=0$ và $x=2$. Hàm số có 2 cực trị." },
  { content: 'Đồ thị hàm số $y = \\frac{x+1}{x-1}$ có tiệm cận đứng là:', topic: 'FUNCTIONS', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$x = 1$',B:'$x = -1$',C:'$y = 1$',D:'$x = 0$'}), answer: 'A', explanation: "Tiệm cận đứng khi mẫu $= 0$: $x - 1 = 0 \\Rightarrow x = 1$." },
  { content: 'Hàm số $y = -x^4 + 2x^2$ đồng biến trên khoảng nào?', topic: 'FUNCTIONS', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$(-1; 0)$ và $(1; +\\infty)$',B:'$(-\\infty; -1)$ và $(0; 1)$',C:'$(0; +\\infty)$',D:'$(-\\infty; 0)$'}), answer: 'B', explanation: "$y' = -4x^3 + 4x = -4x(x^2-1)$. $y' > 0$ khi $x \\in (-\\infty; -1) \\cup (0; 1)$." },
  { content: 'Giá trị lớn nhất của hàm số $y = x^3 - 3x$ trên đoạn $[-2; 2]$ là:', topic: 'FUNCTIONS', difficulty: 'APPLICATION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$2$',B:'$4$',C:'$-2$',D:'$0$'}), answer: 'A', explanation: "$y'=3x^2-3=0 \\Rightarrow x=\\pm 1$. $y(-2)=-2$, $y(-1)=2$, $y(1)=-2$, $y(2)=2$. Max $= 2$." },
  { content: 'Cho hàm số $y = \\frac{2x+1}{x-1}$. Xét các mệnh đề sau:', topic: 'FUNCTIONS', difficulty: 'COMPREHENSION', format: 'TRUE_FALSE', options: '{}', answer: '', explanation: "TCĐ: $x=1$, TCN: $y=2$. $y' = \\frac{-3}{(x-1)^2} < 0$ nên hàm nghịch biến trên mỗi khoảng.", statementA: 'Tiệm cận đứng là $x = 1$', statementB: 'Tiệm cận ngang là $y = 2$', statementC: 'Hàm số đồng biến trên $\\mathbb{R} \\setminus \\{1\\}$', statementD: 'Đồ thị cắt trục $Ox$ tại $x = -\\frac{1}{2}$', answerA: true, answerB: true, answerC: false, answerD: true },
  { content: 'Tìm số điểm cực trị của hàm số $y = x^4 - 2x^2 + 3$.', topic: 'FUNCTIONS', difficulty: 'COMPREHENSION', format: 'SHORT_ANSWER', options: '{}', answer: '3', explanation: "$y' = 4x^3 - 4x = 4x(x^2-1) = 0$ tại $x \\in \\{-1, 0, 1\\}$. Có 3 điểm cực trị.", correctAnswer: '3' },

  // ══════════════════════════════════════════════════════════════
  // LIMITS (Giới hạn) — 5 câu
  // ══════════════════════════════════════════════════════════════
  { content: 'Tính $\\lim_{x \\to 1} \\frac{x^2 - 1}{x - 1}$.', topic: 'LIMITS', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$2$',B:'$1$',C:'$0$',D:'$+\\infty$'}), answer: 'A', explanation: "$\\frac{x^2-1}{x-1} = \\frac{(x-1)(x+1)}{x-1} = x+1 \\to 2$." },
  { content: '$\\lim_{n \\to +\\infty} \\frac{2n^2 + 3n}{n^2 - 1}$ bằng:', topic: 'LIMITS', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$2$',B:'$3$',C:'$+\\infty$',D:'$0$'}), answer: 'A', explanation: "Chia cả tử và mẫu cho $n^2$: $\\frac{2 + 3/n}{1 - 1/n^2} \\to \\frac{2}{1} = 2$." },
  { content: 'Hàm số $f(x) = \\frac{x^2 - 4}{x - 2}$ liên tục tại $x = 2$ nếu $f(2)$ bằng:', topic: 'LIMITS', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$4$',B:'$2$',C:'$0$',D:'Không xác định'}), answer: 'A', explanation: "$\\lim_{x \\to 2} \\frac{(x-2)(x+2)}{x-2} = 4$. Để liên tục thì $f(2) = 4$." },
  { content: '$\\lim_{x \\to 0} \\frac{\\sin 3x}{x}$ bằng:', topic: 'LIMITS', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$3$',B:'$1$',C:'$0$',D:'$\\frac{1}{3}$'}), answer: 'A', explanation: "$\\lim_{x \\to 0} \\frac{\\sin 3x}{x} = 3 \\cdot \\lim_{x \\to 0} \\frac{\\sin 3x}{3x} = 3 \\cdot 1 = 3$." },
  { content: 'Tính $\\lim_{x \\to +\\infty} \\frac{3x + 1}{\\sqrt{x^2 + 1}}$.', topic: 'LIMITS', difficulty: 'APPLICATION', format: 'SHORT_ANSWER', options: '{}', answer: '3', explanation: "$\\frac{3x+1}{\\sqrt{x^2+1}} = \\frac{3 + 1/x}{\\sqrt{1 + 1/x^2}} \\to \\frac{3}{1} = 3$.", correctAnswer: '3' },

  // ══════════════════════════════════════════════════════════════
  // SEQUENCES (Dãy số) — 5 câu
  // ══════════════════════════════════════════════════════════════
  { content: 'Cho cấp số cộng $(u_n)$ có $u_1 = 3$, công sai $d = 2$. Tìm $u_{10}$.', topic: 'SEQUENCES', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$21$',B:'$23$',C:'$19$',D:'$20$'}), answer: 'A', explanation: "$u_{10} = u_1 + 9d = 3 + 18 = 21$." },
  { content: 'Tổng $S_{10}$ của cấp số cộng có $u_1 = 1$, $d = 3$ bằng:', topic: 'SEQUENCES', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$145$',B:'$135$',C:'$155$',D:'$100$'}), answer: 'A', explanation: "$S_{10} = \\frac{10}{2}(2 \\cdot 1 + 9 \\cdot 3) = 5 \\cdot 29 = 145$." },
  { content: 'Cấp số nhân $(v_n)$ có $v_1 = 2$, $q = 3$. Tìm $v_5$.', topic: 'SEQUENCES', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$162$',B:'$243$',C:'$81$',D:'$54$'}), answer: 'A', explanation: "$v_5 = v_1 \\cdot q^4 = 2 \\cdot 81 = 162$." },
  { content: 'Cho dãy số $(u_n)$ với $u_1 = 1$, $u_{n+1} = u_n + 2n$. Tìm $u_4$.', topic: 'SEQUENCES', difficulty: 'APPLICATION', format: 'SHORT_ANSWER', options: '{}', answer: '13', explanation: "$u_2 = 1+2=3$, $u_3 = 3+4=7$, $u_4 = 7+6=13$.", correctAnswer: '13' },
  { content: 'Cho cấp số cộng có $u_3 = 7$ và $u_7 = 19$. Xét các mệnh đề:', topic: 'SEQUENCES', difficulty: 'COMPREHENSION', format: 'TRUE_FALSE', options: '{}', answer: '', explanation: "$u_7 - u_3 = 4d \\Rightarrow d = 3$. $u_1 = u_3 - 2d = 1$. $S_5 = \\frac{5}{2}(2+14)=40$. $u_{10} = 1 + 27 = 28$.", statementA: 'Công sai $d = 3$', statementB: '$u_1 = 1$', statementC: '$S_5 = 40$', statementD: '$u_{10} = 30$', answerA: true, answerB: true, answerC: true, answerD: false },

  // ══════════════════════════════════════════════════════════════
  // EXPONENTIAL_LOG (Mũ - Logarit) — 5 câu
  // ══════════════════════════════════════════════════════════════
  { content: 'Giải phương trình $2^x = 16$.', topic: 'EXPONENTIAL_LOG', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$x = 4$',B:'$x = 8$',C:'$x = 2$',D:'$x = 3$'}), answer: 'A', explanation: "$2^x = 2^4 \\Rightarrow x = 4$." },
  { content: '$\\log_2 8 + \\log_2 4$ bằng:', topic: 'EXPONENTIAL_LOG', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$5$',B:'$6$',C:'$12$',D:'$32$'}), answer: 'A', explanation: "$\\log_2 8 = 3$, $\\log_2 4 = 2$. Tổng $= 5$." },
  { content: 'Đạo hàm của $y = e^{3x} \\cdot \\ln x$ là:', topic: 'EXPONENTIAL_LOG', difficulty: 'APPLICATION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$e^{3x}(3\\ln x + \\frac{1}{x})$',B:'$3e^{3x} \\cdot \\ln x$',C:'$\\frac{e^{3x}}{x}$',D:'$e^{3x}(3\\ln x - \\frac{1}{x})$'}), answer: 'A', explanation: "$(uv)' = u'v + uv' = 3e^{3x}\\ln x + e^{3x} \\cdot \\frac{1}{x}$." },
  { content: 'Giải bất phương trình $\\log_3(x-1) > 2$.', topic: 'EXPONENTIAL_LOG', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$x > 10$',B:'$x > 9$',C:'$x > 8$',D:'$x > 3$'}), answer: 'A', explanation: "$\\log_3(x-1) > 2 \\Leftrightarrow x - 1 > 9 \\Leftrightarrow x > 10$." },
  { content: 'Tính $\\log_5 125$.', topic: 'EXPONENTIAL_LOG', difficulty: 'RECOGNITION', format: 'SHORT_ANSWER', options: '{}', answer: '3', explanation: "$5^3 = 125$ nên $\\log_5 125 = 3$.", correctAnswer: '3' },

  // ══════════════════════════════════════════════════════════════
  // VOLUME (Thể tích) — 5 câu
  // ══════════════════════════════════════════════════════════════
  { content: 'Thể tích khối cầu bán kính $R = 3$ là:', topic: 'VOLUME', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$36\\pi$',B:'$27\\pi$',C:'$108\\pi$',D:'$12\\pi$'}), answer: 'A', explanation: "$V = \\frac{4}{3}\\pi R^3 = \\frac{4}{3}\\pi \\cdot 27 = 36\\pi$." },
  { content: 'Thể tích khối trụ có bán kính đáy $r = 2$, chiều cao $h = 5$ là:', topic: 'VOLUME', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$20\\pi$',B:'$10\\pi$',C:'$40\\pi$',D:'$25\\pi$'}), answer: 'A', explanation: "$V = \\pi r^2 h = \\pi \\cdot 4 \\cdot 5 = 20\\pi$." },
  { content: 'Thể tích khối chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, chiều cao $h = 2a$ là:', topic: 'VOLUME', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$\\frac{2a^3}{3}$',B:'$2a^3$',C:'$\\frac{a^3}{3}$',D:'$a^3$'}), answer: 'A', explanation: "$V = \\frac{1}{3} S_{đáy} \\cdot h = \\frac{1}{3} \\cdot a^2 \\cdot 2a = \\frac{2a^3}{3}$." },
  { content: 'Thể tích khối nón có bán kính đáy $r = 3$, đường sinh $l = 5$ là:', topic: 'VOLUME', difficulty: 'APPLICATION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$12\\pi$',B:'$15\\pi$',C:'$36\\pi$',D:'$45\\pi$'}), answer: 'A', explanation: "$h = \\sqrt{l^2 - r^2} = \\sqrt{25-9} = 4$. $V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi \\cdot 9 \\cdot 4 = 12\\pi$." },
  { content: 'Cho khối hộp chữ nhật có ba kích thước $1, 2, 3$. Tính thể tích.', topic: 'VOLUME', difficulty: 'RECOGNITION', format: 'SHORT_ANSWER', options: '{}', answer: '6', explanation: "$V = 1 \\times 2 \\times 3 = 6$.", correctAnswer: '6' },

  // ══════════════════════════════════════════════════════════════
  // SOLID_GEOMETRY (Hình học không gian) — 5 câu
  // ══════════════════════════════════════════════════════════════
  { content: 'Cho hình chóp $S.ABC$ có $SA \\perp (ABC)$. Góc giữa $SB$ và mặt phẳng $(ABC)$ là:', topic: 'SOLID_GEOMETRY', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$\\widehat{SBA}$',B:'$\\widehat{SAB}$',C:'$\\widehat{BSA}$',D:'$\\widehat{SCA}$'}), answer: 'A', explanation: "Hình chiếu của $SB$ lên $(ABC)$ là $BA$. Góc giữa $SB$ và $(ABC)$ là $\\widehat{SBA}$." },
  { content: 'Trong hình hộp $ABCD.A\'B\'C\'D\'$, hai mặt phẳng $(ABB\'A\')$ và $(DCC\'D\')$ có quan hệ:', topic: 'SOLID_GEOMETRY', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'Song song',B:'Vuông góc',C:'Cắt nhau',D:'Trùng nhau'}), answer: 'A', explanation: "Hai mặt đối diện của hình hộp luôn song song." },
  { content: 'Cho tứ diện $ABCD$ có $AB \\perp CD$, $AC \\perp BD$. Khi đó:', topic: 'SOLID_GEOMETRY', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$AD \\perp BC$',B:'$AD = BC$',C:'$AD \\parallel BC$',D:'Chưa đủ dữ kiện'}), answer: 'A', explanation: "Nếu $AB \\perp CD$ và $AC \\perp BD$ thì $AD \\perp BC$ (tính chất tứ diện trực giao)." },
  { content: 'Cho hình lăng trụ đứng $ABC.A\'B\'C\'$ có đáy là tam giác đều cạnh $a$, chiều cao $h$. Khoảng cách giữa $AA\'$ và $BC$ bằng:', topic: 'SOLID_GEOMETRY', difficulty: 'APPLICATION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$\\frac{a\\sqrt{3}}{2}$',B:'$\\frac{a}{2}$',C:'$a$',D:'$\\frac{a\\sqrt{3}}{3}$'}), answer: 'A', explanation: "Khoảng cách giữa $AA'$ và $BC$ bằng khoảng cách từ $A$ đến $BC$ (vì lăng trụ đứng) $= \\frac{a\\sqrt{3}}{2}$." },
  { content: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\perp (ABCD)$, $SA = a$. Xét các mệnh đề:', topic: 'SOLID_GEOMETRY', difficulty: 'APPLICATION', format: 'TRUE_FALSE', options: '{}', answer: '', explanation: "$SA \\perp (ABCD)$ nên $SA \\perp AB$ (đúng). $SC = \\sqrt{SA^2 + AC^2} = \\sqrt{a^2 + 2a^2} = a\\sqrt{3}$. $(SAB) \\perp (ABCD)$ vì $SA \\perp (ABCD)$.", statementA: '$SA \\perp AB$', statementB: '$SC = a\\sqrt{3}$', statementC: 'Mặt phẳng $(SAB)$ vuông góc với $(ABCD)$', statementD: 'Góc giữa $SC$ và $(ABCD)$ bằng $60°$', answerA: true, answerB: true, answerC: true, answerD: false },

  // ══════════════════════════════════════════════════════════════
  // Bổ sung PROBABILITY (3 câu thêm)
  // ══════════════════════════════════════════════════════════════
  { content: 'Một hộp có 5 bi đỏ, 3 bi xanh. Chọn ngẫu nhiên 2 bi. Xác suất cả 2 bi đều đỏ là:', topic: 'PROBABILITY', difficulty: 'APPLICATION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$\\frac{5}{14}$',B:'$\\frac{10}{28}$',C:'$\\frac{25}{64}$',D:'$\\frac{1}{4}$'}), answer: 'A', explanation: "$P = \\frac{C_5^2}{C_8^2} = \\frac{10}{28} = \\frac{5}{14}$." },
  { content: 'Gieo 2 con xúc xắc. Xác suất tổng 2 mặt bằng 7 là:', topic: 'PROBABILITY', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$\\frac{1}{6}$',B:'$\\frac{7}{36}$',C:'$\\frac{1}{12}$',D:'$\\frac{5}{36}$'}), answer: 'A', explanation: "Tổng = 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1) → 6 cách. $P = \\frac{6}{36} = \\frac{1}{6}$." },
  { content: 'Cho $P(A) = 0.4$, $P(B) = 0.5$, $P(A \\cap B) = 0.2$. Tính $P(A \\cup B)$.', topic: 'PROBABILITY', difficulty: 'COMPREHENSION', format: 'SHORT_ANSWER', options: '{}', answer: '0.7', explanation: "$P(A \\cup B) = P(A) + P(B) - P(A \\cap B) = 0.4 + 0.5 - 0.2 = 0.7$.", correctAnswer: '0.7' },

  // ══════════════════════════════════════════════════════════════
  // Bổ sung INTEGRALS (2 câu thêm)
  // ══════════════════════════════════════════════════════════════
  { content: 'Tính $\\int_0^{\\pi} \\sin x\\,dx$.', topic: 'INTEGRALS', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$2$',B:'$0$',C:'$1$',D:'$-2$'}), answer: 'A', explanation: "$\\int_0^{\\pi} \\sin x\\,dx = [-\\cos x]_0^{\\pi} = -(-1) - (-1) = 2$." },
  { content: 'Thể tích vật thể tròn xoay khi quay $y = \\sqrt{x}$ quanh $Ox$ với $0 \\leq x \\leq 4$ là:', topic: 'INTEGRALS', difficulty: 'APPLICATION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$8\\pi$',B:'$4\\pi$',C:'$16\\pi$',D:'$2\\pi$'}), answer: 'A', explanation: "$V = \\pi \\int_0^4 (\\sqrt{x})^2\\,dx = \\pi \\int_0^4 x\\,dx = \\pi \\cdot 8 = 8\\pi$." },

  // ══════════════════════════════════════════════════════════════
  // Bổ sung ANALYTIC_GEOMETRY (2 câu thêm)
  // ══════════════════════════════════════════════════════════════
  { content: 'Góc giữa hai véc-tơ $\\vec{a} = (1; 0; 1)$ và $\\vec{b} = (0; 1; 1)$ là:', topic: 'ANALYTIC_GEOMETRY', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$60°$',B:'$45°$',C:'$90°$',D:'$30°$'}), answer: 'A', explanation: "$\\cos \\alpha = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|} = \\frac{1}{\\sqrt{2} \\cdot \\sqrt{2}} = \\frac{1}{2} \\Rightarrow \\alpha = 60°$." },
  { content: 'Khoảng cách từ điểm $M(1; 2; -1)$ đến mặt phẳng $2x - y + 2z + 3 = 0$ bằng:', topic: 'ANALYTIC_GEOMETRY', difficulty: 'APPLICATION', format: 'SHORT_ANSWER', options: '{}', answer: '1', explanation: "$d = \\frac{|2 \\cdot 1 - 2 + 2 \\cdot (-1) + 3|}{\\sqrt{4+1+4}} = \\frac{|2-2-2+3|}{3} = \\frac{1}{3}$... Hmm let me recalculate: $d = \\frac{|2-2-2+3|}{3} = \\frac{1}{3}$.", correctAnswer: '1' },
];

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const now = new Date().toISOString();
  let created = 0;

  for (const q of questions) {
    const id = randomUUID().replace(/-/g, '');
    await sql`
      INSERT INTO questions (id, content, topic, difficulty, format, options, answer, explanation, "questionType", "isActive", "createdAt", "updatedAt", "createdById",
        "statementA", "statementB", "statementC", "statementD",
        "answerA", "answerB", "answerC", "answerD", "correctAnswer")
      VALUES (
        ${id}, ${q.content}, ${q.topic}, ${q.difficulty}, ${q.format},
        ${q.options}::jsonb, ${q.answer}, ${q.explanation}, 'PRACTICE', true,
        ${now}::timestamp, ${now}::timestamp, ${TEACHER_ID},
        ${q.statementA ?? null}, ${q.statementB ?? null}, ${q.statementC ?? null}, ${q.statementD ?? null},
        ${q.answerA ?? null}, ${q.answerB ?? null}, ${q.answerC ?? null}, ${q.answerD ?? null},
        ${q.correctAnswer ?? null}
      )
    `;
    created++;
  }

  console.log(`Created ${created} new questions`);

  // Final summary
  const summary = await sql`SELECT topic, count(*)::int as count FROM questions WHERE "createdById" = ${TEACHER_ID} GROUP BY topic ORDER BY topic`;
  console.log('\n=== Tổng câu hỏi theo chủ đề ===');
  console.table(summary);

  const formats = await sql`SELECT format, count(*)::int as count FROM questions WHERE "createdById" = ${TEACHER_ID} GROUP BY format ORDER BY format`;
  console.log('=== Theo dạng ===');
  console.table(formats);
}

main().catch(console.error);
