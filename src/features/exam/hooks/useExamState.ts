'use client';
import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { QuestionData } from '@/features/exam/components/QuestionCard';
import { TOPICS } from '@/shared/constants/topics';

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ExamState {
  questions: QuestionData[];
  answers: Record<string, string | null>;
  skipped: Set<string>;
  currentIndex: number;
  timeRemaining: number;
  initialTimeLimit: number;
  isSubmitting: boolean;
  isFinished: boolean;
  examSessionId: string;
  examMode: string;
}

type ExamAction =
  | { type: 'HYDRATE'; state: Partial<ExamState> }
  | { type: 'INIT'; questions: QuestionData[]; examSessionId: string; timeRemaining: number; examMode: string }
  | { type: 'SELECT_ANSWER'; questionId: string; answer: string }
  | { type: 'SKIP_QUESTION'; questionId: string }
  | { type: 'NAVIGATE'; index: number }
  | { type: 'TICK' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_DONE' };

// ─── Reducer ───────────────────────────────────────────────────────────────────

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case 'HYDRATE': return { ...state, ...action.state };
    case 'INIT':
      return { ...state, questions: action.questions, examSessionId: action.examSessionId, timeRemaining: action.timeRemaining, initialTimeLimit: action.timeRemaining, examMode: action.examMode, answers: {}, skipped: new Set<string>(), currentIndex: 0, isSubmitting: false, isFinished: false };
    case 'SELECT_ANSWER': {
      const newSkipped = new Set(state.skipped);
      newSkipped.delete(action.questionId);
      return { ...state, answers: { ...state.answers, [action.questionId]: action.answer }, skipped: newSkipped };
    }
    case 'SKIP_QUESTION': {
      const newSkipped = new Set(state.skipped);
      newSkipped.add(action.questionId);
      return { ...state, skipped: newSkipped, currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1) };
    }
    case 'NAVIGATE': return { ...state, currentIndex: action.index };
    case 'TICK': return state.timeRemaining <= 0 ? { ...state, timeRemaining: 0 } : { ...state, timeRemaining: state.timeRemaining - 1 };
    case 'SUBMIT_START': return { ...state, isSubmitting: true };
    case 'SUBMIT_DONE': return { ...state, isSubmitting: false, isFinished: true };
    default: return state;
  }
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useExamState() {
  const router = useRouter();
  const [phase, setPhase] = useState<'setup' | 'exam'>('setup');
  const [isGenerating, setIsGenerating] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, dispatch] = useReducer(examReducer, {
    questions: [], answers: {}, skipped: new Set<string>(), currentIndex: 0,
    timeRemaining: 0, initialTimeLimit: 0, isSubmitting: false, isFinished: false,
    examSessionId: '', examMode: 'standard',
  });

  // 1. Hydrate from localStorage
  useEffect(() => {
    const savedSessionId = localStorage.getItem('current_exam_session');
    if (savedSessionId) {
      const saved = localStorage.getItem(`exam_state_${savedSessionId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.questions?.length > 0 && parsed.timeRemaining > 0) {
            dispatch({ type: 'HYDRATE', state: { ...parsed, skipped: new Set(parsed.skipped), isSubmitting: false, isFinished: false } });
            setPhase('exam');
          }
        } catch {
          localStorage.removeItem(`exam_state_${savedSessionId}`);
          localStorage.removeItem('current_exam_session');
        }
      }
    }
    setIsHydrated(true);
  }, []);

  // 2. Persist state
  useEffect(() => {
    if (isHydrated && phase === 'exam' && !state.isFinished && state.examSessionId) {
      localStorage.setItem(`exam_state_${state.examSessionId}`, JSON.stringify({ ...state, skipped: Array.from(state.skipped) }));
      localStorage.setItem('current_exam_session', state.examSessionId);
    }
  }, [state, isHydrated, phase]);

  // 3. Timer
  useEffect(() => {
    if (phase !== 'exam' || state.isFinished || !isHydrated) return;
    timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase, state.isFinished, isHydrated]);

  // 4. Auto-submit on time-up
  useEffect(() => {
    if (state.timeRemaining <= 0 && !state.isFinished && !state.isSubmitting && isHydrated && phase === 'exam') {
      handleSubmit(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timeRemaining, isHydrated, phase]);

  const handleStartExam = useCallback(async (requestBody: Record<string, unknown>) => {
    setIsGenerating(true);
    setSetupError(null);
    try {
      const res = await fetch('/api/v1/exam/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
      const data = await res.json();
      if (!res.ok) { setSetupError(data.error?.message || 'Không thể tạo đề thi. Vui lòng thử lại.'); return; }
      dispatch({ type: 'INIT', questions: data.questions, examSessionId: data.examSessionId, timeRemaining: data.timeLimit, examMode: data.mode });
      setPhase('exam');
    } catch {
      setSetupError('Lỗi kết nối server. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Auto-start from URL params
  useEffect(() => {
    if (!isHydrated || phase !== 'setup' || isGenerating) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') !== 'true') return;
    const mode = params.get('mode') || 'standard';
    let requestBody: Record<string, unknown>;
    if (mode === 'quick') {
      const topic = params.get('topic');
      const allTopicIds = TOPICS.map(t => t.id);
      requestBody = { mode: 'quick', topic: topic || allTopicIds[Math.floor(Math.random() * allTopicIds.length)] };
      const difficulty = params.get('difficulty');
      if (difficulty) requestBody.difficulty = difficulty;
    } else if (mode === 'thpt') {
      requestBody = { mode: 'thpt' };
    } else {
      const topicsStr = params.get('topics');
      const topics = topicsStr?.split(',').filter(Boolean) || [];
      requestBody = { mode: 'standard', topics: topics.length > 0 ? topics : TOPICS.map(t => t.id) };
      const difficulty = params.get('difficulty');
      if (difficulty) requestBody.difficulty = difficulty;
    }
    handleStartExam(requestBody);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, handleStartExam]);

  const handleSubmit = async (isAuto = false) => {
    if (!isAuto) {
      const answeredCount = Object.keys(state.answers).length;
      if (!window.confirm(`Bạn đã hoàn thành ${answeredCount}/${state.questions.length} câu hỏi. Bạn có chắc chắn muốn nộp bài?`)) return;
    }
    dispatch({ type: 'SUBMIT_START' });
    try {
      const formattedAnswers = state.questions.map(q => {
        const raw = state.answers[q.id];
        if (q.format === 'TRUE_FALSE') {
          const vals = raw?.split(',') || [];
          return { questionId: q.id, format: 'TRUE_FALSE', tfAnswerA: vals[0] === 'T' ? true : vals[0] === 'F' ? false : null, tfAnswerB: vals[1] === 'T' ? true : vals[1] === 'F' ? false : null, tfAnswerC: vals[2] === 'T' ? true : vals[2] === 'F' ? false : null, tfAnswerD: vals[3] === 'T' ? true : vals[3] === 'F' ? false : null };
        }
        if (q.format === 'SHORT_ANSWER') return { questionId: q.id, format: 'SHORT_ANSWER', shortAnswer: raw || null };
        return { questionId: q.id, format: 'MULTIPLE_CHOICE', userAnswer: raw || null };
      });
      const res = await fetch('/api/v1/exam/submit', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: formattedAnswers, timeTakenSecs: Math.max(0, state.initialTimeLimit - state.timeRemaining), topics: [...new Set(state.questions.map(q => q.topic))], mode: state.examMode.toUpperCase() }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.removeItem(`exam_state_${state.examSessionId}`);
        localStorage.removeItem('current_exam_session');
        dispatch({ type: 'SUBMIT_DONE' });
        router.push(`/exam/result?attemptId=${data.id || data.attemptId}`);
      } else {
        toast.error('Nộp bài thất bại. Vui lòng thử lại!');
        dispatch({ type: 'SUBMIT_DONE' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Lỗi kết nối server!');
      dispatch({ type: 'SUBMIT_DONE' });
    }
  };

  return { state, dispatch, phase, isGenerating, setupError, isHydrated, handleStartExam, handleSubmit };
}
