/**
 * Stage 2: Text LLM structuring — raw text → structured NDJSON questions.
 * Each call processes one section or chunk and streams questions via callback.
 */
import OpenAI from 'openai';
import { THPT_OCR_SYSTEM_PROMPT, INDIVIDUAL_OCR_SYSTEM_PROMPT } from '@/features/ocr/lib/ocr-prompt';
import { fixLatexEscapes, applyLatexDelimiters, splitBySection } from '@/features/ocr/lib/ocr-text-utils';

/**
 * Strip orphaned continuation text before the first "Câu X" in a section.
 * Specific to Stage 2 — prevents LLM confusion from partial page content.
 */
function stripContinuation(sectionText: string): string {
  const firstCau = sectionText.search(/Câu\s+\d+/i);
  if (firstCau > 50) {
    console.log(`[OCR_API] Stage 2: stripped ${firstCau} chars of continuation text`);
    return sectionText.slice(firstCau);
  }
  return sectionText;
}

/**
 * Call Stage 2 for a specific section (PHẦN I / II / III).
 * Calls onQuestion immediately when each question is parsed from the stream.
 */
export async function callStage2Section(
  sectionText: string,
  sectionLabel: string,
  textClient: OpenAI,
  textModel: string,
  examLabel: string,
  onQuestion: (q: Record<string, unknown>) => void,
  useIndividualPrompt = false,
): Promise<void> {
  if (!sectionText.trim()) return;

  const sectionInstruction = sectionLabel
    ? `Chỉ xuất câu hỏi thuộc ${sectionLabel}.`
    : [
        'Text KHÔNG có header PHẦN I/II/III. Tự xác định format theo DẤU HIỆU NHẬN BIẾT:',
        '',
        'MULTIPLE_CHOICE (PHẦN I, questionNumber = số câu):',
        '  ✓ Có đúng 4 lựa chọn bắt đầu bằng A. B. C. D.',
        '  ✓ Mỗi lựa chọn là một đáp án hoàn chỉnh (số, biểu thức, hoặc mệnh đề)',
        '',
        'TRUE_FALSE (PHẦN II, questionNumber = số câu + 12):',
        '  ✓ Có đúng 4 mệnh đề/phát biểu bắt đầu bằng a) b) c) d)',
        '  ✓ Yêu cầu xét đúng/sai cho từng mệnh đề',
        '  ✓ Thường có "Xét tính đúng sai", "các phát biểu sau"',
        '',
        'SHORT_ANSWER (PHẦN III, questionNumber = số câu + 16):',
        '  ✓ KHÔNG có lựa chọn A/B/C/D, KHÔNG có mệnh đề a/b/c/d',
        '  ✓ Đáp án là một CON SỐ cụ thể',
        '  ✓ Dấu hiệu: "Tính...", "Tìm...", "bằng bao nhiêu", "(đơn vị ...)", "kết quả làm tròn đến..."',
        '  ✓ Ví dụ: "Tính tổng chi phí (đơn vị triệu đồng)" → SHORT_ANSWER',
      ].join('\n');

  const userContent = [
    examLabel ? `Đề thi THPT ${examLabel}.` : '',
    sectionInstruction,
    '',
    `Nội dung đề thi:\n${sectionText}`,
  ].filter(Boolean).join('\n');

  const response = await textClient.chat.completions.create({
    model: textModel,
    messages: [
      { role: 'system', content: useIndividualPrompt ? INDIVIDUAL_OCR_SYSTEM_PROMPT : THPT_OCR_SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
    max_tokens: 8192,
    temperature: 0.1,
    stream: true,
  });

  let buffer = '';
  let lineCount = 0;
  let parsedCount = 0;

  const tryParseLine = (line: string) => {
    if (!line) return;
    lineCount++;
    try {
      const fixed = fixLatexEscapes(line);
      const q = JSON.parse(fixed);
      if (q.questionNumber && q.format) {
        parsedCount++;
        onQuestion(applyLatexDelimiters(q));
      } else {
        console.warn(`[OCR_API] Stage 2 ${sectionLabel}: JSON valid but missing questionNumber/format:`, JSON.stringify(q).slice(0, 200));
      }
    } catch (err) {
      // Log non-trivial lines that failed parsing (skip markdown fences, empty-ish lines)
      if (line.length > 5 && !line.startsWith('```')) {
        console.warn(`[OCR_API] Stage 2 ${sectionLabel}: parse failed (line ${lineCount}): "${line.slice(0, 300)}"`, (err as Error).message);
      }
    }
  };

  try {
    for await (const chunk of response) {
      const content = chunk.choices[0]?.delta?.content;
      if (!content) continue;
      buffer += content;

      while (buffer.includes('\n')) {
        const newlineIdx = buffer.indexOf('\n');
        const line = buffer.slice(0, newlineIdx).trim();
        buffer = buffer.slice(newlineIdx + 1);
        tryParseLine(line);
      }
    }
  } catch (streamErr) {
    console.error(`[OCR_API] Stage 2 ${sectionLabel}: stream error:`, streamErr);
  }

  // Flush remaining buffer
  if (buffer.trim()) {
    tryParseLine(buffer.trim());
  }

  if (parsedCount === 0 && lineCount > 0) {
    console.error(`[OCR_API] Stage 2 ${sectionLabel}: ⚠️ 0 questions parsed from ${lineCount} lines. Full buffer dump (first 500 chars of input text):`, sectionText.slice(0, 500));
  }
}

// ---------------------------------------------------------------------------
// Stage 2 orchestration — split text into chunks and run in parallel
// ---------------------------------------------------------------------------

export interface Stage2Options {
  textClient: OpenAI;
  textModel: string;
  examLabel: string;
  ocrMode: string;
  combinedText: string;
  onQuestion: (q: Record<string, unknown>) => void;
}

/**
 * Run Stage 2: split combined text into sections/chunks and process in parallel.
 * Returns total number of questions emitted.
 */
export async function runStage2(opts: Stage2Options): Promise<number> {
  const { textClient, textModel, examLabel, ocrMode, combinedText, onQuestion } = opts;

  let questionCount = 0;
  const wrappedOnQuestion = (q: Record<string, unknown>) => {
    questionCount++;
    onQuestion(q);
  };

  const useIndividual = ocrMode === 'individual';

  if (useIndividual) {
    // Individual mode: split by page first, then split each page into small chunks.
    const pages = combinedText.split(/(?==== TRANG \d+)/).filter(p => p.trim().length > 20);
    const INDIVIDUAL_CHUNK_SIZE = 3;
    const allChunks: string[] = [];

    for (const page of pages) {
      const parts = page.split(/(?=^Câu\s+\d+[\s:.])/im).filter(p => p.trim().length > 10);
      if (parts.length <= INDIVIDUAL_CHUNK_SIZE) {
        allChunks.push(page);
      } else {
        for (let i = 0; i < parts.length; i += INDIVIDUAL_CHUNK_SIZE) {
          allChunks.push(parts.slice(i, i + INDIVIDUAL_CHUNK_SIZE).join('\n'));
        }
      }
    }

    console.log(`[OCR_API] Stage 2: individual mode, ${pages.length} pages → ${allChunks.length} chunks`);
    await Promise.allSettled(
      allChunks.map(chunk => callStage2Section(chunk, '', textClient, textModel, examLabel, wrappedOnQuestion, true))
    );
  } else {
    const hasPhan1 = /PHẦN\s+I(?!I)/i.test(combinedText);
    const hasPhan2 = /PHẦN\s+II(?!I)/i.test(combinedText);
    const hasPhan3 = /PHẦN\s+III/i.test(combinedText);
    const hasAnySections = hasPhan1 || hasPhan2 || hasPhan3;
    const { phan1, phan2, phan3 } = splitBySection(combinedText);

    let phan1Label = 'PHẦN I';
    if (!hasPhan1) {
      if (hasPhan2) phan1Label = 'PHẦN I';
      else if (hasPhan3) phan1Label = 'PHẦN II';
    }

    console.log(`[OCR_API] Stage 2 (${textModel}): ${phan1Label}=${phan1.length}ch, PHẦN II=${phan2.length}ch, PHẦN III=${phan3.length}ch, sections=${[hasPhan1 && 'I', hasPhan2 && 'II', hasPhan3 && 'III'].filter(Boolean).join('+') || 'none'}`);

    if (hasAnySections) {
      const PHAN1_CHUNK_SIZE = 6;
      const splitPhan1 = (text: string, label: string) => {
        const stripped = stripContinuation(text);
        if (!stripped.trim()) return [];
        const parts = stripped.split(/(?=^Câu\s+\d+[\.\s])/im).filter(p => p.trim().length > 10);
        if (parts.length <= PHAN1_CHUNK_SIZE) return [{ text: stripped, label }];
        const chunks: { text: string; label: string }[] = [];
        for (let i = 0; i < parts.length; i += PHAN1_CHUNK_SIZE) {
          chunks.push({ text: parts.slice(i, i + PHAN1_CHUNK_SIZE).join('\n'), label });
        }
        return chunks;
      };

      const allChunks = [
        ...splitPhan1(phan1, phan1Label),
        { text: stripContinuation(phan2), label: 'PHẦN II' },
        { text: stripContinuation(phan3), label: 'PHẦN III' },
      ].filter(c => c.text.trim().length > 10);

      console.log(`[OCR_API] Stage 2: THPT mode, ${allChunks.length} chunks (PHẦN I split by ${PHAN1_CHUNK_SIZE}, II+III whole)`);
      await Promise.allSettled(
        allChunks.map(c => callStage2Section(c.text, c.label, textClient, textModel, examLabel, wrappedOnQuestion))
      );
    } else {
      console.log(`[OCR_API] Stage 2: no PHẦN headers detected, using auto-detect mode`);
      await callStage2Section(combinedText, '', textClient, textModel, examLabel, wrappedOnQuestion);
    }
  }

  console.log(`[OCR_API] Stage 2 complete: ${questionCount} questions emitted`);
  return questionCount;
}
