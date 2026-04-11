'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import MessageBubble from './MessageBubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  metadata?: any;
}

const DEMO_MESSAGES: Message[] = [
  {
    role: 'user',
    content: 'Tính đạo hàm của f(x) = sin(x^2)',
  },
  {
    role: 'assistant',
    content: 'Áp dụng Chain Rule cho f(x) = sin(x^2):',
    metadata: {
      math: '[f(g(x))]\' = f\'(g(x)) \\cdot g\'(x)',
      steps: [
        { id: 1, content: 'Đặt u = x² → f = sin(u)' },
        { id: 2, content: 'Đạo hàm ngoài: (sin u)\' = cos(x²)' },
        { id: 3, content: 'Đạo hàm trong: (x²)\' = 2x' },
      ],
      result: "f'(x) = 2x \\cdot cos(x^2)",
    },
  },
];

export default function ChatWindow() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Xin chào bạn! 👋 Hôm nay bạn cần giải bài gì? Tôi có thể giải thích từng bước rõ ràng nhé!' },
    ...DEMO_MESSAGES,
  ]);
  const hasGreeted = useRef(false);

  useEffect(() => {
    const name = (session?.user as { name?: string })?.name;
    if (name && !hasGreeted.current) {
      const firstName = name.split(' ').pop() ?? name;
      hasGreeted.current = true;
      setMessages((prev) => [
        { ...prev[0], content: `Xin chào ${firstName}! 👋 Hôm nay bạn cần giải bài gì? Tôi có thể giải thích từng bước rõ ràng nhé!` },
        ...prev.slice(1),
      ]);
    }
  }, [session]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage: Message = { role: 'assistant', content: '' };
      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            try {
              const { content } = JSON.parse(data);
              assistantMessage.content += content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { ...assistantMessage };
                return updated;
              });
            } catch (e) {
              // Ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc]">
      {/* Top Bar */}
      <div className="h-[72px] px-8 border-b border-gray-100 bg-white flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Đạo hàm hàm hợp</h2>
          <p className="text-[11px] text-gray-400 font-medium">Đạo hàm · 4 tin nhắn</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#e6f6f1] text-[#059669] text-[10px] font-bold">
            RAG hoạt động
          </span>
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">
            GPT-4o
          </span>
        </div>
      </div>

      {/* Message List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-8 py-8 space-y-2 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto w-full">
          {messages.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}
          {isStreaming && (
            <div className="flex items-center gap-2 text-[#059669] text-xs font-bold animate-pulse ml-14">
              MathBot đang suy nghĩ...
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto relative">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi bài, giải thích công thức..."
              className="w-full bg-[#f8fafc] border border-gray-100 rounded-2xl px-6 py-4 pr-32 focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all text-sm shadow-sm"
              disabled={isStreaming}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button 
                type="button"
                className="p-2 text-gray-400 hover:text-[#059669] transition-colors"
                title="Đính kèm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>
              <button 
                type="submit"
                disabled={!input.trim() || isStreaming}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !isStreaming
                    ? 'bg-[#059669] text-white shadow-md'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
          <p className="text-center text-[10px] text-gray-400 mt-4">
            MathBot có thể mắc lỗi — kiểm tra lại kết quả quan trọng
          </p>
        </div>
      </div>
    </div>
  );
}
