import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import { createEmbedding } from '@/lib/rag/embed';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const body = await req.json();
    const { content, topic, source } = body;

    if (!content || !topic || !source) {
      return NextResponse.json(
        { error: 'content, topic, and source are required' },
        { status: 400 }
      );
    }

    // Generate embedding
    const embedding = await createEmbedding(content);
    const vectorStr = `[${embedding.join(',')}]`;

    // Insert with embedding using raw SQL (Prisma doesn't support vector type natively)
    const result = await prisma.$queryRawUnsafe(
      `INSERT INTO knowledge_chunks (id, content, topic, source, embedding, "createdAt")
       VALUES (gen_random_uuid(), $1, $2, $3, $4::vector, NOW())
       RETURNING id, content, topic, source, "createdAt"`,
      content,
      topic,
      source,
      vectorStr
    );

    return NextResponse.json({ success: true, chunk: (result as any[])[0] }, { status: 201 });
  } catch (error: any) {
    console.error('[Knowledge Ingest] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
