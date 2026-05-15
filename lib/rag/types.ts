export interface KnowledgeChunkResult {
  id: string;
  content: string;
  topic: string;
  source: string;
  similarity: number;
}

export interface RankedChunk extends KnowledgeChunkResult {
  keywordScore: number;
  topicBoost: number;
  finalScore: number;
}

export interface DecomposedQuery {
  original: string;
  subQueries: string[];
}

export interface RewriteResult {
  originalQuery: string;
  rewrittenQuery: string;
  isFollowUp: boolean;
}
