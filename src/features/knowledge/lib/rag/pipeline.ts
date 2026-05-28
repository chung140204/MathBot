import { createEmbeddings } from './embed';
import { searchSimilarChunks, searchByKeywords } from './search';
import { classifyTopic, smartClassifyTopic } from './router';
import { decomposeQuery } from './decompose';
import { mergeAndRerank } from './rerank';
import { rewriteQuery, detectFollowUp } from './query-rewriter';
import { generateHypotheticalAnswer } from './hyde';
import type { KnowledgeChunkResult } from './types';

export interface RagSearchOptions {
  mode?: 'fast' | 'thinking' | 'tutor';
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
      const chunks = mergeAndRerank([vectorResults], keywordResults, topic, userMessage, 3);
      console.log(`[RAG] Fast mode: ${chunks.length} chunks`);
      return { chunks };
    } catch (error) {
      console.error('[RAG] Fast mode error, no context:', error);
      return { chunks: [] };
    }
  }

  try {
    console.time('[RAG] llm-calls');

    // Step 1: Determine if follow-up — affects parallelization strategy
    const isFollowUp =
      options?.history && options.history.length >= 2 && detectFollowUp(userMessage);

    let ragQuery = userMessage;
    let rewrittenQuery: string | undefined;
    let hydeText: string | null = null;
    let topic: string | null = null;

    if (isFollowUp) {
      // Follow-up: rewrite FIRST, then HyDE+classify on rewritten query
      const rewriteResult = await rewriteQuery(userMessage, options!.history!);
      if (rewriteResult.isFollowUp) {
        ragQuery = rewriteResult.rewrittenQuery;
        rewrittenQuery = rewriteResult.rewrittenQuery;
        console.log('[RAG] Query rewritten:', userMessage, '→', ragQuery);
      }

      // Now HyDE + classify run on the rewritten query (correct context)
      [hydeText, topic] = await Promise.all([
        ragQuery.length >= 15 ? generateHypotheticalAnswer(ragQuery) : Promise.resolve(null),
        smartClassifyTopic(ragQuery),
      ]);
    } else {
      // Not follow-up: all 3 run in parallel on original (fast path)
      const [hydeResult, classifyResult] = await Promise.all([
        userMessage.length >= 15 ? generateHypotheticalAnswer(userMessage) : Promise.resolve(null),
        smartClassifyTopic(userMessage),
      ]);
      hydeText = hydeResult;
      topic = classifyResult;
    }

    console.timeEnd('[RAG] llm-calls');
    if (hydeText) console.log(`[RAG] HyDE generated: ${hydeText.length} chars`);

    // Step 2: Decompose uses rewritten query for sub-query splitting
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

    // Step 6: Confidence gate — filter chunks below threshold
    const minConfidence = parseFloat(process.env.RAG_CONFIDENCE_THRESHOLD || '0.30');
    const confidentChunks = chunks.filter(c => c.finalScore >= minConfidence);
    if (confidentChunks.length === 0 && chunks.length > 0) {
      console.log(`[RAG] No confident chunks (best: ${chunks[0].finalScore.toFixed(2)} < ${minConfidence}), skipping context`);
      return { chunks: [], rewrittenQuery };
    }

    return { chunks: confidentChunks, rewrittenQuery };
  } catch (error) {
    console.error('[RAG] Pipeline error, falling back to no-context:', error);
    return { chunks: [] };
  }
}
