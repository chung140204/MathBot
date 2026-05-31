'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SUGGESTED_QUESTIONS, timeGreeting, getBubbleMessages, linkifyAssistant } from '@/features/assistant/lib/system-guide';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [bubbleDismissed, setBubbleDismissed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  // Auto-focus the input when the panel opens.
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Friendly greeting bubble shown beside the button while the panel is closed.
  useEffect(() => {
    if (open || bubbleDismissed) {
      setBubbleText(null);
      return;
    }
    const msgs = getBubbleMessages();
    let i = 0;
    const showTimer = setTimeout(() => setBubbleText(msgs[0]), 1200);
    const rotateTimer = setInterval(() => {
      i = (i + 1) % msgs.length;
      setBubbleText(msgs[i]);
    }, 5000);
    return () => {
      clearTimeout(showTimer);
      clearInterval(rotateTimer);
    };
  }, [open, bubbleDismissed]);

  // Close when clicking outside the panel/button, or pressing Escape.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || loading) return;

      const history = messages.slice(-6);
      setMessages((m) => [...m, { role: 'user', content: question }, { role: 'assistant', content: '' }]);
      setInput('');
      setLoading(true);

      try {
        const res = await fetch('/api/v1/assistant', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: question, path: pathname, history }),
        });

        if (!res.ok || !res.body) {
          const errText = res.status === 429
            ? 'Bạn hỏi hơi nhanh, vui lòng đợi một chút rồi thử lại.'
            : 'Xin lỗi, trợ lý đang bận. Vui lòng thử lại sau.';
          setMessages((m) => {
            const next = [...m];
            next[next.length - 1] = { role: 'assistant', content: errText };
            return next;
          });
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split('\n\n');
          buffer = parts.pop() ?? '';
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith('data:')) continue;
            const payload = line.slice(5).trim();
            if (payload === '[DONE]') continue;
            try {
              const { t } = JSON.parse(payload) as { t?: string };
              if (t) {
                setMessages((m) => {
                  const next = [...m];
                  next[next.length - 1] = {
                    role: 'assistant',
                    content: next[next.length - 1].content + t,
                  };
                  return next;
                });
              }
            } catch { /* ignore malformed chunk */ }
          }
        }
      } catch {
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { role: 'assistant', content: 'Lỗi kết nối. Vui lòng thử lại.' };
          return next;
        });
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, pathname],
  );

  const handleLinkClick = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Greeting bubble (shown beside the button while closed) */}
      {bubbleText && !open && !bubbleDismissed && (
        <div className="hidden sm:block fixed bottom-10 right-28 z-50 max-w-[240px] animate-page-in">
          <div
            onClick={() => setOpen(true)}
            className="relative bg-white rounded-2xl rounded-br-sm shadow-xl border border-gray-100 px-4 py-3 text-[13px] font-medium text-gray-700 cursor-pointer hover:border-[#059669]/40 transition-colors"
          >
            {bubbleText}
            {/* tail */}
            <span className="absolute -bottom-1.5 right-5 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45" />
            <button
              onClick={(e) => { e.stopPropagation(); setBubbleDismissed(true); }}
              aria-label="Ẩn lời chào"
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-200 text-gray-500 text-xs leading-none flex items-center justify-center hover:bg-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        aria-label="Trợ lý hướng dẫn"
        className="fixed bottom-5 right-5 z-50 w-[68px] h-[68px] rounded-full overflow-hidden bg-white ring-2 ring-[#059669]/40 shadow-lg shadow-[#059669]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? (
          <span className="w-full h-full bg-gradient-to-br from-[#059669] to-[#0ea5e9] text-white flex items-center justify-center">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        ) : (
          <Image src="/assistant-bot.png" alt="Trợ lý hướng dẫn" width={68} height={68} className="w-full h-full object-contain p-0.5" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div ref={panelRef} role="dialog" aria-label="Trợ lý hướng dẫn" className="fixed bottom-24 right-5 z-50 w-[min(380px,calc(100vw-2.5rem))] h-[min(560px,calc(100vh-8rem))] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-page-in">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#059669] to-[#0ea5e9] text-white">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image src="/assistant-bot.png" alt="Trợ lý" width={36} height={36} className="w-full h-full object-contain p-0.5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight">Trợ lý hướng dẫn</p>
              <p className="text-[11px] text-white/80 leading-tight">Cách dùng app & thông tin kỳ thi</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} aria-live="polite" className="flex-1 overflow-y-auto px-3 py-3 space-y-3 bg-[#f8fafc]">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-3 text-[13px] text-gray-600 border border-gray-100">
                  {timeGreeting()}! 👋 Mình là trợ lý hướng dẫn, luôn sẵn sàng đồng hành cùng bạn. Cứ thoải mái hỏi mình về cách dùng MathBot hay thông tin kỳ thi THPT nhé! (Cần giải một bài Toán cụ thể thì bạn dùng Trợ lý Toán nha.)
                </div>
                <div className="space-y-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="block w-full text-left text-[12.5px] px-3 py-2 rounded-lg bg-white border border-gray-100 text-gray-700 hover:border-[#059669] hover:text-[#059669] transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#059669] text-white rounded-br-sm'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    m.content ? (
                      <div className="assistant-md">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ href, children }) => {
                              const url = href || '';
                              if (url.startsWith('/')) {
                                return (
                                  <a
                                    href={url}
                                    onClick={(e) => { e.preventDefault(); handleLinkClick(url); }}
                                    className="text-[#059669] font-semibold underline underline-offset-2 cursor-pointer"
                                  >
                                    {children}
                                  </a>
                                );
                              }
                              return (
                                <a href={url} target="_blank" rel="noopener noreferrer" className="text-[#0ea5e9] underline">
                                  {children}
                                </a>
                              );
                            },
                            p: ({ children }) => <p className="mb-1.5 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-1.5 space-y-0.5">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-1.5 space-y-0.5">{children}</ol>,
                            strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
                          }}
                        >
                          {linkifyAssistant(m.content)}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="inline-flex gap-1 items-center text-gray-400">
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex items-center gap-2 p-2.5 border-t border-gray-100 bg-white"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi cách dùng hệ thống..."
              className="flex-1 px-3 py-2 rounded-xl bg-gray-50 text-[13px] text-gray-800 outline-none focus:ring-2 focus:ring-[#059669]/30"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Gửi"
              className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-[#047857] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
