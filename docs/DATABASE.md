# Database – MathBot

_Last updated: 2025-04-10_

> Read after: `ARCHITECTURE.md` | Read next: `API_SPEC.md`

---

## Technology

- **PostgreSQL 16** with the `pgvector` extension (vector similarity search for RAG)
- **Prisma 5** ORM — all queries go through Prisma Client; raw SQL only for vector operations

---

## Prisma schema

```prisma
// prisma/schema.prisma

generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgvector(map: "vector")]
}

// ─── AUTH ─────────────────────────────────────────────────────────────

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed — never store plaintext
  name      String
  role      UserRole @default(STUDENT)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  examAttempts ExamAttempt[]
  chatSessions ChatSession[]

  @@map("users")
}

enum UserRole {
  STUDENT
  ADMIN   // Reserved for future admin dashboard
}

// ─── QUESTION BANK ────────────────────────────────────────────────────

model Question {
  id          String     @id @default(cuid())
  content     String     // May contain LaTeX: $x^2 + 1 = 0$
  options     Json       // { A: string, B: string, C: string, D: string }
  answer      String     // "A" | "B" | "C" | "D"
  explanation String     // Step-by-step explanation, may contain LaTeX
  topic       Topic
  difficulty  Difficulty
  isActive    Boolean    @default(true)  // Soft delete — never hard delete questions
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  examAnswers ExamAnswer[]

  @@index([topic, difficulty, isActive])
  @@map("questions")
}

enum Topic {
  LIMITS_AND_CONTINUITY       // Giới hạn – Liên tục
  DERIVATIVES                 // Đạo hàm
  INTEGRALS                   // Nguyên hàm – Tích phân
  COMPLEX_NUMBERS             // Số phức
  VOLUMES                     // Thể tích
  COMBINATORICS_PROBABILITY   // Tổ hợp – Xác suất
  SEQUENCES                   // Dãy số
  EXPONENTIAL_LOGARITHM       // Hàm số mũ – Logarit
  FUNCTION_ANALYSIS           // Khảo sát hàm số
  ANALYTIC_GEOMETRY           // Hình học giải tích Oxy
  SOLID_GEOMETRY              // Hình học không gian
}

enum Difficulty {
  RECOGNITION     // Nhận biết (easiest)
  COMPREHENSION   // Thông hiểu
  APPLICATION     // Vận dụng
  ADVANCED        // Vận dụng cao (hardest)
}

// ─── EXAM ─────────────────────────────────────────────────────────────

model ExamAttempt {
  id             String   @id @default(cuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  totalScore     Int      // Number of correct answers
  totalQuestions Int
  timeTakenSecs  Int      // Duration in seconds
  topics         Topic[]  // Topics included in this attempt
  startedAt      DateTime @default(now())
  submittedAt    DateTime @default(now())

  answers ExamAnswer[]

  @@index([userId, submittedAt])
  @@map("exam_attempts")
}

model ExamAnswer {
  id            String      @id @default(cuid())
  examAttemptId String
  examAttempt   ExamAttempt @relation(fields: [examAttemptId], references: [id], onDelete: Cascade)
  questionId    String
  question      Question    @relation(fields: [questionId], references: [id])
  userAnswer    String?     // null if skipped
  isCorrect     Boolean

  @@index([examAttemptId])
  @@map("exam_answers")
}

// ─── CHAT ─────────────────────────────────────────────────────────────

model ChatSession {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  title     String   @default("New conversation")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  messages ChatMessage[]

  @@index([userId, updatedAt])
  @@map("chat_sessions")
}

model ChatMessage {
  id            String      @id @default(cuid())
  chatSessionId String
  chatSession   ChatSession @relation(fields: [chatSessionId], references: [id], onDelete: Cascade)
  role          MessageRole
  content       String      // May contain LaTeX
  createdAt     DateTime    @default(now())

  @@index([chatSessionId, createdAt])
  @@map("chat_messages")
}

enum MessageRole {
  user
  assistant
}

// ─── RAG KNOWLEDGE BASE ───────────────────────────────────────────────

model KnowledgeChunk {
  id        String                       @id @default(cuid())
  content   String
  topic     Topic
  source    String                       // Source document name
  embedding Unsupported("vector(1536)")? // text-embedding-3-small output
  createdAt DateTime                     @default(now())

  @@map("knowledge_chunks")
}
```

---

## Table relationships

```
User ──< ExamAttempt ──< ExamAnswer >── Question
User ──< ChatSession ──< ChatMessage
KnowledgeChunk  (standalone, used by RAG pipeline only)
```

---

## Common query patterns

### Fetch random questions by topic and difficulty
```typescript
// Fetch a larger pool, shuffle in JS — avoids non-deterministic ORDER BY RANDOM()
const pool = await prisma.question.findMany({
  where: { topic, difficulty, isActive: true },
  take: 100,
})
const questions = pool
  .sort(() => Math.random() - 0.5)
  .slice(0, requestedCount)
```

### Compute per-topic accuracy for a user
```typescript
const attempts = await prisma.examAttempt.findMany({
  where: { userId },
  include: {
    answers: {
      include: { question: { select: { topic: true } } },
    },
  },
})

// Group and compute in application layer for flexibility
```

### Vector similarity search (RAG) — raw query required
```typescript
const result = await prisma.$queryRaw<KnowledgeChunk[]>`
  SELECT id, content, topic, source,
         1 - (embedding <=> ${vectorStr}::vector) AS similarity
  FROM knowledge_chunks
  WHERE 1 - (embedding <=> ${vectorStr}::vector) > 0.7
  ORDER BY embedding <=> ${vectorStr}::vector
  LIMIT ${topK}
`
```

---

## Migration workflow

```bash
# Create a new migration (development)
npx prisma migrate dev --name describe_the_change

# Apply migrations in production
npx prisma migrate deploy

# Regenerate Prisma Client after schema changes
npx prisma generate

# Reset database (development only — DESTROYS all data)
npx prisma migrate reset

# Open Prisma Studio to inspect data
npx prisma studio
```

## Extending the schema

When adding a new model:
1. Add the model to `schema.prisma`
2. Run `npx prisma migrate dev --name add_your_model`
3. Update `docs/DATABASE.md` (this file) with the new model and its relationships
4. Update `docs/PROJECT_STATUS.md`

When adding a new `Topic` enum value:
1. Add the value to the `Topic` enum in `schema.prisma`
2. Run a migration
3. Add corresponding knowledge chunks and re-embed them
4. Update the topic list in `docs/AI_CHATBOT.md`