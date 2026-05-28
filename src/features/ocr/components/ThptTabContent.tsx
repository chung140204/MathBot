'use client';

import React, { useState } from 'react';
import MathRenderer from '@/shared/components/MathRenderer';
import { TOPICS } from '@/shared/constants/topics';
import { ExtractedQuestion } from '@/features/ocr/lib/ocr-prompt';
import { useOcrExtraction } from '@/features/ocr/hooks/useOcrExtraction';
import { useBeforeUnload } from '@/features/ocr/hooks/useBeforeUnload';
import { FileDropZone } from './FileDropZone';
import { Badge, SuccessHero, DIFFICULTIES } from './SharedUI';
import {
  Upload, Loader2, AlertCircle, AlertTriangle, Info, FileCheck, ImagePlus,
} from 'lucide-react';

export default function ThptTabContent({ apiBasePath }: { apiBasePath: string }) {
  const [thptYear, setThptYear] = useState('2025');
  const [thptCode, setThptCode] = useState('');
  const [thptFiles, setThptFiles] = useState<File[]>([]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const ocr = useOcrExtraction({ apiBasePath, mode: 'thpt', defaultTotal: 22 });
  useBeforeUnload(ocr.status === 'extracting' || ocr.status === 'done');

  const handleExtract = () => {
    if (!thptFiles.length) return;
    ocr.startExtraction(thptFiles, { examYear: thptYear, examCode: thptCode });
  };

  const handleSave = async () => {
    if (!ocr.allAnswersFilled) return;
    ocr.setStatus('saving');
    try {
      const questionsWithImages = await Promise.all(
        ocr.questions.map(async (q) => {
          const figDataUrl = ocr.questionFigures[q.questionNumber];
          if (!figDataUrl) return q;
          try {
            const blob = await (await fetch(figDataUrl)).blob();
            const file = new File([blob], `fig-q${q.questionNumber}.png`, { type: 'image/png' });
            const fd = new FormData(); fd.append('file', file);
            const res = await fetch(`${apiBasePath}/image`, { method: 'POST', body: fd });
            if (res.ok) { const { url } = await res.json(); return { ...q, imageUrl: url }; }
          } catch { /* upload failed */ }
          return q;
        }),
      );
      const res = await fetch(`${apiBasePath}/ocr/save`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: questionsWithImages, examYear: thptYear, examCode: thptCode }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Save failed'); }
      const result = await res.json();
      if (result.examSet) ocr.setSavedExamSet(result.examSet);
      ocr.setStatus('saved');
    } catch (err) {
      ocr.setError(err instanceof Error ? err.message : 'Save failed');
      ocr.setStatus('error');
    }
  };

  const resetAll = () => { ocr.reset(); setThptFiles([]); setThptCode(''); setEditingIdx(null); };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0]">
        <h2 className="text-[#0f172a] text-[18px] font-bold mb-1">Import Đề THPT Quốc Gia</h2>
        <p className="text-[#64748b] text-[12px]">Upload ảnh hoặc PDF đề thi → AI tự động nhận diện và trích xuất câu hỏi</p>
      </div>

      {/* IDLE */}
      {ocr.status === 'idle' && (
        <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0] animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Năm thi</label>
              <select value={thptYear} onChange={e => setThptYear(e.target.value)}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#059669]">
                {[2025, 2024, 2023, 2022, 2021].map(y => <option key={y} value={String(y)}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Mã đề</label>
              <input type="text" value={thptCode} onChange={e => setThptCode(e.target.value)} placeholder="VD: 101, 102..."
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#059669]" />
            </div>
          </div>
          <FileDropZone accept=".jpg,.jpeg,.png,.webp,.pdf" multiple files={thptFiles}
            onFilesSelected={setThptFiles} subtitle="Hỗ trợ .jpg, .png, .pdf (nhiều file/trang)" />
          <div className="mt-4 bg-[#f0fdf9] border-l-4 border-[#059669] p-4 rounded-r-xl">
            <div className="flex gap-3">
              <Info className="text-[#059669] flex-shrink-0" size={18} />
              <p className="text-[#065f46] text-[12px] leading-relaxed">
                <b>Lưu ý:</b> Sau khi trích xuất, kiểm tra và nhập đáp án đúng cho từng câu hỏi trước khi lưu.
              </p>
            </div>
          </div>
          <button onClick={handleExtract} disabled={!thptFiles.length}
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#0891b2] text-white font-bold text-[14px] shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
            Bắt đầu phân tích bằng AI
          </button>
        </div>
      )}

      {/* CONVERTING */}
      {ocr.status === 'converting' && (
        <div className="bg-white p-12 rounded-2xl border border-[#e2e8f0] flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <Loader2 size={40} className="animate-spin text-[#059669] mb-4" />
          <h3 className="text-[#0f172a] text-[18px] font-bold mb-2">Đang chuyển PDF thành ảnh...</h3>
        </div>
      )}

      {/* EXTRACTING / DONE */}
      {(ocr.status === 'extracting' || ocr.status === 'done') && (
        <div className="space-y-4 animate-in fade-in duration-500">
          {/* Progress bar */}
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-bold text-[#0f172a]">
                {ocr.status === 'extracting' ? 'Đang trích xuất...' : 'Trích xuất hoàn tất'}
              </span>
              <span className="text-[12px] font-bold text-[#059669]">{ocr.progress.current}/{ocr.progress.total} câu</span>
            </div>
            <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#059669] to-[#0891b2] rounded-full transition-all duration-500"
                style={{ width: `${(ocr.progress.current / Math.max(ocr.progress.total, 1)) * 100}%` }} />
            </div>
            {ocr.status === 'done' && ocr.progress.current < 22 && (
              <p className="text-[11px] text-amber-600 mt-2"><AlertTriangle size={12} className="inline mr-1" />Chỉ trích xuất được {ocr.progress.current}/22 câu.</p>
            )}
          </div>

          {/* Question cards */}
          {ocr.questions.map((q, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#e2e8f0] animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[12px] font-black text-slate-400">Câu {q.questionNumber}</span>
                <Badge variant={q.format === 'MULTIPLE_CHOICE' ? 'blue' : q.format === 'TRUE_FALSE' ? 'purple' : 'green'}>
                  {q.format === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' : q.format === 'TRUE_FALSE' ? 'Đúng/Sai' : 'Trả lời ngắn'}
                </Badge>
                <div className="ml-auto flex gap-2">
                  <select value={q.topic} onChange={e => ocr.updateQuestion(idx, { topic: e.target.value })}
                    className="text-[11px] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-2 py-1 outline-none">
                    {TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <select value={q.difficulty} onChange={e => ocr.updateQuestion(idx, { difficulty: e.target.value })}
                    className="text-[11px] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-2 py-1 outline-none">
                    {DIFFICULTIES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <button onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                    className={`text-[11px] px-2 py-1 rounded-lg border font-bold transition-all ${
                      editingIdx === idx ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-[#f8fafc] border-[#e2e8f0] text-[#64748b] hover:border-[#059669]'
                    }`}>{editingIdx === idx ? '✓ Xong' : '✏️ Sửa'}</button>
                </div>
              </div>

              {/* Content */}
              {editingIdx === idx ? (
                <div className="mb-4">
                  <textarea value={q.content} onChange={e => ocr.updateQuestion(idx, { content: e.target.value })} rows={5}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] font-mono outline-none focus:border-[#059669] resize-y" />
                  {q.content && (
                    <div className="mt-2 p-3 bg-white border border-dashed border-[#d1d5db] rounded-lg text-[13px] leading-relaxed whitespace-pre-line">
                      <span className="block text-[9px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Xem trước</span>
                      <MathRenderer content={q.content} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-4 text-[13px] text-[#0f172a] leading-relaxed whitespace-pre-line">
                  <MathRenderer content={q.content} />
                </div>
              )}

              {/* Figure */}
              {ocr.questionFigures[q.questionNumber] && (
                <div className="mb-3 flex justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ocr.questionFigures[q.questionNumber]} alt={`Hình câu ${q.questionNumber}`}
                    className="max-h-48 w-auto rounded-lg border border-[#e2e8f0] cursor-zoom-in hover:opacity-90 transition-opacity"
                    onClick={() => window.open(ocr.questionFigures[q.questionNumber], '_blank')} />
                </div>
              )}

              {/* MC options + answer */}
              {q.format === 'MULTIPLE_CHOICE' && q.options && (
                <div className="space-y-2">
                  {(['A', 'B', 'C', 'D'] as const).map(opt => (
                    <div key={opt} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] ${q.answer === opt ? 'bg-emerald-50 border border-emerald-200' : 'bg-[#f8fafc]'}`}>
                      <button onClick={() => ocr.updateQuestion(idx, { answer: opt })}
                        className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center border-2 transition-all ${
                          q.answer === opt ? 'bg-[#059669] text-white border-[#059669]' : 'border-[#d1d5db] text-[#6b7280] hover:border-[#059669]'
                        }`}>{opt}</button>
                      <MathRenderer content={q.options![opt]} className="flex-1" />
                    </div>
                  ))}
                  {!q.answer && <p className="text-[11px] text-red-500 font-medium">* Vui lòng chọn đáp án đúng</p>}
                </div>
              )}

              {/* TF */}
              {q.format === 'TRUE_FALSE' && (['A', 'B', 'C', 'D'] as const).map(letter => {
                const stKey = `statement${letter}` as keyof ExtractedQuestion;
                const ansKey = `answer${letter}` as keyof ExtractedQuestion;
                const ansVal = q[ansKey] as boolean | undefined;
                return (
                  <div key={letter} className="flex items-center gap-3 px-3 py-2 bg-[#f8fafc] rounded-lg text-[12px]">
                    <span className="text-[10px] font-bold text-slate-400 w-4">{letter.toLowerCase()})</span>
                    <MathRenderer content={String(q[stKey] || '')} className="flex-1" />
                    <div className="flex gap-1">
                      <button onClick={() => ocr.updateQuestion(idx, { [ansKey]: true } as Partial<ExtractedQuestion>)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${ansVal === true ? 'bg-emerald-500 text-white' : 'bg-white border border-[#d1d5db] text-[#6b7280] hover:border-emerald-400'}`}>Đ</button>
                      <button onClick={() => ocr.updateQuestion(idx, { [ansKey]: false } as Partial<ExtractedQuestion>)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${ansVal === false ? 'bg-red-500 text-white' : 'bg-white border border-[#d1d5db] text-[#6b7280] hover:border-red-400'}`}>S</button>
                    </div>
                  </div>
                );
              })}

              {/* SA */}
              {q.format === 'SHORT_ANSWER' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#0f172a] mb-1">Đáp án đúng:</label>
                  <input type="text" value={q.correctAnswer || ''} onChange={e => ocr.updateQuestion(idx, { correctAnswer: e.target.value })}
                    placeholder="VD: 4, 2+a, 120..."
                    className={`w-full bg-[#f8fafc] border rounded-lg px-3 py-2 text-[13px] outline-none transition-all ${!q.correctAnswer ? 'border-red-300' : 'border-[#e2e8f0] focus:border-[#059669]'}`} />
                </div>
              )}

              {/* Explanation */}
              <div className="mt-4 border-t border-[#f1f5f9] pt-3">
                <label className="block text-[11px] font-bold text-[#94a3b8] mb-1 uppercase tracking-wide">Lời giải chi tiết</label>
                <textarea value={q.explanation || ''} onChange={e => ocr.updateQuestion(idx, { explanation: e.target.value })}
                  placeholder="Nhập lời giải..." rows={3}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-3 py-2 text-[12px] outline-none focus:border-[#059669] resize-y transition-all" />
                {q.explanation && (
                  <div className="mt-2 p-3 bg-white border border-dashed border-[#d1d5db] rounded-lg text-[13px] leading-relaxed whitespace-pre-line">
                    <MathRenderer content={q.explanation} />
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Actions */}
          {ocr.status === 'done' && ocr.questions.length > 0 && (
            <div className="flex justify-between items-center">
              <button onClick={resetAll} className="px-6 py-2.5 rounded-xl border border-[#e2e8f0] text-[#64748b] font-bold text-[13px] hover:bg-slate-50">Hủy & Thử lại</button>
              <button onClick={handleSave} disabled={!ocr.allAnswersFilled || ocr.questions.length < 22}
                className="px-8 py-2.5 rounded-xl bg-[#0f172a] text-white font-bold text-[13px] shadow-lg disabled:opacity-40 disabled:cursor-not-allowed">
                {ocr.questions.length < 22 ? `Cần đủ 22 câu (hiện có ${ocr.questions.length})`
                  : ocr.allAnswersFilled ? `Lưu ${ocr.questions.length} câu hỏi vào kho đề` : 'Vui lòng nhập đáp án cho tất cả câu'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* SAVING */}
      {ocr.status === 'saving' && (
        <div className="bg-white p-12 rounded-2xl border border-[#e2e8f0] flex flex-col items-center animate-in fade-in zoom-in duration-500">
          <Loader2 size={40} className="animate-spin text-[#059669] mb-4" />
          <h3 className="text-[#0f172a] text-[18px] font-bold">Đang lưu vào kho đề...</h3>
        </div>
      )}

      {/* SAVED */}
      {ocr.status === 'saved' && (
        <div>
          <SuccessHero stats={{ total: ocr.questions.length, success: ocr.questions.length }} onReset={resetAll} />
          {ocr.savedExamSet && (
            <div className="bg-white rounded-2xl border border-blue-100 p-6 mt-4 text-center">
              <p className="text-sm text-gray-600 mb-3">Đã tạo bộ đề: <span className="font-bold text-gray-900">{ocr.savedExamSet.title}</span></p>
              <a href={`/teacher/exam-sets/${ocr.savedExamSet.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">Xem bộ đề</a>
            </div>
          )}
        </div>
      )}

      {/* ERROR */}
      {ocr.status === 'error' && (
        <div className="bg-white p-8 rounded-2xl border border-red-200 text-center animate-in fade-in duration-500">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
          <h3 className="text-[#0f172a] text-[18px] font-bold mb-2">Đã xảy ra lỗi</h3>
          <p className="text-[#64748b] text-[13px] mb-6">{ocr.error}</p>
          <button onClick={resetAll} className="px-8 py-2.5 rounded-xl bg-[#0f172a] text-white font-bold text-[13px]">Thử lại</button>
        </div>
      )}
    </div>
  );
}
