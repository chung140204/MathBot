import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import prisma from '@/shared/lib/db';
import { Prisma } from '@prisma/client';
import { createEmbedding } from '@/features/knowledge/lib/rag/embed';
import { bustRagCache } from '@/features/knowledge/lib/rag/rag-cache';
import { z } from 'zod';

export const runtime = 'nodejs';

const ingestSchema = z.object({
  content: z.string().min(10).max(10000),
  topic: z.string().min(1).max(50),
  source: z.string().min(1).max(200),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = ingestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'content, topic, and source are required', details: parsed.error.flatten() }, { status: 400 });
    }

    const { content, topic, source } = parsed.data;

    // Generate embedding
    const embedding = await createEmbedding(content);
    const vectorStr = `[${embedding.join(',')}]`;

    // Insert with embedding using raw SQL (Prisma doesn't support vector type natively)
    const result = await prisma.$queryRaw<{ id: string; content: string; topic: string; source: string; createdAt: Date }[]>(
      Prisma.sql`INSERT INTO knowledge_chunks (id, content, topic, source, embedding, "createdAt")
       VALUES (gen_random_uuid(), ${content}, ${topic}, ${source}, ${vectorStr}::vector, NOW())
       RETURNING id, content, topic, source, "createdAt"`
    );

    // The knowledge base changed — invalidate cached RAG retrieval results.
    await bustRagCache();

    return NextResponse.json({ success: true, chunk: result[0] }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
