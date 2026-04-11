# Error Codes – MathBot

_Last updated: 2025-04-10_

> Read after: `FEATURE_FLAGS.md` | Read next: `PROJECT_STATUS.md`

---

## Overview

All API errors return a consistent shape:

```typescript
{
  error: string       // Human-readable message (may vary)
  code: string        // Machine-readable code (stable — never changes)
  details?: unknown   // Optional extra info (e.g. Zod validation errors)
}
```

The `code` field is stable and safe to use in client-side logic.
Never match on `error` message strings — they may change.

---

## Error code registry

### Auth errors — `AUTH_*`

| Code | HTTP | Description |
|------|------|-------------|
| `AUTH_REQUIRED` | 401 | No active session |
| `AUTH_FORBIDDEN` | 403 | Session exists but lacks permission |
| `AUTH_INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `AUTH_EMAIL_TAKEN` | 409 | Email already registered |
| `AUTH_WEAK_PASSWORD` | 400 | Password does not meet requirements |

### Validation errors — `VALIDATION_*`

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Zod schema validation failed (see `details`) |
| `VALIDATION_MISSING_FIELD` | 400 | Required field not provided |

### Exam errors — `EXAM_*`

| Code | HTTP | Description |
|------|------|-------------|
| `EXAM_INSUFFICIENT_QUESTIONS` | 400 | Not enough questions match the filter |
| `EXAM_QUESTION_NOT_FOUND` | 404 | A submitted questionId does not exist |
| `EXAM_ALREADY_SUBMITTED` | 409 | This exam attempt was already submitted |
| `EXAM_ATTEMPT_NOT_FOUND` | 404 | ExamAttempt ID not found |

### Chat errors — `CHAT_*`

| Code | HTTP | Description |
|------|------|-------------|
| `CHAT_SESSION_NOT_FOUND` | 404 | ChatSession ID not found or not owned by user |
| `CHAT_MESSAGE_TOO_LONG` | 400 | Message exceeds 2000 character limit |

### AI provider errors — `AI_*`

| Code | HTTP | Description |
|------|------|-------------|
| `AI_PROVIDER_ERROR` | 502 | OpenAI API returned an error |
| `AI_RATE_LIMITED` | 429 | OpenAI rate limit hit |
| `AI_CONTEXT_TOO_LONG` | 400 | Chat history exceeds model context window |

### Generic errors — `INTERNAL_*`

| Code | HTTP | Description |
|------|------|-------------|
| `INTERNAL_ERROR` | 500 | Unexpected server error |
| `NOT_FOUND` | 404 | Generic resource not found |
| `FEATURE_DISABLED` | 403 | Feature is toggled off via feature flag |

---

## Implementation

```typescript
// src/lib/errors.ts

export const ErrorCode = {
  // Auth
  AUTH_REQUIRED:            'AUTH_REQUIRED',
  AUTH_FORBIDDEN:           'AUTH_FORBIDDEN',
  AUTH_INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
  AUTH_EMAIL_TAKEN:         'AUTH_EMAIL_TAKEN',
  AUTH_WEAK_PASSWORD:       'AUTH_WEAK_PASSWORD',

  // Validation
  VALIDATION_ERROR:         'VALIDATION_ERROR',
  VALIDATION_MISSING_FIELD: 'VALIDATION_MISSING_FIELD',

  // Exam
  EXAM_INSUFFICIENT_QUESTIONS: 'EXAM_INSUFFICIENT_QUESTIONS',
  EXAM_QUESTION_NOT_FOUND:     'EXAM_QUESTION_NOT_FOUND',
  EXAM_ALREADY_SUBMITTED:      'EXAM_ALREADY_SUBMITTED',
  EXAM_ATTEMPT_NOT_FOUND:      'EXAM_ATTEMPT_NOT_FOUND',

  // Chat
  CHAT_SESSION_NOT_FOUND:  'CHAT_SESSION_NOT_FOUND',
  CHAT_MESSAGE_TOO_LONG:   'CHAT_MESSAGE_TOO_LONG',

  // AI
  AI_PROVIDER_ERROR:       'AI_PROVIDER_ERROR',
  AI_RATE_LIMITED:         'AI_RATE_LIMITED',
  AI_CONTEXT_TOO_LONG:     'AI_CONTEXT_TOO_LONG',

  // Generic
  INTERNAL_ERROR:          'INTERNAL_ERROR',
  NOT_FOUND:               'NOT_FOUND',
  FEATURE_DISABLED:        'FEATURE_DISABLED',
} as const

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode]

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly message: string,
    public readonly statusCode: number,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }

  // Convenience factories
  static notFound(code: ErrorCode, message = 'Resource not found') {
    return new AppError(code, message, 404)
  }

  static forbidden(code: ErrorCode, message = 'Access denied') {
    return new AppError(code, message, 403)
  }

  static badRequest(code: ErrorCode, message: string, details?: unknown) {
    return new AppError(code, message, 400, details)
  }

  static internal(message = 'An unexpected error occurred') {
    return new AppError(ErrorCode.INTERNAL_ERROR, message, 500)
  }
}
```

**Usage:**
```typescript
// Throw in business logic
throw AppError.notFound(ErrorCode.CHAT_SESSION_NOT_FOUND, 'Chat session not found')

// Catch in route handler (see API_SPEC.md route template)
if (error instanceof AppError) {
  return NextResponse.json(
    { error: error.message, code: error.code, details: error.details },
    { status: error.statusCode }
  )
}
```

---

## Adding a new error code

1. Add a row to the registry table above (choose the right namespace prefix)
2. Add the constant to the `ErrorCode` object in `src/lib/errors.ts`
3. Use `AppError` to throw it — never return error strings ad hoc

**Never remove or rename an existing code** — client code may depend on it.
If a code becomes obsolete, mark it `[DEPRECATED]` in this file and keep the constant.