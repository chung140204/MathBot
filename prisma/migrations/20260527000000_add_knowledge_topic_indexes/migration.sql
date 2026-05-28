-- B-tree index on topic for filtered vector/keyword search
CREATE INDEX idx_knowledge_chunks_topic
ON knowledge_chunks (topic);

-- GIN index on relatedTopics array for ANY() lookups
CREATE INDEX idx_knowledge_chunks_related_topics
ON knowledge_chunks USING GIN ("relatedTopics");
