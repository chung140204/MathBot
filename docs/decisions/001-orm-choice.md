# ADR 001 – Prisma over Drizzle ORM

_Date: 2025-04-10 | Status: Accepted_

## Decision
Use **Prisma 5** as the ORM.

## Context
The project needs an ORM for PostgreSQL. Main candidates were Prisma and Drizzle.

## Reasoning
- Schema defined in `schema.prisma` is readable and self-documenting — easier to explain in the thesis defense
- Prisma Studio provides a visual data browser useful for demos
- Automatic migration generation reduces risk of schema drift
- Larger community and more examples available for troubleshooting
- Performance is sufficient for the project's scale (< 1000 concurrent users)

## Trade-offs
- Slower at runtime than Drizzle due to the query engine abstraction
- Does not natively support pgvector operators — raw queries required for vector search

## Revisit if
The project scales beyond ~10,000 daily active users and query latency becomes measurable.