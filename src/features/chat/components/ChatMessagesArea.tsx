'use client';

import MessageBubble from './MessageBubble';

interface SourceItem { source: string; topic: string; similarity: number; }
interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: SourceItem[];
  feedback?: 'up' | 'down' | null;
  id?: string;
}

const SUGGESTIONS = [
  { text: 'Tính đạo hàm của f(x) = sin(x²)', icon: '📐' },
  { text: 'Giải phương trình mũ: 2^x = 8', icon: '📊' },
  { text: 'Tìm nguyên hàm của ∫x·eˣ dx', icon: '∫' },
  { text: 'Tính xác suất bài toán tổ hợp', icon: '🎲' },
];

interface ChatMessagesAreaProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  isLoadingHistory: boolean;
  showWelcome: boolean;
  firstName: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  handleSend: (text: string, imageBase64?: string | null, overrideHistory?: Message[]) => void;
  handleEditSubmit: (index: number, newContent: string) => void;
  isStreaming: boolean;
  streamingContent: string;
  isThinking: boolean;
  thinkingContent: string;
  thinkingExpanded: boolean;
  setThinkingExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  thinkingSeconds: number;
  isSearching: boolean;
  chatMode: 'thinking' | 'fast' | 'tutor';
}

export function ChatMessagesArea({
  scrollRef, isLoadingHistory, showWelcome, firstName, messages, setMessages,
  handleSend, handleEditSubmit, isStreaming, streamingContent,
  isThinking, thinkingContent, thinkingExpanded, setThinkingExpanded, thinkingSeconds, isSearching, chatMode,
}: ChatMessagesAreaProps) {
  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {isLoadingHistory ? (
          <div className="flex justify-center mt-16">
            <div className="w-6 h-6 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin" />
          </div>
        ) : showWelcome ? (
          <div className="flex flex-col items-center text-center pt-16 pb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-4" style={{ background: 'linear-gradient(135deg, #059669, #0891b2)' }}>M</div>
            <h2 className="text-xl font-bold mb-1" style={{ color: '#0f172a' }}>Xin chào, {firstName}!</h2>
            <p className="text-sm mb-2" style={{ color: '#475569' }}>Hỏi bất kỳ bài Toán THPT nào — tôi giải từng bước rõ ràng.</p>
            <div className="flex items-center gap-3 mb-8 text-[11px] text-gray-400 font-medium">
              <span>📸 Gửi ảnh bài toán</span><span>·</span><span>📚 Tra cứu tài liệu</span><span>·</span><span>🧠 Suy nghĩ từng bước</span>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {SUGGESTIONS.map((s) => (
                <button key={s.text} onClick={() => handleSend(s.text)}
                  className="text-left text-xs px-3 py-2.5 rounded-xl transition-colors flex items-start gap-2"
                  style={{ background: '#fff', border: '0.5px solid #e2e8f0', color: '#475569' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#059669'; (e.currentTarget as HTMLButtonElement).style.color = '#059669'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLButtonElement).style.color = '#475569'; }}>
                  <span className="flex-shrink-0">{s.icon}</span><span>{s.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => {
              const lastAssistantIdx = messages.map((msg, idx) => msg.role === 'assistant' ? idx : -1).filter(x => x >= 0).pop();
              return (
                <MessageBubble key={i} message={m}
                  onEdit={(newContent) => handleEditSubmit(i, newContent)}
                  onFeedback={m.id ? async (fb) => {
                    await fetch('/api/v1/chat/feedback', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messageId: m.id, feedback: fb }) });
                    setMessages(prev => prev.map((msg, idx) => idx === i ? { ...msg, feedback: fb } : msg));
                  } : undefined}
                  isLastAssistant={i === lastAssistantIdx}
                  onRegenerate={i === lastAssistantIdx ? () => {
                    const lastUserMsg = [...messages].reverse().find(msg => msg.role === 'user');
                    if (lastUserMsg) { setMessages(prev => prev.slice(0, -1)); handleSend(lastUserMsg.content, null, messages.slice(0, -1)); }
                  } : undefined}
                  chatMode={chatMode}
                  onQuickAction={(text) => handleSend(text)}
                />
              );
            })}
            {isStreaming && !streamingContent && (
              <div className="flex items-center gap-3 py-4 px-1">
                <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">M</div>
                <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-100">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="text-xs text-gray-400">{isSearching ? 'Đang tìm kiếm tài liệu' : thinkingContent ? 'Đang suy nghĩ' : 'Đang xử lý'}... {thinkingSeconds}s</span>
                </div>
              </div>
            )}
            {isStreaming && (isThinking || thinkingContent) && (
              <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 text-xs">
                <button onClick={() => setThinkingExpanded((v) => !v)} className="w-full flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors">
                  {isThinking && (
                    <span className="flex gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '120ms' }} />
                      <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '240ms' }} />
                    </span>
                  )}
                  <span>{isThinking ? `Đang suy nghĩ... ${thinkingSeconds}s` : `Đã suy nghĩ xong (${thinkingSeconds}s)`}</span>
                  <span className="ml-auto">{thinkingExpanded ? '▲' : '▼'}</span>
                </button>
                {thinkingExpanded && thinkingContent && (
                  <div className="px-3 pb-3 text-gray-400 whitespace-pre-wrap leading-relaxed border-t border-gray-200 pt-2 max-h-40 overflow-y-auto">{thinkingContent}</div>
                )}
              </div>
            )}
            {isStreaming && streamingContent && (
              <MessageBubble message={{ role: 'assistant', content: streamingContent }} isStreaming={true} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
