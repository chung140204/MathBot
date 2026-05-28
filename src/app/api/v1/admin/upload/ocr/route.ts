import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { runOcrPipeline } from '@/features/ocr/lib/ocr-pipeline';

const MAX_IMAGES = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per image
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * POST /api/v1/admin/upload/ocr
 *
 * 2-stage OCR pipeline:
 *   Stage 1 — Vision (parallel): each page image → raw text extraction
 *   Stage 2 — Text LLM (parallel per section): structured NDJSON questions
 *
 * Response: Server-Sent Events (text/event-stream) with real-time progress.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !['ADMIN', 'TEACHER'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const imageFiles = formData.getAll('images') as File[];
    const examYear = ((formData.get('examYear') as string) || '').replace(/[^0-9]/g, '').slice(0, 4);
    const examCode = ((formData.get('examCode') as string) || '').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    const ocrMode = ((formData.get('mode') as string) || 'thpt') as 'thpt' | 'individual';

    // Validate inputs
    if (!imageFiles.length) {
      return NextResponse.json({ error: 'No images provided' }, { status: 400 });
    }
    if (imageFiles.length > MAX_IMAGES) {
      return NextResponse.json({ error: `Maximum ${MAX_IMAGES} images allowed` }, { status: 400 });
    }
    for (const file of imageFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(', ')}` },
          { status: 400 },
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds 5MB limit` },
          { status: 400 },
        );
      }
    }

    // Convert files to base64
    const base64Images = await Promise.all(
      imageFiles.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return { type: file.type, data: buffer.toString('base64') };
      }),
    );

    // Run the OCR pipeline as SSE stream
    const stream = runOcrPipeline({
      images: base64Images,
      examYear,
      examCode,
      ocrMode,
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[OCR_API] Outer error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 },
    );
  }
}
