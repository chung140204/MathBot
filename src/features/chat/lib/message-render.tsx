'use client';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

function wrapRawLatexInLine(line: string): string {
  const match = line.match(/^(.*?)(\\(?:frac|sqrt|int|sum|prod|lim|sin|cos|tan|log|ln|partial)\{.*)$/);
  if (!match) return line;
  const before = match[1];
  const mathAndAfter = match[2];
  const boundary = mathAndAfter.match(/^(.*?)([.,;:!?])(\s+[A-Za-zÀ-ỹ].*)$/);
  if (boundary) return before + '$' + boundary[1] + '$' + boundary[2] + boundary[3];
  const trailing = mathAndAfter.match(/^(.*?)([.,;:!?]?)(\s*)$/);
  if (trailing && trailing[1]) return before + '$' + trailing[1] + '$' + trailing[2] + trailing[3];
  return before + '$' + mathAndAfter + '$';
}

function balanceSingleDollars(line: string): string {
  const PH = '\x00\x00';
  const temp = line.replace(/\$\$/g, PH);
  const singleCount = (temp.match(/\$/g) || []).length;
  if (singleCount % 2 === 0) return line;
  const lastDollar = line.lastIndexOf('$');
  if (lastDollar === -1) return line;
  if (lastDollar > 0 && line[lastDollar - 1] === '$') return line;
  if (lastDollar < line.length - 1 && line[lastDollar + 1] === '$') return line;
  const afterDollar = line.slice(lastDollar + 1);
  const boundary = afterDollar.match(/^(.*?)([.,;:!?])(\s+[A-Za-zÀ-ỹ].*)$/);
  if (boundary) {
    const closePos = lastDollar + 1 + boundary[1].length;
    return line.slice(0, closePos) + '$' + line.slice(closePos);
  }
  const trailing = afterDollar.match(/^(.*?)([.,;:!?]?)(\s*)$/);
  if (trailing && trailing[1].length > 0) {
    const closePos = lastDollar + 1 + trailing[1].length;
    return line.slice(0, closePos) + '$' + line.slice(closePos);
  }
  return line + '$';
}

export function normalizeContent(content: string): string {
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
  result = result.split('\n').map(line => {
    if (!line.includes('$') && /\\(?:frac|sqrt|int|sum|prod|lim|sin|cos|tan|log|ln)\{/.test(line)) {
      line = wrapRawLatexInLine(line);
    }
    return balanceSingleDollars(line);
  }).join('\n');
  const doubleDollarCount = (result.match(/\$\$/g) || []).length;
  if (doubleDollarCount % 2 === 1) result += '\n$$';
  return result;
}

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

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const imageMatch = content.match(/^!\[.*?\]\((data:image\/[^)]+)\)\n\n?/);
  const imageSrc = imageMatch ? imageMatch[1] : null;
  const textContent = imageMatch ? content.slice(imageMatch[0].length) : content;
  return (
    <div className="markdown">
      {imageSrc && <ImageWithLightbox src={imageSrc} />}
      {textContent && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
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
          {normalizeContent(textContent)}
        </ReactMarkdown>
      )}
    </div>
  );
};
