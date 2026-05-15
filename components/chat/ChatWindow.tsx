'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MessageBubble from './MessageBubble';
import MathInput from './MathInput';

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
  const [chatMode, setChatMode] = useState<'thinking' | 'fast'>('thinking');
  const [thinkingSeconds, setThinkingSeconds] = useState(0);
  const thinkingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [pendingSources, setPendingSources] = useState<SourceItem[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const sseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStreamingRef = useRef(false);

  // Track whether current session was created during streaming (to skip history fetch after stream ends)
  const sessionCreatedDuringStreamRef = useRef(false);

  // Load messages when session changes or streaming ends
  useEffect(() => {
    if (!sessionId) {
      if (!isStreamingRef.current) setMessages([]);
      return;
    }

    // Don't fetch history while streaming
    if (isStreaming || isStreamingRef.current) return;

    // Skip history fetch if this session was just created during streaming
    // (messages are already in state from the stream)
    if (sessionCreatedDuringStreamRef.current) {
      sessionCreatedDuringStreamRef.current = false;
      return;
    }

    setIsLoadingHistory(true);
    fetch(`/api/v1/chat/sessions?sessionId=${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (isStreamingRef.current) return;
        if (Array.isArray(data)) {
          setMessages(data.map((m) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            feedback: m.feedback ?? null,
          })));
        } else {
          console.error("Dữ liệu lịch sử không hợp lệ hoặc lỗi:", data);
          setMessages([]);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoadingHistory(false));
  }, [sessionId, isStreaming]);

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

    // Validate image format before sending
    if (imageBase64 && !imageBase64.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/)) {
      alert('Định dạng ảnh không hợp lệ.');
      return;
    }

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
    isStreamingRef.current = true;
    setThinkingSeconds(0);
    thinkingTimerRef.current = setInterval(() => {
      setThinkingSeconds((s) => s + 1);
    }, 1000);

    // Setup AbortController
    abortControllerRef.current = new AbortController();
    let accumulated = '';
    setPendingSources([]);

    // SSE timeout: abort if no data received for 30s
    const resetSseTimeout = () => {
      if (sseTimeoutRef.current) clearTimeout(sseTimeoutRef.current);
      sseTimeoutRef.current = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, 30_000);
    };
    resetSseTimeout();

    // Call API (we also send the raw imageBase64 separately so backend can process it nicely with the Vision model)
    try {
      const res = await fetch('/chat/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, sessionId, userId, imageBase64, mode: chatMode }),
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

        resetSseTimeout();
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6);
          if (raw === '[DONE]') break;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.event === 'session') {
              sessionCreatedDuringStreamRef.current = true;
              onSessionCreated(parsed.sessionId);
            } else if (parsed.event === 'sources') {
              setPendingSources(parsed.data || []);
            } else if (parsed.event === 'loading') {
              // Server is preparing (RAG search) — streaming will begin shortly
            } else if (parsed.event === 'thinking_start') {
              setIsThinking(true);
              setThinkingExpanded(true);
            } else if (parsed.event === 'thinking_end') {
              setIsThinking(false);
              setThinkingExpanded(false);
              if (thinkingTimerRef.current) {
                clearInterval(thinkingTimerRef.current);
                thinkingTimerRef.current = null;
              }
            } else if (parsed.reasoning && typeof parsed.reasoning === 'string') {
              setThinkingContent((prev) => prev + parsed.reasoning);
            } else if (parsed.content && typeof parsed.content === 'string') {
              // Stop timer when first content arrives
              if (thinkingTimerRef.current) {
                clearInterval(thinkingTimerRef.current);
                thinkingTimerRef.current = null;
              }
              accumulated += parsed.content;
              setStreamingContent(accumulated);
            }
          } catch {
            // partial JSON chunk — skip
          }
        }
      }

      // Commit streamed message to messages array (with sources from RAG)
      setMessages((prev) => [...prev, { role: 'assistant', content: accumulated, sources: pendingSources }]);
      setStreamingContent('');
      setThinkingContent('');
      setIsThinking(false);
      setThinkingExpanded(false);
      onMessageSent();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        if (accumulated.trim()) {
          setMessages((prev) => [...prev, { role: 'assistant', content: accumulated, sources: pendingSources }]);
        } else if (sseTimeoutRef.current === null) {
          // Timeout-triggered abort (not user stop) — show error message
          setMessages((prev) => [...prev, { role: 'assistant', content: 'Phản hồi mất quá lâu. Vui lòng thử lại.' }]);
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
      isStreamingRef.current = false;
      if (thinkingTimerRef.current) {
        clearInterval(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
      if (sseTimeoutRef.current) {
        clearTimeout(sseTimeoutRef.current);
        sseTimeoutRef.current = null;
      }
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
                  onFeedback={m.id ? async (fb) => {
                    await fetch('/api/v1/chat/feedback', {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ messageId: m.id, feedback: fb }),
                    });
                    setMessages(prev => prev.map((msg, idx) => idx === i ? { ...msg, feedback: fb } : msg));
                  } : undefined}
                />
              ))}
              {/* Typing indicator with timer while waiting for response */}
              {isStreaming && !streamingContent && (
                <div className="flex items-center gap-3 py-4 px-1">
                  <div className="w-8 h-8 rounded-full bg-[#059669] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    M
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-100">
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span className="text-xs text-gray-400">
                      {thinkingContent ? 'Đang suy nghĩ' : 'Đang xử lý'}... {thinkingSeconds}s
                    </span>
                  </div>
                </div>
              )}
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
                    <span>{isThinking ? `Đang suy nghĩ... ${thinkingSeconds}s` : `Đã suy nghĩ xong (${thinkingSeconds}s)`}</span>
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


          {/* Mode selector */}
          <div className="flex items-center gap-1.5 mb-2">
            {([
              { value: 'fast', label: 'Nhanh', icon: '⚡' },
              { value: 'thinking', label: 'Suy nghĩ sâu', icon: '🧠' },
            ] as const).map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setChatMode(m.value)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  chatMode === m.value
                    ? 'bg-[#059669] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {m.icon} {m.label}
              </button>
            ))}
          </div>

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
