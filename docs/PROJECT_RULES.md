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