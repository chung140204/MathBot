'use client';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MarkdownRenderer } from '@/features/chat/lib/message-render';

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
  onRegenerate?: () => void;
  isLastAssistant?: boolean;
  chatMode?: 'thinking' | 'fast' | 'tutor';
  onQuickAction?: (text: string) => void;
}

const TUTOR_ACTIONS = [
  { key: 'hint', label: 'Gợi ý thêm', icon: '🔍', message: 'Gợi ý thêm cho bài này' },
  { key: 'similar', label: 'Bài tương tự', icon: '📝', message: 'Cho em một bài tương tự để luyện tập' },
  { key: 'explain', label: 'Giải thích thêm', icon: '❓', message: 'Giải thích thêm bước vừa rồi' },
  { key: 'answer', label: 'Cho đáp án', icon: '✅', message: 'Cho em đáp án đầy đủ bài này' },
] as const;

const DEFAULT_ACTIONS = [
  { key: 'similar', label: 'Bài tương tự', icon: '📝', message: 'Cho em một bài tương tự' },
  { key: 'altMethod', label: 'Cách khác', icon: '🔄', message: 'Giải bài này bằng cách khác' },
] as const;

export default function MessageBubble({ message, isStreaming = false, onEdit, onFeedback, onRegenerate, isLastAssistant, chatMode, onQuickAction }: MessageBubbleProps) {
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
      <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm" style={{ background: isUser ? '#0891b2' : 'linear-gradient(135deg, #059669, #0891b2)' }}>
        {isUser ? '👤' : 'M'}
      </div>

      <div className={`${isUser ? 'max-w-[85%] items-end' : 'w-full max-w-[90%] items-start'} flex flex-col`}>
        {isUser ? (
          <div className="flex flex-col items-end group w-full">
            {isEditing ? (
              <div className="w-full bg-[#f4f4f5] rounded-2xl p-4 shadow-sm border border-gray-200">
                <textarea ref={textareaRef} value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-full bg-transparent border-none outline-none resize-none text-[15px] text-[#0f172a] mb-3" rows={1} />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditing(false)} className="px-4 py-1.5 rounded-full text-xs font-semibold text-gray-500 hover:bg-gray-200 transition-colors">Hủy</button>
                  <button onClick={handleEditSubmit} disabled={!editValue.trim()} className="px-5 py-1.5 rounded-full text-xs font-semibold bg-[#059669] text-white hover:bg-[#047857] transition-colors disabled:opacity-50">Lưu & Gửi</button>
                </div>
              </div>
            ) : (
              <>
                <div className="px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed max-w-full shadow-sm" style={{ background: '#f4f4f5', color: '#0f172a', border: '1px solid #e5e7eb' }}>
                  <MarkdownRenderer content={message.content} />
                </div>
                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors bg-gray-50 hover:bg-gray-100" title="Sao chép" onClick={() => { navigator.clipboard.writeText(message.content.replace(/^!\[.*?\]\(.*?\)\n\n/, '')); toast.success('Đã sao chép!'); }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors bg-gray-50 hover:bg-gray-100" title="Chỉnh sửa" onClick={startEditing}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="group w-full">
            <div className="px-6 py-5 text-[15px] leading-relaxed text-gray-800 w-full" style={{ background: '#ffffff', border: '1px solid #f3f4f6', borderRadius: '1.25rem', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.08)' }}>
              <MarkdownRenderer content={message.content} isStreaming={isStreaming} />
              {isStreaming && <span className="inline-block w-1.5 h-5 ml-1 align-middle bg-emerald-500 animate-pulse rounded-sm" />}
              {!isStreaming && message.sources && message.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400 mb-1.5">Nguồn tham khảo:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {message.sources.map((s, i) => {
                      const pct = Math.round(s.similarity * 100);
                      const relevance = pct >= 80 ? 'Rất liên quan' : pct >= 60 ? 'Liên quan' : 'Tham khảo';
                      return (
                        <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 text-[11px] rounded-lg border border-blue-100" title={`Độ tương đồng: ${pct}%`}>
                          📚 {s.source}<span className="text-blue-400 font-medium">· {relevance}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {!isStreaming && onFeedback && (
              <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onFeedback('up')} className={`p-1.5 rounded-lg text-sm transition-colors ${message.feedback === 'up' ? 'text-green-500 bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`} title="Hữu ích">👍</button>
                <button onClick={() => onFeedback('down')} className={`p-1.5 rounded-lg text-sm transition-colors ${message.feedback === 'down' ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`} title="Chưa hữu ích">👎</button>
                <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors hover:bg-gray-100" title="Sao chép" onClick={() => { navigator.clipboard.writeText(message.content); toast.success('Đã sao chép!'); }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </button>
                {isLastAssistant && onRegenerate && (
                  <button className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg transition-colors hover:bg-gray-100" title="Tạo lại câu trả lời" onClick={onRegenerate}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                )}
              </div>
            )}
            {!isStreaming && onQuickAction && (
              <div className="flex flex-wrap gap-1.5 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {(chatMode === 'tutor' ? TUTOR_ACTIONS : DEFAULT_ACTIONS).map((action) => (
                  <button
                    key={action.key}
                    onClick={() => onQuickAction(action.message)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-gray-50 text-gray-600 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all"
                  >
                    <span>{action.icon}</span>
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
