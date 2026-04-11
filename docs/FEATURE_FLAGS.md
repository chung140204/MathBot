# Feature Flags – MathBot

_Last updated: 2025-04-10_

> Read after: `AI_CHATBOT.md` | Read next: `ERROR_CODES.md`

---

## Overview

Feature flags allow features to be toggled on/off without deploying code changes.
They are used to safely ship incomplete features, run A/B tests, or disable broken functionality quickly.

All flags are defined in two places — keep them in sync:
1. This file (source of truth for documentation)
2. `src/lib/flags.ts` (runtime implementation)

---

## Current flags

| Flag | Type | Default | Status | Description |
|------|------|---------|--------|-------------|
| `ENABLE_CHAT` | env | `true` | Active | AI chatbot feature |
| `ENABLE_ANALYTICS` | env | `true` | Active | Dashboard analytics |
| `ENABLE_EXAM_TIMER` | env | `false` | Planned | Countdown timer during exam |
| `ENABLE_LEADERBOARD` | env | `false` | Planned | Public score leaderboard |
| `ENABLE_EXPORT_PDF` | env | `false` | Planned | Export results as PDF |
| `ENABLE_ADMIN_PANEL` | env | `false` | Planned | Admin dashboard for managing questions |
| `USE_GPT4O_MINI` | env | `false` | Dev only | Use cheaper model to reduce API cost |

---

## Implementation

```typescript
// src/lib/flags.ts

function flag(key: string, defaultValue: boolean): boolean {
  const value = process.env[key]
  if (value === undefined) return defaultValue
  return value === 'true' || value === '1'
}

export const flags = {
  enableChat:       flag('ENABLE_CHAT', true),
  enableAnalytics:  flag('ENABLE_ANALYTICS', true),
  enableExamTimer:  flag('ENABLE_EXAM_TIMER', false),
  enableLeaderboard: flag('ENABLE_LEADERBOARD', false),
  enableExportPdf:  flag('ENABLE_EXPORT_PDF', false),
  enableAdminPanel: flag('ENABLE_ADMIN_PANEL', false),
  useGpt4oMini:     flag('USE_GPT4O_MINI', false),
} as const

export type FeatureFlag = keyof typeof flags
```

**Usage in a Server Component or API route:**
```typescript
import { flags } from '@/lib/flags'

if (!flags.enableChat) {
  return NextResponse.json(
    { error: 'This feature is not available', code: 'FEATURE_DISABLED' },
    { status: 403 }
  )
}
```

**Usage in a Client Component:**
```typescript
// Pass flags as props from a Server Component — never read env vars on the client
// Server Component:
import { flags } from '@/lib/flags'
export default function Layout() {
  return <Sidebar showChat={flags.enableChat} />
}
```

---

## Adding a new flag

1. Add a row to the table above with: name, type, default, status, description
2. Add it to the `flags` object in `src/lib/flags.ts`
3. Add it to `.env.example` with a comment
4. Gate the feature with `if (!flags.yourFlag)` in the relevant route/component

---

## Removing a flag

When a feature is fully shipped and the flag is no longer needed:
1. Remove from this file
2. Remove from `src/lib/flags.ts`
3. Remove the env var from `.env.example` and Vercel settings
4. Remove all `if (flags.yourFlag)` guards from the codebase
5. Document the removal in the relevant ADR or `PROJECT_STATUS.md`