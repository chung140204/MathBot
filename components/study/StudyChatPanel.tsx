'use client';

import { useState, useRef, useEffect } from 'react';
import MessageBubble from '@/components/chat/MessageBubble';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function StudyChatPanel({ topicContext, topicLabel }: { topicContext: string, topicLabel: string }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Chào bạn! Tôi đang theo dõi phần **${topicLabel}** bạn đang đọc. Hỏi gì tôi giải thích ngay nhé! 👋`
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Suggested questions based on context
  const suggestions = [
    `Cho ví dụ khó hơn về ${topicLabel}`,
    `Ứng dụng của ${topicLabel} trong thực tế?`,
    `Tóm tắt nhanh phần này`
  ];

  useEffect(() => {
    // Scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Reset chat if topic changes
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `Chào bạn! Tôi đang theo dõi phần **${topicLabel}** bạn đang đọc. Hỏi gì tôi giải thích ngay nhé! 👋`
      }
    ]);
  }, [topicContext, topicLabel]);

  const send = async (text: string) => {
    if (!text.trim() || isStreaming) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      // Append topic context
      const contextualMessages = [
        { role: 'system', content: `Current study context: ${topicContext}. User is currently reading this topic.` },
        ...messages,
        userMessage
      ];

      const response = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: contextualMessages }),
      });

      if (!response.ok) throw new Error('API Error');

      const reader = response.body?.getReader();
      let assistantMessage: Message = { role: 'assistant', content: '' };
      setMessages((prev) => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
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
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, đã xảy ra lỗi kết nối. Vui lòng thử lại.' }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="flex flex-col h-full bg-[#f9fafb]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 text-sm leading-relaxed rounded-2xl ${
              m.role === 'user' 
                ? 'bg-[#059669] text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
            }`}>
               {/* We just use string rendering for simplicity or MessageBubble if it fits */}
               <div className="math-markup">{m.content}</div>
            </div>
          </div>
        ))}
        {isStreaming && (
          <div className="text-xs text-[#059669] font-semibold animate-pulse">
            AI đang phân tích...
          </div>
        )}
      </div>

      {/* Suggested Questions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 space-y-2">
          <p className="text-[10px] font-black tracking-widest text-gray-400 uppercase">GỢI Ý CÂU HỎI</p>
          <div className="flex flex-col gap-2">
            {suggestions.map(sugg => (
              <button 
                key={sugg} 
                onClick={() => send(sugg)}
                className="text-left px-4 py-2 border border-gray-200 bg-white rounded-xl text-xs font-semibold text-gray-600 hover:border-[#059669] hover:text-[#059669] transition-all"
              >
                {sugg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder="Hỏi về bài đang học..."
            className="w-full bg-[#f8fafc] border border-gray-100 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#059669] focus:ring-1 focus:ring-[#059669] transition-all"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-2 top-2 bottom-2 w-8 flex items-center justify-center rounded-lg bg-[#059669] text-white disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
