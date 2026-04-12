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
  status: 'OK' | 'ERROR';
  message: string;
}

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
    const defaultTopic = (formData.get('topic') as string) || 'DERIVATIVES';
    const defaultDifficulty = (formData.get('difficulty') as string) || 'RECOGNITION';

    let totalCreated = 0;
    let errors: string[] = [];
    let previewRows: PreviewRow[] = [];
    let totalInWorkbook = 0;

    // Process each sheet
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet) as ExcelRow[];
      totalInWorkbook += data.length;

      for (const [index, row] of data.entries()) {
        try {
          const formatStr = row.format || (sheetName === 'MULTIPLE_CHOICE' ? 'MULTIPLE_CHOICE' : 
                          sheetName === 'TRUE_FALSE' ? 'TRUE_FALSE' : 
                          sheetName === 'SHORT_ANSWER' ? 'SHORT_ANSWER' : 'MULTIPLE_CHOICE');
          
          const format = formatStr as QuestionFormat;

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


          const questionData: Prisma.QuestionCreateInput = {
            content: String(row.content || ''),
            explanation: row.explanation ? String(row.explanation) : '',
            topic: row.topic ? normalizeTopic(row.topic) : (defaultTopic as Topic),
            difficulty: (row.difficulty ? String(row.difficulty).toUpperCase() : defaultDifficulty) as Difficulty,
            format: format,
            questionType: normalizeQuestionType(row.question_type || 'PRACTICE'),
            options: {}, // Default mandatory field
          };

          if (!questionData.content || !questionData.topic) {
            throw new Error('Missing content or topic');
          }

          if (format === 'MULTIPLE_CHOICE') {
            questionData.options = {
              A: String(row.option_a || ''),
              B: String(row.option_b || ''),
              C: String(row.option_c || ''),
              D: String(row.option_d || '')
            };
            questionData.answer = String(row.answer || '').trim().toUpperCase();
            if (!questionData.answer) throw new Error('Missing answer');
          } else if (format === 'TRUE_FALSE') {
            questionData.options = {}; // Ensure empty object for JSON field
            questionData.statementA = row.statement_a ? String(row.statement_a) : '';
            questionData.statementB = row.statement_b ? String(row.statement_b) : '';
            questionData.statementC = row.statement_c ? String(row.statement_c) : '';
            questionData.statementD = row.statement_d ? String(row.statement_d) : '';
            
            const parseTF = (val: string | number | boolean | undefined): boolean => {
              if (val === undefined || val === null) return false;
              if (typeof val === 'boolean') return val;
              const s = String(val).toLowerCase();
              return s === 'đúng' || s === 'true' || s === '1' || s === 't';
            };

            questionData.answerA = parseTF(row.answer_a);
            questionData.answerB = parseTF(row.answer_b);
            questionData.answerC = parseTF(row.answer_c);
            questionData.answerD = parseTF(row.answer_d);
            questionData.answer = ''; 
          } else if (format === 'SHORT_ANSWER') {
            questionData.options = {}; // Ensure empty object for JSON field
            questionData.correctAnswer = row.correct_answer ? String(row.correct_answer) : '';
            questionData.answer = questionData.correctAnswer; // Duplicate for legacy support
          }

          if (!dryRun) {
            await prisma.question.create({
              data: questionData
            });
            totalCreated++;
          }
          
          previewRows.push({
            id: index + 1,
            content: questionData.content,
            topic: questionData.topic as string,
            status: 'OK',
            message: dryRun ? 'Hợp lệ (Sẵn sàng)' : 'Đã lưu thành công'
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Unknown error';
          const errMsg = `Sheet ${sheetName}, Row ${index + 2}: ${message}`;
          errors.push(errMsg);
          previewRows.push({
            id: index + 1,
            content: row.content || 'N/A',
            topic: row.topic || 'N/A',
            status: 'ERROR',
            message: message
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      total: totalInWorkbook,
      valid: previewRows.filter(r => r.status === 'OK').length,
      errorCount: errors.length,
      errors: errors.slice(0, 10),
      rows: previewRows
    });

  } catch (error: unknown) {
    console.error('Upload error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function dataLength(workbook: XLSX.WorkBook): number {
  let len = 0;
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    len += data.length;
  }
  return len;
}
