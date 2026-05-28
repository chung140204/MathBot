'use client';

import { useState, useRef, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface SourceItem { source: string; topic: string; similarity: number; }
interface Message { role: 'user' | 'assistant'; content: string; sources?: SourceItem[]; feedback?: 'up' | 'down' | null; id?: string; }

const SSE_TIMEOUT_MS = 120_000; // 2 minutes

export function useChatStream(opts: {
  sessionId: string | null;
  userId?: string;
  onSessionCreated: (id: string) => void;
  onMessageSent: () => void;
}) {
  const { sessionId, userId, onSessionCreated, onMessageSent } = opts;

  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [thinkingContent, setThinkingContent] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingExpanded, setThinkingExpanded] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingSeconds, setThinkingSeconds] = useState(0);
  const [pendingSources, setPendingSources] = useState<SourceItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const savedIdsRef = useRef<{ userMessageId: string; assistantMessageId: string } | null>(null);
  const thinkingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const sseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isStreamingRef = useRef(false);
  const sessionCreatedDuringStreamRef = useRef(false);

  const cleanup = useCallback(() => {
    setIsStreaming(false);
    isStreamingRef.current = false;
    if (thinkingTimerRef.current) { clearInterval(thinkingTimerRef.current); thinkingTimerRef.current = null; }
    if (sseTimeoutRef.current) { clearTimeout(sseTimeoutRef.current); sseTimeoutRef.current = null; }
  }, []);

  const sendMessage = useCallback(async (
    text: string,
    imageBase64: string | null,
    chatMode: 'thinking' | 'fast' | 'tutor',
    overrideHistory?: Message[],
  ) => {
    if ((!text.trim() && !imageBase64) || isStreamingRef.current) return;

    if (imageBase64 && !imageBase64.match(/^data:image\/(png|jpeg|jpg|gif|webp);base64,/)) {
      toast.error('Định dạng ảnh không hợp lệ.');
      return;
    }

    let contentToSend = text.trim();
    if (imageBase64) contentToSend = `![image](${imageBase64})\n\n${contentToSend}`;

    const userMsg: Message = { role: 'user', content: contentToSend };
    const baseHistory = overrideHistory || messages;
    const history = [...baseHistory, userMsg];
    setMessages(history);
    setIsStreaming(true);
    isStreamingRef.current = true;
    setThinkingSeconds(0);
    thinkingTimerRef.current = setInterval(() => setThinkingSeconds(s => s + 1), 1000);

    abortControllerRef.current = new AbortController();
    let accumulated = '';
    setPendingSources([]);
    savedIdsRef.current = null;

    const resetSseTimeout = () => {
      if (sseTimeoutRef.current) clearTimeout(sseTimeoutRef.current);
      sseTimeoutRef.current = setTimeout(() => abortControllerRef.current?.abort(), SSE_TIMEOUT_MS);
    };
    resetSseTimeout();

    try {
      const res = await fetch('/chat/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, sessionId, userId, imageBase64, mode: chatMode }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('[ChatStream] API Error:', errorText);
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
            if (parsed.event === 'session') { sessionCreatedDuringStreamRef.current = true; onSessionCreated(parsed.sessionId); }
            else if (parsed.event === 'rag_searching') { setIsSearching(true); }
            else if (parsed.event === 'sources') { setIsSearching(false); setPendingSources(parsed.data || []); }
            else if (parsed.event === 'saved') { savedIdsRef.current = { userMessageId: parsed.userMessageId, assistantMessageId: parsed.assistantMessageId }; }
            else if (parsed.event === 'thinking_start') { setIsThinking(true); setThinkingExpanded(true); }
            else if (parsed.event === 'thinking_end') {
              setIsThinking(false); setThinkingExpanded(false);
              if (thinkingTimerRef.current) { clearInterval(thinkingTimerRef.current); thinkingTimerRef.current = null; }
            }
            else if (parsed.reasoning && typeof parsed.reasoning === 'string') { setThinkingContent(prev => prev + parsed.reasoning); }
            else if (parsed.content && typeof parsed.content === 'string') {
              setIsSearching(false);
              if (thinkingTimerRef.current) { clearInterval(thinkingTimerRef.current); thinkingTimerRef.current = null; }
              accumulated += parsed.content;
              setStreamingContent(accumulated);
            }
          } catch { /* partial JSON chunk */ }
        }
      }

      const ids = savedIdsRef.current;
      setMessages(prev => {
        const updated = ids
          ? prev.map((msg, idx) => idx === prev.length - 1 && msg.role === 'user' ? { ...msg, id: ids.userMessageId } : msg)
          : prev;
        return [...updated, { role: 'assistant' as const, content: accumulated, sources: pendingSources, id: ids?.assistantMessageId }];
      });
      savedIdsRef.current = null;
      setStreamingContent(''); setThinkingContent(''); setIsThinking(false); setThinkingExpanded(false); setIsSearching(false);
      onMessageSent();
    } catch (err: unknown) {
      const isAbort = err instanceof DOMException && err.name === 'AbortError';
      if (isAbort) {
        if (accumulated.trim()) setMessages(prev => [...prev, { role: 'assistant', content: accumulated, sources: pendingSources }]);
        else if (sseTimeoutRef.current === null) setMessages(prev => [...prev, { role: 'assistant', content: 'Phản hồi mất quá lâu. Vui lòng thử lại.' }]);
      } else {
        console.error('[ChatStream]', err);
      }
      setStreamingContent(''); setThinkingContent(''); setIsThinking(false); setThinkingExpanded(false); setIsSearching(false);
    } finally {
      cleanup();
    }
  }, [messages, sessionId, userId, onSessionCreated, onMessageSent, pendingSources, cleanup]);

  const stopStreaming = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
  }, []);

  return {
    messages, setMessages, streamingContent, thinkingContent,
    isThinking, thinkingExpanded, setThinkingExpanded,
    isStreaming, isSearching, thinkingSeconds, pendingSources,
    isStreamingRef, sessionCreatedDuringStreamRef,
    sendMessage, stopStreaming,
  };
}
