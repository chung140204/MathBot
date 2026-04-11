'use client';

import { useReducer, useEffect, useCallback, useRef } from 'react';
import ExamSidebar from '@/components/exam/ExamSidebar';
import ExamQuestion from '@/components/exam/ExamQuestion';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  content: string;
  options: { A: string; B: string; C: string; D: string };
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
    content: 'Tìm nguyên hàm của $f(x) = 2x + 3$.',
    options: {
      A: '$x^2 + 3x + C$',
      B: '$x^2 + 3 + C$',
      C: '$2x^2 + 3x + C$',
      D: '$x^2 - 3x + C$',
    },
    topic: 'INTEGRAL',
    difficulty: 'EASY',
  },
  {
    id: 'q3',
    content: 'Giải phương trình $\\log_2(x+1) = 3$.',
    options: {
      A: '$x = 7$',
      B: '$x = 8$',
      C: '$x = 6$',
      D: '$x = 9$',
    },
    topic: 'LOGARITHM',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q4',
    content: 'Tính $\\int_0^1 x^2 \\, dx$.',
    options: {
      A: '$\\frac{1}{3}$',
      B: '$\\frac{1}{2}$',
      C: '$1$',
      D: '$\\frac{2}{3}$',
    },
    topic: 'INTEGRAL',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q5',
    content: 'Cho hàm số $f(x) = x^4 - 2x^2 + 1$. Tìm giá trị nhỏ nhất của hàm số.',
    options: {
      A: '$0$',
      B: '$1$',
      C: '$-1$',
      D: '$2$',
    },
    topic: 'DERIVATIVE',
    difficulty: 'HARD',
  },
  {
    id: 'q6',
    content: 'Số phức $z = 3 + 4i$ có mô-đun bằng bao nhiêu?',
    options: {
      A: '$5$',
      B: '$7$',
      C: '$\\sqrt{7}$',
      D: '$25$',
    },
    topic: 'COMPLEX_NUMBER',
    difficulty: 'EASY',
  },
  {
    id: 'q7',
    content: 'Xác suất để gieo một xúc xắc ra mặt chẵn là bao nhiêu?',
    options: {
      A: '$\\frac{1}{2}$',
      B: '$\\frac{1}{3}$',
      C: '$\\frac{1}{6}$',
      D: '$\\frac{2}{3}$',
    },
    topic: 'PROBABILITY',
    difficulty: 'EASY',
  },
  {
    id: 'q8',
    content:
      'Cho hàm số $f(x) = x^3 - 3x^2 + 4$. Tìm tất cả các giá trị của x để hàm số đạt cực trị.',
    options: {
      A: '$x = 0$ và $x = 2$ (cực đại tại $x = 0$, cực tiểu tại $x = 2$)',
      B: '$x = 0$ và $x = 2$ (cực tiểu tại $x = 0$, cực đại tại $x = 2$)',
      C: 'Chỉ $x = 0$ là điểm cực trị',
      D: '$x = 0$ và $x = 2$ (cực đại tại $x = 2$, cực tiểu tại $x = 0$)',
    },
    topic: 'DERIVATIVE',
    difficulty: 'HARD',
  },
  {
    id: 'q9',
    content: 'Tính $C_5^2$.',
    options: {
      A: '$10$',
      B: '$20$',
      C: '$5$',
      D: '$15$',
    },
    topic: 'COMBINATORICS',
    difficulty: 'EASY',
  },
  {
    id: 'q10',
    content: 'Cho cấp số cộng có $u_1 = 3$, $d = 2$. Tìm $u_{10}$.',
    options: {
      A: '$21$',
      B: '$23$',
      C: '$19$',
      D: '$25$',
    },
    topic: 'SEQUENCE',
    difficulty: 'EASY',
  },
  {
    id: 'q11',
    content: 'Tính $\\int_0^{\\pi} \\sin(x) \\, dx$.',
    options: {
      A: '$2$',
      B: '$0$',
      C: '$1$',
      D: '$-2$',
    },
    topic: 'INTEGRAL',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q12',
    content: 'Cho $z = 1 + i$. Tính $z^2$.',
    options: {
      A: '$2i$',
      B: '$2$',
      C: '$-2i$',
      D: '$1 + 2i$',
    },
    topic: 'COMPLEX_NUMBER',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q13',
    content: 'Tìm đạo hàm của $f(x) = \\ln(2x + 1)$.',
    options: {
      A: '$\\frac{2}{2x+1}$',
      B: '$\\frac{1}{2x+1}$',
      C: '$\\frac{1}{x}$',
      D: '$\\frac{2}{x+1}$',
    },
    topic: 'DERIVATIVE',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q14',
    content: 'Giải bất phương trình $\\log_3(x) > 2$.',
    options: {
      A: '$x > 9$',
      B: '$x > 6$',
      C: '$x > 3$',
      D: '$x > 8$',
    },
    topic: 'LOGARITHM',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q15',
    content: 'Thể tích khối cầu bán kính $R$ là bao nhiêu?',
    options: {
      A: '$\\frac{4}{3}\\pi R^3$',
      B: '$4\\pi R^2$',
      C: '$\\frac{2}{3}\\pi R^3$',
      D: '$\\pi R^3$',
    },
    topic: 'GEOMETRY',
    difficulty: 'EASY',
  },
  {
    id: 'q16',
    content:
      'Cho $f(x) = e^{2x}$. Tính $f\'(x)$.',
    options: {
      A: '$2e^{2x}$',
      B: '$e^{2x}$',
      C: '$2xe^{2x}$',
      D: '$e^{x}$',
    },
    topic: 'DERIVATIVE',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q17',
    content:
      'Gieo 2 xúc xắc. Xác suất để tổng bằng 7 là bao nhiêu?',
    options: {
      A: '$\\frac{1}{6}$',
      B: '$\\frac{1}{12}$',
      C: '$\\frac{5}{36}$',
      D: '$\\frac{7}{36}$',
    },
    topic: 'PROBABILITY',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q18',
    content: 'Tìm số hạng tổng quát của cấp số nhân: $2, 6, 18, 54, ...$',
    options: {
      A: '$u_n = 2 \\cdot 3^{n-1}$',
      B: '$u_n = 2 \\cdot 3^{n}$',
      C: '$u_n = 3 \\cdot 2^{n-1}$',
      D: '$u_n = 6^{n-1}$',
    },
    topic: 'SEQUENCE',
    difficulty: 'MEDIUM',
  },
  {
    id: 'q19',
    content: 'Tính diện tích hình phẳng giới hạn bởi $y = x^2$ và trục $Ox$ trên đoạn $[0, 2]$.',
    options: {
      A: '$\\frac{8}{3}$',
      B: '$4$',
      C: '$\\frac{4}{3}$',
      D: '$2$',
    },
    topic: 'INTEGRAL',
    difficulty: 'HARD',
  },
  {
    id: 'q20',
    content:
      'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\perp (ABCD)$, $SA = a\\sqrt{2}$. Tính thể tích khối chóp.',
    options: {
      A: '$\\frac{a^3\\sqrt{2}}{3}$',
      B: '$\\frac{a^3}{3}$',
      C: '$a^3\\sqrt{2}$',
      D: '$\\frac{a^3\\sqrt{2}}{6}$',
    },
    topic: 'GEOMETRY',
    difficulty: 'EXPERT',
  },
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
      window.location.href = `/exam/${result.attemptId}/result`;
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
