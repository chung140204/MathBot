# AI Chatbot & RAG Pipeline – MathBot

_Last updated: 2026-05-05_

> Read after: `API_SPEC.md` | Read next: `FEATURE_FLAGS.md`

---

## Overview

The chatbot uses **Retrieval-Augmented Generation (RAG)** to ground LLM responses in verified Grade 12 Math content stored internally — reducing hallucination and keeping answers aligned with the Vietnamese curriculum.

Pipeline summary:
1. Validate request (Zod) & rate limit (20 msg/min per user)
2. Verify session ownership
3. Embed the user's message → search `knowledge_chunks` via pgvector
4. Inject top-K results as context into the system prompt
5. Stream LLM response back to the client (SSE)
6. Persist both messages to the database

---

## Models

| Purpose | Model | Provider | Notes |
|---------|-------|----------|-------|
| Chat completion (text) | `nvidia/nemotron-3-super-120b-a12b` | NVIDIA NIM | Streaming, reasoning tokens enabled |
| Chat completion (vision) | `meta/llama-3.2-90b-vision-instruct` | NVIDIA NIM | Used when image attached |
| Embedding | `nvidia/nv-embedqa-e5-v5` | NVIDIA NIM | 1024 dimensions |

> All models accessed via NVIDIA API (`https://integrate.api.nvidia.com/v1`) using the OpenAI SDK with custom `baseURL`.
> Model names are configurable via environment variables.

---

## File structure

```
lib/
├── db.ts              ← Prisma Client singleton (Neon adapter)
└── rag/
    ├── embed.ts       ← Create embeddings (NVIDIA API)
    ├── search.ts      ← pgvector cosine similarity search
    ├── pipeline.ts    ← Orchestrate: embed → search (graceful fallback)
    └── prompts.ts     ← System prompt builder with context injection

app/
├── chat/
│   ├── api/route.ts   ← Main chat endpoint (POST, SSE streaming)
│   ├── page.tsx       ← Chat UI page
│   └── layout.tsx     ← Chat layout wrapper
└── api/v1/
    ├── chat/sessions/route.ts      ← Session CRUD (GET, POST, DELETE)
    └── knowledge/ingest/route.ts   ← Admin: add knowledge chunks

components/chat/
├── ChatWindow.tsx     ← Main chat interface, streaming handler
├── ChatSidebar.tsx    ← Session list, grouped by date
├── MessageBubble.tsx  ← Markdown + KaTeX rendering, edit support
└── MathInput.tsx      ← Textarea with formula palette, image upload
```

---

## RAG pipeline

```typescript
// lib/rag/pipeline.ts

export async function ragSearch(userMessage: string): Promise<KnowledgeChunkResult[]> {
  // Graceful fallback: if any step fails, returns [] (chat still works)
  const embedding = await createEmbedding(userMessage)
  const chunks = await searchSimilarChunks(embedding)
  return chunks
}
```

Integrated in `app/chat/api/route.ts`:
```typescript
const chunks = await ragSearch(lastUserMessage);
const systemPrompt = { role: 'system', content: buildSystemPrompt(chunks) };
// ... then pass to LLM with last 10 messages
```

---

## System prompt

Built by `lib/rag/prompts.ts` — includes:
- Vietnamese language enforcement
- Streaming-safe formatting rules (no HTML, short lines)
- LaTeX formatting requirements (KaTeX compatible)
- Structured answer format (Lời giải → Kết quả)
- Retrieved knowledge chunks injected as "TÀI LIỆU THAM KHẢO" section

When no relevant chunks found, the section is omitted and the model answers from general knowledge.

---

## Embedding & vector search

```typescript
// lib/rag/embed.ts
export async function createEmbedding(text: string): Promise<number[]> {
  // Uses NVIDIA API via OpenAI SDK
  // Model: nvidia/nv-embedqa-e5-v5 (1024 dims)
  // Input truncated to 2000 chars
}
```

```typescript
// lib/rag/search.ts
export async function searchSimilarChunks(
  embedding: number[],
  topK: number = 5,          // from RAG_TOP_K env
  threshold: number = 0.7    // from RAG_SIMILARITY_THRESHOLD env
): Promise<KnowledgeChunkResult[]> {
  // Raw SQL with pgvector cosine distance operator (<=>)
  // Returns: id, content, topic, source, similarity score
}
```

---

## Security & reliability

