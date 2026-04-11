# Deployment – MathBot

_Last updated: 2025-04-10_

> Read after: `PROJECT_RULES.md`

---

## Overview

MathBot deploys as a single Next.js application on **Vercel**.
The database runs on a managed PostgreSQL provider with pgvector support.

```
GitHub repo
    │
    ▼ (push to main)
Vercel (auto-deploy)
    │
    ▼
Next.js App (frontend + backend API)
    │
    ▼
PostgreSQL + pgvector (Supabase / Neon)
```

---

## Recommended providers

| Service | Provider | Notes |
|---------|----------|-------|
| App hosting | Vercel | Free tier sufficient for thesis demo |
| PostgreSQL | Neon | Free tier, supports pgvector natively |
| Alternative DB | Supabase | Also supports pgvector, has a Studio UI |

---

## Local development setup

### 1. Clone and install

```bash
git clone https://github.com/your-username/mathbot.git
cd mathbot
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in real values in .env.local
```

### 3. Set up local PostgreSQL with pgvector

```bash
# Option A: Docker (recommended)
docker run -d \
  --name mathbot-db \
  -e POSTGRES_USER=mathbot \
  -e POSTGRES_PASSWORD=mathbot \
  -e POSTGRES_DB=mathbot \
  -p 5432:5432 \
  pgvector/pgvector:pg16

# Option B: Local PostgreSQL — install pgvector extension manually
# https://github.com/pgvector/pgvector#installation
```

### 4. Run database migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Seed the database

```bash
npx tsx prisma/seed.ts
```

### 6. Start development server

```bash
npm run dev
# App available at http://localhost:3000
```

---

## Production deployment — Vercel

### Step 1: Create a Neon database

1. Go to [neon.tech](https://neon.tech) → create a new project
2. Enable the pgvector extension:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
3. Copy the **connection string** (pooled mode for Vercel)

### Step 2: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)

### Step 3: Configure environment variables in Vercel

Go to Project → Settings → Environment Variables and add:

| Variable | Environment | Value |
|----------|-------------|-------|
| `DATABASE_URL` | Production, Preview | Neon pooled connection string |
| `DIRECT_URL` | Production, Preview | Neon direct connection string (for migrations) |
| `NEXTAUTH_SECRET` | Production, Preview | Random 32-char string |
| `NEXTAUTH_URL` | Production | `https://your-app.vercel.app` |
| `OPENAI_API_KEY` | Production, Preview | Your OpenAI key |
| `OPENAI_CHAT_MODEL` | Production | `gpt-4o` |
| `OPENAI_EMBED_MODEL` | Production | `text-embedding-3-small` |
| `RAG_TOP_K` | Production | `5` |
| `RAG_SIMILARITY_THRESHOLD` | Production | `0.7` |
| `ENABLE_CHAT` | Production | `true` |
| `ENABLE_ANALYTICS` | Production | `true` |

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Step 4: Update prisma.schema for Vercel + Neon

Neon requires a direct URL for migrations alongside the pooled URL:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")      // Pooled — used at runtime
  directUrl = env("DIRECT_URL")        // Direct — used for migrations
}
```

### Step 5: Run migrations on production

```bash
# Run once after first deploy, then after every schema change
npx prisma migrate deploy
```

Or add to Vercel build command:
```
prisma migrate deploy && next build
```

### Step 6: Deploy

```bash
git push origin main
# Vercel auto-deploys on every push to main
```

---

## Deployment checklist

Run through this before every production deploy:

- [ ] All environment variables are set in Vercel
- [ ] `prisma migrate deploy` has been run (if schema changed)
- [ ] `NEXTAUTH_URL` matches the actual production URL
- [ ] Feature flags are configured correctly for production
- [ ] OpenAI API key has sufficient credits
- [ ] Local `npm run build` passes without errors

```bash
# Verify build locally before pushing
npm run build
npm run start
```

---

## Branch strategy

| Branch | Purpose | Auto-deploy |
|--------|---------|-------------|
| `main` | Production | Yes → production URL |
| `dev` | Development integration | Yes → preview URL |
| `feat/*` | Feature branches | Yes → unique preview URL |

---

## Rollback

If a bad deploy reaches production:

```bash
# Option A: Revert via Vercel dashboard
# Project → Deployments → find last good deploy → Promote to Production

# Option B: Git revert
git revert HEAD
git push origin main
```

---

## Monitoring

| What to monitor | Where |
|-----------------|-------|
| App errors and logs | Vercel → Project → Functions → Logs |
| Database performance | Neon dashboard |
| OpenAI usage and cost | platform.openai.com → Usage |

---

## Common issues

**`PrismaClientInitializationError` on Vercel**
→ Check `DATABASE_URL` is set and uses the pooled connection string from Neon.

**`NEXTAUTH_URL` mismatch error**
→ Ensure `NEXTAUTH_URL` exactly matches the deployed URL including `https://`.

**pgvector extension not found**
→ Run `CREATE EXTENSION IF NOT EXISTS vector;` on the production database directly.

**OpenAI streaming not working**
→ Vercel Functions have a 10s timeout on the free plan. Upgrade to Pro or reduce `max_tokens`.