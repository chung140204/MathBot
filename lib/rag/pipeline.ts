import { createEmbeddings } from './embed';
import { searchSimilarChunks, searchByKeywords } from './search';
import { classifyTopic } from './router';
import { decomposeQuery } from './decompose';
import { mergeAndRerank } from './rerank';
import { rewriteQuery } from './query-rewriter';
import type { KnowledgeChunkResult } from './types';

export interface RagSearchOptions {
  mode?: 'fast' | 'thinking';
  history?: Array<{ role: string; content: string }>;
}

export interface RagSearchResult {
  chunks: KnowledgeChunkResult[];
  rewrittenQuery?: string;
}

/**
 * Enhanced RAG pipeline: query rewriting → multi-query decomposition →
 * parallel hybrid search (vector + keyword) → merge + re-rank.
 *
 * Returns empty result on any error (graceful fallback — chat still works without RAG).
 */
export async function ragSearch(
  userMessage: string,
  options?: RagSearchOptions,
): Promise<RagSearchResult> {
  if (options?.mode === 'fast') {
    return { chunks: [] };
  }

  try {
    // Step 1: Rewrite follow-up queries with conversation context
    let ragQuery = userMessage;
    let rewrittenQuery: string | undefined;

    if (options?.history && options.history.length >= 2) {
      const result = await rewriteQuery(userMessage, options.history);
      if (result.isFollowUp) {
        ragQuery = result.rewrittenQuery;
        rewrittenQuery = result.rewrittenQuery;
        console.log('[RAG] Query rewritten:', userMessage, '→', ragQuery);
      }
    }

    // Step 2: Classify topic + decompose query (both sync)
    const topic = classifyTopic(ragQuery);
    const decomposed = decomposeQuery(ragQuery);

    // Step 3: Embed all sub-queries (parallel with concurrency limit)
    const embeddings = await createEmbeddings(decomposed.subQueries);

    // Step 4: Parallel hybrid search — vector searches + keyword search
    const [vectorResults, keywordResults] = await Promise.all([
      Promise.all(
        embeddings.map((emb) =>
          searchSimilarChunks(emb, undefined, undefined, topic),
        ),
      ),
      searchByKeywords(ragQuery, undefined, topic),
    ]);

    // Step 5: Merge + re-rank
    const chunks = mergeAndRerank(
      vectorResults,
      keywordResults,
      topic,
      ragQuery,
    );

    return { chunks, rewrittenQuery };
  } catch (error) {
    console.error('[RAG] Pipeline error, falling back to no-context:', error);
    return { chunks: [] };
  }
}
