'use client';

import { Loader2, Check } from 'lucide-react';

interface QuestionFormFooterProps {
  explanation: string;
  setExplanation: (e: string) => void;
  isSubmitting: boolean;
  onSave: () => void;
}

export function QuestionFormFooter({ explanation, setExplanation, isSubmitting, onSave }: QuestionFormFooterProps) {
  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block text-indigo-600">Lời giải chi tiết</label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          placeholder="Nhập các bước giải chi tiết..."
          className="w-full p-4 bg-slate-50 border-none rounded-xl text-slate-600 min-h-[120px] focus:ring-2 focus:ring-indigo-500 font-medium"
        />
      </div>

      <button
        onClick={onSave}
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Check className="w-5 h-5" />
            Lưu câu hỏi mới
          </>
        )}
      </button>
    </>
  );
}
