import { createEmbeddings } from './embed';
import { searchSimilarChunks, searchByKeywords } from './search';
import { classifyTopic, smartClassifyTopic } from './router';
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
  // Fast mode: lightweight RAG — skip HyDE and decomposition, return top 2 chunks
  if (options?.mode === 'fast') {
    try {
      const topic = classifyTopic(userMessage);
      const [embedding] = await createEmbeddings([userMessage]);
      const [vectorResults, keywordResults] = await Promise.all([
        searchSimilarChunks(embedding, undefined, undefined, topic),
        searchByKeywords(userMessage, undefined, topic),
      ]);
      const chunks = mergeAndRerank([vectorResults], keywordResults, topic, userMessage, 2);
      console.log(`[RAG] Fast mode: ${chunks.length} chunks`);
      return { chunks };
    } catch (error) {
      console.error('[RAG] Fast mode error, no context:', error);
      return { chunks: [] };
    }
  }

  try {
    // === PARALLEL LLM CALLS ===
    // rewrite, HyDE, classify are independent — run on original userMessage in parallel.
    // Only decomposeQuery needs the (potentially) rewritten query.
    console.time('[RAG] parallel-llm');

    const rewritePromise =
      options?.history && options.history.length >= 2
        ? rewriteQuery(userMessage, options.history)
        : Promise.resolve({ originalQuery: userMessage, rewrittenQuery: userMessage, isFollowUp: false as const });

    const hydePromise =
      userMessage.length >= 15
        ? generateHypotheticalAnswer(userMessage)
        : Promise.resolve(null);

    const classifyPromise = smartClassifyTopic(userMessage);

    const [rewriteResult, hydeText, topic] = await Promise.all([
      rewritePromise,
      hydePromise,
      classifyPromise,
    ]);

    console.timeEnd('[RAG] parallel-llm');

    let ragQuery = userMessage;
    let rewrittenQuery: string | undefined;
    if (rewriteResult.isFollowUp) {
      ragQuery = rewriteResult.rewrittenQuery;
      rewrittenQuery = rewriteResult.rewrittenQuery;
      console.log('[RAG] Query rewritten:', userMessage, '→', ragQuery);
    }

    if (hydeText) console.log(`[RAG] HyDE generated: ${hydeText.length} chars`);

    // Decompose uses rewritten query for sub-query splitting
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
