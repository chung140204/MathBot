'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { TOPICS } from '@/lib/constants/topics';
import { Loader2, Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// --- Helper Functions ---

function renderLatex(text: string): string {
  if (!text) return '';
  // Replace $...$ with KaTeX rendered HTML
  // Match non-greedy to avoid capturing across multiple $ blocks
  return text.replace(/\$([^$]+)\$/g, (_, math) => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
      });
    } catch (e) {
      console.error('KaTeX error:', e);
      return `$${math}$`;
    }
  });
}

function LatexPreview({ text, className }: { text: string, className?: string }) {
  if (!text) return null;
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: renderLatex(text) }}
    />
  );
}

interface ManualInputFormProps {
  onSuccess?: () => void;
}

export default function ManualInputForm({ onSuccess }: ManualInputFormProps) {
  const [format, setFormat] = useState<'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER'>('MULTIPLE_CHOICE');
  const [topic, setTopic] = useState('DERIVATIVES');
  const [difficulty, setDifficulty] = useState('COMPREHENSION');
  const [questionType, setQuestionType] = useState('PRACTICE');
  const [content, setContent] = useState('');
  const [contentImageUrl, setContentImageUrl] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // MULTIPLE_CHOICE state
  const [options, setOptions] = useState({
    A: { text: '', imageUrl: '' },
    B: { text: '', imageUrl: '' },
    C: { text: '', imageUrl: '' },
    D: { text: '', imageUrl: '' },
  });
  const [answer, setAnswer] = useState('A');

  // TRUE_FALSE state
  const [statements, setStatements] = useState({
    a: { text: '', imageUrl: '', correct: true },
    b: { text: '', imageUrl: '', correct: true },
    c: { text: '', imageUrl: '', correct: true },
    d: { text: '', imageUrl: '', correct: true },
  });

  // SHORT_ANSWER state
  const [correctAnswer, setCorrectAnswer] = useState('');

  const imageInputRef = useRef<HTMLInputElement>(null);

  const processFileUpload = async (file: File, target: string) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh quá lớn (tối đa 5MB)');
      return;
    }

    try {
      setIsUploading(target);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/v1/admin/upload/image', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload thất bại');

      if (target === 'content') {
        setContentImageUrl(data.url);
      } else if (target.startsWith('option-')) {
        const option = target.split('-')[1] as keyof typeof options;
        setOptions(prev => ({
          ...prev,
          [option]: { ...prev[option], imageUrl: data.url }
        }));
      } else if (target.startsWith('statement-')) {
        const statement = target.split('-')[1] as keyof typeof statements;
        setStatements(prev => ({
          ...prev,
          [statement]: { ...prev[statement], imageUrl: data.url }
        }));
      }
      toast.success('Đã tải ảnh lên');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload thất bại';
      toast.error(message);
    } finally {
      setIsUploading(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFileUpload(file, target);
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault(); // Prevent pasting text if an image is found
          await processFileUpload(file, 'content');
        }
      }
    }
  };

  const removeImage = (target: string) => {
    if (target === 'content') setContentImageUrl('');
    else if (target.startsWith('option-')) {
      const option = target.split('-')[1] as keyof typeof options;
      setOptions(prev => ({ ...prev, [option]: { ...prev[option], imageUrl: '' } }));
    } else if (target.startsWith('statement-')) {
      const statement = target.split('-')[1] as keyof typeof statements;
      setStatements(prev => ({ ...prev, [statement]: { ...prev[statement], imageUrl: '' } }));
    }
  };

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung câu hỏi');
      return;
    }

    try {
      setIsSubmitting(true);
      const body = {
        format,
        topic,
        difficulty,
        questionType,
        content: content.trim(),
        imageUrl: contentImageUrl || null,
        explanation: explanation.trim() || null,
        options: format === 'MULTIPLE_CHOICE'
          ? { A: options.A.text, B: options.B.text, C: options.C.text, D: options.D.text }
          : {},
        answer: format === 'MULTIPLE_CHOICE' ? answer : '',
        optionAImageUrl: options.A.imageUrl || null,
        optionBImageUrl: options.B.imageUrl || null,
        optionCImageUrl: options.C.imageUrl || null,
        optionDImageUrl: options.D.imageUrl || null,
        statementA: statements.a.text || null,
        statementB: statements.b.text || null,
        statementC: statements.c.text || null,
        statementD: statements.d.text || null,
        statementAImageUrl: statements.a.imageUrl || null,
        statementBImageUrl: statements.b.imageUrl || null,
        statementCImageUrl: statements.c.imageUrl || null,
        statementDImageUrl: statements.d.imageUrl || null,
        answerA: statements.a.correct,
        answerB: statements.b.correct,
        answerC: statements.c.correct,
        answerD: statements.d.correct,
        correctAnswer: correctAnswer.trim() || null,
      };

      const res = await fetch('/api/v1/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lưu thất bại');

      toast.success('Đã lưu câu hỏi thành công!');
      
      // Reset form
      setContent('');
      setContentImageUrl('');
      setExplanation('');
      setOptions({
        A: { text: '', imageUrl: '' },
        B: { text: '', imageUrl: '' },
        C: { text: '', imageUrl: '' },
        D: { text: '', imageUrl: '' },
      });
      setStatements({
        a: { text: '', imageUrl: '', correct: true },
        b: { text: '', imageUrl: '', correct: true },
        c: { text: '', imageUrl: '', correct: true },
        d: { text: '', imageUrl: '', correct: true },
      });
      setCorrectAnswer('');

      if (onSuccess) onSuccess();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Lưu thất bại';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Left Panel: Form */}
      <div className="space-y-6">
        {/* Format Selector */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Định dạng câu hỏi</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'MULTIPLE_CHOICE' as const, label: 'Trắc nghiệm ABCD', icon: '📝' },
              { id: 'TRUE_FALSE' as const, label: 'Đúng / Sai', icon: '⚖️' },
              { id: 'SHORT_ANSWER' as const, label: 'Trả lời ngắn', icon: '🔢' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={`p-4 rounded-xl border-2 transition-all text-center space-y-2 ${
                  format === f.id
                    ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50'
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="text-2xl">{f.icon}</div>
                <div className={`text-xs font-bold ${format === f.id ? 'text-indigo-700' : 'text-slate-500'}`}>
                  {f.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Configurations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Chủ đề</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500"
            >
              {TOPICS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Mức độ</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="RECOGNITION">Nhận biết</option>
              <option value="COMPREHENSION">Thông hiểu</option>
              <option value="APPLICATION">Vận dụng</option>
              <option value="ADVANCED">Vận dụng cao</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Loại</label>
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500"
            >
              <option value="PRACTICE">Luyện tập</option>
              <option value="EXAM_SET">Bộ đề</option>
              <option value="THPT_EXAM">Đề thi THPT</option>
            </select>
          </div>
        </div>

        {/* Question Content */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Nội dung câu hỏi</label>
            <div className="flex gap-2">
              <input
                type="file"
                className="hidden"
                ref={imageInputRef}
                onChange={(e) => handleImageUpload(e, 'content')}
                accept="image/*"
              />
              <button
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading === 'content'}
                className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
              >
                {isUploading === 'content' ? <Loader2 className="w-3 h-3 animate-spin" /> : <ImageIcon className="w-3 h-3" />}
                Tải ảnh minh họa
              </button>
            </div>
          </div>
          
          {contentImageUrl && (
            <div className="relative group rounded-xl overflow-hidden border border-slate-100 max-h-48">
              <img src={contentImageUrl} alt="Preview" className="w-full object-contain bg-slate-50" />
              <button
                onClick={() => removeImage('content')}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onPaste={handlePaste}
            placeholder="Nhập đề bài ở đây (hỗ trợ LaTeX)..."
            className="w-full p-4 bg-slate-50 border-none rounded-xl text-slate-700 min-h-[120px] focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 font-medium leading-relaxed"
          />
        </div>

        {/* Options / Answers based on format */}
        {format === 'MULTIPLE_CHOICE' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Các phương án lựa chọn</label>
            <div className="space-y-4">
              {Object.entries(options).map(([key, value]) => (
                <div key={key} className="flex gap-4 items-start">
                  <button
                    onClick={() => setAnswer(key)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all shrink-0 ${
                      answer === key
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 ring-4 ring-emerald-50'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {answer === key ? <Check className="w-5 h-5" /> : key}
                  </button>
                  <div className="flex-1 space-y-3">
                    <div className="relative group">
                      <input
                        type="text"
                        value={value.text}
                        onChange={(e) => setOptions(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof options], text: e.target.value } }))}
                        placeholder={`Phương án ${key}...`}
                        className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="absolute right-2 top-1.5 flex gap-1">
                        <input
                          type="file"
                          id={`img-${key}`}
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, `option-${key}`)}
                          accept="image/*"
                        />
                        <label
                          htmlFor={`img-${key}`}
                          className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
                        >
                          <ImageIcon className="w-4 h-4" />
                        </label>
                      </div>
                    </div>
                    {value.imageUrl && (
                      <div className="relative group inline-block rounded-lg overflow-hidden border border-slate-100">
                        <img src={value.imageUrl} alt={`Opt ${key}`} className="h-16 object-contain bg-slate-50 px-4" />
                        <button
                          onClick={() => removeImage(`option-${key}`)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {format === 'TRUE_FALSE' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Các ý Đúng / Sai</label>
            <div className="space-y-6">
              {Object.entries(statements).map(([key, value]) => (
                <div key={key} className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="flex gap-4 items-center">
                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                      {key.toUpperCase()}
                    </span>
                    <input
                      type="text"
                      value={value.text}
                      onChange={(e) => setStatements(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof statements], text: e.target.value } }))}
                      placeholder={`Nhập ý ${key.toUpperCase()}...`}
                      className="flex-1 p-2 bg-transparent border-none rounded-lg text-sm font-medium focus:ring-0 placeholder:text-slate-400"
                    />
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                      <button
                        onClick={() => setStatements(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof statements], correct: true } }))}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          value.correct ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        ĐÚNG
                      </button>
                      <button
                        onClick={() => setStatements(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof statements], correct: false } }))}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          !value.correct ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        SAI
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3 items-center ml-12">
                     <input
                        type="file"
                        id={`stmt-img-${key}`}
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, `statement-${key}`)}
                        accept="image/*"
                      />
                      <label 
                        htmlFor={`stmt-img-${key}`}
                        className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 cursor-pointer flex items-center gap-1 transition-colors"
                      >
                        <ImageIcon className="w-3 h-3" /> Tải ảnh cho ý này
                      </label>
                      {value.imageUrl && (
                        <div className="relative group rounded-lg overflow-hidden border border-slate-200 h-10">
                          <img src={value.imageUrl} alt={`Stmt ${key}`} className="h-full object-contain bg-white px-2" />
                          <button
                             onClick={() => removeImage(`statement-${key}`)}
                             className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-2 h-2" />
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {format === 'SHORT_ANSWER' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Đáp án chính xác</label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Nhập con số đáp án..."
              className="w-full p-4 bg-slate-50 border-none rounded-xl text-lg font-bold text-indigo-600 focus:ring-2 focus:ring-indigo-500"
            />
            {correctAnswer && correctAnswer.includes('$') && (
              <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 mt-2">
                <p className="text-[10px] font-bold text-indigo-400 mb-1 uppercase">Xem trước đáp án:</p>
                <LatexPreview text={correctAnswer} className="text-lg font-bold text-indigo-700" />
              </div>
            )}
            <p className="text-[10px] font-bold text-slate-400 italic">
              * Hệ thống sẽ tự động so khớp giá trị số này khi người dùng nộp bài.
            </p>
          </div>
        )}

        {/* Explanation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block text-indigo-600">Lời giải chi tiết</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Nhập các bước giải chi tiết..."
            className="w-full p-4 bg-slate-50 border-none rounded-xl text-slate-600 min-h-[120px] focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSave}
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
      </div>

      {/* Right Panel: Live Preview */}
      <div className="hidden lg:block relative">
        <div className="sticky top-0 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Xem trước trực tiếp</h3>
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md uppercase tracking-widest">Preview Mode</span>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-8 border-slate-800">
            <div className="bg-white rounded-[1.8rem] min-h-[600px] overflow-hidden flex flex-col">
              {/* Fake Status Bar */}
              <div className="h-6 flex justify-between items-center px-6 mt-2">
                <span className="text-[10px] font-bold">9:41</span>
                <div className="flex gap-1.5 items-center">
                  <div className="w-3 h-3 rounded-full bg-slate-200" />
                  <div className="w-4 h-2.5 rounded-sm bg-slate-200" />
                </div>
              </div>

              <div className="p-6 space-y-6 flex-1 overflow-y-auto max-h-[550px] scrollbar-hide">
                {/* Header Tag */}
                <div className="flex gap-2">
                  <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-tighter">
                    {format.replace('_', ' ')}
                  </span>
                  <span className="text-[9px] font-black bg-indigo-600 text-white px-2 py-1 rounded-full uppercase tracking-tighter shadow-sm shadow-indigo-200">
                    {difficulty}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <LatexPreview 
                    text={content || 'Nội dung câu hỏi sẽ hiển thị ở đây...'} 
                    className="text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-wrap"
                  />
                  {contentImageUrl && (
                    <img src={contentImageUrl} className="w-full rounded-2xl shadow-md" alt="Preview" />
                  )}
                </div>

                {/* Question Area */}
                {format === 'MULTIPLE_CHOICE' && (
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(options).map(([key, val]) => (
                      <div
                        key={key}
                        className={`p-4 rounded-2xl border-2 flex items-center gap-3 transition-colors ${
                          answer === key ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-50'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                          answer === key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {key}
                        </span>
                        <div className="flex-1">
                          <LatexPreview 
                            text={val.text || `Phương án ${key}`} 
                            className={`text-xs font-bold ${answer === key ? 'text-indigo-900' : 'text-slate-600'}`}
                          />
                          {val.imageUrl && (
                            <img src={val.imageUrl} className="mt-2 h-12 object-contain" alt={key} />
                          )}
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
                           <LatexPreview 
                             text={val.text || `Mệnh đề ${key.toUpperCase()}`} 
                             className="text-[11px] font-bold text-slate-700 flex-1"
                           />
                         </div>
                         {val.imageUrl && (
                           <img src={val.imageUrl} className="w-full rounded-lg mt-1 h-20 object-contain bg-white" alt={key} />
                         )}
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
                      <LatexPreview 
                        text={correctAnswer || '?'} 
                        className="text-xl font-black text-indigo-600 truncate"
                      />
                    </div>
                  </div>
                )}

                {explanation && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 mb-1 uppercase tracking-widest flex items-center gap-1">
                       <Check className="w-3 h-3" /> Lời giải chi tiết
                    </p>
                    <LatexPreview 
                      text={explanation} 
                      className="text-[11px] font-base text-slate-600 italic leading-relaxed"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
