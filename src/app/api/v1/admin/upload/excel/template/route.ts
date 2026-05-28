import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { buildThptTemplate, buildQuestionsTemplate } from '@/features/questions/lib/excel-templates';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'questions';

    const isThpt = type === 'thpt';
    const buf = new Uint8Array(isThpt ? await buildThptTemplate() : await buildQuestionsTemplate());
    const filename = isThpt ? 'template_thpt.xlsx' : 'template_questions.xlsx';

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('[TEMPLATE_API]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
