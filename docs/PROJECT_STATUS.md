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
| Exam module complete | Week 3–4 | ✅ Done |
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
| Seed question bank | ✅ | Excel upload implemented with MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER support |
| `GET /api/v1/exam/generate` | ✅ | |
| Exam taking UI | ✅ | Support Part I, II, III (2025 format) |
| `POST /api/v1/exam/submit` | ✅ | Partial scoring for TF questions |
| Results page with explanations | ✅ | LaTeX rendering + format-specific feedback |
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
| `GET /api/v1/analytics/overview` | ✅ | Updated with comprehensive calculated stats |
| Dashboard page | ✅ | Modernized with metrics and interactive charts |
| Topic accuracy chart | ✅ | Recharts implemented with color codes |
| Score trend chart | ✅ | Weekly score bar chart implemented |
| Weak topics highlight | ✅ | Auto-calculated for accuracy < 50% |

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
| 2025-04-12 | Integrated THPT 2025 format (TF, Short Answer) and finalized scoring |