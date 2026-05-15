import prisma from '@/lib/db';

interface KnowledgeChunkResult {
  id: string;
  content: string;
  topic: string;
  source: string;
  similarity: number;
}

const RAG_TOP_K = parseInt(process.env.RAG_TOP_K || '5', 10);
const RAG_SIMILARITY_THRESHOLD = parseFloat(process.env.RAG_SIMILARITY_THRESHOLD || '0.7');

export async function searchSimilarChunks(
  embedding: number[],
  topK: number = RAG_TOP_K,
  threshold: number = RAG_SIMILARITY_THRESHOLD,
  topic?: string | null
): Promise<KnowledgeChunkResult[]> {
  const vectorStr = `[${embedding.join(',')}]`;

  if (topic) {
    // Filtered search: only chunks matching the detected topic
    const results = await prisma.$queryRawUnsafe<KnowledgeChunkResult[]>(
      `SELECT id, content, topic, source,
              1 - (embedding <=> $1::vector) AS similarity
       FROM knowledge_chunks
       WHERE embedding IS NOT NULL
         AND topic = $4
         AND 1 - (embedding <=> $1::vector) > $2
       ORDER BY embedding <=> $1::vector
       LIMIT $3`,
      vectorStr,
      threshold,
      topK,
      topic
    );
    return results;
  }

  // Fallback: search all chunks
  const results = await prisma.$queryRawUnsafe<KnowledgeChunkResult[]>(
    `SELECT id, content, topic, source,
            1 - (embedding <=> $1::vector) AS similarity
     FROM knowledge_chunks
     WHERE embedding IS NOT NULL
       AND 1 - (embedding <=> $1::vector) > $2
     ORDER BY embedding <=> $1::vector
     LIMIT $3`,
    vectorStr,
    threshold,
    topK
  );

  return results;
}
