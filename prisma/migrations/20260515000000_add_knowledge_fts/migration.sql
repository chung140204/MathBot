-- Add generated tsvector column for full-text search
ALTER TABLE knowledge_chunks
ADD COLUMN content_tsv tsvector
GENERATED ALWAYS AS (to_tsvector('simple', content)) STORED;

-- Create GIN index for fast full-text queries
CREATE INDEX idx_knowledge_chunks_content_tsv
ON knowledge_chunks USING GIN (content_tsv);
