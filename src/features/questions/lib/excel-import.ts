/**
 * Excel import business logic — extracted from excel/route.ts.
 * Handles row parsing, duplicate detection, and Prisma input building.
 */
import prisma from '@/shared/lib/db';
import { QuestionFormat, Topic, Difficulty, QuestionType, Prisma } from '@prisma/client';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ExcelRow {
  content?: string;
  explanation?: string;
  topic?: string;
  difficulty?: string;
  format?: string;
  question_type?: string;
  option_a?: string | number;
  option_b?: string | number;
  option_c?: string | number;
  option_d?: string | number;
  answer?: string;
  statement_a?: string;
  statement_b?: string;
  statement_c?: string;
  statement_d?: string;
  answer_a?: string | number | boolean;
  answer_b?: string | number | boolean;
  answer_c?: string | number | boolean;
  answer_d?: string | number | boolean;
  correct_answer?: string | number;
}

export interface PreviewRow {
  id: number;
  content: string;
  topic: string;
  status: 'OK' | 'ERROR' | 'DUP';
  message: string;
}

// ---------------------------------------------------------------------------
// Normalizers
// ---------------------------------------------------------------------------

export function normalizeTopic(t: string): Topic {
  const topicStr = String(t || '').toUpperCase().trim();
  const mapping: Record<string, Topic> = {
    'EXPONENTIAL_LOG': Topic.EXPONENTIAL_LOG,
    'EXPONENTIAL_LOGARITHM': Topic.EXPONENTIAL_LOG,
    'LOGARITHM': Topic.EXPONENTIAL_LOG,
    'LOGARIT': Topic.EXPONENTIAL_LOG,
    'MU_LOGARIT': Topic.EXPONENTIAL_LOG,
    'FUNCTIONS': Topic.FUNCTIONS,
    'FUNCTION_ANALYSIS': Topic.FUNCTIONS,
    'PROBABILITY': Topic.PROBABILITY,
    'COMBINATORICS_PROBABILITY': Topic.PROBABILITY,
    'LIMITS': Topic.LIMITS,
    'LIMITS_AND_CONTINUITY': Topic.LIMITS,
    'VOLUMES': Topic.VOLUME,
    'VOLUME': Topic.VOLUME,
    'DERIVATIVE': Topic.DERIVATIVES,
    'DERIVATIVES': Topic.DERIVATIVES,
    'INTEGRAL': Topic.INTEGRALS,
    'INTEGRALS': Topic.INTEGRALS,
  };
  return mapping[topicStr] || (topicStr as Topic);
}

export function normalizeQuestionType(t: string): QuestionType {
  const type = String(t || '').toUpperCase().trim();
  if (type === 'PRACTICE') return QuestionType.PRACTICE;
  if (type === 'EXAM_SET' || type === 'EXAMSET') return QuestionType.EXAM_SET;
  if (type === 'THPT_EXAM' || type === 'THPT') return QuestionType.THPT_EXAM;
  return QuestionType.PRACTICE;
}

export function parseTF(val: string | number | boolean | undefined): boolean {
  if (val === undefined || val === null) return false;
  if (typeof val === 'boolean') return val;
  const s = String(val).toLowerCase().trim();
  return s === 'đúng' || s === 'true' || s === '1' || s === 't';
}

export function formatFromSheetName(sheetName: string): QuestionFormat | null {
  const name = sheetName.toLowerCase();
  if (name.includes('tracnghiem') || name.includes('trac_nghiem') || name.includes('multiple')) return 'MULTIPLE_CHOICE';
  if (name.includes('dungsai') || name.includes('dung_sai') || name.includes('true_false')) return 'TRUE_FALSE';
  if (name.includes('traloingan') || name.includes('tra_loi_ngan') || name.includes('short_answer')) return 'SHORT_ANSWER';
  return null;
}

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

function resolveFormat(row: ExcelRow, sheetForcedFormat: QuestionFormat | null, sheetName: string): QuestionFormat {
  return (sheetForcedFormat
    || (row.format as QuestionFormat | undefined)
    || (sheetName === 'MULTIPLE_CHOICE' ? 'MULTIPLE_CHOICE'
      : sheetName === 'TRUE_FALSE' ? 'TRUE_FALSE'
      : sheetName === 'SHORT_ANSWER' ? 'SHORT_ANSWER'
      : 'MULTIPLE_CHOICE')) as QuestionFormat;
}

