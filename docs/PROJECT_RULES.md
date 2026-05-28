# Project Rules – MathBot

_Last updated: 2025-04-10_

> Read after: `PROJECT_STATUS.md`
> Claude must follow every rule in this file without exception.

---

## TypeScript

- Always use **TypeScript strict mode** — `tsconfig.json` must have `"strict": true`
- Never use `any` — use `unknown` and narrow the type, or define a proper interface
- Use `interface` for object shapes; use `type` for unions, intersections, and aliases
- Export shared types from `src/types/index.ts`

```typescript
// ✅ correct
interface ExamResult {
  score: number
  totalQuestions: number
  percentage: number
}

// ❌ wrong
const result: any = {}
function process(data: any) {}
```

---

## Next.js App Router

- **Server Components are the default** — only add `'use client'` when the component uses browser APIs, event handlers, or React hooks
- **Never fetch data with `useEffect`** if a Server Component can do it
- Use `loading.tsx` for Suspense boundaries, `error.tsx` for error boundaries
- All API routes live under `src/app/api/v1/` — maintain the `/v1` prefix

```typescript
// ✅ correct — Server Component fetches directly
export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const stats = await prisma.examAttempt.findMany({
    where: { userId: session!.user.id },
  })
  return <Dashboard stats={stats} />
}

// ❌ wrong — useEffect fetching in Client Component
export default function DashboardPage() {
  const [stats, setStats] = useState([])
  useEffect(() => { fetch('/api/v1/...').then(...) }, [])
}
```

---

## Prisma & database

- Use **Prisma Client** for all queries — no raw SQL except pgvector similarity search
- Import from the singleton: `import { prisma } from '@/lib/prisma'`
- Never instantiate `new PrismaClient()` outside of `src/lib/prisma.ts`
- Wrap all Prisma calls in try/catch and throw `AppError` on known failure modes
- Never hard-delete records that affect historical data (use `isActive: false`)

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['query'] : [] })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## API route handlers

- Every route handler must follow the template in `docs/API_SPEC.md`
- Always check session at the top of every handler
- Always validate request body/query with **Zod** before processing
- Always use error codes from `docs/ERROR_CODES.md` — never invent new strings
- Always return the correct HTTP status code

```typescript
// Validation pattern
const schema = z.object({
  count: z.number().int().min(5).max(40).default(20),
  topic: z.nativeEnum(Topic).optional(),
})

const parsed = schema.safeParse(input)
if (!parsed.success) {
  return NextResponse.json(
    { error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR, details: parsed.error.flatten() },
    { status: 400 }
  )
}
```

---

## Error handling

- Use `AppError` from `src/lib/errors.ts` for all known error cases
- Never `throw new Error('some message')` in business logic — use `AppError`
- Route handlers must catch `AppError` separately from unknown errors
- Log unexpected errors with `console.error('[module-name] message:', error)` before returning 500

---

## Math rendering

- **All mathematical expressions must use KaTeX** — never use Unicode characters like `²`, `√`, `∫`
- Inline math: `$expression$`
- Block math: `$$expression$$`
- Always render content through `<MathRenderer>` if it may contain LaTeX

---

## Feature flags

- Before implementing a feature that has a flag, check `docs/FEATURE_FLAGS.md`
- Gate flagged features at the route handler level (not just UI level)
- Never remove a flag without also removing all its guards from the codebase

---

## Environment variables

- Never hardcode secrets, API keys, or database URLs
- Access via `process.env.VARIABLE_NAME` exclusively
- Every variable used in code must be documented in `.env.example`
- Validate required env vars at startup (add to a `src/lib/env.ts` validation if needed)

```bash
# .env.example
DATABASE_URL="postgresql://user:password@localhost:5432/mathbot"
NEXTAUTH_SECRET="change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="sk-..."
OPENAI_CHAT_MODEL="gpt-4o"
OPENAI_EMBED_MODEL="text-embedding-3-small"
RAG_TOP_K="5"
RAG_SIMILARITY_THRESHOLD="0.7"
ENABLE_CHAT="true"
ENABLE_ANALYTICS="true"
```

---

## Git commit convention

