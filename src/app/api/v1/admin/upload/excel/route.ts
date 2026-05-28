import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import * as XLSX from 'xlsx';
import { processExcelWorkbook, type ExcelRow } from '@/features/questions/lib/excel-import';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
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

    // Parse sheets (skip LaTeX guide)
    const sheets = workbook.SheetNames
      .filter((name) => name !== 'Huong_dan_LaTeX')
      .map((name) => ({
        name,
        data: XLSX.utils.sheet_to_json(workbook.Sheets[name]) as ExcelRow[],
      }));

    const result = await processExcelWorkbook(sheets, {
      dryRun,
      configType,
      defaultTopic,
      defaultDifficulty,
      userId: session.user.id,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    console.error('[EXCEL_UPLOAD_API]', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
