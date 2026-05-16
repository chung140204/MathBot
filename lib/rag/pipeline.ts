import { createEmbeddings } from './embed';
import { searchSimilarChunks, searchByKeywords } from './search';
import { classifyTopic } from './router';
import { decomposeQuery } from './decompose';
import { mergeAndRerank } from './rerank';
import { rewriteQuery } from './query-rewriter';
import { generateHypotheticalAnswer } from './hyde';
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

    // Step 1b: HyDE — generate hypothetical answer for better embedding match
    let hydeText: string | null = null;
    if (ragQuery.length >= 15) {
      hydeText = await generateHypotheticalAnswer(ragQuery);
      if (hydeText) console.log(`[RAG] HyDE generated: ${hydeText.length} chars`);
    }

    // Step 2: Classify topic + decompose query (both sync)
    const topic = classifyTopic(ragQuery);
    const decomposed = decomposeQuery(ragQuery);

    // Step 3: Embed — HyDE text (if available) + sub-queries
    const textsToEmbed = hydeText
      ? [hydeText, ...decomposed.subQueries]
      : decomposed.subQueries;
    const embeddings = await createEmbeddings(textsToEmbed);

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

    // Confidence gate: if best chunk score is too low, skip context entirely
    const minConfidence = parseFloat(process.env.RAG_CONFIDENCE_THRESHOLD || '0.28');
    if (chunks.length > 0 && chunks[0].finalScore < minConfidence) {
      console.log(`[RAG] Low confidence (${chunks[0].finalScore.toFixed(2)} < ${minConfidence}), skipping context`);
      return { chunks: [], rewrittenQuery };
    }

    return { chunks, rewrittenQuery };
  } catch (error) {
    console.error('[RAG] Pipeline error, falling back to no-context:', error);
    return { chunks: [] };
  }
}
