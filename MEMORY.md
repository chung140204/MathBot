# MathBot – Memory Log

> Cline reads this file at the start of every session.
> Update this file at the end of every session or when switching tasks.
> Keep the "Current session" section short and accurate — this is what Cline uses to resume work.

---

## Current session

**Date:** 2026-04-13
**Last working on:** Exam Module Completion (Generation, Results, AI Hints)
**Status:** Exam cycle finalized (Start -> Submit -> Result) with AI assistance

### What was completed today

#### 1. Exam Results Module ✅
- Implemented `/exam/result` page with high-quality UI, hero stats, and performance breakdown charts.
- Created `GET /api/v1/exam/result` endpoint for fetching attempt data with safety filters.
- Added performance feedback based on topic accuracy (AI suggestions section).

#### 2. Exam Generation & Lifecycle ✅
- Replaced mock question logic in `app/exam/page.tsx` with dynamic fetches from `/api/v1/exam/generate`.
- Added `ExamSetupModal` for configuring topics and question count before starting.
- Implemented `current_exam_session` and state persistence in `localStorage` for crash recovery.
- Normalized scoring logic for MC (1pt), TF (0.25pt/item), and SA (0.5pt) based on 2025 THPT standards.

#### 3. AI Hint Integration ✅
- Created `AIHintModal` with SSE (Server-Sent Events) streaming support for real-time math hints.
- Integrated "Gợi ý từ AI" button into the exam interface with context-aware prompts.
- Added `MathRenderer` consistency across hint modals and results lists.

#### 4. UI/UX Polishes ✅
- Fixed critical "Module not found" errors related to `MathRenderer` package paths.
- Updated `TOPIC_LABELS` to cover all curriculum areas (Derivatives, Integrals, Functions, etc.).
- Improved sidebar navigation with "Answered", "Skipped", and "Current" status indicators.

### Module status

| Module | Location | Status | Notes |
|--------|----------|--------|-------|
| Auth | `app/(auth)/` | ✅ Working | Login + Register, JWT sessions, raw SQL |
| Dashboard | `app/(dashboard)/dashboard/` | ✅ Working | Landing page with stats |
| Chat | `app/chat/` | ✅ Working | SSE streaming, KaTeX |
| Progress | `app/(dashboard)/progress//` | ✅ Working | 4 metrics, charts, topic bars |
| Exam | `app/exam/` | ✅ Working | Start -> Setup -> Hint -> Submit -> Result |
| RAG | — | 🔲 Not started | Spec in `docs/AI_CHATBOT.md` |

### What is NOT done yet (pick up from here next session)

- [ ] Implement RAG pipeline (`lib/rag/`) — embed, search, pipeline, prompts
- [ ] Connect Chat to real OpenAI API (needs `OPENAI_API_KEY` in `.env`)
- [ ] Seed database with comprehensive question bank
- [ ] Implement `lib/errors.ts` and refined error boundaries
- [ ] Add Vitest + Playwright test suites for the core exam flow
- [ ] Delete leftover debug scripts
- [ ] Update `docs/PROJECT_STATUS.md`

### Blockers
- `OPENAI_API_KEY` not in `.env` — Chat uses mock responses until added
- `lib/prisma.ts` lint warning: `NeonQueryFunction` type mismatch (non-blocking, runtime works)

---

## How to resume next session

Tell Cline exactly this:

> "Read MEMORY.md and CLAUDE.md, then continue from where we left off"

Cline will read this file, understand the current state, and pick up the next task automatically.

---

## Session history

| Date | What was done | Next task |
|------|--------------|-----------|
| 2025-04-10 | Project setup, all docs created, folder structure finalized | Fill .env.local, setup Prisma schema |
| 2026-04-10 | Auth fix (raw SQL), Chat module built, Router fix, Progress verified | Exam module, RAG pipeline, seed DB |
| 2026-04-11 | Study Sidebar Navigation, UI logo update, Prisma Neon Pool fix | Exam module, RAG pipeline, seed DB |
| 2026-04-13 | Exam Module Completion (Generation, Submission, Hints, Results) | RAG pipeline, Seed DB, OpenAI switch |

---

## Important decisions made this session

| Decision | Choice | Reason |
|----------|--------|--------|
| Auth bypass PrismaAdapter | Raw SQL via `neon()` | PrismaAdapter had connectivity issues with Neon serverless; raw SQL is stable and proven |
| Chat as standalone module | `app/chat/` (not inside `(dashboard)`) | `ARCHITECTURE.md` line 60 defines Chat as independent module with its own layout |
| Server-side route protection | `middleware.ts` with NextAuth `withAuth` | Client-side `useRouter.replace()` caused "Router action dispatched before initialization" |
| SSE streaming API | Edge runtime + `ReadableStream` | Matches `API_SPEC.md` contract; mock fallback for dev without API key |
| Study Topic Navigation | Suspense-wrapped isolated component | Avoids `useSearchParams` de-opt warning during Next.js builds |
| Database Connection | `@neondatabase/serverless` Pool over Neon `neon` HTTP | Ensures compatibility with `@prisma/adapter-neon` parsing |

---

## Quick reference — current decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| ORM | Prisma | See docs/decisions/001 |
| AI provider | OpenAI GPT-4o | See docs/decisions/002 |
| Vector DB | pgvector | See docs/decisions/003 |
| Architecture | Next.js monolith | See docs/decisions/004 |
| Database | Neon (PostgreSQL) | Free tier, pgvector support |
| Auth strategy | JWT + raw SQL | Bypasses PrismaAdapter connectivity issues |
| Route protection | Server-side middleware | Prevents client-side router errors |
