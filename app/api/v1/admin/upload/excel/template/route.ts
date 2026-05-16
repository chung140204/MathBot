import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ExcelJS from 'exceljs';

// ─── Enum values ──────────────────────────────────────────────────────────────

const TOPICS = ['DERIVATIVES', 'INTEGRALS', 'FUNCTIONS', 'LIMITS', 'COMPLEX_NUMBERS', 'PROBABILITY', 'SEQUENCES', 'EXPONENTIAL_LOG', 'VOLUME', 'ANALYTIC_GEOMETRY', 'SOLID_GEOMETRY'];
const DIFFICULTIES = ['RECOGNITION', 'COMPREHENSION', 'APPLICATION', 'ADVANCED'];
const FORMATS = ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'];
const MC_ANSWERS = ['A', 'B', 'C', 'D'];
const TF_ANSWERS = ['TRUE', 'FALSE'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const HEADER_FILL: ExcelJS.Fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } };
const HEADER_FONT: Partial<ExcelJS.Font> = { bold: true };

function styleHeader(row: ExcelJS.Row) {
  row.eachCell((cell) => {
    cell.font = HEADER_FONT;
    cell.fill = HEADER_FILL;
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FF059669' } },
    };
  });
  row.commit();
}

function addDropdown(ws: any, col: string, formulae: string[], rows = '2:1000') {
  const list = formulae.join(',');
  ws.dataValidations.add(`${col}${rows}`, {
    type: 'list',
    allowBlank: true,
    formulae: [`"${list}"`],
    showErrorMessage: true,
    errorStyle: 'error',
    errorTitle: 'Giá trị không hợp lệ',
    error: `Vui lòng chọn từ danh sách: ${list}`,
    showInputMessage: true,
    promptTitle: col,
    prompt: `Chọn: ${list}`,
  });
}

function addTopicDifficulty(ws: ExcelJS.Worksheet, topicCol: string, diffCol: string) {
  addDropdown(ws, topicCol, TOPICS);
  addDropdown(ws, diffCol, DIFFICULTIES);
}

// ─── LaTeX guide sheet ────────────────────────────────────────────────────────

const LATEX_ROWS: (string | number)[][] = [
  ['Ký hiệu', 'LaTeX', 'Ghi chú'],
  ['Phân số', '$\\frac{a}{b}$', 'VD: $\\frac{1}{2}$'],
  ['Lũy thừa', '$x^2$ hoặc $x^{10}$', 'Nhiều ký tự dùng {}'],
  ['Chỉ số dưới', '$x_1$ hoặc $x_{12}$', 'VD: $a_{n+1}$'],
  ['Căn bậc 2', '$\\sqrt{x}$', 'VD: $\\sqrt{x^2+1}$'],
  ['Căn bậc n', '$\\sqrt[3]{x}$', 'VD: $\\sqrt[3]{8}=2$'],
  ['Tích phân', '$\\int_a^b f(x)\\,dx$', 'VD: $\\int_0^1 x^2\\,dx$'],
  ['Đạo hàm', "$f'(x)$", 'Hoặc $\\frac{d}{dx}f(x)$'],
  ['Giới hạn', '$\\lim_{x \\to 0} f(x)$', ''],
  ['Vô cực', '$+\\infty$ / $-\\infty$', ''],
  ['Tổng', '$\\sum_{i=1}^{n} a_i$', ''],
  ['Tích', '$\\prod_{i=1}^{n} a_i$', ''],
  ['Logarit', '$\\log_a b$', 'VD: $\\log_2 8 = 3$'],
  ['Logarit tự nhiên', '$\\ln x$', ''],
  ['Mũi tên', '$\\Rightarrow$, $\\Leftrightarrow$', 'Kéo theo, tương đương'],
  ['Góc', '$\\angle ABC$', ''],
  ['Vec-tơ', '$\\vec{AB}$', ''],
  ['Tuyệt đối', '$|x|$', ''],
  ['Giai thừa', '$n!$', ''],
  ['Tổ hợp', '$C_n^k$', 'Hoặc $\\binom{n}{k}$'],
  ['Hoán vị', '$P_n = n!$', ''],
  ['Số phức', '$z = a + bi$', '$i^2 = -1$'],
  ['Pi', '$\\pi \\approx 3.14159$', ''],
  ['Vô cùng', '$\\infty$', ''],
  ['Phép chia', '$\\div$', ''],
  ['Phép nhân', '$\\times$ hoặc $\\cdot$', ''],
  ['Nhỏ hơn hoặc bằng', '$\\leq$', ''],
  ['Lớn hơn hoặc bằng', '$\\geq$', ''],
  ['Xấp xỉ', '$\\approx$', ''],
  ['Khác', '$\\neq$', ''],
  ['Thuộc', '$\\in$, $\\notin$', ''],
  ['Tập hợp con', '$\\subset$, $\\subseteq$', ''],
  ['Giao/Hợp', '$\\cap$, $\\cup$', ''],
  ['Tập rỗng', '$\\emptyset$', ''],
  ['Số thực', '$\\mathbb{R}$', ''],
  ['Số nguyên', '$\\mathbb{Z}$', ''],
];

