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

export type Difficulty = 'RECOGNITION' | 'COMPREHENSION' | 'APPLICATION' | 'ADVANCED';

export interface ClassifyResult {
  topic: string | null;
  difficulty: Difficulty | null;
}

export interface RankedChunk extends KnowledgeChunkResult {
  keywordScore: number;
  topicBoost: number;
  relatedTopicBoost: number;
  difficultyBoost: number;
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
