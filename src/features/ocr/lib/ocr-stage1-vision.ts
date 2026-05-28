/**
 * Stage 1: Vision extraction — each page image → raw text + positions.
 * Supports Gemini (primary) with NVIDIA fallback on rate limit.
 */
import OpenAI from 'openai';
import { THPT_PAGE_EXTRACTION_PROMPT } from '@/features/ocr/lib/ocr-prompt';
import { extractPositions, fixUnicodeMath, type QuestionPosition } from '@/features/ocr/lib/ocr-text-utils';

export interface Base64Image {
  type: string;
  data: string;
}

export interface PageExtractionResult {
  page: number;
  text: string;
  positions: QuestionPosition[];
}

export interface VisionClients {
  primary: OpenAI;
  primaryModel: string;
  fallback: OpenAI;
  fallbackModel: string;
}

/**
 * Extract text from a single page image using vision API.
 * Falls back to NVIDIA if Gemini returns 429/503.
 */
export async function extractPageText(
  img: Base64Image,
  pageIndex: number,
  totalPages: number,
  clients: VisionClients,
): Promise<{ text: string; rawText: string; usedFallback: boolean }> {
  const pageMessages = [
    { role: 'system' as const, content: THPT_PAGE_EXTRACTION_PROMPT },
    {
      role: 'user' as const,
      content: [
        {
          type: 'text' as const,
          text: `This is page ${pageIndex + 1} of ${totalPages} from a Vietnamese math exam. Transcribe ALL visible Vietnamese math content from this image exactly as written. Output ONLY what you see in this specific image.\n\nREMINDER: You MUST end your output with the __positions__ JSON line as specified in the system prompt.`,
        },
        {
          type: 'image_url' as const,
          image_url: { url: `data:${img.type};base64,${img.data}` },
        },
      ],
    },
  ];

  let usedFallback = false;

  let res: Awaited<ReturnType<typeof clients.primary.chat.completions.create>>;
  try {
    res = await clients.primary.chat.completions.create({
      model: clients.primaryModel,
      messages: pageMessages,
      max_tokens: 4096,
      temperature: 0,
      stream: false,
    });
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status;
    if (status === 429 || status === 503) {
      console.warn(`[OCR_API] Page ${pageIndex + 1}: primary vision ${status}, fallback to NVIDIA`);
      usedFallback = true;
      res = await clients.fallback.chat.completions.create({
        model: clients.fallbackModel,
        messages: pageMessages,
        max_tokens: 4096,
        temperature: 0,
        stream: false,
      });
    } else {
      throw err;
    }
  }

  const rawText = res.choices[0]?.message?.content ?? '';
  const text = fixUnicodeMath(rawText);
  console.log(`[OCR_API] Page ${pageIndex + 1} extracted: ${text.length} chars`);

  // Hallucination check
  const hasVietnamese = /[àáâãèéêìíòóôõùúýăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỷỹ]/i.test(text);
  const hasLatex = text.includes('\\') || text.includes('$');
  const hasVietStructure = /Câu|PHẦN|phần/.test(text);
  if (!hasVietnamese && !hasLatex && !hasVietStructure) {
    console.warn(`[OCR_API] Page ${pageIndex + 1} WARNING: possible hallucination — no Vietnamese text detected`);
  }

  return { text, rawText, usedFallback };
}

/**
 * Extract text from all pages in batches with concurrency control.
 * Returns page texts, positions map, and which pages used fallback.
 */
export async function extractAllPages(
  images: Base64Image[],
  clients: VisionClients,
  concurrency: number,
  onPagePositions: (page: number, positions: QuestionPosition[]) => void,
): Promise<{
  pageTexts: string[];
  pagePositionsMap: Record<number, QuestionPosition[]>;
  fallbackPages: Set<number>;
}> {
  const total = images.length;
  const fallbackPages = new Set<number>();
  const pageTextResults: PromiseSettledResult<{ page: number; text: string }>[] = [];

  for (let batch = 0; batch < total; batch += concurrency) {
    const batchResults = await Promise.allSettled(
      images.slice(batch, batch + concurrency).map(async (img, j) => {
        const i = batch + j;
        const result = await extractPageText(img, i, total, clients);
        if (result.usedFallback) fallbackPages.add(i + 1);
        return { page: i + 1, text: result.text };
      }),
    );
    pageTextResults.push(...batchResults);
  }

  if (fallbackPages.size > 0) {
    console.log(`[OCR_API] Stage 1: ${fallbackPages.size}/${total} pages used NVIDIA fallback`);
  }

  // Collect successful extractions in page order; parse positions
  const pageTexts: string[] = [];
  const pagePositionsMap: Record<number, QuestionPosition[]> = {};

  for (let i = 0; i < pageTextResults.length; i++) {
    const result = pageTextResults[i];
    if (result.status === 'fulfilled') {
      const { text, positions } = extractPositions(result.value.text);
      pageTexts.push(`=== TRANG ${i + 1} ===\n${text}`);
      pagePositionsMap[i + 1] = positions;
      onPagePositions(i + 1, positions);
    } else {
      console.error(`[OCR_API] Page ${i + 1} extraction failed:`, result.reason);
      pageTexts.push(`=== TRANG ${i + 1} ===\n[Không đọc được trang này]`);
      pagePositionsMap[i + 1] = [];
      onPagePositions(i + 1, []);
    }
  }

  return { pageTexts, pagePositionsMap, fallbackPages };
}
