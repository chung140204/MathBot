import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const TEACHER_ID = 'b41b93bee9ed46f7ae09fc68a0c71e2c';

interface QuestionSeed {
  content: string;
  topic: string;
  difficulty: string;
  format: string;
  options: string;
  answer: string;
  explanation: string;
  statementA?: string;
  statementB?: string;
  statementC?: string;
  statementD?: string;
  answerA?: boolean;
  answerB?: boolean;
  answerC?: boolean;
  answerD?: boolean;
  correctAnswer?: string;
}

const questions: QuestionSeed[] = [
  // ── ĐẠO HÀM (7 câu) ──
  { content: 'Tính đạo hàm của hàm số $f(x) = x^3 - 3x^2 + 2x - 1$.', topic: 'DERIVATIVES', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$3x^2 - 6x + 2$',B:'$3x^2 - 6x$',C:'$x^2 - 6x + 2$',D:'$3x^3 - 6x + 2$'}), answer: 'A', explanation: "$f'(x) = 3x^2 - 6x + 2$." },
  { content: 'Đạo hàm của hàm số $y = \\sin(2x)$ là:', topic: 'DERIVATIVES', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$2\\cos(2x)$',B:'$\\cos(2x)$',C:'$-2\\cos(2x)$',D:'$2\\sin(2x)$'}), answer: 'A', explanation: "$y' = \\cos(2x) \\cdot 2 = 2\\cos(2x)$." },
  { content: 'Hàm số $y = x^3 - 3x + 2$ đạt cực đại tại:', topic: 'DERIVATIVES', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$x = 1$',B:'$x = -1$',C:'$x = 0$',D:'$x = 2$'}), answer: 'B', explanation: "$y' = 3x^2 - 3 = 0 \\Rightarrow x = \\pm 1$. $y''(-1) = -6 < 0$ nên cực đại tại $x = -1$." },
  { content: 'Cho hàm số $f(x) = e^{2x}$. Giá trị $f\'(0)$ bằng:', topic: 'DERIVATIVES', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$2$',B:'$1$',C:'$e^2$',D:'$0$'}), answer: 'A', explanation: "$f'(x) = 2e^{2x}$, suy ra $f'(0) = 2$." },
  { content: 'Phương trình tiếp tuyến của đồ thị hàm số $y = x^2$ tại điểm $M(1; 1)$ là:', topic: 'DERIVATIVES', difficulty: 'APPLICATION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$y = 2x - 1$',B:'$y = 2x + 1$',C:'$y = x - 1$',D:'$y = x + 1$'}), answer: 'A', explanation: "$y' = 2x$, $y'(1) = 2$. PTTT: $y - 1 = 2(x - 1) \\Rightarrow y = 2x - 1$." },
  // TF + SA cho đạo hàm
  { content: 'Cho hàm số $f(x) = x^3 - 3x$. Xét các mệnh đề sau:', topic: 'DERIVATIVES', difficulty: 'COMPREHENSION', format: 'TRUE_FALSE', options: '{}', answer: '', explanation: "$f'(x) = 3x^2 - 3$. Cực đại tại $x = -1$, cực tiểu tại $x = 1$. $f(1) = -2$.", statementA: 'Hàm số đồng biến trên $(-\\infty; -1)$', statementB: "$f'(x) = 3x^2 - 3$", statementC: 'Hàm số có cực tiểu tại $x = -1$', statementD: '$f(1) = -2$', answerA: true, answerB: true, answerC: false, answerD: true },
  { content: 'Cho hàm số $f(x) = x^4 - 2x^2 + 1$. Tính $f\'(1)$.', topic: 'DERIVATIVES', difficulty: 'RECOGNITION', format: 'SHORT_ANSWER', options: '{}', answer: '0', explanation: "$f'(x) = 4x^3 - 4x$. $f'(1) = 4 - 4 = 0$.", correctAnswer: '0' },

  // ── TÍCH PHÂN (4 câu) ──
  { content: 'Tính tích phân $\\int_0^1 2x\\,dx$.', topic: 'INTEGRALS', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$1$',B:'$2$',C:'$\\frac{1}{2}$',D:'$0$'}), answer: 'A', explanation: "$\\int_0^1 2x\\,dx = x^2 \\Big|_0^1 = 1$." },
  { content: 'Nguyên hàm của hàm số $f(x) = 3x^2$ là:', topic: 'INTEGRALS', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$x^3 + C$',B:'$6x + C$',C:'$x^3$',D:'$3x^3 + C$'}), answer: 'A', explanation: "$\\int 3x^2\\,dx = x^3 + C$." },
  { content: 'Diện tích hình phẳng giới hạn bởi $y = x^2$, trục hoành, $0 \\leq x \\leq 1$ bằng:', topic: 'INTEGRALS', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$\\frac{1}{3}$',B:'$\\frac{1}{2}$',C:'$1$',D:'$\\frac{2}{3}$'}), answer: 'A', explanation: "$S = \\int_0^1 x^2\\,dx = \\frac{1}{3}$." },
  { content: 'Tính $\\int_0^2 (2x + 1)\\,dx$.', topic: 'INTEGRALS', difficulty: 'RECOGNITION', format: 'SHORT_ANSWER', options: '{}', answer: '6', explanation: "$\\int_0^2 (2x+1)\\,dx = (x^2 + x)\\Big|_0^2 = 6$.", correctAnswer: '6' },

  // ── SỐ PHỨC (3 câu) ──
  { content: 'Cho số phức $z = 3 + 4i$. Mô-đun của $z$ bằng:', topic: 'COMPLEX_NUMBERS', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$5$',B:'$7$',C:'$\\sqrt{7}$',D:'$25$'}), answer: 'A', explanation: "$|z| = \\sqrt{9 + 16} = 5$." },
  { content: 'Số phức liên hợp của $z = 2 - 3i$ là:', topic: 'COMPLEX_NUMBERS', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$2 + 3i$',B:'$-2 + 3i$',C:'$-2 - 3i$',D:'$3 - 2i$'}), answer: 'A', explanation: "$\\bar{z} = 2 + 3i$." },
  { content: 'Cho số phức $z$ thỏa mãn $(1+i)z = 3 + i$. Tính $|z|$.', topic: 'COMPLEX_NUMBERS', difficulty: 'APPLICATION', format: 'SHORT_ANSWER', options: '{}', answer: '\\sqrt{5}', explanation: "$z = \\frac{3+i}{1+i} = 2 - i$. $|z| = \\sqrt{5}$.", correctAnswer: '\\sqrt{5}' },

  // ── XÁC SUẤT (2 câu) ──
  { content: 'Gieo một con xúc xắc cân đối. Xác suất để mặt chẵn xuất hiện là:', topic: 'PROBABILITY', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$\\frac{1}{2}$',B:'$\\frac{1}{3}$',C:'$\\frac{1}{6}$',D:'$\\frac{2}{3}$'}), answer: 'A', explanation: "$P = \\frac{3}{6} = \\frac{1}{2}$." },
  { content: 'Số cách chọn 3 học sinh từ 10 học sinh là:', topic: 'PROBABILITY', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$120$',B:'$720$',C:'$210$',D:'$30$'}), answer: 'A', explanation: "$C_{10}^3 = 120$." },

  // ── HÌNH HỌC GIẢI TÍCH (3 câu) ──
  { content: 'Khoảng cách từ điểm $M(1; 2; 3)$ đến mặt phẳng $Oxy$ bằng:', topic: 'ANALYTIC_GEOMETRY', difficulty: 'RECOGNITION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$3$',B:'$2$',C:'$1$',D:'$\\sqrt{14}$'}), answer: 'A', explanation: "Khoảng cách đến $Oxy$ bằng $|z_M| = 3$." },
  { content: 'Phương trình mặt cầu tâm $I(1; 2; 3)$ bán kính $R = 4$ là:', topic: 'ANALYTIC_GEOMETRY', difficulty: 'COMPREHENSION', format: 'MULTIPLE_CHOICE', options: JSON.stringify({A:'$(x-1)^2 + (y-2)^2 + (z-3)^2 = 16$',B:'$(x-1)^2 + (y-2)^2 + (z-3)^2 = 4$',C:'$x^2 + y^2 + z^2 = 16$',D:'$(x+1)^2 + (y+2)^2 + (z+3)^2 = 16$'}), answer: 'A', explanation: "$(x - a)^2 + (y - b)^2 + (z - c)^2 = R^2$." },
  { content: 'Trong không gian $Oxyz$, cho điểm $A(1; 0; 2)$ và mặt phẳng $(P): x + y + z - 6 = 0$. Xét các mệnh đề:', topic: 'ANALYTIC_GEOMETRY', difficulty: 'APPLICATION', format: 'TRUE_FALSE', options: '{}', answer: '', explanation: "$A$ không thuộc $(P)$ vì $1+0+2-6 = -3 \\neq 0$. $d(A, (P)) = \\frac{3}{\\sqrt{3}} = \\sqrt{3}$.", statementA: '$A$ thuộc mặt phẳng $(P)$', statementB: 'Khoảng cách từ $A$ đến $(P)$ bằng $\\sqrt{3}$', statementC: 'Véc-tơ pháp tuyến của $(P)$ là $\\vec{n} = (1; 1; 1)$', statementD: '$A$ nằm cùng phía với gốc tọa độ $O$ đối với $(P)$', answerA: false, answerB: true, answerC: true, answerD: true },
];

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const now = new Date().toISOString();

  // 1. Insert questions
  const questionIds: string[] = [];
  for (const q of questions) {
    const id = randomUUID().replace(/-/g, '');
    questionIds.push(id);
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
  }
  console.log(`Created ${questionIds.length} questions`);

  // 2. Group questions by topic for exam sets
  const derivativeIds = questionIds.filter((_, i) => questions[i].topic === 'DERIVATIVES');
  const integralComplexIds = questionIds.filter((_, i) => ['INTEGRALS', 'COMPLEX_NUMBERS'].includes(questions[i].topic));
  const allIds = questionIds;

  const examSets = [
    { title: 'Kiểm tra Đạo hàm - Cơ bản', desc: 'Bài kiểm tra 15 phút về đạo hàm cơ bản', time: 900, ids: derivativeIds },
    { title: 'Ôn tập Tích phân & Số phức', desc: 'Đề ôn tập tích phân và số phức (45 phút)', time: 2700, ids: integralComplexIds },
    { title: 'Đề tổng hợp - Tất cả chủ đề', desc: 'Đề thi tổng hợp gồm trắc nghiệm, đúng/sai và trả lời ngắn (90 phút)', time: 5400, ids: allIds },
  ];

  for (const es of examSets) {
    const esId = randomUUID().replace(/-/g, '');
    await sql`
      INSERT INTO exam_sets (id, title, description, "timeLimit", "createdById", "isActive", "createdAt", "updatedAt")
      VALUES (${esId}, ${es.title}, ${es.desc}, ${es.time}, ${TEACHER_ID}, true, ${now}::timestamp, ${now}::timestamp)
    `;
    for (let i = 0; i < es.ids.length; i++) {
      const esqId = randomUUID().replace(/-/g, '');
      await sql`
        INSERT INTO exam_set_questions (id, "examSetId", "questionId", "sortOrder")
        VALUES (${esqId}, ${esId}, ${es.ids[i]}, ${i})
      `;
    }
    console.log(`Exam set: "${es.title}" — ${es.ids.length} questions`);
  }

  console.log('Done!');
}

main().catch(console.error);
