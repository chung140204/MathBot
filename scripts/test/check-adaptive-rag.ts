import 'dotenv/config';
import { detectFollowUp } from '../../src/features/knowledge/lib/rag/query-rewriter';
import { classifyDifficultyKeywords, classifyTopic } from '../../src/features/knowledge/lib/rag/router';

/**
 * Offline, deterministic test cases for the ADAPTIVE RAG routing signals
 * (no network / no DB — only the pure regex/keyword classifiers).
 *
 * These pin down the decisions that drive ragSearch():
 *   - detectFollowUp        → whether rewriteQuery (LLM) runs
 *   - classifyDifficultyKeywords === 'ADVANCED' → whether HyDE escalation runs
 *   - classifyTopic         → topic filter on the cheap default path
 *
 * Run: npx tsx scripts/test/check-adaptive-rag.ts
 */

let passed = 0;
let failed = 0;

function assertEq(label: string, actual: unknown, expected: unknown): void {
  const ok = actual === expected;
  if (ok) {
    passed++;
    console.log(`  ✅ ${label}`);
  } else {
    failed++;
    console.log(`  ❌ ${label}\n       expected: ${JSON.stringify(expected)}\n       actual:   ${JSON.stringify(actual)}`);
  }
}

// ── 1. detectFollowUp → triggers query rewrite (escalation) ────────────
console.log('\n[detectFollowUp] follow-ups (should escalate → rewrite):');
assertEq('"Giải thích thêm bước vừa rồi"', detectFollowUp('Giải thích thêm bước vừa rồi'), true);
assertEq('"Câu trên giải sao ạ"', detectFollowUp('Câu trên giải sao ạ'), true);
assertEq('"Còn cách khác không"', detectFollowUp('Còn cách khác không'), true);
assertEq('"Với m = 2 thì sao"', detectFollowUp('Với m = 2 thì sao'), true);
assertEq('"Tại sao lại ra kết quả đó"', detectFollowUp('Tại sao lại ra kết quả đó'), true);
assertEq('short null-topic "thế còn sao?"', detectFollowUp('thế còn sao?'), true);

console.log('\n[detectFollowUp] standalone questions (cheap default path, NO rewrite):');
assertEq('"Tính đạo hàm của hàm số y = x^3 - 3x^2 + 2"', detectFollowUp('Tính đạo hàm của hàm số y = x^3 - 3x^2 + 2'), false);
assertEq('"Tính tích phân từ 0 đến 1 của x^2 dx"', detectFollowUp('Tính tích phân từ 0 đến 1 của x^2 dx'), false);
assertEq('"Số phức z thỏa mãn |z - 1| = 2"', detectFollowUp('Số phức z thỏa mãn |z - 1| = 2'), false);

// ── 2. classifyDifficultyKeywords → triggers HyDE escalation (VDC) ─────
console.log('\n[classifyDifficultyKeywords] VDC/ADVANCED (should escalate → HyDE+decompose):');
assertEq('"Tìm tất cả giá trị của tham số m để hàm số đồng biến"', classifyDifficultyKeywords('Tìm tất cả giá trị của tham số m để hàm số đồng biến'), 'ADVANCED');
assertEq('"Có bao nhiêu giá trị nguyên của m"', classifyDifficultyKeywords('Có bao nhiêu giá trị nguyên của m'), 'ADVANCED');
assertEq('"Cho hàm hợp f(g(x)), tìm số điểm cực trị"', classifyDifficultyKeywords('Cho hàm hợp f(g(x)), tìm số điểm cực trị'), 'ADVANCED');
assertEq('"Đồ thị f\'(x) như hình vẽ"', classifyDifficultyKeywords("Đồ thị f'(x) như hình vẽ"), 'ADVANCED');

console.log('\n[classifyDifficultyKeywords] normal difficulty (no forced HyDE):');
assertEq('"Tính đạo hàm của y = x^3"', classifyDifficultyKeywords('Tính đạo hàm của y = x^3'), null);
assertEq('"Tính tích phân từ 0 đến 1 của x^2 dx"', classifyDifficultyKeywords('Tính tích phân từ 0 đến 1 của x^2 dx'), null);

// ── 3. classifyTopic → topic filter on the cheap default path ──────────
console.log('\n[classifyTopic] topic detection (strong keywords win):');
assertEq('tích phân → INTEGRALS', classifyTopic('Tính tích phân từ 0 đến 1 của x^2 dx'), 'INTEGRALS');
assertEq('số phức → COMPLEX_NUMBERS', classifyTopic('Số phức z thỏa mãn |z - 1| = 2, tìm tập hợp điểm'), 'COMPLEX_NUMBERS');
assertEq('xác suất → PROBABILITY', classifyTopic('Tính xác suất để lấy được 2 bi đỏ'), 'PROBABILITY');
assertEq('logarit → EXPONENTIAL_LOG', classifyTopic('Giải phương trình logarit cơ số 2'), 'EXPONENTIAL_LOG');
assertEq('no math keyword → null', classifyTopic('xin chào bạn'), null);

// ── 4. Derived routing decision (mirrors ragSearch escalation logic) ───
// route: follow-up ⇒ LLM rewrite+classify; otherwise cheap sync path.
// hydeForced: VDC always forces HyDE (the low-confidence fallback is runtime-only).
console.log('\n[routing] derived decision table:');
function route(q: string) {
  const followUp = detectFollowUp(q);
  const vdc = classifyDifficultyKeywords(q) === 'ADVANCED';
  return { path: followUp ? 'escalate:rewrite' : 'cheap-sync', hydeForced: vdc };
}
const r1 = route('Tính đạo hàm của y = x^3 - 3x^2 + 2');
assertEq('easy standalone → cheap-sync', r1.path, 'cheap-sync');
assertEq('easy standalone → no forced HyDE', r1.hydeForced, false);

const r2 = route('Tìm tất cả giá trị của tham số m để hàm số có 3 cực trị');
assertEq('VDC standalone → cheap-sync path', r2.path, 'cheap-sync');
assertEq('VDC standalone → HyDE forced', r2.hydeForced, true);

const r3 = route('Giải thích thêm bước vừa rồi');
assertEq('follow-up → escalate:rewrite', r3.path, 'escalate:rewrite');

// ── Summary ────────────────────────────────────────────────────────────
console.log(`\n──────────────────────────────\nPASS ${passed} / ${passed + failed}`);
if (failed > 0) {
  console.error(`FAILED ${failed} test case(s)`);
  process.exit(1);
}
console.log('All adaptive-RAG routing test cases passed ✅');
process.exit(0);
