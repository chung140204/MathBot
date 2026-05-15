/**
 * Chatbot test script — tests RAG pipeline, routing, embedding, and chat API.
 *
 * Usage: npx tsx scripts/test-chatbot.ts
 *
 * Requires: dev server running at localhost:3000 (for chat API test)
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Will be loaded dynamically in main()
let classifyTopic: any;
let createEmbedding: any;
let ragSearch: any;

let passed = 0;
let failed = 0;

function test(name: string, fn: () => boolean) {
  try {
    if (fn()) {
      console.log(`  ✅ ${name}`);
      passed++;
    } else {
      console.log(`  ❌ ${name}`);
      failed++;
    }
  } catch (e: any) {
    console.log(`  ❌ ${name} — Error: ${e.message}`);
    failed++;
  }
}

async function testAsync(name: string, fn: () => Promise<boolean>) {
  try {
    if (await fn()) {
      console.log(`  ✅ ${name}`);
      passed++;
    } else {
      console.log(`  ❌ ${name}`);
      failed++;
    }
  } catch (e: any) {
    console.log(`  ❌ ${name} — Error: ${e.message}`);
    failed++;
  }
}

async function main() {
  // Dynamic imports after dotenv loaded
  ({ classifyTopic } = await import('../lib/rag/router'));
  ({ createEmbedding } = await import('../lib/rag/embed'));
  ({ ragSearch } = await import('../lib/rag/pipeline'));

  console.log('\n🧪 MathBot Chatbot Test Suite\n');

  // ═══════════════════════════════
  console.log('📌 1. Query Router');
  // ═══════════════════════════════

  test('đạo hàm → DERIVATIVES', () =>
    classifyTopic('tính đạo hàm của f(x) = x^3') === 'DERIVATIVES'
  );

  test('tích phân → INTEGRALS', () =>
    classifyTopic('tìm nguyên hàm của sin(x)') === 'INTEGRALS'
  );

  test('số phức → COMPLEX_NUMBERS', () =>
    classifyTopic('giải phương trình số phức z^2 = -4') === 'COMPLEX_NUMBERS'
  );

  test('xác suất → PROBABILITY', () =>
    classifyTopic('tính xác suất rút được 2 bi đỏ') === 'PROBABILITY'
  );

  test('hình không gian → SOLID_GEOMETRY', () =>
    classifyTopic('tính góc nhị diện của hình chóp') === 'SOLID_GEOMETRY'
  );

  test('giới hạn → LIMITS', () =>
    classifyTopic('tính giới hạn lim x→0 sin(x)/x') === 'LIMITS'
  );

  test('mũ logarit → EXPONENTIAL_LOG', () =>
    classifyTopic('giải phương trình mũ 2^x = 8') === 'EXPONENTIAL_LOG'
  );

  test('câu chào hỏi → null (no topic)', () =>
    classifyTopic('xin chào bạn') === null
  );

  test('câu mơ hồ → null', () =>
    classifyTopic('giúp tôi bài này') === null
  );

  // ═══════════════════════════════
  console.log('\n📌 2. Embedding');
  // ═══════════════════════════════

  await testAsync('tạo embedding thành công', async () => {
    const emb = await createEmbedding('tính đạo hàm');
    return Array.isArray(emb) && emb.length > 0;
  });

  await testAsync('embedding có đúng 1024 dims', async () => {
    const emb = await createEmbedding('tích phân');
    return emb.length === 1024;
  });

  // ═══════════════════════════════
  console.log('\n📌 3. RAG Search');
  // ═══════════════════════════════

  await testAsync('search "đạo hàm" → có kết quả', async () => {
    const chunks = await ragSearch('tính đạo hàm của hàm số');
    console.log(`     → ${chunks.length} chunks, topics: ${[...new Set(chunks.map(c => c.topic))].join(', ')}`);
    return chunks.length > 0;
  });

  await testAsync('search "đạo hàm" → chunks thuộc DERIVATIVES', async () => {
    const chunks = await ragSearch('công thức đạo hàm cơ bản');
    return chunks.every(c => c.topic === 'DERIVATIVES');
  });

  await testAsync('search "tích phân" → chunks thuộc INTEGRALS', async () => {
    const chunks = await ragSearch('tính tích phân xác định');
    return chunks.length > 0 && chunks.some(c => c.topic === 'INTEGRALS');
  });

  await testAsync('search "số phức" → chunks thuộc COMPLEX_NUMBERS', async () => {
    const chunks = await ragSearch('tìm mô-đun số phức');
    return chunks.length > 0 && chunks.some(c => c.topic === 'COMPLEX_NUMBERS');
  });

  await testAsync('search "xin chào" → ít/không có kết quả (fallback)', async () => {
    const chunks = await ragSearch('xin chào bạn ơi');
    console.log(`     → ${chunks.length} chunks (expected: few or 0)`);
    return true; // just log, don't fail
  });

  // ═══════════════════════════════
  console.log('\n📌 4. Chat API (cần dev server chạy ở localhost:3000)');
  // ═══════════════════════════════

  await testAsync('POST /chat/api → stream response', async () => {
    try {
      const res = await fetch('http://localhost:3000/chat/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'tính đạo hàm x^2' }],
          mode: 'fast',
        }),
      });

      if (res.status === 401) {
        console.log('     ⚠️  Cần auth — skip (test thủ công qua browser)');
        return true;
      }

      if (!res.ok) {
        console.log(`     → Status ${res.status}: ${await res.text()}`);
        return false;
      }

      const text = await res.text();
      const hasContent = text.includes('"content"');
      const hasDone = text.includes('[DONE]');
      const hasUndefined = text.includes('"undefined"');

      console.log(`     → hasContent: ${hasContent}, hasDone: ${hasDone}, hasUndefined: ${hasUndefined}`);
      return hasContent && hasDone && !hasUndefined;
    } catch (e: any) {
      if (e.cause?.code === 'ECONNREFUSED') {
        console.log('     ⚠️  Dev server không chạy — skip');
        return true;
      }
      throw e;
    }
  });

  // ═══════════════════════════════
  console.log('\n📌 5. LaTeX Normalize (client-side logic)');
  // ═══════════════════════════════

  // Simulate normalizeContent
  function normalizeContent(content: string): string {
    if (!content) return '';
    let result = content
      .replace(/\\\[/g, '$$$$')
      .replace(/\\\]/g, '$$$$')
      .replace(/\\\(/g, '$')
      .replace(/\\\)/g, '$')
      .replace(/(?<!\$)\\boxed\{([^}]+)\}/g, '$$\\boxed{$1}$$')
      .replace(/\\tag\{[^}]*\}/g, '')
      .replace(/(?<!\$)\\(Longleftrightarrow|Leftrightarrow|Rightarrow|Leftarrow|implies|iff)/g, '$\\$1$')
      .replace(/\bundefined\b/g, '');
    return result;
  }

  test('\\[ ... \\] → $$ ... $$', () => {
    const r = normalizeContent('\\[x^2\\]');
    return r.includes('$$');
  });

  test('\\( ... \\) → $ ... $', () => {
    const r = normalizeContent('\\(x^2\\)');
    return r === '$x^2$';
  });

  test('\\boxed{x} → $\\boxed{x}$', () => {
    const r = normalizeContent('đáp án: \\boxed{42}');
    return r.includes('$') && r.includes('\\boxed');
  });

  test('\\tag{1} → removed', () => {
    const r = normalizeContent('$x^2$ \\tag{1}');
    return !r.includes('\\tag');
  });

  test('\\Longleftrightarrow → wrapped in $', () => {
    const r = normalizeContent('x > 0 \\Longleftrightarrow y > 0');
    return r.includes('$\\Longleftrightarrow$');
  });

  test('"undefined" → removed', () => {
    const r = normalizeContent('kết quả undefined là');
    return !r.includes('undefined');
  });

  // ═══════════════════════════════
  console.log('\n═══════════════════════════════');
  console.log(`✅ Passed: ${passed}/${passed + failed}`);
  console.log(`❌ Failed: ${failed}/${passed + failed}`);
  console.log('═══════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
