import { KnowledgeChunkResult, RankedChunk } from './types';

function computeKeywordScore(query: string, content: string): number {
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1);

  if (queryWords.length === 0) return 0;

  const contentLower = content.toLowerCase();
  const matchCount = queryWords.filter((word) => contentLower.includes(word)).length;

  return Math.min(matchCount / queryWords.length, 1);
}

export function mergeAndRerank(
  vectorResults: KnowledgeChunkResult[][],
  keywordResults: KnowledgeChunkResult[],
  detectedTopic: string | null,
  query: string,
  topK: number = 5,
): RankedChunk[] {
  const chunkMap = new Map<string, KnowledgeChunkResult>();
  const maxSimilarities = new Map<string, number>();

  for (const resultSet of vectorResults) {
    for (const chunk of resultSet) {
      if (!chunkMap.has(chunk.id)) {
        chunkMap.set(chunk.id, chunk);
      }
      const current = maxSimilarities.get(chunk.id) ?? 0;
      maxSimilarities.set(chunk.id, Math.max(current, chunk.similarity));
    }
  }

  for (const chunk of keywordResults) {
    if (!chunkMap.has(chunk.id)) {
      chunkMap.set(chunk.id, chunk);
      maxSimilarities.set(chunk.id, chunk.similarity);
    }
  }

  const ranked: RankedChunk[] = [];

  for (const [id, chunk] of chunkMap) {
    const vectorSimilarity = maxSimilarities.get(id) ?? 0;
    const keywordScore = computeKeywordScore(query, chunk.content);
    const topicBoost = detectedTopic && chunk.topic === detectedTopic ? 1.0 : 0.0;
    const finalScore = 0.55 * vectorSimilarity + 0.30 * keywordScore + 0.15 * topicBoost;

    ranked.push({
      ...chunk,
      similarity: vectorSimilarity,
      keywordScore,
      topicBoost,
      finalScore,
    });
  }

  ranked.sort((a, b) => b.finalScore - a.finalScore);

  // Filter out low-score chunks (configurable threshold)
  const minScore = parseFloat(process.env.RAG_MIN_SCORE || '0.20');
  const filtered = ranked.filter((c) => c.finalScore >= minScore);

  // Source diversity: max 2 chunks per source file
  const sourceCount = new Map<string, number>();
  const diverse: RankedChunk[] = [];
  for (const chunk of filtered) {
    const count = sourceCount.get(chunk.source) ?? 0;
    if (count < 2) {
      diverse.push(chunk);
      sourceCount.set(chunk.source, count + 1);
    }
    if (diverse.length >= topK) break;
  }

  return diverse;
}
