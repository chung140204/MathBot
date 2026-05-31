'use client';
import { useState, useMemo, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { normalizeContent } from '@/features/chat/lib/latex-normalize';

export { normalizeContent };

export function ImageWithLightbox({ src }: { src: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="my-4 cursor-pointer group" onClick={() => setOpen(true)}>
        <img src={src} className="max-w-full md:max-w-md rounded-xl border border-gray-200 shadow-sm object-contain max-h-96 transition-transform group-hover:scale-[1.02]" alt="Chat image" />
        <p className="text-[10px] text-gray-400 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click để phóng to</p>
      </div>
      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out" onClick={() => setOpen(false)}>
          <img src={src} className="max-w-full max-h-full object-contain rounded-lg" alt="Zoomed image" />
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white text-xl transition-colors">×</button>
        </div>
      )}
    </>
  );
}

export const MarkdownRenderer = memo(({ content, isStreaming = false }: { content: string; isStreaming?: boolean }) => {
  const imageMatch = content.match(/^!\[.*?\]\((data:image\/[^)]+)\)\n\n?/);
  const imageSrc = imageMatch ? imageMatch[1] : null;
  const textContent = imageMatch ? content.slice(imageMatch[0].length) : content;

  // Heavy multi-pass LaTeX normalization, memoized so committed (non-streaming)
  // bubbles don't re-run it on unrelated re-renders. Skipped while streaming.
  const normalized = useMemo(
    () => (isStreaming ? '' : normalizeContent(textContent)),
    [textContent, isStreaming],
  );

  return (
    <div className="markdown">
      {imageSrc && <ImageWithLightbox src={imageSrc} />}
      {textContent && (
        isStreaming ? (
          // While streaming, render raw text only — skip the normalize + KaTeX
          // parse that would otherwise re-run over the WHOLE message on every
          // token batch (the main cause of jank on long answers). Math shows raw
          // ($...$) mid-stream and snaps to rendered once the message completes.
          <div className="whitespace-pre-wrap break-words">{textContent}</div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[[rehypeKatex, { throwOnError: false, errorColor: '#dc2626' }]]}
            components={{
              img: ({ node, ...props }) => {
                if (!props.src) return null;
                return (
                  <div className="my-4">
                    <img {...props} className="max-w-full md:max-w-md rounded-xl border border-gray-200 shadow-sm object-contain max-h-96" alt={props.alt || 'Chat image'} />
                  </div>
                );
              },
            }}
          >
            {normalized}
          </ReactMarkdown>
        )
      )}
    </div>
  );
});
MarkdownRenderer.displayName = 'MarkdownRenderer';
