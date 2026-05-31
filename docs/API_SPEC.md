# API Specification – MathBot

_Last updated: 2025-04-10 | Current version: v1_

> Read after: `DATABASE.md` | Read next: `AI_CHATBOT.md`

---

## Conventions

| Convention | Value |
|-----------|-------|
| Base path | `/api/v1` |
| Content type | `application/json` (except `/chat` which uses SSE) |
| Authentication | Session cookie via NextAuth.js |
| Input validation | Zod on every route handler |
| Error format | `{ error: string, code: string, details?: unknown }` |

All routes require an active session unless marked **public**.
Error codes are defined in `docs/ERROR_CODES.md`.

---

## API versioning

Routes are prefixed with `/api/v1/`. When breaking changes are needed:
- Create `/api/v2/affected-route/` alongside v1
- Keep v1 alive for at least one semester (or until no active clients)
- Document the deprecation in this file under a **Deprecated** section

---

## Auth – `/api/v1/auth`

Handled entirely by **NextAuth.js**. No custom route handlers needed.

```
POST /api/v1/auth/signin          Sign in with email + password
POST /api/v1/auth/signout         Sign out current session
GET  /api/v1/auth/session         Get current session (public)
```

---

## Exam – `/api/v1/exam`

### `GET /api/v1/exam/generate`

Generate a new exam from the question bank.

**Query parameters:**

| Param | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `topic` | `Topic[]` | No | all topics | Comma-separated |
| `difficulty` | `Difficulty` | No | all | |
| `count` | `number` | No | `20` | Min: 5, Max: 40 |

**Response `200`:**
```typescript
{
  examId: string           // Temporary UUID — used when submitting
  questions: {
    id: string
    content: string        // May contain LaTeX inline: $...$  or block: $$...$$
    options: {
      A: string
      B: string
      C: string
      D: string
    }
    topic: Topic
    difficulty: Difficulty
  }[]
}
```

> `answer` and `explanation` are intentionally excluded from this response.

**Possible errors:** `EXAM_INSUFFICIENT_QUESTIONS`

---

### `POST /api/v1/exam/submit`

Submit answers and receive scored results.

**Request body:**
```typescript
{
  answers: {
    questionId: string
    answer: string | null  // null = skipped
  }[]
  timeTakenSecs: number
  topics: Topic[]
}
```

**Response `200`:**
```typescript
{
  attemptId: string
  totalScore: number
  totalQuestions: number
  percentage: number
  results: {
    questionId: string
    userAnswer: string | null
    correctAnswer: string
    isCorrect: boolean
    explanation: string    // May contain LaTeX
  }[]
}
```

**Possible errors:** `EXAM_QUESTION_NOT_FOUND`, `EXAM_ALREADY_SUBMITTED`

---

### `GET /api/v1/exam/history`

Retrieve the authenticated user's exam history.

**Query parameters:**

| Param | Type | Required | Default |
|-------|------|----------|---------|
| `page` | `number` | No | `1` |
| `limit` | `number` | No | `10` |

**Response `200`:**
```typescript
{
  attempts: {
    id: string
    totalScore: number
    totalQuestions: number
    percentage: number
    topics: Topic[]
    timeTakenSecs: number
    submittedAt: string    // ISO 8601
  }[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

---

## Chat – `/api/v1/chat`

### `POST /api/v1/chat`

Send a message to the AI chatbot. Returns a **Server-Sent Events (SSE) stream**.

**Request body:**
```typescript
{
  sessionId: string | null   // null = create new session
  message: string            // Max 2000 characters
}
```

**Response:** `Content-Type: text/event-stream`

```
data: {"type":"session","sessionId":"clx..."}

data: {"type":"chunk","content":"The derivative of "}

data: {"type":"chunk","content":"$f(x) = x^2$ is $f'(x) = 2x$."}

