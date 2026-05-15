/**
 * Script to ingest knowledge chunks from markdown files into the database.
 *
 * Usage: npx tsx scripts/ingest-knowledge.ts
 *
 * Reads all .md files from data/knowledge/, splits by "---" separator,
 * parses [topic: ...] and [source: ...] metadata, generates embeddings,
 * and inserts into knowledge_chunks table.
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });
const embeddingClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.NVIDIA_BASE_URL || undefined,
});
const EMBED_MODEL = process.env.EMBED_MODEL || 'nvidia/nv-embedqa-e5-v5';
const KNOWLEDGE_DIR = path.join(process.cwd(), 'data', 'knowledge');

interface ParsedChunk {
  content: string;
  topic: string;
  source: string;
}

function topicFromFilename(filename: string): string {
  return filename.replace('.md', '').replace(/-/g, '_').toUpperCase();
}

function parseMarkdownFile(filePath: string): ParsedChunk[] {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const fallbackTopic = topicFromFilename(filename);

  const sections = raw.split(/\n---\n/).filter(s => s.trim());
  const chunks: ParsedChunk[] = [];

  for (const section of sections) {
    const lines = section.trim().split('\n');

    // Skip title lines (# heading)
    const contentLines: string[] = [];
    let topic = '';
    let source = '';

    for (const line of lines) {
      const topicMatch = line.match(/^\[topic:\s*(.+?)\]$/);
      const sourceMatch = line.match(/^\[source:\s*(.+?)\]$/);

      if (topicMatch) {
        topic = topicMatch[1].trim();
      } else if (sourceMatch) {
        source = sourceMatch[1].trim();
      } else if (!line.startsWith('# ')) {
        contentLines.push(line);
      }
    }

    // Fallback: use topic from filename if not specified in chunk
    if (!topic) {
      topic = fallbackTopic;
    }

    const content = contentLines.join('\n').trim();
    if (content && topic && source) {
      chunks.push({ content, topic, source });
    }
  }

  return chunks;
}

async function createEmbedding(text: string): Promise<number[]> {
  const response = await embeddingClient.embeddings.create({
    model: EMBED_MODEL,
    input: text.slice(0, 500),
    encoding_format: 'float',
    input_type: 'passage',
  } as any);
  return response.data[0].embedding;
}

async function main() {
  console.log('🚀 Starting knowledge ingestion...');
  console.log(`📂 Reading from: ${KNOWLEDGE_DIR}`);
  console.log(`🤖 Embedding model: ${EMBED_MODEL}\n`);

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error('❌ Knowledge directory not found:', KNOWLEDGE_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.md'));
  console.log(`📄 Found ${files.length} files\n`);

  // Clear existing chunks
  const deleteResult = await prisma.$executeRawUnsafe('DELETE FROM knowledge_chunks');
  console.log(`🗑️  Cleared existing chunks (${deleteResult} rows)\n`);

  let totalChunks = 0;
  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = path.join(KNOWLEDGE_DIR, file);
    const chunks = parseMarkdownFile(filePath);
    totalChunks += chunks.length;

    console.log(`📖 ${file}: ${chunks.length} chunks`);

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      try {
        const embedding = await createEmbedding(chunk.content);
        const vectorStr = `[${embedding.join(',')}]`;

        await prisma.$executeRawUnsafe(
          `INSERT INTO knowledge_chunks (id, content, topic, source, embedding, "createdAt")
           VALUES (gen_random_uuid(), $1, $2, $3, $4::vector, NOW())`,
          chunk.content,
          chunk.topic,
          chunk.source,
          vectorStr
        );

        successCount++;
        process.stdout.write(`   ✓ [${i + 1}/${chunks.length}] ${chunk.source}\n`);
      } catch (error: any) {
        errorCount++;
        console.error(`   ✗ [${i + 1}/${chunks.length}] ${chunk.source}: ${error.message}`);
      }

      // Rate limit: small delay between API calls
      await new Promise(r => setTimeout(r, 200));
    }
    console.log('');
  }

  console.log('═══════════════════════════════════');
  console.log(`✅ Done! ${successCount}/${totalChunks} chunks inserted successfully`);
  if (errorCount > 0) {
    console.log(`❌ ${errorCount} chunks failed`);
  }
  console.log('═══════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
