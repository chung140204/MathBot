/**
 * Client-side PDF → PNG image converter using pdfjs-dist.
 * Uses dynamic import to avoid SSR issues (DOMMatrix not defined on server).
 */

/**
 * Convert a PDF file to an array of PNG image files (one per page).
 * @param file  The PDF File object
 * @param scale Render scale (2.0 → ~1600px width for A4, good OCR quality)
 * @returns     Array of File objects (image/png), one per page
 */
export async function pdfToImages(file: File, scale = 3.0): Promise<File[]> {
  // Dynamic import — only runs in the browser, never during SSR
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  const images: File[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error(`Cannot get 2d context for page ${i}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.render({ canvasContext: ctx as any, canvas, viewport }).promise;

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error(`Failed to convert page ${i} to blob`))),
        'image/png',
        0.92,
      );
    });

    images.push(new File([blob], `page-${i}.png`, { type: 'image/png' }));
  }

  return images;
}

/**
 * Crop a rectangular region of a page image (given as a data URL) using canvas.
 * @param dataUrl  The page image as a data URL
 * @param yStart   Fractional top of crop region (0.0 = top of image)
 * @param yEnd     Fractional bottom of crop region (1.0 = bottom of image)
 * @param padding  Extra fractional padding added on y-axis (default 2%)
 * @param xStart   Fractional left of crop region (default 0.0 = full width)
 * @param xEnd     Fractional right of crop region (default 1.0 = full width)
 * @returns        Cropped image as a PNG data URL
 */
export async function cropPageImage(
  dataUrl: string,
  yStart: number,
  yEnd: number,
  padding = 0.02,
  xStart = 0.0,
  xEnd = 1.0,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const cropTop = Math.max(0, yStart - padding) * img.height;
      const cropBottom = Math.min(1, yEnd + padding) * img.height;
      const cropHeight = cropBottom - cropTop;
      const cropLeft = Math.max(0, xStart) * img.width;
      const cropRight = Math.min(1, xEnd) * img.width;
      const cropWidth = cropRight - cropLeft;

      const canvas = document.createElement('canvas');
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Cannot get 2d context')); return; }

      ctx.drawImage(img, cropLeft, cropTop, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image for cropping'));
    img.src = dataUrl;
  });
}
