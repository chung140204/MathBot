'use server';

import prisma from '@/lib/db';
import { Topic } from '@prisma/client';

export async function getKnowledgeChunks(topicKey: string) {
  try {
    const chunks = await prisma.knowledgeChunk.findMany({
      where: { topic: topicKey as Topic },
      select: { id: true, source: true, content: true },
      orderBy: { createdAt: 'asc' }
    });
    return chunks;
  } catch (error) {
    console.error('Failed to fetch knowledge chunks:', error);
    return [];
  }
}
