'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2, X, Check, Image as ImageIcon } from 'lucide-react';
import { QuestionPreviewPanel } from './manual/QuestionPreviewPanel';
import { MultipleChoiceSection, TrueFalseSection, ShortAnswerSection } from './manual/AnswerSections';
import { QuestionFormConfig } from './manual/QuestionFormConfig';
import { QuestionFormFooter } from './manual/QuestionFormFooter';

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
        <QuestionFormConfig
          format={format} setFormat={setFormat}
          topic={topic} setTopic={setTopic}
          difficulty={difficulty} setDifficulty={setDifficulty}
          questionType={questionType} setQuestionType={setQuestionType}
        />

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

        {/* Options / Answers — extracted components */}
        {format === 'MULTIPLE_CHOICE' && (
          <MultipleChoiceSection options={options} answer={answer} isUploading={isUploading}
            onSetAnswer={setAnswer}
            onSetOptionText={(key, text) => setOptions(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof options], text } }))}
            onImageUpload={handleImageUpload} onRemoveImage={removeImage} />
        )}
        {format === 'TRUE_FALSE' && (
          <TrueFalseSection statements={statements}
            onSetStatementText={(key, text) => setStatements(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof statements], text } }))}
            onSetStatementCorrect={(key, correct) => setStatements(prev => ({ ...prev, [key]: { ...prev[key as keyof typeof statements], correct } }))}
            onImageUpload={handleImageUpload} onRemoveImage={removeImage} />
        )}
        {format === 'SHORT_ANSWER' && (
          <ShortAnswerSection correctAnswer={correctAnswer} onChange={setCorrectAnswer} />
        )}

        <QuestionFormFooter
          explanation={explanation} setExplanation={setExplanation}
          isSubmitting={isSubmitting} onSave={handleSave}
        />
      </div>

      {/* Right Panel: Live Preview (extracted) */}
      <QuestionPreviewPanel
        format={format} difficulty={difficulty} content={content}
        contentImageUrl={contentImageUrl} options={options} answer={answer}
        statements={statements} correctAnswer={correctAnswer} explanation={explanation}
      />
    </div>
  );
}
