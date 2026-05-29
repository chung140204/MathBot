import { KnowledgeChunkResult, RankedChunk, Difficulty } from './types';

function computeKeywordScore(query: string, content: string): number {
  const queryWords = query
    .toLowerCase()
    .normalize('NFC')
    .split(/\s+/)
    .filter((w) => w.length > 1);

  if (queryWords.length === 0) return 0;

  const contentLower = content.toLowerCase().normalize('NFC');
  const matchCount = queryWords.filter((word) => contentLower.includes(word)).length;

  return Math.min(matchCount / queryWords.length, 1);
}

export function mergeAndRerank(
  vectorResults: KnowledgeChunkResult[][],
  keywordResults: KnowledgeChunkResult[],
  detectedTopic: string | null,
  query: string,
  topK: number = 5,
  detectedDifficulty: Difficulty | null = null,
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
    const relatedTopicBoost = detectedTopic && chunk.relatedTopics?.includes(detectedTopic) ? 1.0 : 0.0;

    // Difficulty-aware soft boost — only when the query is detected ADVANCED (VDC).
    // Env-overridable weights default to the original values, so when
    // detectedDifficulty !== 'ADVANCED' the formula is byte-identical to before.
    const vdcActive = detectedDifficulty === 'ADVANCED';
    const difficultyBoost = vdcActive && chunk.difficulty === 'ADVANCED' ? 1.0 : 0.0;
    const wVec = parseFloat(process.env.RAG_W_VECTOR || '0.50');
    const wKw = parseFloat(process.env.RAG_W_KW || '0.27');
    const wTopic = parseFloat(process.env.RAG_W_TOPIC || '0.15');
    const wRelated = parseFloat(process.env.RAG_W_RELATED || '0.08');
    const wDiff = parseFloat(process.env.RAG_W_DIFFICULTY || '0.10');
    const finalScore =
      wVec * vectorSimilarity +
      wKw * keywordScore +
      wTopic * topicBoost +
      wRelated * relatedTopicBoost +
      (vdcActive ? wDiff * difficultyBoost : 0);

    ranked.push({
      ...chunk,
      similarity: vectorSimilarity,
      keywordScore,
      topicBoost,
      relatedTopicBoost,
      difficultyBoost,
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
    if (count < 3) {
      diverse.push(chunk);
      sourceCount.set(chunk.source, count + 1);
    }
    if (diverse.length >= topK) break;
  }

  return diverse;
}