```
feat(module): short description of what was added
fix(module): short description of what was fixed
refactor(module): what was restructured and why
docs: what documentation was updated
chore: dependency install, config change, tooling
test(module): what was tested
```

Examples:
```
feat(exam): add difficulty filter to exam generation
fix(chat): handle OpenAI rate limit error gracefully
docs: update API_SPEC with DELETE /chat/sessions endpoint
```

---

## What NOT to do

| Rule | Reason |
|------|--------|
| Never create `.js` files | TypeScript only |
| Never use `pages/` directory | App Router only |
| Never fetch in `useEffect` if a Server Component can do it | Performance, simplicity |
| Never hardcode API keys | Security |
| Never invent error codes | Use `ERROR_CODES.md` |
| Never leave `console.log` debug statements | Clean production logs |
| Never skip Zod validation on API input | Security and reliability |
| Never use `any` type | Type safety |
| Never write raw SQL except vector search | Use Prisma Client |
| Never render math with Unicode characters | Use KaTeX |

---

## Component architecture

### File size limits

- **Max 300 lines per component file** — nếu vượt, tách thành sub-components hoặc custom hooks
- **Max 150 lines per custom hook** — nếu hook phức tạp hơn, tách logic thành utility functions
- **Max 100 lines per API route handler** — delegate business logic sang modules trong `features/`

```
❌ UploadClient.tsx (1,889 dòng) — monolith không thể maintain
✅ UploadClient.tsx (109) + ImageTabContent.tsx (283) + ThptTabContent.tsx (291) + ...
```

### Component decomposition rules

1. **Mỗi tab trong tabbed UI = 1 component riêng** — không bao giờ inline nhiều tab trong 1 file
2. **Shared UI primitives** (`Badge`, `SuccessHero`) → export từ `SharedUI.tsx` trong cùng feature folder
3. **Repeated state patterns** → extract thành custom hook (ví dụ: `useOcrExtraction` cho SSE + OCR flow)
4. **Repeated UI patterns** → extract thành component (ví dụ: `FileDropZone` cho drag-drop)

```typescript
// ✅ correct — tab component nhận props tối thiểu, tự quản state nội bộ
export default function ImageTabContent({ apiBasePath }: { apiBasePath: string }) {
  const ocr = useOcrExtraction({ apiBasePath, mode: 'individual' });
  // ...
}

// ❌ wrong — parent truyền 15+ state props xuống tab
<ImageTab
  questions={questions} setQuestions={setQuestions}
  status={status} setStatus={setStatus}
  progress={progress} setProgress={setProgress} // ... quá nhiều props
/>
```

### Hook patterns

- **Mỗi hook làm 1 việc** — `useOcrExtraction` xử lý OCR, `useSessionPersistence` xử lý storage, `useBeforeUnload` xử lý warning
- Hook phải expose cả **state** lẫn **actions** — không để consumer tự setState
- Wrap mọi event handler với `useCallback` nếu handler được truyền xuống child component
- Async operations trong hooks phải có **AbortController** + **timeout**

```typescript
// ✅ correct — hook expose action, consumer chỉ gọi
const ocr = useOcrExtraction({ apiBasePath, mode: 'thpt' });
ocr.startExtraction(files, { examYear: '2025' });

// ❌ wrong — consumer tự manage SSE parsing, abort, state
const [questions, setQuestions] = useState([]);
const res = await fetch('/api/ocr', { body: formData });
// ... 50 dòng SSE parsing inline
```

---

## Backend pipeline architecture

### Module boundary rules (áp dụng cho OCR pipeline và tương tự)

1. **Route handler chỉ làm 3 việc**: auth check → input validation → delegate sang pipeline
2. **Pipeline orchestrator** wire các stages và own SSE/streaming logic
3. **Mỗi stage = 1 file** với input/output types rõ ràng
4. **Pure utility functions** tách riêng (text processing, math fixing) — không mix với I/O logic

```
src/features/ocr/lib/
├── ocr-pipeline.ts          ← orchestrator (wire stages, SSE stream)
├── ocr-stage1-vision.ts     ← stage 1: vision API calls
├── ocr-stage1c-figures.ts   ← stage 1c: figure label assignment
├── ocr-stage2-structure.ts  ← stage 2: text → structured JSON
├── ocr-figure-assignment.ts ← YOLO + figure → question mapping
├── ocr-text-utils.ts        ← pure text functions (no I/O, no API calls)
├── ocr-prompt.ts            ← prompt templates + ExtractedQuestion type
└── yolo-detect.ts           ← ONNX inference (isolated, no other deps)
```

