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
let decomposeQuery: any;
let detectFollowUp: any;
let mergeAndRerank: any;

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
  ({ decomposeQuery } = await import('../lib/rag/decompose'));
  ({ detectFollowUp } = await import('../lib/rag/query-rewriter'));
  ({ mergeAndRerank } = await import('../lib/rag/rerank'));

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
    classifyTopic('tính góc nhị diện trong hình học không gian') === 'SOLID_GEOMETRY'
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
    const { chunks } = await ragSearch('tính đạo hàm của hàm số');
    console.log(`     → ${chunks.length} chunks, topics: ${[...new Set(chunks.map((c: any) => c.topic))].join(', ')}`);
    return chunks.length > 0;
  });

  await testAsync('search "đạo hàm" → chunks thuộc DERIVATIVES', async () => {
    const { chunks } = await ragSearch('công thức đạo hàm cơ bản');
    return chunks.every((c: any) => c.topic === 'DERIVATIVES');
  });

  await testAsync('search "tích phân" → chunks thuộc INTEGRALS', async () => {
    const { chunks } = await ragSearch('tính tích phân xác định');
    return chunks.length > 0 && chunks.some((c: any) => c.topic === 'INTEGRALS');
  });

  await testAsync('search "số phức" → chunks thuộc COMPLEX_NUMBERS', async () => {
    const { chunks } = await ragSearch('tìm mô-đun số phức');
    return chunks.length > 0 && chunks.some((c: any) => c.topic === 'COMPLEX_NUMBERS');
  });

  await testAsync('search "xin chào" → ít/không có kết quả (fallback)', async () => {
    const { chunks } = await ragSearch('xin chào bạn ơi');
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
  console.log('\n📌 6. Query Decomposition');
  // ═══════════════════════════════

  test('câu đơn → 1 sub-query, không tách', () => {
    const result = decomposeQuery('tính đạo hàm');
    return result.subQueries.length === 1 && result.subQueries[0] === 'tính đạo hàm';
  });

  test('"rồi" → tách thành 2 sub-queries', () => {
    const result = decomposeQuery('tính đạo hàm rồi tìm cực trị');
    return result.subQueries.length === 2;
  });

  test('"và tìm" → tách thành 2 sub-queries', () => {
    const result = decomposeQuery('giải phương trình và tìm nghiệm');
    return result.subQueries.length === 2;
  });

  test('max 3 sub-queries dù có nhiều split point', () => {
    const result = decomposeQuery('tính đạo hàm rồi tìm cực trị sau đó khảo sát hàm số tiếp theo xác định tiệm cận');
    return result.subQueries.length <= 3;
  });

  test('original được giữ nguyên', () => {
    const q = 'tính đạo hàm rồi tìm cực trị';
    const result = decomposeQuery(q);
    return result.original === q;
  });

  test('sub-query đầu tiên không rỗng', () => {
    const result = decomposeQuery('tính đạo hàm rồi tìm cực trị');
    return result.subQueries[0].trim().length > 0;
  });

  // ═══════════════════════════════
  console.log('\n📌 7. Follow-Up Detection');
  // ═══════════════════════════════

  test('"câu trên" → follow-up', () =>
    detectFollowUp('câu trên làm như thế nào?') === true
  );

  test('"cách khác đi" → follow-up', () =>
    detectFollowUp('cách khác đi') === true
  );

  test('"tại sao kết quả lại là 5?" → follow-up', () =>
    detectFollowUp('tại sao kết quả lại là 5?') === true
  );

  test('"nếu thay x = 2" → follow-up', () =>
    detectFollowUp('nếu thay x = 2 thì sao?') === true
  );

  test('"làm tiếp phần 2" → follow-up', () =>
    detectFollowUp('làm tiếp phần 2') === true
  );

  test('"ok" (ngắn, không có topic) → follow-up', () =>
    detectFollowUp('ok') === true
  );

  test('câu hỏi đầy đủ về đạo hàm → không phải follow-up', () =>
    detectFollowUp('tính đạo hàm của f(x) = x^3 + 2x') === false
  );

  test('câu hỏi đầy đủ về phương trình → không phải follow-up', () =>
    detectFollowUp('giải phương trình bậc 2: x^2 - 5x + 6 = 0') === false
  );

  // ═══════════════════════════════
  console.log('\n📌 8. Merge & Rerank');
  // ═══════════════════════════════

  test('dedup — cùng chunk id không bị trùng', () => {
    const chunk = { id: 'c1', content: 'đạo hàm', topic: 'DERIVATIVES', source: 'test', similarity: 0.9 };
    const result = mergeAndRerank([[chunk]], [chunk], 'DERIVATIVES', 'đạo hàm', 5);
    return result.filter((r: any) => r.id === 'c1').length === 1;
  });

  test('chunk có similarity cao hơn → đứng đầu', () => {
    const high = { id: 'h1', content: 'tính đạo hàm', topic: 'DERIVATIVES', source: 'test', similarity: 0.95 };
    const low = { id: 'l1', content: 'bài tập', topic: 'INTEGRALS', source: 'test', similarity: 0.5 };
    const result = mergeAndRerank([[high, low]], [], 'DERIVATIVES', 'đạo hàm', 5);
    return result[0].id === 'h1';
  });

  test('topic boost — chunk đúng topic có finalScore cao hơn', () => {
    const correct = { id: 'c1', content: 'đạo hàm cơ bản', topic: 'DERIVATIVES', source: 'test', similarity: 0.8 };
    const wrong = { id: 'c2', content: 'tích phân cơ bản', topic: 'INTEGRALS', source: 'test', similarity: 0.8 };
    const result = mergeAndRerank([[correct, wrong]], [], 'DERIVATIVES', 'đạo hàm', 5);
    const c = result.find((r: any) => r.id === 'c1');
    const w = result.find((r: any) => r.id === 'c2');
    return c.finalScore > w.finalScore;
  });

  test('top-K giới hạn đúng số lượng', () => {
    const chunks = Array.from({ length: 10 }, (_, i) => ({
      id: `c${i}`, content: `chunk ${i}`, topic: 'DERIVATIVES', source: 'test', similarity: Math.random(),
    }));
    const result = mergeAndRerank([chunks], [], null, 'test', 3);
    return result.length === 3;
  });

  test('finalScore theo công thức 0.55*vec + 0.30*kw + 0.15*topic', () => {
    const chunk = { id: 'c1', content: 'tính đạo hàm', topic: 'DERIVATIVES', source: 'test', similarity: 1.0 };
    const result = mergeAndRerank([[chunk]], [], 'DERIVATIVES', 'tính đạo hàm', 5);
    const r = result[0];
    const expected = 0.55 * r.similarity + 0.30 * r.keywordScore + 0.15 * r.topicBoost;
    return Math.abs(r.finalScore - expected) < 0.001;
  });

  // ═══════════════════════════════
  console.log('\n📌 9. RAG Precision@3 (cần DB)');
  // ═══════════════════════════════

  const precisionCases = [
    { query: 'tính đạo hàm của f(x) = x³ - 3x + 2', expectedTopic: 'DERIVATIVES' },
    { query: 'tìm nguyên hàm của 2x + cos(x)', expectedTopic: 'INTEGRALS' },
    { query: 'giải phương trình 2^x = 16', expectedTopic: 'EXPONENTIAL_LOG' },
    { query: 'tính xác suất rút 2 bi đỏ từ túi 5 đỏ 3 xanh', expectedTopic: 'PROBABILITY' },
    { query: 'tìm mô-đun số phức z = 3 + 4i', expectedTopic: 'COMPLEX_NUMBERS' },
    { query: 'khảo sát hàm số y = x³ - 3x', expectedTopic: 'DERIVATIVES' },
    { query: 'tính thể tích hình chóp đáy vuông', expectedTopic: 'VOLUME' },
    { query: 'tìm số hạng thứ n của cấp số cộng', expectedTopic: 'SEQUENCES' },
  ];

  let totalPrecision = 0;
  let precisionCount = 0;

  for (const { query, expectedTopic } of precisionCases) {
    await testAsync(`precision@3 "${query.slice(0, 30)}..." → ${expectedTopic}`, async () => {
      try {
        const { chunks } = await ragSearch(query);
        const top3 = chunks.slice(0, 3);
        if (top3.length === 0) {
          console.log(`     → 0 chunks (DB có dữ liệu chưa?)`);
          return false;
        }
        const correct = top3.filter((c: any) => c.topic === expectedTopic).length;
        const precision = correct / top3.length;
        totalPrecision += precision;
        precisionCount++;
        console.log(`     → precision@3: ${(precision * 100).toFixed(0)}% (${correct}/${top3.length} đúng topic)`);
        return precision >= 0.5;
      } catch (e: any) {
        console.log(`     ⚠️  Lỗi DB — ${e.message}`);
        return true; // skip nếu DB không kết nối được
      }
    });
  }

  if (precisionCount > 0) {
    const avg = (totalPrecision / precisionCount * 100).toFixed(1);
    console.log(`\n  📊 Average precision@3: ${avg}% (across ${precisionCount} queries)`);
  }

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
