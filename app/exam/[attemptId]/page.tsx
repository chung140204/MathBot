'use client';

import { useReducer, useEffect, useCallback, useRef } from 'react';
import ExamSidebar from '@/components/exam/ExamSidebar';
import ExamQuestion from '@/components/exam/ExamQuestion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  content: string;
  format: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: { A: string; B: string; C: string; D: string };
  statementA?: string;
  statementB?: string;
  statementC?: string;
  statementD?: string;
  topic: string;
  difficulty: string;
}

interface ExamState {
  questions: Question[];
  answers: Record<string, string | null>;
  skipped: Set<string>;
  currentIndex: number;
  timeRemaining: number;
  isSubmitting: boolean;
  isFinished: boolean;
}

type ExamAction =
  | { type: 'SELECT_ANSWER'; questionId: string; answer: string }
  | { type: 'SKIP_QUESTION'; questionId: string }
  | { type: 'NAVIGATE'; index: number }
  | { type: 'TICK' }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_DONE' };

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    content: 'Tính đạo hàm của hàm số $f(x) = x^3 - 3x^2 + 2x - 1$.',
    format: 'MULTIPLE_CHOICE',
    options: {
      A: '$3x^2 - 6x + 2$',
      B: '$3x^2 - 6x - 2$',
      C: '$x^2 - 6x + 2$',
      D: '$3x^2 + 6x + 2$',
    },
    topic: 'DERIVATIVE',
    difficulty: 'EASY',
  },
  {
    id: 'q2',
    content: 'Cho hàm số $f(x) = x^3 - 3x + 2$. Xét tính đúng/sai của các phát biểu sau:',
    format: 'TRUE_FALSE',
    statementA: 'Hàm số đồng biến trên khoảng $(2; +\\infty)$.',
    statementB: 'Hàm số nghịch biến trên khoảng $(-1; 1)$.',
    statementC: 'Đồ thị hàm số có hai điểm cực trị.',
    statementD: 'Giá trị cực đại của hàm số bằng $4$.',
    topic: 'DERIVATIVE',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q3',
    content: 'Tìm giá trị nguyên nhỏ nhất của tham số $m$ để hàm số $y = x^3 - 3x^2 + mx - 1$ đồng biến trên $\\mathbb{R}$.',
    format: 'SHORT_ANSWER',
    topic: 'DERIVATIVE',
    difficulty: 'HARD',
  },
  // Add more mixed questions if needed
];

// ─── Reducer ──────────────────────────────────────────────────────────────────

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
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
  const [state, dispatch] = useReducer(examReducer, {
    questions: MOCK_QUESTIONS,
    answers: {},
    skipped: new Set<string>(),
    currentIndex: 0,
    timeRemaining: 1800, // 30 minutes
    isSubmitting: false,
    isFinished: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    if (state.isFinished) return;

    timerRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isFinished]);

  // Auto-submit when timer hits 0
  useEffect(() => {
    if (state.timeRemaining <= 0 && !state.isFinished && !state.isSubmitting) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timeRemaining]);

  const handleSubmit = useCallback(async () => {
    const confirmed =
      state.timeRemaining <= 0 ||
      window.confirm(
        `Bạn đã làm ${Object.values(state.answers).filter((a) => a !== null && a !== undefined).length}/${state.questions.length} câu.\nBạn có chắc chắn muốn nộp bài?`
      );

    if (!confirmed) return;

    dispatch({ type: 'SUBMIT_START' });

    try {
      const payload = {
        answers: state.questions.map((q) => ({
          questionId: q.id,
          answer: state.answers[q.id] ?? null,
        })),
        timeTakenSecs: 1800 - state.timeRemaining,
        topics: [...new Set(state.questions.map((q) => q.topic))],
      };

      const res = await fetch('/api/v1/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('[exam] Submit error:', errorData);
        alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
        dispatch({ type: 'SUBMIT_DONE' });
        return;
      }

      const result = await res.json();
      dispatch({ type: 'SUBMIT_DONE' });

      // Navigate to results page (will be implemented later)
      window.location.href = `/exam/${result.attemptId}/results`;
    } catch (error) {
      console.error('[exam] Submit error:', error);
      alert('Không thể kết nối đến server. Vui lòng thử lại.');
      dispatch({ type: 'SUBMIT_DONE' });
    }
  }, [state]);

  const currentQuestion = state.questions[state.currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <ExamSidebar
        examTitle="Đề thi Đạo hàm"
        totalQuestions={state.questions.length}
        currentIndex={state.currentIndex}
        answers={state.answers}
        skipped={state.skipped}
        questionIds={state.questions.map((q) => q.id)}
        timeRemaining={state.timeRemaining}
        onNavigate={(index) => dispatch({ type: 'NAVIGATE', index })}
        onSubmit={handleSubmit}
        isSubmitting={state.isSubmitting}
      />

      <ExamQuestion
        question={currentQuestion}
        questionNumber={state.currentIndex + 1}
        totalQuestions={state.questions.length}
        selectedAnswer={state.answers[currentQuestion.id] ?? null}
        onSelectAnswer={(answer) =>
          dispatch({ type: 'SELECT_ANSWER', questionId: currentQuestion.id, answer })
        }
        onSkip={() => dispatch({ type: 'SKIP_QUESTION', questionId: currentQuestion.id })}
        onPrev={() => dispatch({ type: 'NAVIGATE', index: state.currentIndex - 1 })}
        onNext={() => dispatch({ type: 'NAVIGATE', index: state.currentIndex + 1 })}
        hasPrev={state.currentIndex > 0}
        hasNext={state.currentIndex < state.questions.length - 1}
      />
    </div>
  );
}
