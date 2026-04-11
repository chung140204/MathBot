# Project Status – MathBot

_Last updated: 2025-04-10_

> Read after: `ERROR_CODES.md` | Read next: `PROJECT_RULES.md`

**Update this file whenever a task changes state.**

---

## Timeline

| Milestone | Target date | Status |
|-----------|-------------|--------|
| Docs & architecture finalized | Week 1 | ✅ Done |
| Core setup (DB, Auth, schema) | Week 2 | ✅ Done |
| Exam module complete | Week 3–4 | ⬜ Not started |
| Chat + RAG complete | Week 5–6 | ⬜ Not started |
| Testing & evaluation | Week 7 | ⬜ Not started |
| Report + defense prep | Week 8 | ⬜ Not started |

---

## Foundation

| Task | Status | Notes |
|------|--------|-------|
| Initialize Next.js 14 + App Router | ✅ | `npx create-next-app@latest mathbot --typescript --tailwind --app` |
| Configure Prisma + PostgreSQL | ✅ | Enable pgvector extension, using neon() HTTP |
| Configure NextAuth.js | ✅ | Credentials provider with raw SQL optimization |
| Configure Zod for validation | ✅ | |
| Configure KaTeX | ⬜ | |
| Set up `.env.example` | ✅ | |
| Deploy skeleton to Vercel | ⬜ | Verify env vars work in production |

## Auth module

| Task | Status | Notes |
|------|--------|-------|
| Register page + API | ✅ | Fixed and verified |
| Login page + API | ✅ | Fixed and verified |
| Route protection middleware | ⬜ | `src/middleware.ts` |
| Session type extension | ✅ | Added `userId` and `role` to session type |

## Exam module

| Task | Status | Notes |
|------|--------|-------|
| Seed question bank | ⬜ | Minimum 200 questions across all topics |
| `GET /api/v1/exam/generate` | ⬜ | |
| Exam taking UI | ⬜ | Question navigation, option selection |
| `POST /api/v1/exam/submit` | ⬜ | Auto-scoring, persist attempt |
| Results page with explanations | ⬜ | LaTeX rendering for explanations |
| `GET /api/v1/exam/history` | ⬜ | Paginated |

## Chat module

| Task | Status | Notes |
|------|--------|-------|
| OpenAI client singleton | ⬜ | `src/lib/openai.ts` |
| Embedding pipeline | ⬜ | `src/lib/rag/embed.ts` |
| pgvector search | ⬜ | `src/lib/rag/search.ts` |
| RAG orchestration | ⬜ | `src/lib/rag/pipeline.ts` |
| Ingest knowledge documents | ⬜ | Math textbook chunks → embeddings |
| `POST /api/v1/chat` (SSE stream) | ⬜ | |
| Chat UI with streaming | ⬜ | Show chunks as they arrive |
| KaTeX rendering in chat | ⬜ | `src/components/MathRenderer.tsx` |
| Session list + history | ⬜ | |
| Delete session | ⬜ | |

## Analytics module

| Task | Status | Notes |
|------|--------|-------|
| `GET /api/v1/analytics/overview` | ⬜ | |
| Dashboard page | ⬜ | |
| Topic accuracy chart | ⬜ | Recharts bar chart |
| Score trend chart | ⬜ | Recharts line chart |
| Weak topics highlight | ⬜ | Topics below 60% accuracy |

## Testing

| Task | Status | Notes |
|------|--------|-------|
| Unit tests for RAG pipeline | ⬜ | Vitest |
| Unit tests for scoring logic | ⬜ | Vitest |
| E2E test: full exam flow | ⬜ | Playwright |
| E2E test: chat flow | ⬜ | Playwright |
| Chatbot accuracy evaluation | ⬜ | Manual: 20 sample questions with known answers |

---

## Status legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done and verified |
| 🔄 | In progress |
| ⬜ | Not started |
| ❌ | Blocked — see Notes column |
| 🚫 | Descoped — will not implement |

---

## Change log

| Date | Change |
|------|--------|
| 2025-04-10 | Project initialized, docs written |