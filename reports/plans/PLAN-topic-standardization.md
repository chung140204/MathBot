# Implementation Plan: Standardizing MathBot Topic Constants

## 📌 User Request (VERBATIM)
> Fix topic list across the entire codebase:
>
> Valid topics (must match Prisma Topic enum exactly):
> DERIVATIVES       → "Đạo hàm"
> INTEGRALS         → "Tích phân & Nguyên hàm"
> FUNCTIONS         → "Hàm số"
> LIMITS            → "Giới hạn"
> COMPLEX_NUMBERS   → "Số phức"
> PROBABILITY       → "Xác suất - Tổ hợp"
> SEQUENCES         → "Dãy số"
> EXPONENTIAL_LOG   → "Hàm số mũ - Logarit"
> VOLUME            → "Thể tích"
> ANALYTIC_GEOMETRY → "Hình học giải tích"
> SOLID_GEOMETRY    → "Hình học không gian"

## 🎯 Acceptance Criteria (Derived from User Request)
| ID | Criterion | Verification Method |
|----|-----------|---------------------|
| AC1 | `src/lib/constants/topics.ts` created with mapping | File existence and content check |
| AC2 | `UploadClient.tsx` uses central `TOPICS` | Code review of imports and usage |
| AC3 | Dashboard `layout.tsx` uses central `TOPIC_CONFIG` | Code review of sidebar rendering |
| AC4 | `study/page.tsx` uses central `TOPIC_CONFIG` | Code review of theory content filtering |
| AC5 | `practice/page.tsx` uses central `TOPICS` | Code review of filter options |
| AC6 | All IDs match `Topic` enum in `prisma/schema.prisma` | Compare with schema file |

## 📋 Context Summary
**Architecture**: Next.js App Router with Prisma.
**Patterns**: Centralized constants in `src/lib/constants/`.
**Constraints**: Must match Prisma `Topic` enum exactly to avoid DB errors.

## Overview
Centralizing hardcoded topic lists into a single source of truth at `src/lib/constants/topics.ts` and refactoring all UI entry points to use this constant.

## Prerequisites
- [x] Scout report identifies all integration points (SCOUT-topic-standardization.md)
- [x] Prisma schema verified for correct Enum values.

## Phase 1: Foundation
### Tasks
- [ ] Task 1.1: Create `src/lib/constants/topics.ts`
  - Agent: `backend-engineer`
  - File(s): `src/lib/constants/topics.ts`
  - Acceptance: Contains `TOPICS`, `TOPIC_CONFIG`, `TOPIC_SUBSECTIONS`, and `TOPIC_LABEL`
  - Verification: `ls src/lib/constants/topics.ts`

## Phase 2: UI Refactoring
### Tasks
- [ ] Task 2.1: Refactor `app/admin/upload/UploadClient.tsx`
  - Agent: `frontend-engineer`
  - File(s): `app/admin/upload/UploadClient.tsx`
  - Acceptance: Replaces local `TOPICS` with central import.
- [ ] Task 2.2: Refactor `app/(dashboard)/layout.tsx`
  - Agent: `frontend-engineer`
  - File(s): `app/(dashboard)/layout.tsx`
  - Acceptance: Replaces local `TOPIC_CONFIG` and `TOPIC_SUBSECTIONS` with central import.
- [ ] Task 2.3: Refactor `app/(dashboard)/study/page.tsx`
  - Agent: `frontend-engineer`
  - File(s): `app/(dashboard)/study/page.tsx`
  - Acceptance: Replaces local `TOPIC_CONFIG` and `TOPIC_SUBSECTIONS` with central import.
- [ ] Task 2.4: Refactor `app/(dashboard)/practice/page.tsx`
  - Agent: `frontend-engineer`
  - File(s): `app/(dashboard)/practice/page.tsx`
  - Acceptance: Replaces local `TOPICS` with central import.

## Risks
| Risk | Impact | Mitigation | Rollback |
|------|--------|------------|----------|
| Broken imports | High | Verify file paths carefully | Revert to local constants |
| Key mismatch | Medium | Double check Prisma enum vs constant IDs | Revert change to specific file |

## Rollback Strategy
Use `git checkout` to revert modified files to their previous state if UI breaks or data fetching fails.
