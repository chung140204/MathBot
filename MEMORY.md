# MathBot – Memory Log

> Cline reads this file at the start of every session.
> Update this file at the end of every session or when switching tasks.
> Keep the "Current session" section short and accurate — this is what Cline uses to resume work.

---

## Current session

**Date:** 2026-05-05
**Last working on:** Chatbot UX/UI Overhaul & Vision Integration
**Status:** Completed professional ChatGPT-like chat interface with multimodal support.

### What was completed today

#### 1. Multimodal Vision Integration ✅
- Integrated `meta/llama-3.2-90b-vision-instruct` for image understanding.
- Implemented file upload (`📎`) and clipboard paste support (Ctrl+V).
- Created a Base64-to-Markdown pipeline for image storage and rendering.
- Added logic to switch models dynamically: Vision for images, Text-only (DeepSeek-R1 style) for prompts.

#### 2. Professional Message Rendering ✅
- Integrated `react-markdown`, `remark-gfm`, and `rehype-katex` for high-quality formatting.
- Designed custom CSS for `.markdown` classes: headings (Emerald H3), lists, and indented paragraphs.
- Implemented styled KaTeX blocks with padding, light backgrounds, and rounded corners.

#### 3. Chat UX/UI Enhancements ✅
- Replaced restricted `math-field` with standard `textarea` and a custom formula palette (`ƒx`).
- Added a functional **"Stop"** button to abort streaming and save tokens.
- Implemented **"Copy"** and **"Edit"** actions on messages.
- Editing a message now correctly truncates the conversation history and re-triggers AI generation from that point.

#### 4. Critical Stability Fixes ✅
- Fixed race conditions where history loading would overwrite active stream content.
- Improved auto-scroll mechanism using a dual-trigger approach (immediate + 100ms delay) to handle Math/Image rendering.
- Fixed NVIDIA API errors by conditionally removing `reasoning_budget` for Vision models.

### Module status

| Module | Location | Status | Notes |
|--------|----------|--------|-------|
| Auth | `app/(auth)/` | ✅ Working | Login + Register, JWT sessions, raw SQL |
| Dashboard | `app/(dashboard)/dashboard/` | ✅ Working | Landing page with stats |
| Chat | `app/chat/` | ✅ Working | **Vision support**, KaTeX, GFM, History Edit |
| Progress | `app/(dashboard)/progress/` | ✅ Working | 4 metrics, charts, topic bars |
| Exam | `app/exam/` | ✅ Working | Start -> Setup -> Hint -> Submit -> Result |
| RAG | — | 🔲 Not started | Spec in `docs/AI_CHATBOT.md` |

### What is NOT done yet (pick up from here next session)

- [ ] Implement RAG pipeline (`lib/rag/`) — embed, search, pipeline, prompts
- [ ] Transition from Base64 images to S3/Cloudinary/R2 storage (DB row size limits)
- [ ] Seed database with comprehensive question bank
- [ ] Implement `lib/errors.ts` and refined error boundaries
- [ ] Add Vitest + Playwright test suites for the core chat/exam flows
- [ ] Update `docs/PROJECT_STATUS.md`

### Blockers
- Prisma `db push` blocked by Neon TCP restrictions (requires proxy or manual migrations)
- Base64 images are stored directly in DB (potential performance/storage issue at scale)

---

## How to resume next session

Tell Cline exactly this:

> "Read MEMORY.md and CLAUDE.md, then continue from where we left off"

---

## Session history

| Date | What was done | Next task |
|------|--------------|-----------|
| 2025-04-10 | Project setup, all docs created, folder structure finalized | Fill .env.local, setup Prisma schema |
| 2026-04-10 | Auth fix (raw SQL), Chat module built, Router fix, Progress verified | Exam module, RAG pipeline, seed DB |
| 2026-04-11 | Study Sidebar Navigation, UI logo update, Prisma Neon Pool fix | Exam module, RAG pipeline, seed DB |
| 2026-04-13 | Exam Module Completion (Generation, Submission, Hints, Results) | RAG pipeline, Seed DB, OpenAI switch |
| 2026-05-05 | **Chat Overhaul**: Vision integrated, Professional UI (Markdown/KaTeX), Edit/Stop functionality, Stability fixes | RAG pipeline, Image storage migration |

---

## Important decisions made this session

| Decision | Choice | Reason |
|----------|--------|--------|
| Vision Model | `meta/llama-3.2-90b-vision-instruct` | Best-in-class open vision model on NVIDIA NIM for math OCR |
| Markdown rendering | `react-markdown` + `rehype-katex` | Industry standard for professional, safe, and styleable AI output |
| Image storage (MVP) | Base64 strings in `chatMessage` | Avoids complex S3 setup during prototyping; uses existing schema |
| Chat Rewind Logic | `messages.slice(0, index)` | Provides the most intuitive "Edit" experience (rewriting history) |
| Streaming Control | `AbortController` + Stop button | Essential for UX and token cost management |

---

## Quick reference — current decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| ORM | Prisma | See docs/decisions/001 |
| AI provider | NVIDIA (Llama 3.2 Vision / DeepSeek R1) | High performance, specialized models |
| Vector DB | pgvector | See docs/decisions/003 |
| Architecture | Next.js monolith | See docs/decisions/004 |
| Database | Neon (PostgreSQL) | Free tier, pgvector support |
| Auth strategy | JWT + raw SQL | Bypasses PrismaAdapter connectivity issues |
| Route protection | Server-side middleware | Prevents client-side router errors |
