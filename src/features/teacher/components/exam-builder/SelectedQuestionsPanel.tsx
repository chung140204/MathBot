'use client';
import React from 'react';
import { ArrowUp, ArrowDown, X, Loader2, ImagePlus } from 'lucide-react';
import MathRenderer from '@/shared/components/MathRenderer';

const TOPICS: Record<string, string> = {
  DERIVATIVES: 'Đạo hàm', INTEGRALS: 'Tích phân', FUNCTIONS: 'Hàm số', LIMITS: 'Giới hạn',
  COMPLEX_NUMBERS: 'Số phức', PROBABILITY: 'Xác suất', SEQUENCES: 'Dãy số',
  EXPONENTIAL_LOG: 'Mũ - Logarit', VOLUME: 'Thể tích', ANALYTIC_GEOMETRY: 'HH giải tích', SOLID_GEOMETRY: 'HH không gian',
};
const DIFFICULTIES: Record<string, string> = { RECOGNITION: 'Nhận biết', COMPREHENSION: 'Thông hiểu', APPLICATION: 'Vận dụng', ADVANCED: 'Vận dụng cao' };
const FORMATS: Record<string, string> = { MULTIPLE_CHOICE: 'Trắc nghiệm', TRUE_FALSE: 'Đúng/Sai', SHORT_ANSWER: 'Trả lời ngắn' };

interface Question { id: string; content: string; topic: string; difficulty: string; format: string; }

interface SelectedQuestionsPanelProps {
  selected: Question[];
  buildMode: 'manual' | 'auto';
  uploading: boolean;
  uploadRef: React.RefObject<HTMLInputElement | null>;
  handleUploadImages: (files: FileList) => void;
  moveUp: (idx: number) => void;
  moveDown: (idx: number) => void;
  removeQuestion: (id: string) => void;
}

export function SelectedQuestionsPanel({ selected, buildMode, uploading, uploadRef, handleUploadImages, moveUp, moveDown, removeQuestion }: SelectedQuestionsPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h2 className="font-semibold text-gray-900 mb-3">Câu hỏi đã chọn ({selected.length})</h2>
      {selected.length === 0 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          {buildMode === 'manual' ? 'Nhấn + để thêm câu hỏi từ ngân hàng' : 'Cấu hình và bấm "Tạo đề" để tạo tự động'}
        </div>
      ) : (
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {selected.map((q, idx) => (
            <div key={q.id} className="p-3 rounded-lg border border-gray-100 text-sm flex items-start gap-2">
              <span className="text-xs font-bold text-gray-400 w-6 mt-0.5">{idx + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 truncate"><MathRenderer content={q.content.length > 60 ? q.content.slice(0, 60) + '...' : q.content} /></p>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">{TOPICS[q.topic] || q.topic}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">{DIFFICULTIES[q.difficulty] || q.difficulty}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-50 text-purple-600">{FORMATS[q.format] || q.format}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-20"><ArrowUp size={12} /></button>
                <button onClick={() => moveDown(idx)} disabled={idx === selected.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-20"><ArrowDown size={12} /></button>
                <button onClick={() => removeQuestion(q.id)} className="p-1 hover:bg-red-50 text-red-400 rounded"><X size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100">
        <input ref={uploadRef} type="file" accept=".jpg,.jpeg,.png,.webp,.pdf" multiple className="hidden"
          onChange={e => { if (e.target.files?.length) handleUploadImages(e.target.files); e.target.value = ''; }} />
        <button onClick={() => uploadRef.current?.click()} disabled={uploading}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition disabled:opacity-50">
          {uploading ? <><Loader2 size={14} className="animate-spin" /> Đang trích xuất...</> : <><ImagePlus size={14} /> Upload ảnh bổ sung câu hỏi</>}
        </button>
      </div>
    </div>
  );
}
