import { createEmbedding } from './embed';
import { searchSimilarChunks } from './search';
import { classifyTopic } from './router';

interface KnowledgeChunkResult {
  id: string;
  content: string;
  topic: string;
  source: string;
  similarity: number;
}

/**
 * Performs RAG search: classifies topic, embeds the user message, and finds similar chunks.
 * Returns empty array on any error (graceful fallback — chat still works without RAG).
 */
export async function ragSearch(userMessage: string): Promise<KnowledgeChunkResult[]> {
  try {
    const topic = classifyTopic(userMessage);
    const embedding = await createEmbedding(userMessage);
    const chunks = await searchSimilarChunks(embedding, undefined, undefined, topic);
    return chunks;
  } catch (error) {
    console.error('[RAG] Pipeline error, falling back to no-context:', error);
    return [];
  }
}
