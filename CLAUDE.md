# MathBot – CLAUDE.md

_Last updated: 2025-04-10 | Version: 1.0.0_

This is the primary context file for AI-assisted development.
**Read this file first**, then follow the reference order below before writing any code.

---

## What is this project?

**MathBot** — an AI-powered online learning platform that helps Vietnamese high school students (Grade 12) prepare for university entrance exams in Mathematics.

Core capabilities:
- Multiple-choice exam simulation with topic and difficulty filtering
- Automatic scoring with per-question explanations
- AI chatbot (RAG-based) for step-by-step problem solving and study advice
- Personal analytics dashboard showing strengths, weaknesses, and progress over time

---

## Documentation reading order

Always read in this order before starting any task:

| # | File | Purpose |
|---|------|---------|
| 1 | `docs/ARCHITECTURE.md` | System architecture, modules, data flows |
| 2 | `docs/DATABASE.md` | Prisma schema, relationships, query patterns |
| 3 | `docs/API_SPEC.md` | API versioning, endpoints, request/response contracts |
| 4 | `docs/AI_CHATBOT.md` | RAG pipeline, prompt design, model configuration |
| 5 | `docs/FEATURE_FLAGS.md` | Feature flags — what's enabled, how to toggle |
| 6 | `docs/ERROR_CODES.md` | Standardized error codes used across the system |
| 7 | `docs/PROJECT_STATUS.md` | What's done, in progress, and not started |
| 8 | `docs/PROJECT_RULES.md` | Coding conventions and non-negotiable rules |

---

## Tech stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js | 14 (App Router) | Fullstack monolith |
| Language | TypeScript | 5.x | Strict mode enabled |
| Database | PostgreSQL | 16 | With pgvector extension |
| ORM | Prisma | 5.x | No raw SQL except vector search |
| Auth | NextAuth.js | v5 | Credentials provider |
| AI – Chat | OpenAI GPT-4o | latest | Streaming, temp 0.3 |
| AI – Embed | text-embedding-3-small | latest | 1536 dims for RAG |
| Vector search | pgvector | 0.7+ | Co-located with PostgreSQL |
| Math rendering | KaTeX | latest | Mandatory – no Unicode math |
| Validation | Zod | 3.x | All API inputs validated |
| Styling | Tailwind CSS | 3.x | |
| Testing | Vitest + Playwright | latest | Unit + E2E |
| Deployment | Vercel | — | Single deployment, FE + BE |

---

## Repository structure

```
mathbot/
├── CLAUDE.md                         ← You are here
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API_SPEC.md
│   ├── AI_CHATBOT.md
│   ├── FEATURE_FLAGS.md
│   ├── ERROR_CODES.md
│   ├── PROJECT_STATUS.md
│   ├── PROJECT_RULES.md
│   └── decisions/
│       ├── 001-orm-choice.md
│       ├── 002-ai-provider.md
│       ├── 003-rag-strategy.md
│       └── 004-monolith-architecture.md
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── src/
│   ├── app/
│   │   ├── (auth)/                   ← Public routes: login, register
│   │   ├── (dashboard)/              ← Protected routes: dashboard, profile
│   │   ├── exam/                     ← Exam taking + results
│   │   ├── chat/                     ← AI chat interface
│   │   └── api/
│   │       └── v1/                   ← All API routes versioned under /api/v1
│   │           ├── auth/
│   │           ├── exam/
│   │           ├── chat/
│   │           └── analytics/
│   │
│   ├── components/
│   │   ├── ui/                       ← Shared: Button, Input, Card, Modal
│   │   ├── exam/                     ← Exam-specific components
│   │   ├── chat/                     ← Chat-specific components
│   │   ├── analytics/                ← Chart and stat components
│   │   └── MathRenderer.tsx          ← KaTeX renderer for LaTeX strings
│   │
│   ├── lib/
│   │   ├── prisma.ts                 ← Prisma Client singleton
│   │   ├── openai.ts                 ← OpenAI Client singleton
│   │   ├── auth.ts                   ← NextAuth configuration
│   │   ├── flags.ts                  ← Feature flag helpers
│   │   ├── errors.ts                 ← AppError class + error registry
│   │   └── rag/
│   │       ├── embed.ts              ← Embedding creation
│   │       ├── search.ts             ← pgvector similarity search
│   │       ├── pipeline.ts           ← RAG orchestration
│   │       └── prompts.ts            ← System prompt builders
│   │
│   ├── hooks/                        ← Custom React hooks (client-side only)
│   ├── types/
│   │   └── index.ts                  ← Shared TypeScript types and enums
│   └── middleware.ts                 ← Auth guard for protected routes
│
├── tests/
│   ├── unit/                         ← Vitest unit tests
│   └── e2e/                          ← Playwright end-to-end tests
│
├── .env.example                      ← Committed, no real values
├── .env.local                        ← Local secrets — never commit
└── .env.test                         ← Test environment variables
```

---

## Key principles for Claude

- Always use **TypeScript** — never create `.js` files
- All API routes live under `/api/v1/` — maintain versioning
- Use **Server Components** by default; add `'use client'` only when necessary
- All math formulas must use **KaTeX** — never Unicode math characters
- All API inputs must be validated with **Zod**
- Never hardcode secrets — use `process.env` exclusively
- Check `docs/FEATURE_FLAGS.md` before implementing a flagged feature
- Use error codes from `docs/ERROR_CODES.md` — never invent new ones ad hoc
- Update `docs/PROJECT_STATUS.md` when a feature is completed