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
dotenv.config({ path: '.env' });

import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import * as fs from 'fs';
import * as path from 'path';

neonConfig.webSocketConstructor = ws;

function createPrisma() {
  const p = new Pool({ connectionString: process.env.DATABASE_URL });
  const a = new PrismaNeon(p);
  return { prisma: new PrismaClient({ adapter: a }), pool: p };
}

let db = createPrisma();

async function execWithRetry(fn: (prisma: PrismaClient) => Promise<void>, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await fn(db.prisma);
      return;
    } catch (error: any) {
      if (attempt < retries && /terminated|connection|socket/i.test(error.message)) {
        console.log('   ⟳ Reconnecting...');
        await db.prisma.$disconnect().catch(() => {});
        await db.pool.end().catch(() => {});
        db = createPrisma();
        continue;
      }
      throw error;
    }
  }
}

const GEMINI_EMBED_URL =
  'https://generativelanguage.googleapis.com/v1/models/gemini-embedding-001:embedContent';
const KNOWLEDGE_DIR = path.join(process.cwd(), 'data', 'knowledge');

interface ParsedChunk {
  content: string;
  topic: string;
  source: string;
  difficulty: string | null;
  subTopic: string | null;
  relatedTopics: string[];
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
    let difficulty: string | null = null;
    let subTopic: string | null = null;
    let relatedTopics: string[] = [];

    for (const line of lines) {
      const topicMatch = line.match(/^\[topic:\s*(.+?)\]$/);
      const sourceMatch = line.match(/^\[source:\s*(.+?)\]$/);
      const difficultyMatch = line.match(/^\[difficulty:\s*(.+?)\]$/);
      const subTopicMatch = line.match(/^\[subTopic:\s*(.+?)\]$/);
      const relatedTopicsMatch = line.match(/^\[relatedTopics:\s*(.+?)\]$/);

      if (topicMatch) {
        topic = topicMatch[1].trim();
      } else if (sourceMatch) {
        source = sourceMatch[1].trim();
      } else if (difficultyMatch) {
        difficulty = difficultyMatch[1].trim();
      } else if (subTopicMatch) {
        subTopic = subTopicMatch[1].trim();
      } else if (relatedTopicsMatch) {
        relatedTopics = relatedTopicsMatch[1].split(',').map(t => t.trim()).filter(Boolean);
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
      chunks.push({ content, topic, source, difficulty, subTopic, relatedTopics });
    }
  }

  return chunks;
}

async function createEmbedding(text: string): Promise<number[]> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is required for embedding');

  const res = await fetch(`${GEMINI_EMBED_URL}?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content: { parts: [{ text: text.slice(0, 2000) }] },
      outputDimensionality: 768,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(`Gemini embed ${res.status}: ${err?.error?.message ?? res.statusText}`);
  }

  const data = await res.json() as any;
  return data.embedding.values as number[];
}

async function main() {
  console.log('🚀 Starting knowledge ingestion...');
  console.log(`📂 Reading from: ${KNOWLEDGE_DIR}`);
  console.log(`🤖 Embedding model: gemini-embedding-001 (768-dim)\n`);

  if (!fs.existsSync(KNOWLEDGE_DIR)) {
    console.error('❌ Knowledge directory not found:', KNOWLEDGE_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(KNOWLEDGE_DIR).filter(f => f.endsWith('.md'));
  console.log(`📄 Found ${files.length} files\n`);

  // Clear existing chunks
  const deleteResult = await db.prisma.$executeRawUnsafe('DELETE FROM knowledge_chunks');
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

        await execWithRetry(async (p) => {
          await p.$executeRawUnsafe(
            `INSERT INTO knowledge_chunks (id, content, topic, source, difficulty, "subTopic", "relatedTopics", embedding, "createdAt")
             VALUES (gen_random_uuid(), $1, $2, $3, $4::"Difficulty", $5, $6::"Topic"[], $7::vector, NOW())`,
            chunk.content,
            chunk.topic,
            chunk.source,
            chunk.difficulty,
            chunk.subTopic,
            chunk.relatedTopics.length > 0 ? chunk.relatedTopics : [],
            vectorStr
          );
        });

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
    await db.prisma.$disconnect();
    await db.pool.end();
  });
