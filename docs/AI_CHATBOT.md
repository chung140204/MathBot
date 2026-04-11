# AI Chatbot & RAG Pipeline – MathBot

_Last updated: 2025-04-10_

> Read after: `API_SPEC.md` | Read next: `FEATURE_FLAGS.md`

---

## Overview

The chatbot uses **Retrieval-Augmented Generation (RAG)** to ground GPT-4o responses in verified Grade 12 Math content stored internally — reducing hallucination and keeping answers aligned with the Vietnamese curriculum.

Pipeline summary:
1. Embed the user's message → search `knowledge_chunks` via pgvector
2. Inject top-K results as context into the system prompt
3. Stream GPT-4o response back to the client
4. Persist both messages to the database

---

## Models

| Purpose | Model | Notes |
|---------|-------|-------|
| Chat completion | `gpt-4o` | Streaming, use `gpt-4o-mini` during development |
| Embedding | `text-embedding-3-small` | 1536 dimensions |

> To reduce cost during development, set `OPENAI_CHAT_MODEL=gpt-4o-mini` in `.env.local`.
> The model is read from env — never hardcoded.

---

## File structure

```
src/lib/
├── openai.ts          ← Singleton OpenAI client
└── rag/
    ├── embed.ts       ← Create embeddings
    ├── search.ts      ← pgvector similarity search
    ├── pipeline.ts    ← Orchestrate the full RAG flow
    └── prompts.ts     ← System prompt builders
```

---

## RAG pipeline

```typescript
// src/lib/rag/pipeline.ts

export async function ragPipeline(
  userMessage: string,
  chatHistory: { role: 'user' | 'assistant'; content: string }[]
): Promise<ReadableStream> {

  // Step 1: Embed the user's question
  const embedding = await createEmbedding(userMessage)

  // Step 2: Retrieve top-5 relevant knowledge chunks
  const chunks = await searchSimilarChunks(embedding, 5)

  // Step 3: Build system prompt with retrieved context
  const systemPrompt = buildSystemPrompt(chunks)

  // Step 4: Stream GPT-4o response
  const stream = await openai.chat.completions.create({
    model: process.env.OPENAI_CHAT_MODEL ?? 'gpt-4o',
    stream: true,
    temperature: 0.3,
    max_tokens: 1500,
    messages: [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-10),          // Last 10 messages to stay within context window
      { role: 'user', content: userMessage },
    ],
  })

  return stream
}
```

---

## System prompt

```typescript
// src/lib/rag/prompts.ts

export function buildSystemPrompt(chunks: KnowledgeChunk[]): string {
  const context = chunks.length > 0
    ? chunks.map(c => `[${c.topic} — ${c.source}]\n${c.content}`).join('\n\n---\n\n')
    : 'No specific reference material found. Answer from general knowledge.'

  return `You are MathBot — an AI tutor specialized in helping Vietnamese students (Grade 12) prepare for university entrance exams in Mathematics.

## Behavior rules
- Answer only questions related to Grade 12 Mathematics and university exam preparation
- Explain solutions step by step, clearly and concisely
- Write all mathematical expressions in LaTeX: inline $...$ or block $$...$$
- If you are not confident in an answer, say so explicitly — do not fabricate
- After solving a problem, ask if the student wants to try a similar one
- Keep responses focused; avoid unnecessary disclaimers

## Reference material (use to improve accuracy)
${context}

## Topics in scope
Limits & Continuity, Derivatives, Integrals, Complex Numbers, Volumes,
Combinatorics & Probability, Sequences, Exponential & Logarithmic Functions,
Function Analysis, Analytic Geometry (Oxy), Solid Geometry`
}
```

---

## Embedding & vector search

```typescript
// src/lib/rag/embed.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000),   // Hard limit — model max is ~8192 tokens
  })
  return response.data[0].embedding
}
```

```typescript
// src/lib/rag/search.ts
import { prisma } from '@/lib/prisma'

export async function searchSimilarChunks(
  embedding: number[],
  topK: number = 5,
  similarityThreshold: number = 0.7
) {
  const vectorStr = `[${embedding.join(',')}]`

  return prisma.$queryRaw<KnowledgeChunk[]>`
    SELECT id, content, topic, source,
           1 - (embedding <=> ${vectorStr}::vector) AS similarity
    FROM knowledge_chunks
    WHERE 1 - (embedding <=> ${vectorStr}::vector) > ${similarityThreshold}
    ORDER BY embedding <=> ${vectorStr}::vector
    LIMIT ${topK}
  `
}
```

---

## KaTeX rendering

The client renders LaTeX returned by the AI using **KaTeX**.

```bash
npm install katex react-katex
```

`MathRenderer` component (`src/components/MathRenderer.tsx`) parses the full message string, splits on `$...$` and `$$...$$` delimiters, and renders each math segment with KaTeX. Plain text segments are rendered as Markdown.

**LaTeX conventions for AI responses:**
- Inline math: `$f(x) = x^2$`
- Block math (displayed on its own line): `$$\int_0^1 x^2\,dx = \frac{1}{3}$$`

---

## Configuration reference

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | — | Required. OpenAI secret key |
| `OPENAI_CHAT_MODEL` | `gpt-4o` | Chat model name |
| `OPENAI_EMBED_MODEL` | `text-embedding-3-small` | Embedding model |
| `RAG_TOP_K` | `5` | Number of chunks to retrieve |
| `RAG_SIMILARITY_THRESHOLD` | `0.7` | Minimum cosine similarity |
| `CHAT_MAX_HISTORY` | `10` | Max messages sent as context |
| `CHAT_MAX_TOKENS` | `1500` | Max response tokens |

---

## Extending the pipeline

**Swap the LLM provider:**
Only change `src/lib/openai.ts` and the model name in `src/lib/rag/pipeline.ts`. The rest of the system is provider-agnostic.

**Add chunk re-ranking:**
After `searchSimilarChunks`, pass results through a cross-encoder before building the prompt. No other files need to change.

**Add hybrid search (keyword + vector):**
Extend `src/lib/rag/search.ts` to combine pgvector results with PostgreSQL `ts_rank` full-text search, then merge and de-duplicate results.

**Add a new subject:**
1. Add new `Topic` enum values to `prisma/schema.prisma`
2. Embed and insert the new knowledge documents
3. Update the "Topics in scope" section in `buildSystemPrompt`