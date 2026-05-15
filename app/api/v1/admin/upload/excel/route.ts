import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import * as XLSX from 'xlsx';
import { QuestionFormat, Topic, Difficulty, QuestionType, Prisma } from '@prisma/client';

interface ExcelRow {
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

interface PreviewRow {
  id: number;
  content: string;
  topic: string;
  status: 'OK' | 'ERROR' | 'DUP';
  message: string;
}

// Normalize Topic Enum
const normalizeTopic = (t: string): Topic => {
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
};

const normalizeQuestionType = (t: string): QuestionType => {
  const type = String(t || '').toUpperCase().trim();
  if (type === 'PRACTICE') return QuestionType.PRACTICE;
  if (type === 'EXAM_SET' || type === 'EXAMSET') return QuestionType.EXAM_SET;
  if (type === 'THPT_EXAM' || type === 'THPT') return QuestionType.THPT_EXAM;
  return QuestionType.PRACTICE;
};

const parseTF = (val: string | number | boolean | undefined): boolean => {
  if (val === undefined || val === null) return false;
  if (typeof val === 'boolean') return val;
  const s = String(val).toLowerCase().trim();
  return s === 'đúng' || s === 'true' || s === '1' || s === 't';
};

// Determine QuestionFormat from sheet name for THPT multi-sheet
const formatFromSheetName = (sheetName: string): QuestionFormat | null => {
  const name = sheetName.toLowerCase();
  if (name.includes('tracnghiem') || name.includes('trac_nghiem') || name.includes('multiple')) return 'MULTIPLE_CHOICE';
  if (name.includes('dungsai') || name.includes('dung_sai') || name.includes('true_false')) return 'TRUE_FALSE';
  if (name.includes('traloingan') || name.includes('tra_loi_ngan') || name.includes('short_answer')) return 'SHORT_ANSWER';
  return null;
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });

    const dryRun = formData.get('dryRun') === 'true';
    const configType = (formData.get('type') as string) || 'PRACTICE';
    const defaultTopic = (formData.get('topic') as string) || 'DERIVATIVES';
    const defaultDifficulty = (formData.get('difficulty') as string) || 'RECOGNITION';

    const isThptUpload = configType === 'THPT_EXAM';

    let totalCreated = 0;
    const errors: string[] = [];
    const previewRows: PreviewRow[] = [];
    let totalInWorkbook = 0;

    // Track seen content within this file for in-file duplicate detection
    const seenContents = new Set<string>();

    for (const sheetName of workbook.SheetNames) {
      // Skip the LaTeX guide sheet
      if (sheetName === 'Huong_dan_LaTeX') continue;

      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet) as ExcelRow[];
      totalInWorkbook += data.length;

      // For THPT uploads, derive format from sheet name; otherwise read from row
      const sheetForcedFormat = isThptUpload ? formatFromSheetName(sheetName) : null;

      for (const [index, row] of data.entries()) {
        try {
          if (!row.content || !String(row.content).trim()) {
            throw new Error('Thiếu nội dung câu hỏi (content)');
          }

          // ── Duplicate detection ──────────────────────────────────────────
          const normalizedContent = String(row.content).trim().toLowerCase();

          if (seenContents.has(normalizedContent)) {
            previewRows.push({
              id: totalInWorkbook - data.length + index + 1,
              content: String(row.content),
              topic: row.topic || defaultTopic,
              status: 'DUP',
              message: 'Trùng với câu hỏi khác trong file',
            });
            continue;
          }

          // Check DB duplicate (only if not already seen in file)
          const dbCount = await prisma.question.count({
            where: { content: { contains: normalizedContent, mode: 'insensitive' } },
          });

          if (dbCount > 0) {
            seenContents.add(normalizedContent);
            previewRows.push({
              id: totalInWorkbook - data.length + index + 1,
              content: String(row.content),
              topic: row.topic || defaultTopic,
              status: 'DUP',
              message: 'Câu hỏi đã tồn tại trong hệ thống',
            });
            continue;
          }

          seenContents.add(normalizedContent);
          // ────────────────────────────────────────────────────────────────

          const formatStr = sheetForcedFormat
            || (row.format as QuestionFormat | undefined)
            || (sheetName === 'MULTIPLE_CHOICE' ? 'MULTIPLE_CHOICE'
              : sheetName === 'TRUE_FALSE' ? 'TRUE_FALSE'
              : sheetName === 'SHORT_ANSWER' ? 'SHORT_ANSWER'
              : 'MULTIPLE_CHOICE');

          const format = formatStr as QuestionFormat;

          const questionData: Prisma.QuestionCreateInput = {
            content: String(row.content).trim(),
            explanation: row.explanation ? String(row.explanation) : '',
            topic: row.topic ? normalizeTopic(row.topic) : (defaultTopic as Topic),
            difficulty: (row.difficulty ? String(row.difficulty).toUpperCase() : defaultDifficulty) as Difficulty,
            format,
            questionType: isThptUpload ? QuestionType.THPT_EXAM : normalizeQuestionType(row.question_type || configType),
            options: {},
            answer: '',
          };

          if (!questionData.topic) {
            throw new Error('Thiếu chủ đề (topic)');
          }

          if (format === 'MULTIPLE_CHOICE') {
            questionData.options = {
              A: String(row.option_a || ''),
              B: String(row.option_b || ''),
              C: String(row.option_c || ''),
              D: String(row.option_d || ''),
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

          if (!dryRun) {
            await prisma.question.create({ data: questionData });
            totalCreated++;
          }

          previewRows.push({
            id: totalInWorkbook - data.length + index + 1,
            content: questionData.content,
            topic: questionData.topic as string,
            status: 'OK',
            message: dryRun ? 'Hợp lệ (Sẵn sàng)' : 'Đã lưu thành công',
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          errors.push(`Sheet ${sheetName}, Row ${index + 2}: ${message}`);
          previewRows.push({
            id: totalInWorkbook - data.length + index + 1,
            content: row.content ? String(row.content) : 'N/A',
            topic: row.topic || 'N/A',
            status: 'ERROR',
            message,
          });
        }
      }
    }

    const dupCount = previewRows.filter((r) => r.status === 'DUP').length;

    return NextResponse.json({
      success: true,
      total: totalInWorkbook,
      valid: previewRows.filter((r) => r.status === 'OK').length,
      errorCount: errors.length,
      dupCount,
      errors: errors.slice(0, 10),
      rows: previewRows,
    });
  } catch (error: unknown) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
