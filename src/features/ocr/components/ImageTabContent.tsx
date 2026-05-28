'use client';

import { useCallback, useState } from 'react';
import MathRenderer from '@/shared/components/MathRenderer';
import { TOPICS } from '@/shared/constants/topics';
import { ExtractedQuestion } from '@/features/ocr/lib/ocr-prompt';
import { useOcrExtraction } from '@/features/ocr/hooks/useOcrExtraction';
import { useBeforeUnload } from '@/features/ocr/hooks/useBeforeUnload';
import { FileDropZone } from './FileDropZone';
import { DIFFICULTIES } from './SharedUI';
import { ImagePlus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

/** Teacher upload endpoint — intentionally separate from admin apiBasePath */
const TEACHER_UPLOAD_URL = '/api/v1/teacher/questions/upload';

export default function ImageTabContent({ apiBasePath }: { apiBasePath: string }) {
  const [imgFiles, setImgFiles] = useState<File[]>([]);
  const [imgTitle, setImgTitle] = useState('');
  const [imgTopic, setImgTopic] = useState('');

  const ocr = useOcrExtraction({ apiBasePath, mode: 'individual', defaultTotal: 0 });
  useBeforeUnload(ocr.status === 'extracting' || ocr.status === 'done');

  const handleExtract = useCallback(() => {
    if (!imgFiles.length) return;
    ocr.startExtraction(imgFiles, { topic: imgTopic || undefined });
  }, [imgFiles, imgTopic, ocr]);

  const handleSave = useCallback(async () => {
    ocr.setStatus('saving');
    try {
      const questionsWithImages = await Promise.all(
        ocr.questions.map(async (q) => {
          const figDataUrl = ocr.questionFigures[q.questionNumber] || q.imageUrl;
          if (!figDataUrl || !figDataUrl.startsWith('data:')) return q;
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
      const saveBody: Record<string, unknown> = { questions: questionsWithImages };
      if (imgTitle.trim()) saveBody.title = imgTitle.trim();
      const res = await fetch(TEACHER_UPLOAD_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveBody),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Save failed'); }
      const result = await res.json();
      if (result.examSet) ocr.setSavedExamSet(result.examSet);
      ocr.setStatus('saved');
    } catch (err) {
      ocr.setError(err instanceof Error ? err.message : 'Lỗi lưu');
      ocr.setStatus('error');
    }
  }, [ocr, apiBasePath, imgTitle]);

  const resetAll = useCallback(() => { ocr.reset(); setImgFiles([]); setImgTitle(''); setImgTopic(''); }, [ocr]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* IDLE */}
      {ocr.status === 'idle' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8">
          <h2 className="text-[15px] font-bold text-[#0f172a] mb-2">Tải ảnh câu hỏi</h2>
          <p className="text-[13px] text-[#64748b] mb-6">Upload ảnh chứa câu hỏi toán → OCR trích xuất → lưu vào ngân hàng + tạo bộ đề.</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-[12px] font-bold text-[#374151] mb-1.5">Tên bộ đề *</label>
              <input value={imgTitle} onChange={e => setImgTitle(e.target.value)} placeholder="VD: Đề ôn Đạo hàm chương 3"
                className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-[#059669]" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#374151] mb-1.5">Chuyên đề *</label>
              <select value={imgTopic} onChange={e => setImgTopic(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#e2e8f0] rounded-xl text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]">
                <option value="">-- Chọn chuyên đề --</option>
                {TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <FileDropZone accept=".jpg,.jpeg,.png,.webp,.pdf" multiple files={imgFiles}
            onFilesSelected={(files) => setImgFiles(files)} icon="image"
            subtitle="JPG, PNG, WebP, PDF — tối đa 8 ảnh" />
          {imgFiles.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">{imgFiles.length} file đã chọn</p>
              <button onClick={handleExtract}
                className="w-full py-3 rounded-xl bg-[#059669] text-white font-bold text-[13px] hover:bg-[#047857] transition">
                Trích xuất câu hỏi
              </button>
            </div>
          )}
        </div>
      )}

      {/* EXTRACTING */}
      {ocr.status === 'extracting' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-8 text-center">
          <Loader2 size={32} className="animate-spin mx-auto mb-3 text-[#059669]" />
          <h3 className="font-bold text-[15px] text-[#0f172a]">Đang trích xuất câu hỏi...</h3>
          <p className="text-[13px] text-[#64748b] mt-1">{ocr.progress.current} câu đã nhận</p>
        </div>
      )}

      {/* CONVERTING */}
      {ocr.status === 'converting' && (
        <div className="bg-white rounded-2xl border border-[#e2e8f0] p-12 flex flex-col items-center">
          <Loader2 size={40} className="animate-spin text-[#059669] mb-4" />
          <h3 className="text-[18px] font-bold mb-2">Đang chuyển PDF thành ảnh...</h3>
        </div>
      )}

      {/* DONE / SAVING — Question cards */}
      {(ocr.status === 'done' || ocr.status === 'saving') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#0f172a]">Kết quả: {ocr.questions.length} câu hỏi</h2>
            <div className="flex gap-2">
              <button onClick={resetAll} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Hủy</button>
              <button disabled={ocr.questions.length === 0 || ocr.status === 'saving' || !imgTitle.trim()} onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-[#0f172a] text-white text-sm font-bold disabled:opacity-40">
                {ocr.status === 'saving' ? 'Đang lưu...' : !imgTitle.trim() ? 'Nhập tên bộ đề' : `Lưu bộ đề (${ocr.questions.length} câu)`}
              </button>
            </div>
          </div>
          <div className="space-y-4">
            {ocr.questions.map((q, i) => (
              <QuestionCardImg key={i} q={q} index={i} ocr={ocr} apiBasePath={apiBasePath} />
            ))}
          </div>
        </div>
      )}

      {/* SAVED */}
      {ocr.status === 'saved' && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-500" />
          <h3 className="text-[18px] font-bold text-[#0f172a] mb-2">Đã lưu thành công!</h3>
          <p className="text-[13px] text-[#64748b] mb-4">{ocr.questions.length} câu hỏi đã được thêm vào ngân hàng</p>
          <div className="flex gap-3 justify-center">
            <button onClick={resetAll} className="px-6 py-2.5 rounded-xl bg-[#0f172a] text-white font-bold text-[13px]">Tải thêm</button>
            <a href="/teacher/questions" className="px-6 py-2.5 rounded-xl border border-gray-200 text-[13px] font-bold text-gray-700 hover:bg-gray-50">Ngân hàng</a>
          </div>
        </div>
      )}

      {/* ERROR */}
      {ocr.status === 'error' && (
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center">
          <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
          <h3 className="text-[18px] font-bold mb-2">Đã xảy ra lỗi</h3>
          <p className="text-[13px] text-[#64748b] mb-4">{ocr.error}</p>
          <button onClick={resetAll} className="px-8 py-2.5 rounded-xl bg-[#0f172a] text-white font-bold text-[13px]">Thử lại</button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Question card for Image tab
// ---------------------------------------------------------------------------
function QuestionCardImg({ q, index, ocr, apiBasePath }: {
  q: ExtractedQuestion; index: number;
  ocr: ReturnType<typeof useOcrExtraction>; apiBasePath: string;
}) {
  const updateQ = (patch: Partial<ExtractedQuestion>) => ocr.updateQuestion(index, patch);
  const figUrl = ocr.questionFigures[q.questionNumber] || q.imageUrl;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold text-white bg-gray-800 px-2.5 py-1 rounded">Câu {index + 1}</span>
        <select value={q.format} onChange={e => updateQ({ format: e.target.value as ExtractedQuestion['format'] })}
          className="text-[11px] px-2 py-1 rounded border border-gray-200 bg-white font-medium">
          <option value="MULTIPLE_CHOICE">Trắc nghiệm</option>
          <option value="TRUE_FALSE">Đúng/Sai</option>
          <option value="SHORT_ANSWER">Trả lời ngắn</option>
        </select>
        <select value={q.topic} onChange={e => updateQ({ topic: e.target.value })}
          className="text-[11px] px-2 py-1 rounded border border-gray-200 bg-white">
          {TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
        <select value={q.difficulty} onChange={e => updateQ({ difficulty: e.target.value })}
          className="text-[11px] px-2 py-1 rounded border border-gray-200 bg-white">
          {DIFFICULTIES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <div className="flex-1" />
        <button onClick={() => ocr.setQuestions(prev => prev.filter((_, j) => j !== index))}
          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Xóa câu">
          <AlertCircle size={14} />
        </button>
      </div>

      <div className="text-sm text-gray-800 leading-relaxed"><MathRenderer content={q.content} /></div>

      {/* Figure */}
      <div>
        {figUrl ? (
          <div className="flex justify-center p-3 bg-gray-50 rounded-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={figUrl} alt="Hình câu hỏi" className="max-h-64 max-w-full rounded border border-gray-200 cursor-pointer hover:opacity-80"
              onClick={() => window.open(figUrl, '_blank')} />
          </div>
        ) : (
          <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-xs text-gray-500 cursor-pointer hover:border-blue-400 hover:text-blue-600 transition">
            <ImagePlus size={14} /> Thêm hình minh họa
            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
              const file = e.target.files?.[0]; if (!file) return;
              const fd = new FormData(); fd.append('file', file);
              try { const res = await fetch(`${apiBasePath}/image`, { method: 'POST', body: fd }); if (res.ok) { const { url } = await res.json(); updateQ({ imageUrl: url }); } } catch {}
            }} />
          </label>
        )}
      </div>

      {/* MC */}
      {q.format === 'MULTIPLE_CHOICE' && q.options && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500">Đáp án:</p>
          <div className="grid grid-cols-2 gap-2">
            {(['A', 'B', 'C', 'D'] as const).map(opt => (
              <button key={opt} onClick={() => updateQ({ answer: opt })}
                className={`text-left px-3 py-2 rounded-lg border text-sm transition ${q.answer === opt ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <span className="font-bold mr-2">{opt}.</span>
                <MathRenderer content={(q.options as Record<string, string>)[opt] || ''} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* TF */}
      {q.format === 'TRUE_FALSE' && (['A', 'B', 'C', 'D'] as const).map(letter => {
        const stKey = `statement${letter}` as keyof ExtractedQuestion;
        const ansKey = `answer${letter}` as keyof ExtractedQuestion;
        const statement = (q as unknown as Record<string, unknown>)[stKey] as string | undefined;
        const ans = (q as unknown as Record<string, unknown>)[ansKey] as boolean | undefined;
        return (
          <div key={letter} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
            <span className="text-xs font-bold text-gray-400 w-4">{letter.toLowerCase()})</span>
            <div className="flex-1 text-sm text-gray-700">
              {statement ? <MathRenderer content={statement} /> : <span className="text-gray-400 italic">Chưa có mệnh đề</span>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => updateQ({ [ansKey]: true } as Partial<ExtractedQuestion>)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${ans === true ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>Đ</button>
              <button onClick={() => updateQ({ [ansKey]: false } as Partial<ExtractedQuestion>)}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${ans === false ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>S</button>
            </div>
          </div>
        );
      })}

      {/* SA */}
      {q.format === 'SHORT_ANSWER' && (
        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">Đáp án (số):</label>
          <input type="text" value={q.correctAnswer || ''} placeholder="VD: 4.9" onChange={e => updateQ({ correctAnswer: e.target.value })}
            className="w-40 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      )}

      {/* Explanation */}
      <div>
        <label className="text-xs font-semibold text-gray-500 block mb-1">Lời giải (tùy chọn):</label>
        <textarea value={q.explanation || ''} rows={2} placeholder="Nhập lời giải..." onChange={e => updateQ({ explanation: e.target.value })}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    </div>
  );
}
