'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Loader2, Lightbulb, AlertCircle } from 'lucide-react';
import MathRenderer from '@/shared/components/MathRenderer';

interface AIHintModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionContent: string;
}

export default function AIHintModal({ isOpen, onClose, questionContent }: AIHintModalProps) {
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHint = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Tôi đang làm câu hỏi toán này: "${questionContent}". Đừng giải chi tiết, hãy cho tôi 1 gợi ý ngắn gọn giúp tôi tự giải được. Trả lời bằng tiếng Việt, sử dụng KaTeX cho công thức toán.`
            }
          ]
        })
      });

      if (res.ok) {
        // SSE parsing
        const reader = res.body?.getReader();
        if (!reader) throw new Error('No body');
        
        let fullContent = '';
        const decoder = new TextDecoder();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content || '';
                fullContent += delta;
              } catch (e) {
                // Not JSON or partial
              }
            }
          }
          setHint(fullContent);
        }
      } else {
        throw new Error('Failed to fetch hint');
      }
    } catch (err) {
      setError('Không thể kết nối với AI. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !hint) {
      fetchHint();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-emerald-100 flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 leading-tight">Gợi ý từ MathBot</h3>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">AI Assistance</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200/50 rounded-full transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading && !hint ? (
             <div className="flex flex-col items-center justify-center py-12 gap-4 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                <p className="text-sm font-bold animate-pulse">Đang phân tích câu hỏi...</p>
             </div>
          ) : error ? (
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
               <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
               <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
               <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-2xl border border-amber-100/50">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                  <div className="text-sm text-slate-700 font-medium leading-relaxed italic">
                    "{questionContent.substring(0, 100)}{questionContent.length > 100 ? '...' : ''}"
                  </div>
               </div>
               
               <div className="prose prose-slate max-w-none">
                  <div className="text-slate-900 leading-relaxed font-medium">
                     <MathRenderer content={hint || ''} />
                  </div>
               </div>
               
               {loading && (
                 <div className="flex justify-end mt-4">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-sm"
          >
            Tôi đã hiểu!
          </button>
        </div>
      </div>
    </div>
  );
}
