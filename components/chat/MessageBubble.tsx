'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface SourceItem {
  source: string;
  topic: string;
  similarity: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceItem[];
  feedback?: 'up' | 'down' | null;
  id?: string;
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onEdit?: (newContent: string) => void;
  onFeedback?: (feedback: 'up' | 'down') => void;
}

/**
 * Wraps raw LaTeX commands (not inside $...$) found on a line.
 * Example: "Vậy \frac{du}{dx} = 2x." → "Vậy $\frac{du}{dx} = 2x$."
 */
function wrapRawLatexInLine(line: string): string {
  const match = line.match(/^(.*?)(\\(?:frac|sqrt|int|sum|prod|lim|sin|cos|tan|log|ln|partial)\{.*)$/);
  if (!match) return line;

  const before = match[1];
  const mathAndAfter = match[2];

  // Find text boundary: punctuation + space + letter (Vietnamese/English)
  const boundary = mathAndAfter.match(/^(.*?)([.,;:!?])(\s+[A-Za-zÀ-ỹ].*)$/);
  if (boundary) {
    return before + '$' + boundary[1] + '$' + boundary[2] + boundary[3];
  }

  // No text after → wrap to end, keep trailing punctuation outside $
  const trailing = mathAndAfter.match(/^(.*?)([.,;:!?]?)(\s*)$/);
  if (trailing && trailing[1]) {
    return before + '$' + trailing[1] + '$' + trailing[2] + trailing[3];
  }

  return before + '$' + mathAndAfter + '$';
}

/**
 * Fixes lines with an unclosed $ delimiter.
 * Inserts closing $ at the best boundary (before punctuation+text, or end of math).
 */
function balanceSingleDollars(line: string): string {
  // Replace $$ with placeholder to count only single $
  const PH = '\x00\x00';
  const temp = line.replace(/\$\$/g, PH);
  const singleCount = (temp.match(/\$/g) || []).length;
  if (singleCount % 2 === 0) return line; // already balanced

  // Find the last unmatched $ in the original line
  const lastDollar = line.lastIndexOf('$');
  if (lastDollar === -1) return line;
  // Make sure it's not part of $$
  if (lastDollar > 0 && line[lastDollar - 1] === '$') return line;
  if (lastDollar < line.length - 1 && line[lastDollar + 1] === '$') return line;

  const afterDollar = line.slice(lastDollar + 1);

  // Try to close at punctuation + text boundary
  const boundary = afterDollar.match(/^(.*?)([.,;:!?])(\s+[A-Za-zÀ-ỹ].*)$/);
  if (boundary) {
    const closePos = lastDollar + 1 + boundary[1].length;
    return line.slice(0, closePos) + '$' + line.slice(closePos);
  }

  // Fallback: close before trailing punctuation
  const trailing = afterDollar.match(/^(.*?)([.,;:!?]?)(\s*)$/);
  if (trailing && trailing[1].length > 0) {
    const closePos = lastDollar + 1 + trailing[1].length;
    return line.slice(0, closePos) + '$' + line.slice(closePos);
  }

  return line + '$';
}

/**
 * Normalizes common LaTeX delimiters used by various LLMs
 * to standard markdown-math ($...$ and $$...$$).
 * Handles unclosed delimiters, raw LaTeX commands, and edge cases.
 */
function normalizeContent(content: string): string {
  if (!content) return '';

  let result = content
    // Step 1: Normalize display math delimiters
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
    // Step 2: Normalize inline math delimiters
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    // Step 3: Fix raw \boxed{...} → $$\boxed{...}$$
    .replace(/(?<!\$)\\boxed\{([^}]+)\}/g, '$$\\boxed{$1}$$')
    // Step 4: Remove \tag{...} (not supported in KaTeX inline)
    .replace(/\\tag\{[^}]*\}/g, '')
    // Step 5: Fix raw arrows outside math → wrap in $
    .replace(/(?<!\$)\\(Longleftrightarrow|Leftrightarrow|Rightarrow|Leftarrow|implies|iff)/g, '$\\$1$')
    // Step 6: Remove "undefined" artifacts
    .replace(/\bundefined\b/g, '');

  // Step 7: Per-line processing
  result = result.split('\n').map(line => {
    // 7a: Wrap raw LaTeX commands on lines that have NO $ at all
    if (!line.includes('$') && /\\(?:frac|sqrt|int|sum|prod|lim|sin|cos|tan|log|ln)\{/.test(line)) {
      line = wrapRawLatexInLine(line);
    }
    // 7b: Balance unclosed single $ delimiters
    line = balanceSingleDollars(line);
    return line;
  }).join('\n');

  // Step 8: Balance unclosed $$ globally
  const doubleDollarCount = (result.match(/\$\$/g) || []).length;
  if (doubleDollarCount % 2 === 1) {
    result += '\n$$';
  }

  return result;
}

