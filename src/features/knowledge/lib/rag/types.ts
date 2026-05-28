export interface KnowledgeChunkResult {
  id: string;
  content: string;
  topic: string;
  source: string;
  similarity: number;
  difficulty?: string;
  subTopic?: string;
  relatedTopics?: string[];
}

export interface RankedChunk extends KnowledgeChunkResult {
  keywordScore: number;
  topicBoost: number;
  relatedTopicBoost: number;
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
