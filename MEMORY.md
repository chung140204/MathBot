# MathBot – Memory Log

> Cline reads this file at the start of every session.
> Update this file at the end of every session or when switching tasks.
> Keep the "Current session" section short and accurate — this is what Cline uses to resume work.

---

## Current session

**Date:** 2026-04-11
**Last working on:** Study module navigation, UI polishes, Prisma DB connection adapter fix
**Status:** Study Sidebar isolated, UI colors exposed, Database 500 error eliminated

### What was completed today

#### 1. Study Navigation Revamp ✅
- Re-implemented `TOPIC_CONFIG` accordion in `app/(dashboard)/layout.tsx` isolated ONLY to `/study` paths.
- Added color-coded dots, drop-shadows, and layout alignment for topic configuration logic.
- Managed URL synchronization safely via `<React.Suspense>` over `useSearchParams()` to avoid build de-opts.

#### 2. UI Polishes & Logo Integration ✅
- Replaced the placeholder "M" logo with a custom `/mathbot-logo.png` image with `next/image`. added custom graphic sizing.
- Added user slogan "Học không còn là nghĩa vụ – mà là trải nghiệm" neatly below the new logo.
- Removed `grayscale` effect from all global sidebar icons so they stay colored regardless of hover state.
- Fixed a `sizes` warning on the Next.js `Image` component.

#### 3. Database Connection (Prisma Neon HTTP) Fix ✅
- Resolved a critical 500 `Failed to execute 'json' on 'Response': Unexpected end of JSON input` error caused by `PrismaClient` initialization failing to fallback correctly to `neon(connectionString)`.
- Corrected `lib/db.ts` to implement `Pool` mapped with `ws` from `@neondatabase/serverless` instead of standard `neon` tagged literal, passing the `PrismaNeon` adapter successfully (`new PrismaNeon(pool as any)`).

#### 4. Progress Page — Verified ✅
- `app/(dashboard)/progress/page.tsx` already exists (666 lines) with ALL requested sections
- API endpoint `app/api/v1/analytics/overview/route.ts` already exists
- No changes were needed — page was already built

### Module status

| Module | Location | Status | Notes |
|--------|----------|--------|-------|
| Auth | `app/(auth)/` | ✅ Working | Login + Register, JWT sessions, bcrypt, raw SQL via neon() |
| Dashboard | `app/(dashboard)/dashboard/` | ✅ Working | Landing page with stats |
| Chat | `app/chat/` | ✅ Working | SSE streaming, KaTeX, standalone module |
| Progress | `app/(dashboard)/progress/` | ✅ Working | 4 metrics, charts, topic bars, weak topics, history |
| Practice | `app/(dashboard)/practice/` | 🔲 Exists | Needs verification |
| Exam | — | 🔲 Not started | API spec defined, no implementation yet |
| RAG | — | 🔲 Not started | Spec in `docs/AI_CHATBOT.md` |

### What is NOT done yet (pick up from here next session)

- [ ] Implement Exam module (`app/exam/` + `app/api/v1/exam/`)
- [ ] Implement RAG pipeline (`lib/rag/`) — embed, search, pipeline, prompts
- [ ] Connect Chat to real OpenAI API (needs `OPENAI_API_KEY` in `.env`)
- [ ] Implement Practice page fully (exam generation + submission flow)
- [ ] Seed database with question bank (`prisma/seed.ts`)
- [ ] Create `lib/errors.ts` with AppError class + error codes
- [ ] Create `lib/flags.ts` with feature flag helpers
- [ ] Add Vitest + Playwright test suites
- [ ] Delete leftover debug scripts (`scripts/debug-login.ts`, `scripts/debug-login2.ts`)
- [ ] Update `docs/PROJECT_STATUS.md` to reflect current progress

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