function addLatexSheet(wb: ExcelJS.Workbook) {
  const ws = wb.addWorksheet('Huong_dan_LaTeX');
  ws.columns = [{ width: 22 }, { width: 32 }, { width: 30 }];
  LATEX_ROWS.forEach((row, i) => {
    const r = ws.addRow(row);
    if (i === 0) styleHeader(r);
  });
}

// ─── GET /api/v1/admin/upload/excel/template ─────────────────────────────────

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'questions';

    const wb = new ExcelJS.Workbook();
    wb.creator = 'MathBot';
    wb.created = new Date();

    if (type === 'thpt') {
      // ── Phần I: Trắc nghiệm (12 MC) ──────────────────────────────────────
      // A=content B=topic C=difficulty D=option_a E=option_b F=option_c G=option_d H=answer I=explanation
      const ws1 = wb.addWorksheet('Phan_I_TracNghiem');
      ws1.columns = [
        { header: 'content',     key: 'content',     width: 50 },
        { header: 'topic',       key: 'topic',        width: 20 },
        { header: 'difficulty',  key: 'difficulty',   width: 16 },
        { header: 'option_a',    key: 'option_a',     width: 22 },
        { header: 'option_b',    key: 'option_b',     width: 22 },
        { header: 'option_c',    key: 'option_c',     width: 22 },
        { header: 'option_d',    key: 'option_d',     width: 22 },
        { header: 'answer',      key: 'answer',       width: 10 },
        { header: 'explanation', key: 'explanation',  width: 50 },
      ];
      styleHeader(ws1.getRow(1));
      ws1.addRow({ content: 'Cho hàm số $y = x^3 - 3x + 2$. Hàm số đồng biến trên khoảng nào?', topic: 'FUNCTIONS', difficulty: 'RECOGNITION', option_a: '$(-\\infty; -1)$', option_b: '$(-1; 1)$', option_c: '$(1; +\\infty)$', option_d: '$(0; 2)$', answer: 'A', explanation: '' });
      ws1.addRow({ content: 'Tính $\\int_0^1 2x\\,dx$.', topic: 'INTEGRALS', difficulty: 'COMPREHENSION', option_a: '$0$', option_b: '$1$', option_c: '$2$', option_d: '$\\frac{1}{2}$', answer: 'B', explanation: '$[x^2]_0^1 = 1$' });
      addTopicDifficulty(ws1, 'B', 'C');
      addDropdown(ws1, 'H', MC_ANSWERS);

      // ── Phần II: Đúng/Sai (4 TF) ─────────────────────────────────────────
      // A=content B=topic C=difficulty D-G=statement_a/b/c/d H-K=answer_a/b/c/d L=explanation
      const ws2 = wb.addWorksheet('Phan_II_DungSai');
      ws2.columns = [
        { header: 'content',     key: 'content',     width: 50 },
        { header: 'topic',       key: 'topic',        width: 20 },
        { header: 'difficulty',  key: 'difficulty',   width: 16 },
        { header: 'statement_a', key: 'statement_a',  width: 32 },
        { header: 'statement_b', key: 'statement_b',  width: 32 },
        { header: 'statement_c', key: 'statement_c',  width: 32 },
        { header: 'statement_d', key: 'statement_d',  width: 32 },
        { header: 'answer_a',    key: 'answer_a',     width: 12 },
        { header: 'answer_b',    key: 'answer_b',     width: 12 },
        { header: 'answer_c',    key: 'answer_c',     width: 12 },
        { header: 'answer_d',    key: 'answer_d',     width: 12 },
        { header: 'explanation', key: 'explanation',  width: 50 },
      ];
      styleHeader(ws2.getRow(1));
      ws2.addRow({ content: 'Cho $f(x) = x^2 - 2x + 1$. Xét tính đúng/sai:', topic: 'FUNCTIONS', difficulty: 'COMPREHENSION', statement_a: '$f(0) = 1$', statement_b: '$f(1) = 0$', statement_c: 'Hàm đạt cực tiểu tại $x=1$', statement_d: "$f'(0)=-2$", answer_a: 'TRUE', answer_b: 'TRUE', answer_c: 'TRUE', answer_d: 'TRUE', explanation: '' });
      addTopicDifficulty(ws2, 'B', 'C');
      addDropdown(ws2, 'H', TF_ANSWERS);
      addDropdown(ws2, 'I', TF_ANSWERS);
      addDropdown(ws2, 'J', TF_ANSWERS);
      addDropdown(ws2, 'K', TF_ANSWERS);

      // ── Phần III: Trả lời ngắn (6 SA) ────────────────────────────────────
      // A=content B=topic C=difficulty D=correct_answer E=explanation
      const ws3 = wb.addWorksheet('Phan_III_TraLoiNgan');
      ws3.columns = [
        { header: 'content',        key: 'content',        width: 50 },
        { header: 'topic',          key: 'topic',           width: 20 },
        { header: 'difficulty',     key: 'difficulty',      width: 16 },
        { header: 'correct_answer', key: 'correct_answer',  width: 20 },
        { header: 'explanation',    key: 'explanation',     width: 50 },
      ];
      styleHeader(ws3.getRow(1));
      ws3.addRow({ content: 'Tính $\\lim_{x \\to 2} \\frac{x^2-4}{x-2}$.', topic: 'LIMITS', difficulty: 'COMPREHENSION', correct_answer: '4', explanation: '$\\lim_{x\\to2}(x+2)=4$' });
      ws3.addRow({ content: 'Cho $\\log_2 3 = a$. Tính $\\log_2 12$ theo $a$.', topic: 'EXPONENTIAL_LOG', difficulty: 'APPLICATION', correct_answer: '2+a', explanation: '$\\log_2 12=\\log_2 4+\\log_2 3=2+a$' });
      addTopicDifficulty(ws3, 'B', 'C');

      addLatexSheet(wb);

      const buf = await wb.xlsx.writeBuffer();
      return new NextResponse(buf, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="template_thpt.xlsx"',
        },
      });
    }

    // ── type === 'questions' (PRACTICE / EXAM_SET) ───────────────────────────
    // A=content B=format C=topic D=difficulty E=explanation
    // F=option_a G=option_b H=option_c I=option_d J=answer (MC)
    // K=statement_a L=statement_b M=statement_c N=statement_d (TF)
    // O=answer_a P=answer_b Q=answer_c R=answer_d (TF)
    // S=correct_answer (SA)
    const ws = wb.addWorksheet('CauHoi');
    ws.columns = [
      { header: 'content',        key: 'content',        width: 52 },
      { header: 'format',         key: 'format',          width: 18 },
      { header: 'topic',          key: 'topic',            width: 20 },
      { header: 'difficulty',     key: 'difficulty',       width: 16 },
      { header: 'explanation',    key: 'explanation',      width: 50 },
      { header: 'option_a',       key: 'option_a',         width: 22 },
      { header: 'option_b',       key: 'option_b',         width: 22 },
      { header: 'option_c',       key: 'option_c',         width: 22 },
      { header: 'option_d',       key: 'option_d',         width: 22 },
      { header: 'answer',         key: 'answer',           width: 10 },
      { header: 'statement_a',    key: 'statement_a',      width: 35 },
      { header: 'statement_b',    key: 'statement_b',      width: 35 },
      { header: 'statement_c',    key: 'statement_c',      width: 35 },
      { header: 'statement_d',    key: 'statement_d',      width: 35 },
      { header: 'answer_a',       key: 'answer_a',         width: 12 },
      { header: 'answer_b',       key: 'answer_b',         width: 12 },
      { header: 'answer_c',       key: 'answer_c',         width: 12 },
      { header: 'answer_d',       key: 'answer_d',         width: 12 },
      { header: 'correct_answer', key: 'correct_answer',   width: 20 },
    ];
    styleHeader(ws.getRow(1));

    // MC example
    ws.addRow({ content: 'Đạo hàm của hàm số $y = x^3 - 3x$ bằng?', format: 'MULTIPLE_CHOICE', topic: 'DERIVATIVES', difficulty: 'RECOGNITION', explanation: "$y' = 3x^2 - 3$", option_a: '$3x^2 - 3$', option_b: '$3x^2 + 3$', option_c: '$x^2 - 3$', option_d: '$3x^3 - 3$', answer: 'A' });
    // TF example
    ws.addRow({ content: 'Cho $f(x) = \\ln x$ $(x > 0)$. Xét các mệnh đề:', format: 'TRUE_FALSE', topic: 'EXPONENTIAL_LOG', difficulty: 'COMPREHENSION', statement_a: '$f(1) = 0$', statement_b: "$f'(x) = \\frac{1}{x}$", statement_c: '$f$ nghịch biến trên $(0;+\\infty)$', statement_d: '$f(e) = 1$', answer_a: 'TRUE', answer_b: 'TRUE', answer_c: 'FALSE', answer_d: 'TRUE' });
    // SA example
    ws.addRow({ content: 'Tính $C_{10}^3$.', format: 'SHORT_ANSWER', topic: 'PROBABILITY', difficulty: 'RECOGNITION', explanation: '$C_{10}^3 = 120$', correct_answer: '120' });

    addDropdown(ws, 'B', FORMATS);
    addTopicDifficulty(ws, 'C', 'D');
    addDropdown(ws, 'J', MC_ANSWERS);
    addDropdown(ws, 'O', TF_ANSWERS);
    addDropdown(ws, 'P', TF_ANSWERS);
    addDropdown(ws, 'Q', TF_ANSWERS);
    addDropdown(ws, 'R', TF_ANSWERS);

    addLatexSheet(wb);

    const buf = await wb.xlsx.writeBuffer();
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="template_questions.xlsx"',
      },
    });
  } catch (error) {
    console.error('[TEMPLATE_API]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