### Configuration & magic numbers

- **Hardcoded thresholds** phải là `const` ở đầu file với tên mô tả:

```typescript
// ✅ correct
const STAGE1C_MAX_Y_DISTANCE = 0.25;
const ADJACENT_TABLE_MAX_GAP = 0.1;
if (bestDist < STAGE1C_MAX_Y_DISTANCE) { ... }

// ❌ wrong
if (bestDist < 0.25) { ... }
```

- Nếu giá trị cần thay đổi runtime → dùng `process.env` với fallback

### Error handling trong pipelines

- **Không bao giờ swallow errors silent** — ít nhất phải `console.warn` + emit status event
- Stage failures phải **degrade gracefully** — nếu YOLO fail, vẫn trả questions (không có figures)
- Streaming responses phải wrap iterator trong `try-catch`
- Mỗi error log phải có **prefix `[MODULE_NAME]`** để grep được

```typescript
// ✅ correct — log + emit + graceful degradation
} catch (err) {
  console.error(`[OCR_API] YOLO page ${i + 1} failed:`, err);
  emit('status', { message: `Cảnh báo: Phát hiện hình trang ${i + 1} thất bại` });
}

// ❌ wrong — silent catch
} catch { /* ignore */ }
```

---

## Frontend quality rules

### Constants & shared values

- **Topic list, difficulty levels** → import từ `@/shared/constants/` — không bao giờ define inline map
- **API endpoints** → nếu khác `apiBasePath`, extract thành named constant với comment giải thích

```typescript
// ✅ correct
import { TOPICS } from '@/shared/constants/topics';
import { DIFFICULTIES } from './SharedUI';
const TEACHER_UPLOAD_URL = '/api/v1/teacher/questions/upload';

// ❌ wrong — duplicate inline map
const TOPIC_MAP = { DERIVATIVES: 'Đạo hàm', ... };
```

### Async operations trong components

- Mọi `fetch()` phải có `AbortController` nếu component có thể unmount trước khi response về
- Long-running requests (>30s) phải có **timeout**
- **`useBeforeUnload`** bắt buộc khi component có unsaved state (extracting, done-but-not-saved)

### Accessibility baseline

- Interactive non-button elements phải có: `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space), `aria-label`
- File drop zones phải validate cả **extension** lẫn **MIME type**
- Form fields có label bắt buộc phải có `aria-required="true"`

### State persistence

- `useSessionPersistence` phải persist cả `'done'` lẫn `'saving'` state — tránh mất data nếu user rời trang
- Session restore phải verify data integrity trước khi apply (check `questions.length > 0`)
- Mỗi tab dùng **storage key riêng** — không conflict

---

## File naming conventions

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| React component | PascalCase | `ImageTabContent.tsx`, `FileDropZone.tsx` |
| Custom hook | camelCase, prefix `use` | `useOcrExtraction.ts`, `useBeforeUnload.ts` |
| Backend module | kebab-case | `ocr-pipeline.ts`, `ocr-text-utils.ts` |
| Shared UI | PascalCase | `SharedUI.tsx` (chứa Badge, SuccessHero) |
| Constants | camelCase file, UPPER_SNAKE export | `topics.ts` → `export const TOPICS = [...]` |
| Types-only file | kebab-case | `ocr-types.ts` |

---

## Checklist trước khi merge

```
□ TypeScript pass: npx tsc --noEmit
□ Không có file > 300 dòng (component) hoặc > 100 dòng (route handler)
□ Không có hardcoded magic numbers — dùng named constants
□ Mọi async fetch có AbortController hoặc timeout
□ Không có silent catch — errors phải log hoặc report
□ Shared constants import từ @/shared/constants/ — không duplicate inline
□ Interactive elements có đủ accessibility attributes
□ Handlers truyền xuống child components đều wrapped với useCallback
□ Session persistence hoạt động đúng (save khi done/saving, clear khi idle/saved)
```