'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MessageBubble from './MessageBubble';
import MathInput from './MathInput';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatWindowProps {
  userId?: string;
  sessionId: string | null;
  onSessionCreated: (id: string) => void;
  onMessageSent: () => void;
}

const SUGGESTIONS = [
  'Tính đạo hàm của f(x) = sin(x²)',
  'Giải phương trình mũ: 2^x = 8',
  'Tìm nguyên hàm của ∫x·eˣ dx',
  'Tính xác suất bài toán tổ hợp',
];

export default function ChatWindow({
  userId,
  sessionId,
  onSessionCreated,
  onMessageSent,
}: ChatWindowProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [thinkingContent, setThinkingContent] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingExpanded, setThinkingExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load messages when session changes
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      return;
    }
    
    // Avoid overwriting active stream with history fetch
    if (isStreaming) return;

    setIsLoadingHistory(true);
    fetch(`/api/v1/chat/sessions?sessionId=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMessages(data.map((m) => ({ 
            role: m.role as 'user' | 'assistant', 
            content: m.content 
          })));
        } else {
          console.error("Dữ liệu lịch sử không hợp lệ hoặc lỗi:", data);
          setMessages([]);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingHistory(false));
  }, [sessionId, isStreaming]); // Added isStreaming to dependencies for safe synchronization

  // Improved Auto-scroll for dynamic content (Math, Images)
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    };

    // Immediate scroll on data change
    scrollToBottom();

    // Secondary scroll after a short delay for Math/Image rendering
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, streamingContent, isThinking]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  const sendMessage = async (
    text: string, 
    imageBase64: string | null = selectedImage,
    overrideHistory?: Message[]
  ) => {
    if ((!text.trim() && !imageBase64) || isStreaming) return;

    // Attach image directly into the text using Markdown if there's an image
    // This allows it to be displayed in MessageBubble and stored in DB effortlessly
    let contentToSend = text.trim();
    if (imageBase64) {
      contentToSend = `![image](${imageBase64})\n\n${contentToSend}`;
    }

    const userMsg: Message = { role: 'user', content: contentToSend };
    const baseHistory = overrideHistory || messages;
    const history = [...baseHistory, userMsg];
    setMessages(history);
    setInput('');
    setSelectedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsStreaming(true);

    // Setup AbortController
    abortControllerRef.current = new AbortController();
    let accumulated = '';

    // Call API (we also send the raw imageBase64 separately so backend can process it nicely with the Vision model)
    try {
      const res = await fetch('/chat/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, sessionId, userId, imageBase64 }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("API Error details:", errorText);
        throw new Error(`API Error ${res.status}: ${errorText}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6);
          if (raw === '[DONE]') break;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.event === 'session') {
              onSessionCreated(parsed.sessionId);
            } else if (parsed.event === 'thinking_start') {
              setIsThinking(true);
              setThinkingExpanded(true);
            } else if (parsed.event === 'thinking_end') {
              setIsThinking(false);
              setThinkingExpanded(false);
            } else if (parsed.reasoning) {
              setThinkingContent((prev) => prev + parsed.reasoning);
            } else if (parsed.content) {
              accumulated += parsed.content;
              setStreamingContent(accumulated);
            }
          } catch {
            // partial JSON chunk — skip
          }
        }
      }

      // Commit streamed message to messages array
      setMessages((prev) => [...prev, { role: 'assistant', content: accumulated }]);
      setStreamingContent('');
      setThinkingContent('');
      setIsThinking(false);
      setThinkingExpanded(false);
      onMessageSent();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('User stopped the generation.');
        // If aborted, keep what we have so far
        if (accumulated.trim()) {
          setMessages((prev) => [...prev, { role: 'assistant', content: accumulated }]);
        }
      } else {
        console.error(err);
      }
      setStreamingContent('');
      setThinkingContent('');
      setIsThinking(false);
      setThinkingExpanded(false);
    } finally {
      setIsStreaming(false);
    }
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleEditSubmit = (index: number, newContent: string) => {
    // Truncate messages up to the edited message and send new one
    const newHistory = messages.slice(0, index);
    sendMessage(newContent, null, newHistory);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const firstName = (session?.user?.name ?? '').split(' ').pop() || 'bạn';
  const showWelcome = !sessionId && messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-6"
        style={{
          height: 52,
          background: '#fff',
          borderBottom: '0.5px solid #e2e8f0',
          flexShrink: 0,
        }}
      >
        <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>
          {sessionId ? 'Cuộc trò chuyện' : 'MathBot AI'}
        </span>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: '#d1fae5', color: '#059669' }}
        >
          AI đang hoạt động
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {isLoadingHistory ? (
            <div className="flex justify-center mt-16">
              <div className="w-6 h-6 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin" />
            </div>
          ) : showWelcome ? (
            /* Welcome screen */
            <div className="flex flex-col items-center text-center pt-16 pb-8">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-4"
                style={{ background: 'linear-gradient(135deg, #059669, #0891b2)' }}
              >
                M
              </div>
              <h2 className="text-xl font-bold mb-1" style={{ color: '#0f172a' }}>
                Xin chào, {firstName}!
              </h2>
              <p className="text-sm mb-8" style={{ color: '#475569' }}>
                Hỏi bất kỳ bài Toán THPT nào — tôi giải từng bước rõ ràng.
              </p>
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-left text-xs px-3 py-2.5 rounded-xl transition-colors"
                    style={{
                      background: '#fff',
                      border: '0.5px solid #e2e8f0',
                      color: '#475569',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#059669';
                      (e.currentTarget as HTMLButtonElement).style.color = '#059669';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0';
                      (e.currentTarget as HTMLButtonElement).style.color = '#475569';
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((m, i) => (
                <MessageBubble 
                  key={i} 
                  message={m} 
                  onEdit={(newContent) => handleEditSubmit(i, newContent)}
                />
              ))}
              {/* Thinking box */}
              {isStreaming && (isThinking || thinkingContent) && (
                <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 text-xs">
                  <button
                    onClick={() => setThinkingExpanded((v) => !v)}
                    className="w-full flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    {isThinking && (
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '120ms' }} />
                        <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '240ms' }} />
                      </span>
                    )}
                    <span>{isThinking ? 'Đang suy nghĩ...' : 'Đã suy nghĩ xong'}</span>
                    <span className="ml-auto">{thinkingExpanded ? '▲' : '▼'}</span>
                  </button>
                  {thinkingExpanded && thinkingContent && (
                    <div className="px-3 pb-3 text-gray-400 whitespace-pre-wrap leading-relaxed border-t border-gray-200 pt-2 max-h-40 overflow-y-auto">
                      {thinkingContent}
                    </div>
                  )}
                </div>
              )}
              {/* Streaming bubble */}
              {isStreaming && streamingContent && (
                <MessageBubble
                  message={{ role: 'assistant', content: streamingContent }}
                  isStreaming={true}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Input */}
      <div
        style={{
          background: '#fff',
          borderTop: '0.5px solid #e2e8f0',
          padding: '12px 16px 16px',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <div className="max-w-4xl mx-auto relative">
          {/* Stop Button */}


          <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-end gap-2"
          style={{
            background: '#f8fafc',
            border: '0.5px solid #e2e8f0',
            borderRadius: 12,
            padding: '8px 12px 8px 8px',
          }}
        >
          <MathInput
            value={input}
            onChange={setInput}
            onEnter={() => sendMessage(input)}
            image={selectedImage}
            onImageSelect={setSelectedImage}
            disabled={isStreaming || isLoadingHistory}
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={stopStreaming}
              className="flex-shrink-0 w-8 h-8 mb-[4px] rounded-lg flex items-center justify-center transition-all bg-gray-800 text-white hover:bg-gray-700 shadow-sm"
              title="Dừng tạo"
            >
              <div className="w-3 h-3 bg-white rounded-sm"></div>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit as any}
              disabled={!input.trim() && !selectedImage}
              className="flex-shrink-0 w-8 h-8 mb-[4px] rounded-lg flex items-center justify-center transition-all"
              style={{
                background:
                  (input.trim() || selectedImage)
                    ? 'linear-gradient(135deg, #059669, #0891b2)'
                    : '#e2e8f0',
                color: (input.trim() || selectedImage) ? '#fff' : '#94a3b8',
              }}
              title="Gửi tin nhắn"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </form>
        <p className="text-center text-[10px] mt-2" style={{ color: '#94a3b8' }}>
          MathBot có thể mắc lỗi. Hãy kiểm tra kết quả quan trọng.
        </p>
        </div>
      </div>
    </div>
  );
}
