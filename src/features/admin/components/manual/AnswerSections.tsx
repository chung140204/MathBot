'use client';

import { Check, X, Image as ImageIcon } from 'lucide-react';
import { LatexPreview } from './QuestionPreviewPanel';

// ---------------------------------------------------------------------------
// Multiple Choice Options
// ---------------------------------------------------------------------------

interface MCProps {
  options: Record<string, { text: string; imageUrl: string }>;
  answer: string;
  isUploading: string | null;
  onSetAnswer: (key: string) => void;
  onSetOptionText: (key: string, text: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, target: string) => void;
  onRemoveImage: (target: string) => void;
}

export function MultipleChoiceSection({ options, answer, onSetAnswer, onSetOptionText, onImageUpload, onRemoveImage }: MCProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Các phương án lựa chọn</label>
      <div className="space-y-4">
        {Object.entries(options).map(([key, value]) => (
          <div key={key} className="flex gap-4 items-start">
            <button onClick={() => onSetAnswer(key)}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shrink-0 ${
                answer === key ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 ring-4 ring-emerald-50' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}>
              {answer === key ? <Check className="w-5 h-5" /> : key}
            </button>
            <div className="flex-1 space-y-3">
              <div className="relative group">
                <input type="text" value={value.text} onChange={e => onSetOptionText(key, e.target.value)}
                  placeholder={`Phương án ${key}...`} className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500" />
                <div className="absolute right-2 top-1.5 flex gap-1">
                  <input type="file" id={`img-${key}`} className="hidden" onChange={e => onImageUpload(e, `option-${key}`)} accept="image/*" />
                  <label htmlFor={`img-${key}`} className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                    <ImageIcon className="w-4 h-4" />
                  </label>
                </div>
              </div>
              {value.imageUrl && (
                <div className="relative group inline-block rounded-lg overflow-hidden border border-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value.imageUrl} alt={`Opt ${key}`} className="h-16 object-contain bg-slate-50 px-4" />
                  <button onClick={() => onRemoveImage(`option-${key}`)} className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// True/False Statements
// ---------------------------------------------------------------------------

interface TFProps {
  statements: Record<string, { text: string; imageUrl: string; correct: boolean }>;
  onSetStatementText: (key: string, text: string) => void;
  onSetStatementCorrect: (key: string, correct: boolean) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>, target: string) => void;
  onRemoveImage: (target: string) => void;
}

export function TrueFalseSection({ statements, onSetStatementText, onSetStatementCorrect, onImageUpload, onRemoveImage }: TFProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Các ý Đúng / Sai</label>
      <div className="space-y-6">
        {Object.entries(statements).map(([key, value]) => (
          <div key={key} className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
            <div className="flex gap-4 items-center">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">{key.toUpperCase()}</span>
              <input type="text" value={value.text} onChange={e => onSetStatementText(key, e.target.value)}
                placeholder={`Nhập ý ${key.toUpperCase()}...`} className="flex-1 p-2 bg-transparent border-none rounded-lg text-sm font-medium focus:ring-0 placeholder:text-slate-400" />
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                <button onClick={() => onSetStatementCorrect(key, true)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${value.correct ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-600'}`}>ĐÚNG</button>
                <button onClick={() => onSetStatementCorrect(key, false)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${!value.correct ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-slate-600'}`}>SAI</button>
              </div>
            </div>
            <div className="flex gap-3 items-center ml-12">
              <input type="file" id={`stmt-img-${key}`} className="hidden" onChange={e => onImageUpload(e, `statement-${key}`)} accept="image/*" />
              <label htmlFor={`stmt-img-${key}`} className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 cursor-pointer flex items-center gap-1 transition-colors">
                <ImageIcon className="w-3 h-3" /> Tải ảnh cho ý này
              </label>
              {value.imageUrl && (
                <div className="relative group rounded-lg overflow-hidden border border-slate-200 h-10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={value.imageUrl} alt={`Stmt ${key}`} className="h-full object-contain bg-white px-2" />
                  <button onClick={() => onRemoveImage(`statement-${key}`)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100">
                    <X className="w-2 h-2" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Short Answer
// ---------------------------------------------------------------------------

export function ShortAnswerSection({ correctAnswer, onChange }: { correctAnswer: string; onChange: (val: string) => void }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
      <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Đáp án chính xác</label>
      <input type="text" value={correctAnswer} onChange={e => onChange(e.target.value)} placeholder="Nhập con số đáp án..."
        className="w-full p-4 bg-slate-50 border-none rounded-xl text-lg font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500" />
      {correctAnswer && correctAnswer.includes('$') && (
        <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 mt-2">
          <p className="text-[10px] font-bold text-indigo-400 mb-1 uppercase">Xem trước đáp án:</p>
          <LatexPreview text={correctAnswer} className="text-lg font-bold text-indigo-700" />
        </div>
      )}
      <p className="text-[10px] font-bold text-slate-400 italic">* Hệ thống sẽ tự động so khớp giá trị số này khi người dùng nộp bài.</p>
    </div>
  );
}