const MarkdownRenderer = ({ content }: { content: string }) => {
  // Extract base64 image from content before normalizing (to avoid mangling base64 data)
  const imageMatch = content.match(/^!\[.*?\]\((data:image\/[^)]+)\)\n\n?/);
  const imageSrc = imageMatch ? imageMatch[1] : null;
  const textContent = imageMatch ? content.slice(imageMatch[0].length) : content;

  return (
    <div className="markdown">
      {imageSrc && (
        <div className="my-4">
          <img
            src={imageSrc}
            className="max-w-full md:max-w-md rounded-xl border border-gray-200 shadow-sm object-contain max-h-96"
            alt="Chat image"
          />
        </div>
      )}
      {textContent && (
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            img: ({ node, ...props }) => {
              if (!props.src) return null;
              return (
                <div className="my-4">
                  <img
                    {...props}
                    className="max-w-full md:max-w-md rounded-xl border border-gray-200 shadow-sm object-contain max-h-96"
                    alt={props.alt || "Chat image"}
                  />
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

export default function MessageBubble({ message, isStreaming = false, onEdit, onFeedback }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const startEditing = () => {
    setEditValue(message.content.replace(/^!\[.*?\]\(.*?\)\n\n/, ''));
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (onEdit && editValue.trim() !== message.content.replace(/^!\[.*?\]\(.*?\)\n\n/, '')) {
      onEdit(editValue.trim());
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      textareaRef.current.focus();
    }
  }, [isEditing, editValue]);

  return (
    <div className={`flex items-start gap-4 mb-8 ${isUser ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
      <div
        className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
        style={{ background: isUser ? '#0891b2' : 'linear-gradient(135deg, #059669, #0891b2)' }}
      >
        {isUser ? '👤' : 'M'}
      </div>

      <div className={`${isUser ? 'max-w-[85%] items-end' : 'w-full max-w-[90%] items-start'} flex flex-col`}>
        {isUser ? (
          <div className="flex flex-col items-end group w-full">
            {isEditing ? (
              <div className="w-full bg-[#f4f4f5] rounded-2xl p-4 shadow-sm border border-gray-200">
                <textarea
                  ref={textareaRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full bg-transparent border-none outline-none resize-none text-[15px] text-[#0f172a] mb-3"
                  rows={1}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleEditSubmit}
                    disabled={!editValue.trim()}
                    className="px-5 py-1.5 rounded-full text-xs font-semibold bg-[#059669] text-white hover:bg-[#047857] transition-colors disabled:opacity-50"
                  >
                    Lưu & Gửi
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div
                  className="px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed max-w-full shadow-sm"
                  style={{
                    background: '#f4f4f5',
                    color: '#0f172a',
                    border: '1px solid #e5e7eb'
                  }}
                >
                  <MarkdownRenderer content={message.content} />
                </div>
                
                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors bg-gray-50 hover:bg-gray-100" 
                    title="Sao chép"
                    onClick={() => navigator.clipboard.writeText(message.content.replace(/^!\[.*?\]\(.*?\)\n\n/, ''))}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button 
                    className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors bg-gray-50 hover:bg-gray-100" 
                    title="Chỉnh sửa"
                    onClick={startEditing}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="group w-full">
            <div
              className="px-6 py-5 text-[15px] leading-relaxed text-gray-800 w-full"
              style={{
                background: '#ffffff',
                border: '1px solid #f3f4f6',
                borderRadius: '1.25rem',
                boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)',
              }}
            >
              <MarkdownRenderer content={message.content} />
              {isStreaming && (
                <span className="inline-block w-1.5 h-5 ml-1 align-middle bg-emerald-500 animate-pulse rounded-sm" />
              )}
              {/* Sources citations */}
              {!isStreaming && message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 mb-1.5">Nguồn tham khảo:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {message.sources.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100"
                      >
                        📚 {s.source} · {Math.round(s.similarity * 100)}%
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Feedback buttons */}
            {!isStreaming && onFeedback && (
              <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onFeedback('up')}
                  className={`p-1.5 rounded-lg text-sm transition-colors ${message.feedback === 'up' ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                  title="Hữu ích"
                >
                  👍
                </button>
                <button
                  onClick={() => onFeedback('down')}
                  className={`p-1.5 rounded-lg text-sm transition-colors ${message.feedback === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                  title="Chưa hữu ích"
                >
                  👎
                </button>
                <button
                  className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors hover:bg-gray-100"
                  title="Sao chép"
                  onClick={() => navigator.clipboard.writeText(message.content)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
