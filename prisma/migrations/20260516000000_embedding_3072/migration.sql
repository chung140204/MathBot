-- Migration: Change embedding dimension from 1024 to 768 (gemini-embedding-001, outputDimensionality=768)
-- Existing embeddings are cleared (NULL) because they are incompatible with the new model.
-- Run scripts/re-embed-chunks.ts after this migration to re-embed all chunks.

-- Drop existing vector index
DROP INDEX IF EXISTS knowledge_chunks_embedding_idx;

-- Change column type: vector(1024) → vector(768), reset values to NULL
ALTER TABLE knowledge_chunks
  ALTER COLUMN embedding TYPE vector(768)
  USING NULL;

-- Recreate HNSW index for cosine similarity search (max 2000 dims)
CREATE INDEX knowledge_chunks_embedding_idx
  ON knowledge_chunks
  USING hnsw (embedding vector_cosine_ops);