export function buildQuestionData(
  row: ExcelRow,
  format: QuestionFormat,
  isThptUpload: boolean,
  configType: string,
  defaultTopic: string,
  defaultDifficulty: string,
  userId: string,
): Prisma.QuestionCreateInput {
  const questionData: Prisma.QuestionCreateInput = {
    content: String(row.content).trim(),
    explanation: row.explanation ? String(row.explanation) : '',
    topic: row.topic ? normalizeTopic(row.topic) : (defaultTopic as Topic),
    difficulty: (row.difficulty ? String(row.difficulty).toUpperCase() : defaultDifficulty) as Difficulty,
    format,
    questionType: isThptUpload ? QuestionType.THPT_EXAM : normalizeQuestionType(row.question_type || configType),
    options: {},
    answer: '',
    createdBy: { connect: { id: userId } },
  };

  if (!questionData.topic) throw new Error('Thiếu chủ đề (topic)');

  if (format === 'MULTIPLE_CHOICE') {
    questionData.options = {
      A: String(row.option_a || ''), B: String(row.option_b || ''),
      C: String(row.option_c || ''), D: String(row.option_d || ''),
    };
    questionData.answer = String(row.answer || '').trim().toUpperCase();
    if (!questionData.answer) throw new Error('Thiếu đáp án (answer)');
  } else if (format === 'TRUE_FALSE') {
    questionData.options = {};
    questionData.statementA = row.statement_a ? String(row.statement_a) : '';
    questionData.statementB = row.statement_b ? String(row.statement_b) : '';
    questionData.statementC = row.statement_c ? String(row.statement_c) : '';
    questionData.statementD = row.statement_d ? String(row.statement_d) : '';
    questionData.answerA = parseTF(row.answer_a);
    questionData.answerB = parseTF(row.answer_b);
    questionData.answerC = parseTF(row.answer_c);
    questionData.answerD = parseTF(row.answer_d);
    questionData.answer = '';
  } else if (format === 'SHORT_ANSWER') {
    questionData.options = {};
    questionData.correctAnswer = row.correct_answer ? String(row.correct_answer) : '';
    questionData.answer = questionData.correctAnswer;
  }

  return questionData;
}

/**
 * Process all sheets in a workbook: validate, detect duplicates, optionally save.
 */
export async function processExcelWorkbook(
  sheets: { name: string; data: ExcelRow[] }[],
  opts: {
    dryRun: boolean;
    configType: string;
    defaultTopic: string;
    defaultDifficulty: string;
    userId: string;
  },
): Promise<{
  total: number;
  valid: number;
  errorCount: number;
  dupCount: number;
  errors: string[];
  rows: PreviewRow[];
}> {
  const { dryRun, configType, defaultTopic, defaultDifficulty, userId } = opts;
  const isThptUpload = configType === 'THPT_EXAM';

  let totalCreated = 0;
  const errors: string[] = [];
  const previewRows: PreviewRow[] = [];
  let totalInWorkbook = 0;
  const seenContents = new Set<string>();

  for (const { name: sheetName, data } of sheets) {
    totalInWorkbook += data.length;
    const sheetForcedFormat = isThptUpload ? formatFromSheetName(sheetName) : null;

    for (const [index, row] of data.entries()) {
      const rowId = totalInWorkbook - data.length + index + 1;
      try {
        if (!row.content || !String(row.content).trim()) {
          throw new Error('Thiếu nội dung câu hỏi (content)');
        }

        const normalizedContent = String(row.content).trim().toLowerCase();

        // In-file duplicate
        if (seenContents.has(normalizedContent)) {
          previewRows.push({ id: rowId, content: String(row.content), topic: row.topic || defaultTopic, status: 'DUP', message: 'Trùng với câu hỏi khác trong file' });
          continue;
        }

        // DB duplicate
        const dbCount = await prisma.question.count({
          where: { content: { contains: normalizedContent, mode: 'insensitive' } },
        });
        if (dbCount > 0) {
          seenContents.add(normalizedContent);
          previewRows.push({ id: rowId, content: String(row.content), topic: row.topic || defaultTopic, status: 'DUP', message: 'Câu hỏi đã tồn tại trong hệ thống' });
          continue;
        }

        seenContents.add(normalizedContent);

        const format = resolveFormat(row, sheetForcedFormat, sheetName);
        const questionData = buildQuestionData(row, format, isThptUpload, configType, defaultTopic, defaultDifficulty, userId);

        if (!dryRun) {
          await prisma.question.create({ data: questionData });
          totalCreated++;
        }

        previewRows.push({ id: rowId, content: questionData.content, topic: questionData.topic as string, status: 'OK', message: dryRun ? 'Hợp lệ (Sẵn sàng)' : 'Đã lưu thành công' });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`Sheet ${sheetName}, Row ${index + 2}: ${message}`);
        previewRows.push({ id: rowId, content: row.content ? String(row.content) : 'N/A', topic: row.topic || 'N/A', status: 'ERROR', message });
      }
    }
  }

  return {
    total: totalInWorkbook,
    valid: previewRows.filter((r) => r.status === 'OK').length,
    errorCount: errors.length,
    dupCount: previewRows.filter((r) => r.status === 'DUP').length,
    errors: errors.slice(0, 10),
    rows: previewRows,
  };
}
