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

export async function getStudyContent(topicKey: string, subsection?: string) {
  try {
    if (subsection) {
      const items = await prisma.$queryRawUnsafe<any[]>(
        `SELECT id, topic, subsection, title, content, "sortOrder" FROM study_contents WHERE topic = $1::text AND subsection = $2::text ORDER BY "sortOrder" ASC`,
        topicKey,
        subsection
      );
      return items;
    }
    const items = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id, topic, subsection, title, content, "sortOrder" FROM study_contents WHERE topic = $1::text ORDER BY "sortOrder" ASC`,
      topicKey
    );
    return items;
  } catch (error) {
    console.error('Failed to fetch study content:', error);
    return [];
  }
}
