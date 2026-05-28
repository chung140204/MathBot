'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Check } from 'lucide-react';

function renderLatex(text: string): string {
  if (!text) return '';
  return text.replace(/\$([^$]+)\$/g, (_, math) => {
    try { return katex.renderToString(math, { throwOnError: false, displayMode: false }); }
    catch { return `$${math}$`; }
  });
}

export function LatexPreview({ text, className }: { text: string; className?: string }) {
  if (!text) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: renderLatex(text) }} />;
}

interface Props {
  format: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  difficulty: string;
  content: string;
  contentImageUrl: string;
  options: Record<string, { text: string; imageUrl: string }>;
  answer: string;
  statements: Record<string, { text: string; imageUrl: string; correct: boolean }>;
  correctAnswer: string;
  explanation: string;
}

export function QuestionPreviewPanel({
  format, difficulty, content, contentImageUrl, options, answer, statements, correctAnswer, explanation,
}: Props) {
  return (
    <div className="hidden lg:block relative">
      <div className="sticky top-0 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Xem trước trực tiếp</h3>
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md uppercase tracking-widest">Preview Mode</span>
        </div>
        <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-8 border-slate-800">
          <div className="bg-white rounded-[1.8rem] min-h-[600px] overflow-hidden flex flex-col">
            <div className="h-6 flex justify-between items-center px-6 mt-2">
              <span className="text-[10px] font-bold">9:41</span>
              <div className="flex gap-1.5 items-center"><div className="w-3 h-3 rounded-full bg-slate-200" /><div className="w-4 h-2.5 rounded-sm bg-slate-200" /></div>
            </div>
            <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[550px] scrollbar-hide">
              <div className="flex gap-2">
                <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-tighter">{format.replace('_', ' ')}</span>
                <span className="text-[9px] font-black bg-indigo-600 text-white px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm shadow-indigo-200">{difficulty}</span>
              </div>
              <div className="space-y-4">
                <LatexPreview text={content || 'Nội dung câu hỏi sẽ hiển thị ở đây...'} className="text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-wrap" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {contentImageUrl && <img src={contentImageUrl} className="w-full rounded-2xl shadow-md" alt="Preview" />}
              </div>

              {format === 'MULTIPLE_CHOICE' && (
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(options).map(([key, val]) => (
                    <div key={key} className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-colors ${answer === key ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50'}`}>
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${answer === key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{key}</span>
                      <div className="flex-1">
                        <LatexPreview text={val.text || `Phương án ${key}`} className={`text-xs font-bold ${answer === key ? 'text-indigo-900' : 'text-slate-600'}`} />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {val.imageUrl && <img src={val.imageUrl} className="mt-2 h-12 object-contain" alt={key} />}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {format === 'TRUE_FALSE' && (
                <div className="space-y-4">
                  {Object.entries(statements).map(([key, val]) => (
                    <div key={key} className="space-y-2 p-3 bg-slate-50 rounded-2xl">
                      <div className="flex gap-3">
                        <span className="text-[10px] font-black text-indigo-600">{key.toUpperCase()}</span>
                        <LatexPreview text={val.text || `Mệnh đề ${key.toUpperCase()}`} className="text-[11px] font-bold text-slate-700 flex-1" />
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {val.imageUrl && <img src={val.imageUrl} className="w-full rounded-lg mt-1 h-20 object-contain bg-white" alt={key} />}
                      <div className="flex gap-2 justify-end">
                        <div className={`px-3 py-1 rounded-lg text-[8px] font-black border ${val.correct ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200 text-slate-300'}`}>ĐÚNG</div>
                        <div className={`px-3 py-1 rounded-lg text-[8px] font-black border ${!val.correct ? 'bg-red-500 text-white border-red-500' : 'border-slate-200 text-slate-300'}`}>SAI</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {format === 'SHORT_ANSWER' && (
                <div className="p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 border-dashed text-center">
                  <p className="text-[10px] font-bold text-indigo-400 mb-2 uppercase">Vùng nhập đáp án</p>
                  <div className="h-10 w-full bg-white rounded-xl border border-indigo-200 flex items-center justify-center px-4 overflow-hidden">
                    <LatexPreview text={correctAnswer || '?'} className="text-xl font-black text-indigo-600 truncate" />
                  </div>
                </div>
              )}

              {explanation && (
                <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black text-emerald-600 mb-1 uppercase tracking-widest flex items-center gap-1"><Check className="w-3 h-3" /> Lời giải chi tiết</p>
                  <LatexPreview text={explanation} className="text-[11px] font-base text-slate-600 italic leading-relaxed" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