| Feature | Implementation |
|---------|---------------|
| Authentication | NextAuth session required |
| Session ownership | Verified before message save |
| Rate limiting | 20 msg/min per user (in-memory) |
| Input validation | Zod schema (messages, sessionId, imageBase64) |
| Image validation | Format check (data:image/*;base64) + size limit (4MB) |
| Stream errors | Caught and sent as error event to client |
| DB save failures | Warning event sent to client before stream close |
| RAG fallback | If embedding/search fails → chat works without context |

---

## Vision support

When user attaches an image:
1. Client validates format (`data:image/(png|jpeg|jpg|gif|webp);base64,...`) and size (max 4MB)
2. Image embedded in message as markdown: `![image](base64...)\n\nuser text`
3. API reformats to OpenAI vision format: `[{type: 'text'}, {type: 'image_url'}]`
4. Model switches to `meta/llama-3.2-90b-vision-instruct`
5. RAG still runs on the text portion

---

## Thinking/reasoning tokens (NVIDIA)

When using NVIDIA models (non-vision):
- `enable_thinking: true` is passed via `extra_body`
- `reasoning_budget: 16384` tokens allocated
- Stream events: `thinking_start` → `reasoning` chunks → `thinking_end` → `content` chunks
- Client displays reasoning in collapsible section

---

## KaTeX rendering

The client renders LaTeX using **remark-math + rehype-katex** in `MessageBubble.tsx`.

Content normalization (handles various LLM output formats):
- `\[...\]` → `$$...$$` (display math)
- `\(...\)` → `$...$` (inline math)

**LaTeX conventions:**
- Inline math: `$f(x) = x^2$`
- Block math: `$$\int_0^1 x^2\,dx = \frac{1}{3}$$`

---

## Knowledge ingestion

### Via API (admin only)
```bash
POST /api/v1/knowledge/ingest
Authorization: (admin session required)

{
  "content": "Đạo hàm của hàm số: $(x^n)' = nx^{n-1}$ ...",
  "topic": "DERIVATIVES",
  "source": "SGK Toán 12 - Chương 1"
}
```

### Via seed script
```bash
npx prisma db seed
```
Seeds 12 sample knowledge chunks covering all topics with auto-generated embeddings.

### Data requirements
For production RAG quality, need comprehensive knowledge base:
- SGK Toán 12 content (formulas, theorems, examples)
- THPT exam solutions from past years
- Organized by Topic enum values

---

## Configuration reference

| Variable | Default | Description |
|----------|---------|-------------|
| `OPENAI_API_KEY` | — | Required. NVIDIA API key |
| `NVIDIA_BASE_URL` | — | NVIDIA NIM endpoint URL |
| `NVIDIA_MODEL` | `gpt-4o` | Chat model name |
| `EMBED_MODEL` | `nvidia/nv-embedqa-e5-v5` | Embedding model |
| `RAG_TOP_K` | `5` | Number of chunks to retrieve |
| `RAG_SIMILARITY_THRESHOLD` | `0.7` | Minimum cosine similarity |
| `CHAT_MAX_HISTORY` | `10` | Max messages sent as context |

---

## SSE event protocol

Events sent from server to client during streaming:

| Event | Format | When |
|-------|--------|------|
| New session | `{ event: 'session', sessionId }` | First message creates session |
| Thinking start | `{ event: 'thinking_start' }` | NVIDIA reasoning begins |
| Reasoning | `{ reasoning: "..." }` | Each reasoning chunk |
| Thinking end | `{ event: 'thinking_end' }` | Reasoning complete |
| Content | `{ content: "..." }` | Each response chunk |
| Error | `{ event: 'error', message }` | Stream/API failure |
| Warning | `{ event: 'warning', message }` | DB save failed |
| Done | `[DONE]` | Stream complete |

---

## Extending the pipeline

**Add more knowledge:**
Use the ingestion API or create a PDF parsing script to bulk-insert chunks.

**Swap the LLM provider:**
Change `NVIDIA_BASE_URL` and model env vars. The OpenAI SDK is provider-agnostic.

**Add chunk re-ranking:**
After `searchSimilarChunks`, pass results through a cross-encoder before building the prompt.

**Add hybrid search (keyword + vector):**
Extend `lib/rag/search.ts` to combine pgvector results with PostgreSQL `ts_rank` full-text search.

**Add a new subject:**
1. Add new `Topic` enum values to `prisma/schema.prisma`
2. Embed and insert the new knowledge documents
3. Update the "Topics in scope" section in `buildSystemPrompt`
