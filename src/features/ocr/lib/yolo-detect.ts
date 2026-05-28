/**
 * DocLayout-YOLO figure/table detection using ONNX Runtime (Node.js).
 *
 * Model: DocLayout-YOLO (YOLOv10-based), pre-trained on DocStructBench.
 * Expected model path: <project-root>/models/best.onnx
 *   → override with env var YOLO_MODEL_PATH
 *
 * Input tensor:  [1, 3, 1024, 1024] float32  (RGB, values 0.0–1.0)
 * Output tensor: [1, 300, 6] float32  (NMS-free, each row: x1,y1,x2,y2,score,classId)
 *
 * DocStructBench classes:
 *   0: title  1: text  2: abandon  3: figure  4: figure_caption
 *   5: table  6: table_caption  7: table_footnote  8: isolate_formula  9: formula_caption
 *
 * We only keep: figure (3) and table (5).
 */

import * as ort from 'onnxruntime-node';
import sharp from 'sharp';
import path from 'path';

const MODEL_INPUT_SIZE = 1024;
const CONF_THRESHOLD   = 0.45;

// All DocStructBench classes — order must match model training
const ALL_CLASSES = [
  'title', 'plain text', 'abandon', 'figure', 'figure_caption',
  'table', 'table_caption', 'table_footnote', 'isolate_formula', 'formula_caption',
] as const;

// Only emit detections for these classes
const DETECT_TYPES = new Set<string>(['figure', 'table']);

type DetectionClass = 'figure' | 'table';

export interface FigureDetection {
  type:       DetectionClass;
  xStart:     number;  // fraction [0, 1]
  yStart:     number;
  xEnd:       number;
  yEnd:       number;
  confidence: number;
}

// Singleton session — loaded once per process
let _session: ort.InferenceSession | null = null;

async function getSession(): Promise<ort.InferenceSession> {
  if (!_session) {
    const modelPath = process.env.YOLO_MODEL_PATH
      ? path.resolve(process.env.YOLO_MODEL_PATH)
      : path.join(process.cwd(), 'models', 'best.onnx');
    _session = await ort.InferenceSession.create(modelPath, {
      executionProviders: ['cpu'],
    });
  }
  return _session;
}

interface LetterboxResult {
  pixels: Float32Array;
  padLeft: number;
  padTop: number;
  scaledWidth: number;
  scaledHeight: number;
}

/**
 * Decode image buffer, letterbox-resize to model input size (preserve aspect
 * ratio, pad with gray), and return CHW float32 array + letterbox metadata.
 */
async function preprocessImage(imageBuffer: Buffer): Promise<LetterboxResult> {
  const meta = await sharp(imageBuffer).metadata();
  const origW = meta.width!;
  const origH = meta.height!;

  const scale   = Math.min(MODEL_INPUT_SIZE / origW, MODEL_INPUT_SIZE / origH);
  const scaledW = Math.round(origW * scale);
  const scaledH = Math.round(origH * scale);
  const padLeft = Math.round((MODEL_INPUT_SIZE - scaledW) / 2);
  const padTop  = Math.round((MODEL_INPUT_SIZE - scaledH) / 2);

  const { data } = await sharp(imageBuffer)
    .resize(MODEL_INPUT_SIZE, MODEL_INPUT_SIZE, {
      fit: 'contain',
      background: { r: 114, g: 114, b: 114 },
    })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const stride  = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;
  const float32 = new Float32Array(3 * stride);
  for (let i = 0; i < stride; i++) {
    float32[i]              = data[i * 3]     / 255; // R
    float32[stride     + i] = data[i * 3 + 1] / 255; // G
    float32[stride * 2 + i] = data[i * 3 + 2] / 255; // B
  }
  return { pixels: float32, padLeft, padTop, scaledWidth: scaledW, scaledHeight: scaledH };
}

/**
 * Run DocLayout-YOLO inference on a base64-encoded page image.
 * Returns detected figures/tables as fractional bounding boxes.
 *
 * @param imageBase64 - Raw base64 string (no data-URL prefix)
 */
export async function detectFigures(imageBase64: string): Promise<FigureDetection[]> {
  const sess   = await getSession();
  const buffer = Buffer.from(imageBase64, 'base64');
  const { pixels, padLeft, padTop, scaledWidth, scaledHeight } = await preprocessImage(buffer);

  const inputTensor = new ort.Tensor('float32', pixels, [1, 3, MODEL_INPUT_SIZE, MODEL_INPUT_SIZE]);
  const feeds: Record<string, ort.Tensor> = {};
  feeds[sess.inputNames[0]] = inputTensor;

  const results = await sess.run(feeds);
  const output  = results[sess.outputNames[0]];
  const data    = output.data as Float32Array;

  // YOLOv10 output: [1, maxDet, 6] — each row: [x1, y1, x2, y2, score, classId]
  // NMS-free: detections are already filtered and sorted by the model.
  const maxDet  = output.dims[1];
  const detections: FigureDetection[] = [];

  for (let d = 0; d < maxDet; d++) {
    const offset  = d * 6;
    const x1      = data[offset];
    const y1      = data[offset + 1];
    const x2      = data[offset + 2];
    const y2      = data[offset + 3];
    const score   = data[offset + 4];
    const classId = Math.round(data[offset + 5]);

    if (score < CONF_THRESHOLD) continue;

    const className = ALL_CLASSES[classId];
    if (!className || !DETECT_TYPES.has(className)) continue;

    // Map from letterbox pixel coords → original image fractions
    detections.push({
      type:       (className === 'table' ? 'table' : 'figure') as DetectionClass,
      xStart:     Math.max(0, Math.min(1, (x1 - padLeft) / scaledWidth)),
      yStart:     Math.max(0, Math.min(1, (y1 - padTop)  / scaledHeight)),
      xEnd:       Math.max(0, Math.min(1, (x2 - padLeft) / scaledWidth)),
      yEnd:       Math.max(0, Math.min(1, (y2 - padTop)  / scaledHeight)),
      confidence: score,
    });
  }

  return detections;
}
