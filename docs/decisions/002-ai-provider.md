# ADR 002 – OpenAI as AI provider

_Date: 2025-04-10 | Status: Accepted_

## Decision
Use **OpenAI API** (GPT-4o for chat, text-embedding-3-small for embeddings).

## Reasoning
- GPT-4o reliably produces correct LaTeX for math expressions
- Streaming API is well-documented and straightforward to integrate
- text-embedding-3-small offers good quality at low cost for RAG
- Official Node.js SDK is well-maintained

## Trade-offs
- Ongoing API cost — mitigated by using `gpt-4o-mini` during development
- Dependency on a third-party service — mitigated by keeping provider logic isolated in `src/lib/openai.ts` and `src/lib/rag/`

## Revisit if
OpenAI pricing increases significantly or a self-hosted model (Ollama + Llama) reaches comparable math quality.