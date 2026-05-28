/**
 * OCR Pipeline Orchestrator — wires all stages together and owns SSE streaming.
 *
 * Stage 1:  Vision extraction (parallel, batched by concurrency)
 * Stage 1b: YOLO figure detection + Stage 1c figure-to-question mapping (concurrent with Stage 2)
 * Stage 2:  Text LLM structuring (parallel per section)
 */
import OpenAI from 'openai';
import { extractAllPages, type Base64Image, type VisionClients } from '@/features/ocr/lib/ocr-stage1-vision';
import { assignFiguresForPage, buildPageSectionMap } from '@/features/ocr/lib/ocr-figure-assignment';
import { runStage2 } from '@/features/ocr/lib/ocr-stage2-structure';
// QuestionPosition used transitively by imported modules

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OcrPipelineOptions {
  images: Base64Image[];
  examYear: string;
  examCode: string;
  ocrMode: 'thpt' | 'individual';
}

// ---------------------------------------------------------------------------
// Client factory
// ---------------------------------------------------------------------------

export function createClients(ocrMode: string): {
  visionClients: VisionClients;
  nvidiaVisionClient: OpenAI;
  nvidiaVisionModel: string;
  textClient: OpenAI;
  textModel: string;
} {
  const useGemini = ocrMode !== 'individual' && !!process.env.GEMINI_API_KEY;

  const primaryVisionClient = useGemini
    ? new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      })
    : new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        baseURL: process.env.NVIDIA_BASE_URL || undefined,
      });
  const primaryVisionModel = useGemini
    ? (process.env.GEMINI_VISION_MODEL || 'gemini-2.5-flash')
    : (process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct');

  const nvidiaVisionClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.NVIDIA_BASE_URL || undefined,
  });
  const nvidiaVisionModel = process.env.NVIDIA_VISION_MODEL || 'meta/llama-3.2-90b-vision-instruct';

  const textClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.NVIDIA_BASE_URL || undefined,
  });
  const textModel = process.env.NVIDIA_TEXT_MODEL || 'meta/llama-3.1-70b-instruct';

  console.log(`[OCR_API] Mode: ${ocrMode} | Stage 1 vision: ${primaryVisionModel} (${useGemini ? 'Gemini' : 'NVIDIA'})`);
  console.log(`[OCR_API] Stage 2 text: ${textModel} (NVIDIA)`);

  return {
    visionClients: {
      primary: primaryVisionClient,
      primaryModel: primaryVisionModel,
      fallback: nvidiaVisionClient,
      fallbackModel: nvidiaVisionModel,
    },
    nvidiaVisionClient,
    nvidiaVisionModel,
    textClient,
    textModel,
  };
}

// ---------------------------------------------------------------------------
// Pipeline execution
// ---------------------------------------------------------------------------

/**
 * Run the full OCR pipeline as an SSE stream.
 * Returns a ReadableStream that emits SSE events.
 */
export function runOcrPipeline(opts: OcrPipelineOptions): ReadableStream {
  const { images, examYear, examCode, ocrMode } = opts;
  const examLabel = [
    examYear ? `năm ${examYear}` : '',
    examCode ? `mã đề ${examCode}` : '',
  ].filter(Boolean).join(', ');

  const { visionClients, nvidiaVisionClient, nvidiaVisionModel, textClient, textModel } = createClients(ocrMode);
  const concurrency = Math.max(1, Math.min(8, parseInt(process.env.VISION_CONCURRENCY || '2', 10) || 2));

  const encoder = new TextEncoder();
  let cancelled = false;

  return new ReadableStream({
    cancel() {
      cancelled = true;
    },
    async start(controller) {
      const emit = (event: string, data: unknown) => {
        if (cancelled) return;
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ event, ...((typeof data === 'object' && data !== null) ? data : { data }) })}\n\n`,
            ),
          );
        } catch {
          cancelled = true;
        }
      };

      try {
        // ── STAGE 1: Extract raw text from each page ──
        emit('status', { message: `Đang đọc ${images.length} trang đề thi...` });

        const { pageTexts, pagePositionsMap, fallbackPages } = await extractAllPages(
          images,
          visionClients,
          concurrency,
          (page, positions) => emit('pagePositions', { page, positions }),
        );

        const combinedText = pageTexts.join('\n\n');
        console.log(`[OCR_API] Stage 1 complete. Total chars: ${combinedText.length}`);

        const pageSectionMap = buildPageSectionMap(pageTexts);
        console.log(`[OCR_API] pageSectionMap:`, Object.fromEntries(pageSectionMap));

        // ── STAGE 1b: YOLO figure detection (concurrent with Stage 2) ──
        const figureDetectionTasks = images.map(async (img, i) => {
          try {
            const positions = await assignFiguresForPage(img, {
              pageIndex: i,
              pageTexts,
              pagePositionsMap,
              pageSectionMap,
              fallbackPages,
              visionClient: visionClients.primary,
              visionModel: visionClients.primaryModel,
              nvidiaVisionClient,
              nvidiaVisionModel,
            });
            if (positions) {
              emit('pagePositions', { page: i + 1, positions });
            }
          } catch (err) {
            console.error(`[OCR_API] YOLO page ${i + 1} failed:`, err);
            emit('status', { message: `Cảnh báo: Phát hiện hình trang ${i + 1} thất bại` });
          }
        });

        // ── STAGE 2: Structure text → NDJSON questions ──
        emit('status', { message: 'Đang phân tích và cấu trúc câu hỏi...' });

        let questionCount = 0;
        const totalQuestions = await runStage2({
          textClient,
          textModel,
          examLabel,
          ocrMode,
          combinedText,
          onQuestion: (q) => {
            questionCount++;
            emit('question', { data: q, progress: { current: questionCount, total: 22 } });
          },
        });

        // Wait for figure detection to finish
        await Promise.allSettled(figureDetectionTasks);

        emit('complete', { totalExtracted: totalQuestions });
        if (!cancelled) controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch (error) {
        console.error('[OCR_API] Error:', error);
        emit('error', {
          message: error instanceof Error ? error.message : 'OCR extraction failed',
        });
        if (!cancelled) controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      }

      if (!cancelled) controller.close();
    },
  });
}
