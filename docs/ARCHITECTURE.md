# Architecture – MathBot

_Last updated: 2025-04-10_

> Read after: `CLAUDE.md` | Read next: `DATABASE.md`

---

## Overview

MathBot is a **Next.js 14 fullstack monolith** using the App Router. Frontend and backend live in the same repository and are deployed together on Vercel.

```
Browser
  │
  ▼
Next.js on Vercel
  ├── React Server Components  (data fetching, page rendering)
  ├── Client Components        (interactivity, streaming chat UI)
  └── API Route Handlers       (/api/v1/*)
        │
        ├── Prisma ORM ──────► PostgreSQL + pgvector
        └── OpenAI SDK ──────► OpenAI API (GPT-4o, embeddings)
```

---

## Modules

### Auth (`src/app/(auth)/`)
Handles user registration, login, and session management via NextAuth.js.

Responsibilities:
- Email + password authentication (bcrypt hashed)
- JWT session — `userId` is available on every server-side request
- Route protection via `src/middleware.ts`

Extension points:
- Add OAuth providers (Google, GitHub) in `src/lib/auth.ts` without touching other modules
- Add role-based access control (RBAC) by extending the `User` model and session type

---

### Exam (`src/app/exam/`)
Generates exams from the question bank, accepts submissions, and returns scored results.

Responsibilities:
- Filter questions by topic and difficulty
- Randomize question order per attempt
- Auto-score and persist attempt + per-answer records
- Return correct answers and explanations after submission

Extension points:
- Add timed exam mode by storing `startedAt` in `ExamAttempt`
- Add essay/open-ended questions by extending the `QuestionType` enum
- Add question reporting (flag bad questions) without touching core exam flow

---

### Chat (`src/app/chat/`)
AI-powered chat interface backed by a RAG pipeline.

Responsibilities:
- Maintain per-user chat sessions with full message history
- Stream GPT-4o responses to the client via SSE
- Retrieve relevant knowledge chunks before calling the LLM
- Render LaTeX in AI responses via KaTeX

Extension points:
- Add conversation summarization to manage long context windows
- Add feedback thumbs up/down per message for quality tracking
- Swap LLM provider by only changing `src/lib/openai.ts` and `src/lib/rag/pipeline.ts`

---

### Analytics (`src/app/(dashboard)/`)
Provides personal learning insights based on exam history.

Responsibilities:
- Compute accuracy per topic across all attempts
- Identify weak topics (accuracy below threshold)
- Show score trend over the last N attempts

Extension points:
- Add cohort comparison (percentile vs. all users) without changing individual stats queries
- Add weekly study goals and streak tracking as a separate sub-module
- Export analytics as PDF/CSV as a standalone feature

---

### RAG Pipeline (`src/lib/rag/`)
Retrieval-Augmented Generation — makes the AI accurate on Grade 12 Math content.

Responsibilities:
- Embed user queries using `text-embedding-3-small`
- Search `knowledge_chunks` table via pgvector cosine similarity
- Inject retrieved context into the system prompt before calling GPT-4o

Extension points:
- Add chunk re-ranking (cross-encoder) between retrieval and generation
- Add hybrid search (keyword + vector) by combining pgvector with PostgreSQL full-text search
- Support additional subjects by adding new `Topic` enum values and re-indexing knowledge chunks

---

## Data flows

### Exam flow
```
User selects topic + count
  → GET /api/v1/exam/generate
  → Prisma: fetch N random questions (filter by topic, difficulty)
  → Return questions (no answers)
  → User submits answers
  → POST /api/v1/exam/submit
  → Score each answer, persist ExamAttempt + ExamAnswer records
  → Return results with correct answers and explanations
```

### AI chat flow
```
User sends message
  → POST /api/v1/chat (SSE stream)
  → Create embedding for user message (OpenAI)
  → pgvector: find top-5 similar knowledge chunks
  → Build system prompt with retrieved context
  → Stream GPT-4o response back to client
  → Persist user message + assistant response to ChatMessage table
  → Client renders chunks incrementally, KaTeX parses math expressions
```

### Analytics flow
```
User opens dashboard
  → Server Component fetches ExamAnswer records for userId
  → Group by topic → compute accuracy per topic
  → Identify topics where accuracy < 60% → weak topics list
  → Render charts client-side with Recharts
```

---

## Adding a new module

Follow this checklist when adding a new feature module:

1. Create page(s) under `src/app/(dashboard)/your-module/`
2. Create API routes under `src/app/api/v1/your-module/`
3. Add any new Prisma models to `prisma/schema.prisma` and run `prisma migrate dev`
4. Create a feature flag in `docs/FEATURE_FLAGS.md` and `src/lib/flags.ts`
5. Add new error codes to `docs/ERROR_CODES.md` and `src/lib/errors.ts`
6. Update `docs/PROJECT_STATUS.md`
7. Document any architectural decision in `docs/decisions/`

---

## Scalability considerations

| Concern | Current approach | Migration path if needed |
|---------|-----------------|--------------------------|
| Database load | Single PostgreSQL instance | Add read replicas, then PgBouncer |
| Vector search | pgvector in same DB | Migrate to Pinecone or Qdrant |
| LLM cost | GPT-4o (pay-per-token) | Add response caching with Redis |
| File storage | Not needed yet | Add Vercel Blob or S3 |
| Background jobs | Not needed yet | Add Inngest or BullMQ |