data: {"type":"done"}
```

Client should use `fetch` with `ReadableStream` (not `EventSource`) to support POST requests.

**Possible errors:** `CHAT_SESSION_NOT_FOUND`, `CHAT_MESSAGE_TOO_LONG`, `AI_PROVIDER_ERROR`

---

### `GET /api/v1/chat/sessions`

List all chat sessions for the authenticated user.

**Response `200`:**
```typescript
{
  sessions: {
    id: string
    title: string
    lastMessage: string    // Truncated to 100 chars
    updatedAt: string
  }[]
}
```

---

### `GET /api/v1/chat/sessions/[sessionId]`

Get full message history for a session.

**Response `200`:**
```typescript
{
  session: {
    id: string
    title: string
    messages: {
      id: string
      role: "user" | "assistant"
      content: string
      createdAt: string
    }[]
  }
}
```

**Possible errors:** `CHAT_SESSION_NOT_FOUND`, `AUTH_FORBIDDEN`

---

### `DELETE /api/v1/chat/sessions/[sessionId]`

Delete a chat session and all its messages.

**Response `200`:**
```typescript
{ success: true }
```

**Possible errors:** `CHAT_SESSION_NOT_FOUND`, `AUTH_FORBIDDEN`

---

## Guide Assistant – `/api/v1/assistant`

In-app "how to use the system" assistant (NOT the math tutor — see `ASSISTANT.md`).

### `POST /api/v1/assistant`

Ask how to use a MathBot feature. Returns a **Server-Sent Events (SSE) stream**.

**Request body:**
```typescript
{
  message: string                  // Max 2000 characters
  path?: string                    // Current page pathname, for context (max 200)
  history?: {                      // Up to 10 prior turns
    role: "user" | "assistant"
    content: string                // Max 4000
  }[]
}
```

**Response:** `Content-Type: text/event-stream`
```
data: {"t":"Để làm một bài thi, vào "}

data: {"t":"[Luyện tập](/practice)..."}

data: [DONE]
```

- Each event carries one streamed token in `t`. `[DONE]` ends the stream.
- The system prompt is built per role (student/teacher/admin) and is constrained to
  the feature guide in `system-guide.ts` to avoid hallucinating non-existent pages.
- Client uses `fetch` + `ReadableStream` (not `EventSource`).

**Auth:** required. **Rate limit:** shared `aiLimiter` (20 req / 60s per user → `429 RATE_LIMITED`).

**Possible errors:** `AUTH_REQUIRED` (401), `VALIDATION_ERROR` (400), `RATE_LIMITED` (429)

---

## Analytics – `/api/v1/analytics`

### `GET /api/v1/analytics/overview`

Get a summary of the user's learning performance.

**Response `200`:**
```typescript
{
  totalExams: number
  averageScore: number       // Percentage 0–100
  bestScore: number
  topicStats: {
    topic: Topic
    totalQuestions: number
    correctAnswers: number
    accuracy: number         // Percentage 0–100
  }[]
  recentTrend: {
    date: string             // ISO 8601 date
    score: number            // Percentage
  }[]                        // Last 10 attempts, chronological
  weakTopics: Topic[]        // Topics where accuracy < 60%
}
```

---

## Route handler template

Use this template for every new route handler:

```typescript
// src/app/api/v1/your-module/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { AppError, ErrorCode } from '@/lib/errors'

const bodySchema = z.object({
  // define your schema here
})

export async function POST(request: Request) {
  // 1. Auth check
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized', code: ErrorCode.AUTH_REQUIRED },
      { status: 401 }
    )
  }

  // 2. Input validation
  const body = await request.json()
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', code: ErrorCode.VALIDATION_ERROR, details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // 3. Business logic
  try {
    const result = await yourService(parsed.data, session.user.id)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      )
    }
    console.error('[your-module] Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', code: ErrorCode.INTERNAL_ERROR },
      { status: 500 }
    )
  }
}
```

---

## HTTP status codes used

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Resource created |
| `400` | Invalid input (Zod validation failed) |
| `401` | Not authenticated |
| `403` | Authenticated but not authorized |
| `404` | Resource not found |
| `409` | Conflict (e.g. duplicate submission) |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error |

---

## Deprecated endpoints

_None yet._

When deprecating, add entries here:
```
[DEPRECATED since v2] GET /api/v1/exam/old-endpoint
  → Use GET /api/v2/exam/new-endpoint instead
  → Will be removed after: 2025-12-01
```