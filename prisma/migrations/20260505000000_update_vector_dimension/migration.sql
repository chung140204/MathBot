-- AlterTable: Change embedding column from vector(1536) to vector(1024)
-- This matches the NVIDIA nv-embedqa-e5-v5 embedding model output dimensions
ALTER TABLE "knowledge_chunks" ALTER COLUMN "embedding" TYPE vector(1024);
