'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import MathRenderer from '@/shared/components/MathRenderer';
import { Clock, Send } from 'lucide-react';

interface Question {
  id: string; content: string; options: Record<string, string>; topic: string; difficulty: string; format: string;
  imageUrl: string | null; statementA: string | null; statementB: string | null; statementC: string | null; statementD: string | null;
}
interface Answer {
  questionId: string; answer?: string | null; shortAnswer?: string | null;
  tfAnswerA?: boolean; tfAnswerB?: boolean; tfAnswerC?: boolean; tfAnswerD?: boolean;
}

export default function ClassroomExamClient({ classroomId, assignmentId }: { classroomId: string; assignmentId: string }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  const [timeLimit, setTimeLimit] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  // Mốc bắt đầu để đo thời gian làm bài thật (kể cả khi bài tập không giới hạn giờ).
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    fetch(`/api/v1/classroom/${classroomId}/assignments/${assignmentId}/start`, { method: 'POST' })
      .then(r => { if (!r.ok) throw r; return r.json(); })
      .then(data => {
        setQuestions(data.questions || []);
        setTitle(data.title || '');
        setTimeLimit(data.timeLimit || null);
        if (data.timeLimit) setTimeLeft(data.timeLimit);
        startedAtRef.current = Date.now();
      })
      .catch(async (r) => {
        if (r instanceof Response) { const d = await r.json(); setError(d.error || 'Lỗi'); }
        else setError('Không thể bắt đầu bài thi');
      })
      .finally(() => setLoading(false));
  }, [classroomId, assignmentId]);

  const submitExam = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    const answerList: Answer[] = questions.map(q => answers[q.id] || { questionId: q.id });
    // Thời gian làm bài thật = đồng hồ bấm giờ từ lúc bắt đầu (chính xác kể cả khi
    // không giới hạn giờ). Fallback về (timeLimit - timeLeft) nếu thiếu mốc bắt đầu.
    const elapsedSecs = startedAtRef.current
      ? Math.floor((Date.now() - startedAtRef.current) / 1000)
      : (timeLimit ? timeLimit - (timeLeft || 0) : 0);
    try {
      const res = await fetch(`/api/v1/classroom/${classroomId}/assignments/${assignmentId}/submit`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerList, timeTakenSecs: Math.max(0, elapsedSecs) }),
      });
      if (res.ok) {
        const result = await res.json();
        localStorage.setItem(`exam-result-${assignmentId}`, JSON.stringify(result));
        router.push(`/classrooms/${classroomId}/assignments/${assignmentId}/result`);
      }
    } catch { setError('Lỗi nộp bài'); } finally { setSubmitting(false); }
  }, [submitting, questions, answers, classroomId, assignmentId, timeLimit, timeLeft, router]);

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) { clearInterval(timerRef.current!); submitExam(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft, submitExam]);

  const setAnswer = (questionId: string, update: Partial<Answer>) => {
    setAnswers(prev => ({ ...prev, [questionId]: { ...prev[questionId], questionId, ...update } }));
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" /></div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  const q = questions[currentIdx];
  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col p-4">
        <h2 className="font-bold text-gray-900 mb-1 text-sm truncate">{title}</h2>
        {timeLeft !== null && (
          <div className={`flex items-center gap-1 text-sm font-mono mb-4 ${timeLeft < 60 ? 'text-red-600' : 'text-gray-600'}`}>
            <Clock size={14} /> {formatTime(timeLeft)}
          </div>
        )}
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {questions.map((qq, i) => (
            <button key={qq.id} onClick={() => setCurrentIdx(i)}
              className={`w-8 h-8 rounded text-xs font-bold ${i === currentIdx ? 'bg-emerald-600 text-white' : answers[qq.id] ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
              {i + 1}
            </button>
          ))}
        </div>
        <div className="mt-auto">
          <button onClick={() => { if (confirm('Bạn có chắc muốn nộp bài?')) submitExam(); }} disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50">
            <Send size={16} /> {submitting ? 'Đang nộp...' : 'Nộp bài'}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-8">
        {q && (
          <div className="max-w-3xl mx-auto">
            <p className="text-sm text-gray-500 mb-2">Câu {currentIdx + 1}/{questions.length}</p>
            <div className="bg-white rounded-xl border p-6 mb-6">
              <div className="prose prose-sm max-w-none mb-4"><MathRenderer content={q.content} /></div>
              {q.imageUrl && <img src={q.imageUrl} alt="" className="max-w-md rounded-lg border mb-4" />}

              {q.format === 'MULTIPLE_CHOICE' && (
                <div className="space-y-2">
                  {['A', 'B', 'C', 'D'].map(opt => (
                    <label key={opt} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${answers[q.id]?.answer === opt ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name={`q-${q.id}`} checked={answers[q.id]?.answer === opt} onChange={() => setAnswer(q.id, { answer: opt })} className="accent-emerald-600" />
                      <span className="font-bold text-gray-600">{opt}.</span>
                      <span className="text-sm"><MathRenderer content={q.options?.[opt] || ''} /></span>
                    </label>
                  ))}
                </div>
              )}

              {q.format === 'TRUE_FALSE' && (
                <div className="space-y-3">
                  {(['A', 'B', 'C', 'D'] as const).map(letter => {
                    const stmt = q[`statement${letter}` as keyof Question] as string | null;
                    const key = `tfAnswer${letter}` as keyof Answer;
                    if (!stmt) return null;
                    return (
                      <div key={letter} className="p-3 rounded-lg border border-gray-200">
                        <p className="text-sm mb-2"><span className="font-bold">{letter}.</span> <MathRenderer content={stmt} /></p>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                            <input type="radio" name={`q-${q.id}-${letter}`} checked={answers[q.id]?.[key] === true} onChange={() => setAnswer(q.id, { [key]: true })} className="accent-emerald-600" /> Đúng
                          </label>
                          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                            <input type="radio" name={`q-${q.id}-${letter}`} checked={answers[q.id]?.[key] === false} onChange={() => setAnswer(q.id, { [key]: false })} className="accent-emerald-600" /> Sai
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {q.format === 'SHORT_ANSWER' && (
                <input value={answers[q.id]?.shortAnswer || ''} onChange={e => setAnswer(q.id, { shortAnswer: e.target.value })} placeholder="Nhập đáp án..." className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm" />
              )}
            </div>

            {/* Nav buttons */}
            <div className="flex justify-between">
              <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0} className="px-4 py-2 bg-gray-100 rounded-lg text-sm disabled:opacity-30">Câu trước</button>
              <button onClick={() => setCurrentIdx(i => Math.min(questions.length - 1, i + 1))} disabled={currentIdx === questions.length - 1} className="px-4 py-2 bg-gray-100 rounded-lg text-sm disabled:opacity-30">Câu tiếp</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
