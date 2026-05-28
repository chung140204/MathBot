import { neon } from '@neondatabase/serverless';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const TEACHER_ID = 'b41b93bee9ed46f7ae09fc68a0c71e2c';

interface ExamSetDef {
  title: string;
  description: string;
  timeLimit: number; // seconds
  filter: { topics?: string[]; difficulties?: string[]; formats?: string[]; limit?: number };
}

const examSets: ExamSetDef[] = [
  // ── Theo chủ đề đơn ─────────────────────────────────────────
  {
    title: 'Khảo sát hàm số - Cơ bản',
    description: 'Kiểm tra 20 phút: cực trị, tiệm cận, đồng biến nghịch biến',
    timeLimit: 1200,
    filter: { topics: ['FUNCTIONS'] },
  },
  {
    title: 'Giới hạn & Liên tục',
    description: 'Kiểm tra 15 phút về giới hạn dãy số, giới hạn hàm số, tính liên tục',
    timeLimit: 900,
    filter: { topics: ['LIMITS'] },
  },
  {
    title: 'Cấp số cộng - Cấp số nhân',
    description: 'Bài kiểm tra 20 phút: công thức số hạng tổng quát, tổng n số hạng',
    timeLimit: 1200,
    filter: { topics: ['SEQUENCES'] },
  },
  {
    title: 'Hàm số mũ & Logarit',
    description: 'Kiểm tra 20 phút: phương trình mũ, logarit, đạo hàm',
    timeLimit: 1200,
    filter: { topics: ['EXPONENTIAL_LOG'] },
  },
  {
    title: 'Thể tích khối tròn xoay',
    description: 'Kiểm tra 20 phút: khối cầu, khối trụ, khối nón, khối chóp',
    timeLimit: 1200,
    filter: { topics: ['VOLUME'] },
  },
  {
    title: 'Hình học không gian',
    description: 'Kiểm tra 25 phút: góc, khoảng cách, quan hệ vuông góc song song',
    timeLimit: 1500,
    filter: { topics: ['SOLID_GEOMETRY'] },
  },

  // ── Tổ hợp nhiều chủ đề ─────────────────────────────────────
  {
    title: 'Đề ôn: Giải tích (Hàm số + Giới hạn + Mũ-Log)',
    description: 'Đề ôn tập 45 phút tổng hợp phần Giải tích',
    timeLimit: 2700,
    filter: { topics: ['FUNCTIONS', 'LIMITS', 'EXPONENTIAL_LOG'] },
  },
  {
    title: 'Đề ôn: Hình học (Không gian + Thể tích + Giải tích)',
    description: 'Đề ôn tập 45 phút tổng hợp phần Hình học',
    timeLimit: 2700,
    filter: { topics: ['SOLID_GEOMETRY', 'VOLUME', 'ANALYTIC_GEOMETRY'] },
  },
  {
    title: 'Đề ôn: Đại số (Dãy số + Xác suất + Số phức)',
    description: 'Đề ôn tập 30 phút tổng hợp phần Đại số',
    timeLimit: 1800,
    filter: { topics: ['SEQUENCES', 'PROBABILITY', 'COMPLEX_NUMBERS'] },
  },

  // ── Theo mức độ ──────────────────────────────────────────────
  {
    title: 'Bài tập Nhận biết - Dễ',
    description: 'Tổng hợp câu nhận biết tất cả chủ đề (15 phút)',
    timeLimit: 900,
    filter: { difficulties: ['RECOGNITION'] },
  },
  {
    title: 'Bài tập Thông hiểu',
    description: 'Tổng hợp câu thông hiểu tất cả chủ đề (25 phút)',
    timeLimit: 1500,
    filter: { difficulties: ['COMPREHENSION'] },
  },
  {
    title: 'Bài tập Vận dụng - Nâng cao',
    description: 'Tổng hợp câu vận dụng tất cả chủ đề (30 phút)',
    timeLimit: 1800,
    filter: { difficulties: ['APPLICATION', 'ADVANCED'] },
  },

  // ── Theo dạng câu hỏi ───────────────────────────────────────
  {
    title: 'Luyện Đúng/Sai + Trả lời ngắn',
    description: 'Chỉ gồm câu TRUE_FALSE và SHORT_ANSWER (20 phút)',
    timeLimit: 1200,
    filter: { formats: ['TRUE_FALSE', 'SHORT_ANSWER'] },
  },

  // ── Đề thi thử ──────────────────────────────────────────────
  {
    title: 'Đề thi thử THPT - Toàn bộ',
    description: 'Đề thi thử tổng hợp tất cả chủ đề, tất cả dạng (90 phút)',
    timeLimit: 5400,
    filter: {}, // all questions
  },
];

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const now = new Date().toISOString();

  // Fetch all teacher questions
  const allQuestions = await sql`
    SELECT id, topic, difficulty, format
    FROM questions
    WHERE "createdById" = ${TEACHER_ID} AND "isActive" = true
    ORDER BY topic, difficulty, format
  `;

  console.log(`Found ${allQuestions.length} teacher questions`);

  if (allQuestions.length === 0) {
    console.error('No questions found for teacher. Run seed-teacher-data-v2.ts first.');
    process.exit(1);
  }

  // Check existing exam sets to avoid duplicates
  const existing = await sql`
    SELECT title FROM exam_sets WHERE "createdById" = ${TEACHER_ID} AND "isActive" = true
  `;
  const existingTitles = new Set(existing.map((r: Record<string, string>) => r.title));

  let created = 0;

  for (const es of examSets) {
    if (existingTitles.has(es.title)) {
      console.log(`[SKIP] "${es.title}" — already exists`);
      continue;
    }

    // Filter questions
    let filtered = allQuestions as Array<Record<string, string>>;
    if (es.filter.topics?.length) {
      filtered = filtered.filter(q => es.filter.topics!.includes(q.topic));
    }
    if (es.filter.difficulties?.length) {
      filtered = filtered.filter(q => es.filter.difficulties!.includes(q.difficulty));
    }
    if (es.filter.formats?.length) {
      filtered = filtered.filter(q => es.filter.formats!.includes(q.format));
    }
    if (es.filter.limit) {
      filtered = filtered.slice(0, es.filter.limit);
    }

    if (filtered.length === 0) {
      console.log(`[SKIP] "${es.title}" — no matching questions`);
      continue;
    }

    // Create exam set
    const esId = randomUUID().replace(/-/g, '');
    await sql`
      INSERT INTO exam_sets (id, title, description, "timeLimit", "createdById", "isActive", "createdAt", "updatedAt")
      VALUES (${esId}, ${es.title}, ${es.description}, ${es.timeLimit}, ${TEACHER_ID}, true, ${now}::timestamp, ${now}::timestamp)
    `;

    // Create exam set questions
    for (let i = 0; i < filtered.length; i++) {
      const esqId = randomUUID().replace(/-/g, '');
      await sql`
        INSERT INTO exam_set_questions (id, "examSetId", "questionId", "sortOrder")
        VALUES (${esqId}, ${esId}, ${filtered[i].id}, ${i})
      `;
    }

    console.log(`[OK] "${es.title}" — ${filtered.length} câu`);
    created++;
  }

  console.log(`\nDone! Created ${created} new exam sets.`);

  // Summary
  const summary = await sql`
    SELECT es.title, count(esq.id)::int as questions
    FROM exam_sets es
    LEFT JOIN exam_set_questions esq ON esq."examSetId" = es.id
    WHERE es."createdById" = ${TEACHER_ID} AND es."isActive" = true
    GROUP BY es.id, es.title
    ORDER BY es."createdAt"
  `;
  console.log('\n=== Tất cả bộ đề ===');
  console.table(summary);
}

main().catch(console.error);
