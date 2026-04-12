import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { Topic, Difficulty, QuestionFormat, QuestionType, Prisma } from '@prisma/client';

export async function POST(req: NextRequest) {
  console.log('=== POST /api/v1/admin/questions called ===');

  try {
    // Auth check
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      format,
      topic,
      difficulty,
      questionType,
      content,
      imageUrl,
      explanation,
      options,
      answer,
      optionAImageUrl,
      optionBImageUrl,
      optionCImageUrl,
      optionDImageUrl,
      statementA,
      statementB,
      statementC,
      statementD,
      statementAImageUrl,
      statementBImageUrl,
      statementCImageUrl,
      statementDImageUrl,
      answerA,
      answerB,
      answerC,
      answerD,
      correctAnswer,
    } = body;

    console.log('Body received:', format, topic);
    console.log('--- Incoming Manual Question Body ---');
    console.log(JSON.stringify(body, null, 2));

    // Basic validation
    if (!content || !topic || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Build question data with proper Prisma types
    const questionData: Prisma.QuestionCreateInput = {
      content,
      imageUrl: imageUrl || null,
      explanation: explanation || '',
      topic: topic as Topic,
      difficulty: difficulty as Difficulty,
      format: format as QuestionFormat,
      questionType: (questionType as QuestionType) || 'PRACTICE',
      options: (options as Prisma.InputJsonValue) || {},
    };

    if (format === 'MULTIPLE_CHOICE') {
      questionData.answer = answer || '';
      questionData.optionAImageUrl = optionAImageUrl || null;
      questionData.optionBImageUrl = optionBImageUrl || null;
      questionData.optionCImageUrl = optionCImageUrl || null;
      questionData.optionDImageUrl = optionDImageUrl || null;
    } else if (format === 'TRUE_FALSE') {
      questionData.statementA = statementA || null;
      questionData.statementB = statementB || null;
      questionData.statementC = statementC || null;
      questionData.statementD = statementD || null;
      questionData.statementAImageUrl = statementAImageUrl || null;
      questionData.statementBImageUrl = statementBImageUrl || null;
      questionData.statementCImageUrl = statementCImageUrl || null;
      questionData.statementDImageUrl = statementDImageUrl || null;
      questionData.answerA = answerA ?? null;
      questionData.answerB = answerB ?? null;
      questionData.answerC = answerC ?? null;
      questionData.answerD = answerD ?? null;
      questionData.answer = '';
    } else if (format === 'SHORT_ANSWER') {
      questionData.correctAnswer = correctAnswer || null;
      questionData.answer = correctAnswer || ''; // legacy support
    }

    const question = await prisma.question.create({
      data: questionData,
    });
    console.log('Created:', question.id);

    return NextResponse.json({
      success: true,
      id: question.id,
      message: 'Câu hỏi đã được tạo thành công'
    });
  } catch (error: unknown) {
    console.error('Error creating question:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      error: errorMessage
    }, { status: 500 });
  }
}
