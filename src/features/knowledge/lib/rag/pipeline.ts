import { createEmbeddings } from './embed';
import { searchSimilarChunks, searchByKeywords } from './search';
import { classifyTopic, smartClassify, classifyDifficultyKeywords } from './router';
import { decomposeQuery } from './decompose';
import { mergeAndRerank } from './rerank';
import { rewriteQuery, detectFollowUp } from './query-rewriter';
import { generateHypotheticalAnswer } from './hyde';
import { getCachedRag, setCachedRag } from './rag-cache';
import type { KnowledgeChunkResult, Difficulty } from './types';

export interface RagSearchOptions {
  mode?: 'fast' | 'thinking' | 'tutor';
  history?: Array<{ role: string; content: string }>;
}

export interface RagSearchResult {
  chunks: KnowledgeChunkResult[];
  rewrittenQuery?: string;
}

/**
 * Adaptive RAG pipeline. Heaviness is driven by cheap SIGNALS, not by `mode`:
 *
 *  1. Default (every mode): sync topic/difficulty classify → embed the query →
 *     parallel hybrid search (vector + keyword) → merge + re-rank. No sub-LLM
 *     calls on this path, so it is fast.
 *  2. Escalate `rewriteQuery` (LLM) only when the message looks like a follow-up.
 *  3. Escalate HyDE + decomposition only when the query is VDC/ADVANCED, OR as a
 *     CONFIDENCE FALLBACK when the cheap pass retrieves nothing strong — so HyDE's
 *     cost is paid only when retrieval is actually weak.
 *
 * Returns empty result on any error (graceful fallback — chat still works without RAG).
 */
export async function ragSearch(
  userMessage: string,
  options?: RagSearchOptions,
): Promise<RagSearchResult> {
  try {
    const history = options?.history;
    const isFollowUp = !!history && history.length >= 2 && detectFollowUp(userMessage);

    let ragQuery = userMessage;
    let rewrittenQuery: string | undefined;
    let topic: string | null;
    let difficulty: Difficulty | null;

    // ── Signals ────────────────────────────────────────────────────────
    // Follow-up: rewrite (LLM) + classify (LLM) run in PARALLEL on the original
    // query — topic rarely changes after a rewrite and it's only a filter with an
    // unfiltered fallback, so we don't serialize them.
    if (isFollowUp) {
      console.time('[RAG] llm-calls');
      const [rewriteResult, cls] = await Promise.all([
        rewriteQuery(userMessage, history!),
        smartClassify(userMessage),
      ]);
      console.timeEnd('[RAG] llm-calls');
      if (rewriteResult.isFollowUp && rewriteResult.rewrittenQuery !== userMessage) {
        ragQuery = rewriteResult.rewrittenQuery;
        rewrittenQuery = rewriteResult.rewrittenQuery;
        console.log('[RAG] Query rewritten:', userMessage, '→', ragQuery);
      }
      topic = cls.topic;
      difficulty = cls.difficulty;
    } else {
      // Common case: purely sync signals, no LLM round trip.
      topic = classifyTopic(userMessage);
      difficulty = classifyDifficultyKeywords(userMessage);
    }

    // ── Cache lookup (deterministic, non-follow-up queries only) ─────────
    // Follow-ups depend on history + an LLM rewrite, so they are never cached.
    // A hit skips the entire retrieval stage (embed + search + rerank + HyDE).
    const cacheable = !isFollowUp;
    if (cacheable) {
      const cached = await getCachedRag(userMessage, topic);
      if (cached) {
        console.log(`[RAG] Cache hit: ${cached.length} chunks`);
        return { chunks: cached };
      }
    }

    const isVdc =
      difficulty === 'ADVANCED' && process.env.RAG_VDC_AUTO_UPGRADE !== 'false';
    const topK = isVdc ? parseInt(process.env.RAG_VDC_TOP_K || '8', 10) : 5;
    const minConfidence = isVdc
      ? parseFloat(process.env.RAG_VDC_CONFIDENCE_THRESHOLD || '0.18')
      : parseFloat(process.env.RAG_CONFIDENCE_THRESHOLD || '0.30');

    // Run hybrid search for a set of embedding texts; returns the raw result sets
    // so callers can merge several passes (cheap pass + HyDE pass) together.
    const hybridSearch = async (texts: string[]) => {
      const embeddings = await createEmbeddings(texts);
      const [vectorResults, keywordResults] = await Promise.all([
        Promise.all(embeddings.map((emb) => searchSimilarChunks(emb, undefined, undefined, topic))),
        searchByKeywords(ragQuery, undefined, topic),
      ]);
      return { vectorResults, keywordResults };
    };

    // ── Pass 1: cheap retrieval (embed the query directly) ──────────────
    const pass1 = await hybridSearch([ragQuery]);
    let vectorSets = pass1.vectorResults;
    let keywordSets = pass1.keywordResults;
    let chunks = mergeAndRerank(vectorSets, keywordSets, topic, ragQuery, topK, difficulty);

    // ── Pass 2: HyDE escalation — VDC, or weak retrieval (confidence fallback) ──
    const bestScore = chunks.length > 0 ? chunks[0].finalScore : 0;
    const needHyde = ragQuery.length >= 15 && (isVdc || bestScore < minConfidence);
    if (needHyde) {
      const hydeText = await generateHypotheticalAnswer(ragQuery);
      if (hydeText) {
        console.log(`[RAG] HyDE escalation (best=${bestScore.toFixed(2)}, vdc=${isVdc}): ${hydeText.length} chars`);
        const decomposed = decomposeQuery(ragQuery);
        const pass2 = await hybridSearch([hydeText, ...decomposed.subQueries]);
        vectorSets = [...vectorSets, ...pass2.vectorResults];
        keywordSets = [...keywordSets, ...pass2.keywordResults];
        chunks = mergeAndRerank(vectorSets, keywordSets, topic, ragQuery, topK, difficulty);
      }
    }

    // ── Confidence gate — relaxed for VDC (hard problems embed at lower similarity)
    const confidentChunks = chunks.filter((c) => c.finalScore >= minConfidence);
    if (confidentChunks.length === 0 && chunks.length > 0) {
      console.log(`[RAG] No confident chunks (best: ${chunks[0].finalScore.toFixed(2)} < ${minConfidence}), skipping context`);
      // Cache the empty result too — a query that retrieves nothing strong will
      // keep doing so until the KB changes (which busts the cache).
      if (cacheable) void setCachedRag(userMessage, topic, []);
      return { chunks: [], rewrittenQuery };
    }

    console.log(`[RAG] ${confidentChunks.length} chunks (hyde=${needHyde}, followUp=${isFollowUp}, vdc=${isVdc})`);
    if (cacheable) void setCachedRag(userMessage, topic, confidentChunks);
    return { chunks: confidentChunks, rewrittenQuery };
  } catch (error) {
    console.error('[RAG] Pipeline error, falling back to no-context:', error);
    return { chunks: [] };
  }
}
