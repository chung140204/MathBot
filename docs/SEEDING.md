# Seeding – MathBot

_Last updated: 2025-04-10_

---

## Overview

The question bank needs at least **200 questions** covering all 11 Grade 12 Math topics before the app is usable.
This file documents the seed data structure, how to run the seeder, and how to add more questions.

---

## Minimum question requirements

| Topic | Min questions | Priority |
|-------|--------------|---------|
| `FUNCTION_ANALYSIS` | 25 | High |
| `DERIVATIVES` | 25 | High |
| `INTEGRALS` | 25 | High |
| `EXPONENTIAL_LOGARITHM` | 20 | High |
| `LIMITS_AND_CONTINUITY` | 15 | Medium |
| `SOLID_GEOMETRY` | 15 | Medium |
| `VOLUMES` | 15 | Medium |
| `COMBINATORICS_PROBABILITY` | 15 | Medium |
| `ANALYTIC_GEOMETRY` | 15 | Medium |
| `SEQUENCES` | 15 | Medium |
| `COMPLEX_NUMBERS` | 15 | Low |
| **Total** | **200** | |

Each topic needs questions at all 4 difficulty levels:
- `RECOGNITION` — 30%
- `COMPREHENSION` — 30%
- `APPLICATION` — 25%
- `ADVANCED` — 15%

---

## Question format

```typescript
// prisma/seed.ts

interface SeedQuestion {
  content: string       // Use LaTeX for math: $f(x) = x^2$
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  answer: 'A' | 'B' | 'C' | 'D'
  explanation: string   // Step-by-step solution with LaTeX
  topic: Topic
  difficulty: Difficulty
}
```

### Example question

```typescript
{
  content: "Cho hàm số $f(x) = x^3 - 3x + 2$. Hàm số đạt cực tiểu tại điểm nào?",
  options: {
    A: "$x = -1$",
    B: "$x = 1$",
    C: "$x = 0$",
    D: "$x = 2$"
  },
  answer: "B",
  explanation: `Ta có $f'(x) = 3x^2 - 3 = 3(x^2 - 1) = 3(x-1)(x+1)$.

$f'(x) = 0 \\Rightarrow x = \\pm 1$

Lập bảng biến thiên:
- Với $x < -1$: $f'(x) > 0$ (tăng)
- Với $-1 < x < 1$: $f'(x) < 0$ (giảm)
- Với $x > 1$: $f'(x) > 0$ (tăng)

Vậy hàm số đạt **cực đại** tại $x = -1$ và **cực tiểu** tại $x = 1$.`,
  topic: "FUNCTION_ANALYSIS",
  difficulty: "COMPREHENSION"
}
```

---

## Seed script

```typescript
// prisma/seed.ts
import { PrismaClient, Topic, Difficulty } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  // Paste questions here — see format above
  // Organize by topic for readability
]

async function main() {
  console.log('Seeding question bank...')

  // Clear existing questions (dev only)
  if (process.env.NODE_ENV !== 'production') {
    await prisma.question.deleteMany()
    console.log('Cleared existing questions')
  }

  const result = await prisma.question.createMany({
    data: questions,
    skipDuplicates: true,
  })

  console.log(`Seeded ${result.count} questions`)

  // Log breakdown by topic
  for (const topic of Object.values(Topic)) {
    const count = await prisma.question.count({ where: { topic } })
    console.log(`  ${topic}: ${count} questions`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Run:
```bash
npx prisma db seed
```

---

## Seeding knowledge chunks (RAG)

Knowledge chunks are the documents the AI uses to answer questions accurately.
Each chunk should be 200–500 words — small enough to be retrieved precisely.

```typescript
// prisma/seed-knowledge.ts
import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

const prisma = new PrismaClient()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const documents = [
  {
    topic: 'DERIVATIVES',
    source: 'Giải tích 12 - Chương 1',
    content: `Định nghĩa đạo hàm: Cho hàm số y = f(x) xác định trên khoảng (a, b)...
    
Các quy tắc tính đạo hàm:
- $(u + v)' = u' + v'$
- $(uv)' = u'v + uv'$  
- $\\left(\\frac{u}{v}\\right)' = \\frac{u'v - uv'}{v^2}$

Bảng đạo hàm cơ bản:
- $(x^n)' = nx^{n-1}$
- $(\\sin x)' = \\cos x$
- $(\\cos x)' = -\\sin x$
- $(e^x)' = e^x$
- $(\\ln x)' = \\frac{1}{x}$`
  },
  // Add one document per major concept per topic
  // Aim for 5–10 chunks per topic = ~55–110 chunks total
]

async function seedKnowledge() {
  console.log('Embedding and seeding knowledge chunks...')

  for (const doc of documents) {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: doc.content,
    })
    const embedding = embeddingResponse.data[0].embedding
    const vectorStr = `[${embedding.join(',')}]`

    await prisma.$executeRaw`
      INSERT INTO knowledge_chunks (id, content, topic, source, embedding, "createdAt")
      VALUES (
        gen_random_uuid(),
        ${doc.content},
        ${doc.topic}::"Topic",
        ${doc.source},
        ${vectorStr}::vector,
        NOW()
      )
      ON CONFLICT DO NOTHING
    `

    console.log(`  Embedded: ${doc.source} (${doc.topic})`)
  }

  console.log('Knowledge seeding complete')
}

seedKnowledge()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Run:
```bash
npx tsx prisma/seed-knowledge.ts
```

> Warning: This calls the OpenAI embeddings API for each chunk.
> Cost is minimal (~$0.001 per 100 chunks) but requires a valid `OPENAI_API_KEY` in `.env.local`.

---

## Adding questions over time

To add more questions without re-seeding everything:

```bash
# Option A: Via Prisma Studio (visual)
npx prisma studio
# Navigate to Question table → Add record

# Option B: Via a script
npx tsx prisma/add-questions.ts
```

Never delete existing questions — set `isActive: false` instead to preserve exam history integrity.