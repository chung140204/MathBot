# Testing – MathBot

_Last updated: 2025-04-10_

---

## Overview

| Type | Tool | What it covers |
|------|------|---------------|
| Unit tests | Vitest | Business logic, RAG pipeline, scoring, utilities |
| Integration tests | Vitest + Prisma | Database queries, API route handlers |
| End-to-end tests | Playwright | Full user flows in the browser |
| AI evaluation | Manual scripts | Chatbot answer accuracy on math problems |

---

## Setup

```bash
# Install test dependencies
npm install -D vitest @vitejs/plugin-react vitest-environment-node
npm install -D @playwright/test
npm install -D @prisma/client prisma

# Install Playwright browsers
npx playwright install
```

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Unit tests (Vitest)

### File structure

```
tests/
└── unit/
    ├── rag/
    │   ├── pipeline.test.ts
    │   └── search.test.ts
    ├── exam/
    │   ├── scoring.test.ts
    │   └── generate.test.ts
    └── lib/
        └── errors.test.ts
```

### Vitest config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
})
```

### Test setup

```typescript
// tests/setup.ts
import { vi } from 'vitest'

// Mock OpenAI globally — never call real API in unit tests
vi.mock('@/lib/openai', () => ({
  openai: {
    embeddings: {
      create: vi.fn().mockResolvedValue({
        data: [{ embedding: new Array(1536).fill(0.1) }],
      }),
    },
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'mocked response' } }],
        }),
      },
    },
  },
}))

// Mock Prisma globally
vi.mock('@/lib/prisma', () => ({
  prisma: {
    question: { findMany: vi.fn(), findUnique: vi.fn() },
    examAttempt: { create: vi.fn(), findMany: vi.fn() },
    examAnswer: { createMany: vi.fn() },
    chatSession: { create: vi.fn(), findUnique: vi.fn() },
    chatMessage: { create: vi.fn(), findMany: vi.fn() },
    $queryRaw: vi.fn(),
  },
}))
```

### Example: scoring logic test

```typescript
// tests/unit/exam/scoring.test.ts
import { describe, it, expect } from 'vitest'
import { scoreExam } from '@/lib/exam/scoring'

describe('scoreExam', () => {
  it('counts correct answers accurately', () => {
    const answers = [
      { questionId: '1', userAnswer: 'A', correctAnswer: 'A' },
      { questionId: '2', userAnswer: 'B', correctAnswer: 'C' },
      { questionId: '3', userAnswer: null,  correctAnswer: 'D' },
    ]
    const result = scoreExam(answers)
    expect(result.totalScore).toBe(1)
    expect(result.totalQuestions).toBe(3)
    expect(result.percentage).toBeCloseTo(33.33, 1)
  })

  it('returns 0 when all answers are skipped', () => {
    const answers = [
      { questionId: '1', userAnswer: null, correctAnswer: 'A' },
    ]
    expect(scoreExam(answers).totalScore).toBe(0)
  })
})
```

### Example: RAG pipeline test

```typescript
// tests/unit/rag/pipeline.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ragPipeline } from '@/lib/rag/pipeline'
import { prisma } from '@/lib/prisma'

describe('ragPipeline', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('calls vector search with the embedded query', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([
      { id: '1', content: 'Derivative of x^2 is 2x', topic: 'DERIVATIVES', source: 'textbook' }
    ])

    await ragPipeline('What is the derivative of x squared?', [])

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1)
  })

  it('falls back gracefully when no chunks are found', async () => {
    vi.mocked(prisma.$queryRaw).mockResolvedValue([])
    await expect(ragPipeline('random question', [])).resolves.not.toThrow()
  })
})
```

---

## End-to-end tests (Playwright)

### Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  retries: 1,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Example: full exam flow

```typescript
// tests/e2e/exam.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Exam flow', () => {
  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await page.goto('/login')
    await page.fill('[name=email]', 'test@example.com')
    await page.fill('[name=password]', 'testpassword123')
    await page.click('[type=submit]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('user can complete a full exam attempt', async ({ page }) => {
    await page.goto('/exam')
    await page.selectOption('[name=topic]', 'DERIVATIVES')
    await page.click('text=Start Exam')

    // Answer all questions
    const questions = page.locator('[data-testid=question]')
    const count = await questions.count()
    for (let i = 0; i < count; i++) {
      await page.click(`[data-testid=question-${i}] [data-option=A]`)
    }

    await page.click('text=Submit')
    await expect(page.locator('[data-testid=results]')).toBeVisible()
    await expect(page.locator('[data-testid=score]')).toContainText('%')
  })
})
```

### Example: chat flow

```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test'

test('user can send a message and receive a response', async ({ page }) => {
  await page.goto('/chat')
  await page.fill('[data-testid=chat-input]', 'What is the derivative of x squared?')
  await page.keyboard.press('Enter')

  // Wait for streaming to complete
  await expect(page.locator('[data-testid=assistant-message]')).toBeVisible({ timeout: 15000 })
  await expect(page.locator('[data-testid=assistant-message]')).not.toBeEmpty()
})
```

---

## AI chatbot accuracy evaluation

This is a **manual evaluation** run before each thesis milestone.

### How to run

```typescript
// tests/eval/chatbot-accuracy.ts
// Run with: npx tsx tests/eval/chatbot-accuracy.ts

const testCases = [
  {
    question: "Find the derivative of f(x) = x³ + 2x² - 5x + 1",
    expectedKeywords: ["3x²", "4x", "-5", "f'(x)"],
  },
  {
    question: "Calculate the integral of 2x from 0 to 3",
    expectedKeywords: ["9", "x²"],
  },
  // Add at least 20 test cases covering all topics
]

// Send each question to /api/v1/chat
// Check response contains expected keywords
// Log pass/fail rate per topic
```

### Evaluation scorecard

| Topic | Test cases | Pass | Accuracy |
|-------|-----------|------|---------|
| Derivatives | 5 | — | — |
| Integrals | 5 | — | — |
| Limits | 3 | — | — |
| Complex Numbers | 3 | — | — |
| Probability | 4 | — | — |
| **Total** | **20** | **—** | **—** |

> Update this table after each evaluation run. Target: ≥ 80% accuracy overall.

---

## Running tests

```bash
# Run all unit tests
npm test

# Run with coverage report
npm run test:coverage

# Run a specific test file
npx vitest tests/unit/exam/scoring.test.ts

# Run E2E tests (requires dev server running)
npm run test:e2e

# Run E2E with browser UI
npm run test:e2e:ui
```

---

## CI (GitHub Actions)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm test
```