/**
 * Stage 1c: Dedicated vision call for figure/table → questionLabel mapping.
 * Uses the vision model to identify which question each figure/table belongs to.
 */
import OpenAI from 'openai';
import { THPT_FIGURE_DETECTION_PROMPT } from '@/features/ocr/lib/ocr-prompt';

export interface Stage1cFigure {
  type: 'figure' | 'table';
  questionLabel: string;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
}

/**
 * Call vision model to identify figure/table ownership on a page.
 * Falls back to NVIDIA if primary model returns 429/503.
 */
export async function callStage1cFigureDetection(
  imgData: string,
  imgType: string,
  visionClient: OpenAI,
  visionModel: string,
  fallbackClient: OpenAI,
  fallbackModel: string,
): Promise<Stage1cFigure[]> {
  const messages = [
    {
      role: 'user' as const,
      content: [
        { type: 'text' as const, text: THPT_FIGURE_DETECTION_PROMPT },
        { type: 'image_url' as const, image_url: { url: `data:${imgType};base64,${imgData}` } },
      ],
    },
  ];

  let text = '';
  try {
    const res = await visionClient.chat.completions.create({
      model: visionModel, messages, max_tokens: 2048, temperature: 0, stream: false,
    });
    text = res.choices[0]?.message?.content ?? '';
  } catch (err: unknown) {
    const status = (err as { status?: number })?.status;
    if (status === 429 || status === 503) {
      const res = await fallbackClient.chat.completions.create({
        model: fallbackModel, messages, max_tokens: 2048, temperature: 0, stream: false,
      });
      text = res.choices[0]?.message?.content ?? '';
    } else {
      throw err;
    }
  }

  // Parse JSON array — strip markdown fences the model may wrap around output
  const clean = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const startIdx = clean.indexOf('[');
  let endIdx = clean.lastIndexOf(']');

  // Salvage truncated JSON: if we have '[' but no ']', the response was likely cut off.
  // Try appending ']' after the last complete object (ending with '}').
  if (startIdx >= 0 && (endIdx < 0 || endIdx <= startIdx)) {
    const lastBrace = clean.lastIndexOf('}');
    if (lastBrace > startIdx) {
      const salvaged = clean.slice(startIdx, lastBrace + 1) + ']';
      try {
        const arr = JSON.parse(salvaged);
        if (Array.isArray(arr) && arr.length > 0) {
          console.log(`[OCR_API] Stage 1c: salvaged truncated JSON → ${arr.length} entries`);
          return parseStage1cResults(arr);
        }
      } catch { /* salvage failed, fall through */ }
    }
    if (clean.length > 0) console.warn('[OCR_API] Stage 1c: no JSON array found in response:', clean.slice(0, 200));
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let arr: any[];
  try {
    arr = JSON.parse(clean.slice(startIdx, endIdx + 1));
  } catch (parseErr) {
    console.warn('[OCR_API] Stage 1c: JSON parse failed:', parseErr, clean.slice(startIdx, Math.min(endIdx + 1, startIdx + 200)));
    return [];
  }

  return parseStage1cResults(Array.isArray(arr) ? arr : []);
}

/**
 * Parse and validate Stage 1c results into typed figures.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseStage1cResults(arr: any[]): Stage1cFigure[] {
  return arr
    .filter((r) => r.questionLabel && (r.type === 'figure' || r.type === 'table'))
    .map((r) => ({
      type: r.type as 'figure' | 'table',
      questionLabel: String(r.questionLabel),
      xStart: Math.max(0, Math.min(1, r.xStart ?? 0)),
      yStart: Math.max(0, Math.min(1, r.yStart ?? 0)),
      xEnd: Math.max(0, Math.min(1, r.xEnd ?? 1)),
      yEnd: Math.max(0, Math.min(1, r.yEnd ?? 1)),
    }));
}
