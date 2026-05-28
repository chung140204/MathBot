'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MathInput from './MathInput';
import { useChatStream } from '@/features/chat/hooks/useChatStream';
import { ChatMessagesArea } from './ChatMessagesArea';

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


export default function ChatWindow({
  userId,
  sessionId,
  onSessionCreated,
  onMessageSent,
}: ChatWindowProps) {
  const { data: session } = useSession();
  const chat = useChatStream({ sessionId, userId, onSessionCreated, onMessageSent });
  const { messages, setMessages, streamingContent, thinkingContent, isThinking, thinkingExpanded, setThinkingExpanded, isStreaming, isSearching, thinkingSeconds, isStreamingRef, sessionCreatedDuringStreamRef, sendMessage, stopStreaming } = chat;
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [chatMode, setChatMode] = useState<'thinking' | 'fast'>('thinking');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

    const controller = new AbortController();
    setIsLoadingHistory(true);
    fetch(`/api/v1/chat/sessions?sessionId=${sessionId}`, { signal: controller.signal })
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
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      })
      .finally(() => setIsLoadingHistory(false));
    return () => controller.abort();
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

  // sendMessage and stopStreaming now come from useChatStream hook

  const handleSend = (text: string, imageBase64: string | null = selectedImage, overrideHistory?: Message[]) => {
    sendMessage(text, imageBase64, chatMode, overrideHistory);
    setInput('');
    setSelectedImage(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };


  const handleEditSubmit = (index: number, newContent: string) => {
    const newHistory = messages.slice(0, index);
    handleSend(newContent, null, newHistory);
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSend(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const firstName = (session?.user?.name ?? '').split(' ').pop() || 'bạn';
  const showWelcome = !sessionId && messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full" style={{ background: '#f8fafc' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-6" style={{ height: 52, background: '#fff', borderBottom: '0.5px solid #e2e8f0', flexShrink: 0 }}>
        <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>{sessionId ? 'Cuộc trò chuyện' : 'MathBot AI'}</span>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#d1fae5', color: '#059669' }}>AI đang hoạt động</span>
      </div>

      {/* Messages */}
      <ChatMessagesArea
        scrollRef={scrollRef} isLoadingHistory={isLoadingHistory} showWelcome={showWelcome}
        firstName={firstName} messages={messages} setMessages={setMessages}
        handleSend={handleSend} handleEditSubmit={handleEditSubmit}
        isStreaming={isStreaming} streamingContent={streamingContent}
        isThinking={isThinking} thinkingContent={thinkingContent}
        thinkingExpanded={thinkingExpanded} setThinkingExpanded={setThinkingExpanded}
        thinkingSeconds={thinkingSeconds} isSearching={isSearching}
      />

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
            onEnter={() => handleSend(input)}
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
