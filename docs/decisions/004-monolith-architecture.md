# ADR 004 – Monolith over separated frontend/backend

_Date: 2025-04-10 | Status: Accepted_

## Decision
Use a **Next.js 14 fullstack monolith** — frontend and backend in one repository and one deployment.

## Reasoning
- Eliminates CORS configuration entirely — same-origin requests
- Single Vercel deployment — no infrastructure coordination
- Shared TypeScript types between frontend and backend without a shared package
- Faster development for a solo developer on a 2-month timeline
- Next.js App Router Server Components allow direct Prisma calls without an HTTP layer

## Trade-offs
- Frontend and backend scale together — cannot scale independently
- Harder to extract into microservices if scope grows significantly

## Revisit if
The project needs to support a mobile app (would benefit from a standalone API) or multiple frontend clients.