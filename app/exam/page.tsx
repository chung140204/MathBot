'use client';

import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import ExamSidebar from '@/components/exam/ExamSidebar';
import ExamQuestion from '@/components/exam/ExamQuestion';
import ExamSetupModal from '@/components/exam/ExamSetupModal';
import { QuestionData } from '@/components/exam/QuestionCard';
import { TOPICS } from '@/lib/constants/topics';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExamState {
  questions: QuestionData[];
  answers: Record<string, string | null>;
  skipped: Set<string>;
  currentIndex: number;
  timeRemaining: number;
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

// ─── Reducer ──────────────────────────────────────────────────────────────────

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.state };
    case 'INIT':
      return {
        ...state,
        questions: action.questions,
        examSessionId: action.examSessionId,
        timeRemaining: action.timeRemaining,
        examMode: action.examMode,
        answers: {},
        skipped: new Set<string>(),
        currentIndex: 0,
        isSubmitting: false,
        isFinished: false,
      };
    case 'SELECT_ANSWER': {
      const newSkipped = new Set(state.skipped);
      newSkipped.delete(action.questionId);
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answer },
        skipped: newSkipped,
      };
    }
    case 'SKIP_QUESTION': {
      const newSkipped = new Set(state.skipped);
      newSkipped.add(action.questionId);
      const nextIndex = Math.min(state.currentIndex + 1, state.questions.length - 1);
      return { ...state, skipped: newSkipped, currentIndex: nextIndex };
    }
    case 'NAVIGATE':
      return { ...state, currentIndex: action.index };
    case 'TICK':
      if (state.timeRemaining <= 0) return { ...state, timeRemaining: 0 };
      return { ...state, timeRemaining: state.timeRemaining - 1 };
    case 'SUBMIT_START':
      return { ...state, isSubmitting: true };
    case 'SUBMIT_DONE':
      return { ...state, isSubmitting: false, isFinished: true };
    default:
      return state;
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExamPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<'setup' | 'exam'>('setup');
  const [isGenerating, setIsGenerating] = useState(false);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const [state, dispatch] = useReducer(examReducer, {
    questions: [],
    answers: {},
    skipped: new Set<string>(),
    currentIndex: 0,
    timeRemaining: 0,
    isSubmitting: false,
    isFinished: false,
    examSessionId: '',
    examMode: 'standard',
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Check for saved exam state on mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem('current_exam_session');
    if (savedSessionId) {
      const saved = localStorage.getItem(`exam_state_${savedSessionId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.questions?.length > 0 && parsed.timeRemaining > 0) {
            dispatch({
              type: 'HYDRATE',
              state: {
                ...parsed,
                skipped: new Set(parsed.skipped),
                isSubmitting: false,
                isFinished: false,
              },
            });
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

  // 2. Persist state while in exam
  useEffect(() => {
    if (isHydrated && phase === 'exam' && !state.isFinished && state.examSessionId) {
      const stateToSave = {
        ...state,
        skipped: Array.from(state.skipped),
      };
      localStorage.setItem(`exam_state_${state.examSessionId}`, JSON.stringify(stateToSave));
      localStorage.setItem('current_exam_session', state.examSessionId);
    }
  }, [state, isHydrated, phase]);

  // 3. Timer Setup
  useEffect(() => {
    if (phase !== 'exam' || state.isFinished || !isHydrated) return;

    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, state.isFinished, isHydrated]);

  // 4. Auto-submit
  useEffect(() => {
    if (state.timeRemaining <= 0 && !state.isFinished && !state.isSubmitting && isHydrated && phase === 'exam') {
      handleSubmit(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timeRemaining, isHydrated, phase]);

  // ─── Generate exam from API ────────────────────────────────────────────────

  const handleStartExam = useCallback(async (requestBody: Record<string, unknown>) => {
    setIsGenerating(true);
    setSetupError(null);

    try {
      const res = await fetch('/api/v1/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json();

      if (!res.ok) {
        setSetupError(data.error?.message || 'Không thể tạo đề thi. Vui lòng thử lại.');
        return;
      }

      dispatch({
        type: 'INIT',
        questions: data.questions,
        examSessionId: data.examSessionId,
        timeRemaining: data.timeLimit,
        examMode: data.mode,
      });

      setPhase('exam');
    } catch {
      setSetupError('Lỗi kết nối server. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Auto-start: skip setup modal when coming from practice page with autostart=true
  useEffect(() => {
    if (!isHydrated || phase !== 'setup' || isGenerating) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') !== 'true') return;

    const mode = params.get('mode') || 'standard';

    let requestBody: Record<string, unknown>;

    if (mode === 'quick') {
      const topic = params.get('topic');
      if (!topic) {
        // No topic provided for quick mode, pick random
        const allTopicIds = TOPICS.map(t => t.id);
        const randomTopic = allTopicIds[Math.floor(Math.random() * allTopicIds.length)];
        requestBody = { mode: 'quick', topic: randomTopic };
      } else {
        requestBody = { mode: 'quick', topic };
      }
      const difficulty = params.get('difficulty');
      if (difficulty) (requestBody as Record<string, unknown>).difficulty = difficulty;
    } else if (mode === 'thpt') {
      requestBody = { mode: 'thpt' };
    } else {
      // Standard mode
      const topicsStr = params.get('topics');
      const topics = topicsStr?.split(',').filter(Boolean) || [];
      const resolvedTopics = topics.length > 0 ? topics : TOPICS.map(t => t.id);
      requestBody = { mode: 'standard', topics: resolvedTopics };
      const difficulty = params.get('difficulty');
      if (difficulty) (requestBody as Record<string, unknown>).difficulty = difficulty;
    }

    handleStartExam(requestBody);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, handleStartExam]);

  // ─── Submit exam ───────────────────────────────────────────────────────────

  const handleSubmit = async (isAuto = false) => {
    if (!isAuto) {
      const answeredCount = Object.keys(state.answers).length;
      const confirmed = window.confirm(
        `Bạn đã hoàn thành ${answeredCount}/${state.questions.length} câu hỏi. Bạn có chắc chắn muốn nộp bài?`
      );
      if (!confirmed) return;
    }

    dispatch({ type: 'SUBMIT_START' });

    try {
      const formattedAnswers = state.questions.map(q => {
        const raw = state.answers[q.id];

        if (q.format === 'TRUE_FALSE') {
          const vals = (raw?.split(',') || []);
          return {
            questionId: q.id,
            format: 'TRUE_FALSE',
            tfAnswerA: vals[0] === 'T' ? true : vals[0] === 'F' ? false : null,
            tfAnswerB: vals[1] === 'T' ? true : vals[1] === 'F' ? false : null,
            tfAnswerC: vals[2] === 'T' ? true : vals[2] === 'F' ? false : null,
            tfAnswerD: vals[3] === 'T' ? true : vals[3] === 'F' ? false : null,
          };
        }

        if (q.format === 'SHORT_ANSWER') {
          return {
            questionId: q.id,
            format: 'SHORT_ANSWER',
            shortAnswer: raw || null,
          };
        }

        return {
          questionId: q.id,
          format: 'MULTIPLE_CHOICE',
          userAnswer: raw || null,
        };
      });

      const res = await fetch('/api/v1/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: formattedAnswers,
          timeTakenSecs: (state.timeRemaining > 0)
            ? Math.max(0, (state.examMode === 'thpt' ? 5400 : state.examMode === 'standard' ? 2700 : 1200) - state.timeRemaining)
            : 0,
          topics: [...new Set(state.questions.map(q => q.topic))],
          mode: state.examMode.toUpperCase(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.removeItem(`exam_state_${state.examSessionId}`);
        localStorage.removeItem('current_exam_session');
        dispatch({ type: 'SUBMIT_DONE' });
        router.push(`/exam/result?attemptId=${data.id || data.attemptId}`);
      } else {
        alert('Nộp bài thất bại. Vui lòng thử lại!');
        dispatch({ type: 'SUBMIT_DONE' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Lỗi kết nối server!');
      dispatch({ type: 'SUBMIT_DONE' });
    }
  };

  // ─── Exam title based on mode ──────────────────────────────────────────────

  const examTitle = state.examMode === 'thpt'
    ? 'Đề thi thử THPT QG 2025'
    : state.examMode === 'quick'
    ? 'Thi nhanh'
    : 'Luyện đề chuẩn';

  const examBadge = state.examMode === 'thpt'
    ? `12 TN + 4 ĐS + 6 TL`
    : `${state.questions.length} câu`;

  // ─── Render ────────────────────────────────────────────────────────────────

  if (!isHydrated) return null;

  // Setup phase: show loading when auto-generating, or setup modal
  if (phase === 'setup') {
    if (isGenerating) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
          <div className="text-center">
            <div className="w-10 h-10 border-[3px] border-[#059669]/20 border-t-[#059669] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-600">Đang tạo đề thi...</p>
            {setupError && (
              <p className="text-sm text-red-600 mt-3">{setupError}</p>
            )}
          </div>
        </div>
      );
    }
    return (
      <div>
        <ExamSetupModal
          onStart={(config) => handleStartExam({
            mode: 'standard',
            topics: config.topics,
          })}
          isLoading={isGenerating}
        />
        {setupError && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="rounded-xl bg-red-50 border border-red-200 px-6 py-3 text-sm text-red-700 shadow-lg">
              {setupError}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Exam phase
  const currentQuestion = state.questions[state.currentIndex];

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <ExamSidebar
        examTitle={examTitle}
        totalQuestions={state.questions.length}
        currentIndex={state.currentIndex}
        answers={state.answers}
        skipped={state.skipped}
        questionIds={state.questions.map(q => q.id)}
        timeRemaining={state.timeRemaining}
        onNavigate={(idx) => dispatch({ type: 'NAVIGATE', index: idx })}
        onSubmit={() => handleSubmit(false)}
        isSubmitting={state.isSubmitting}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              {examTitle}
            </span>
            <div className="h-4 w-px bg-slate-200" />
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded">
              {examBadge}
            </span>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Tiến độ tổng quát</span>
                <span className="text-sm font-black text-slate-900">
                  {state.questions.length > 0
                    ? Math.round((Object.keys(state.answers).length / state.questions.length) * 100)
                    : 0}%
                </span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          {currentQuestion && (
            <ExamQuestion
              question={currentQuestion}
              questionNumber={state.currentIndex + 1}
              totalQuestions={state.questions.length}
              selectedAnswer={state.answers[currentQuestion.id] ?? null}
              onSelectAnswer={(val) => dispatch({ type: 'SELECT_ANSWER', questionId: currentQuestion.id, answer: val })}
              onSkip={() => dispatch({ type: 'SKIP_QUESTION', questionId: currentQuestion.id })}
              onPrev={() => dispatch({ type: 'NAVIGATE', index: state.currentIndex - 1 })}
              onNext={() => dispatch({ type: 'NAVIGATE', index: state.currentIndex + 1 })}
              hasPrev={state.currentIndex > 0}
              hasNext={state.currentIndex < state.questions.length - 1}
            />
          )}
        </main>
      </div>
    </div>
  );
}
