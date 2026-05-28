import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/shared/lib/auth-helpers';
import { ErrorCode } from '@/shared/lib/errors';
import { flags } from '@/shared/lib/flags';
import {
  uploadSaveSchema, buildPrismaInputs,
  appendToExamSet, createExamSetWithQuestions, saveToBank, UploadError,
} from '@/features/questions/lib/question-upload';

export async function POST(req: Request) {
  if (!flags.enableClassroom) return NextResponse.json({ error: 'Feature disabled', code: ErrorCode.FEATURE_DISABLED }, { status: 403 });
  const auth = await requireRole('TEACHER', 'ADMIN');
  if (auth.error) return auth.response;

  try {
    const body = await req.json();
    const data = uploadSaveSchema.parse(body);
    const prismaInputs = buildPrismaInputs(data.questions, auth.session.user.id);

    if (data.examSetId) {
      const result = await appendToExamSet(data.examSetId, prismaInputs, auth.session.user.id, auth.session.user.role);
      return NextResponse.json({ success: true, ...result });
    }
    if (data.title) {
      const result = await createExamSetWithQuestions(data.title, prismaInputs, auth.session.user.id);
      return NextResponse.json({ success: true, ...result });
    }
    const result = await saveToBank(prismaInputs);
    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: 'Validation failed', code: ErrorCode.VALIDATION_ERROR, details: error.issues }, { status: 400 });
    if (error instanceof UploadError && error.code === 'EXAM_SET_NOT_FOUND') return NextResponse.json({ error: 'Exam set not found', code: ErrorCode.EXAM_SET_NOT_FOUND }, { status: 404 });
    if (error instanceof UploadError && error.code === 'ACCESS_DENIED') return NextResponse.json({ error: 'Access denied', code: ErrorCode.AUTH_FORBIDDEN }, { status: 403 });
    console.error('[teacher/questions/upload]', error);
    return NextResponse.json({ error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR }, { status: 500 });
  }
}
