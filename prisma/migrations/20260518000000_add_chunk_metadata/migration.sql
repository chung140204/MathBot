-- AlterTable: Add metadata columns to knowledge_chunks
ALTER TABLE "knowledge_chunks" ADD COLUMN IF NOT EXISTS "difficulty" "Difficulty";
ALTER TABLE "knowledge_chunks" ADD COLUMN IF NOT EXISTS "subTopic" TEXT;
ALTER TABLE "knowledge_chunks" ADD COLUMN IF NOT EXISTS "relatedTopics" "Topic"[] DEFAULT '{}';
