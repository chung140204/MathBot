# ADR 003 – pgvector over dedicated vector database

_Date: 2025-04-10 | Status: Accepted_

## Decision
Store embeddings in **PostgreSQL with pgvector** rather than a dedicated vector database (Pinecone, Qdrant, Weaviate).

## Reasoning
- Eliminates a separate external service — simpler deployment and lower operational overhead
- Sufficient performance for the expected data size (< 50,000 knowledge chunks)
- Keeps all data in one place — easier to back up and manage
- No additional cost beyond the PostgreSQL instance already needed

## Trade-offs
- Does not scale as well as dedicated vector DBs beyond ~1M vectors
- Requires raw SQL for vector queries since Prisma has no pgvector operator support
- Index build time increases with data volume (use HNSW index for large datasets)

## Revisit if
Knowledge base grows beyond 100,000 chunks and query latency exceeds 200ms.