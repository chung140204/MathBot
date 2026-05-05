'use client';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  onEdit?: (newContent: string) => void;
}

/**
 * Normalizes common LaTeX delimiters used by various LLMs 
 * to standard markdown-math ($...$ and $$...$$)
 */
function normalizeContent(content: string): string {
  if (!content) return '';
  return content
    .replace(/\\\[/g, '$$$$')
    .replace(/\\\]/g, '$$$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');
}

const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          img: ({ node, ...props }) => (
            <div className="my-4">
              <img 
                {...props} 
                className="max-w-full md:max-w-md rounded-xl border border-gray-200 shadow-sm object-contain max-h-96" 
                alt={props.alt || "Chat image"} 
              />
            </div>
          ),
        }}
      >
        {normalizeContent(content)}
      </ReactMarkdown>
    </div>
  );
};

export default function MessageBubble({ message, isStreaming = false, onEdit }: MessageBubbleProps) {
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
              <span
                className="inline-block w-1.5 h-5 ml-1 align-middle bg-emerald-500 animate-pulse rounded-sm"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
