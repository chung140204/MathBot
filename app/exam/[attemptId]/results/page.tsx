'use client';

import { useState } from 'react';
import Link from 'next/link';
import MathRenderer from '@/components/exam/MathRenderer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuestionResult {
  questionId: string;
  questionNumber: number;
  content: string;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  topic: string;
  options: { A: string; B: string; C: string; D: string };
}

interface TopicStat {
  topic: string;
  label: string;
  correct: number;
  total: number;
  accuracy: number;
}

interface PreviousAttempt {
  percentage: number;
}

interface ExamResultData {
  attemptId: string;
  totalScore: number;
  totalQuestions: number;
  percentage: number;
  timeTakenSecs: number;
  examTitle: string;
  results: QuestionResult[];
  topicStats: TopicStat[];
  previousAttempt: PreviousAttempt | null;
}

// ─── Topic labels ─────────────────────────────────────────────────────────────

const TOPIC_LABELS: Record<string, string> = {
  DERIVATIVE: 'Đạo hàm',
  INTEGRAL: 'Tích phân',
  PROBABILITY: 'Xác suất',
  GEOMETRY: 'Hình học',
  LOGARITHM: 'Logarit',
  COMPLEX_NUMBER: 'Số phức',
  SEQUENCE: 'Dãy số',
  COMBINATORICS: 'Tổ hợp',
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_RESULT: ExamResultData = {
  attemptId: 'test-attempt-1',
  totalScore: 16,
  totalQuestions: 20,
  percentage: 80,
  timeTakenSecs: 863,
  examTitle: 'Đạo hàm',
  previousAttempt: { percentage: 65 },
  topicStats: [
    { topic: 'DERIVATIVE', label: 'Đạo hàm', correct: 5, total: 6, accuracy: 83 },
    { topic: 'INTEGRAL', label: 'Tích phân', correct: 4, total: 4, accuracy: 100 },
    { topic: 'LOGARITHM', label: 'Logarit', correct: 1, total: 2, accuracy: 50 },
    { topic: 'COMPLEX_NUMBER', label: 'Số phức', correct: 2, total: 2, accuracy: 100 },
    { topic: 'PROBABILITY', label: 'Xác suất', correct: 1, total: 2, accuracy: 50 },
    { topic: 'GEOMETRY', label: 'Hình học', correct: 1, total: 2, accuracy: 50 },
    { topic: 'SEQUENCE', label: 'Dãy số', correct: 1, total: 1, accuracy: 100 },
    { topic: 'COMBINATORICS', label: 'Tổ hợp', correct: 1, total: 1, accuracy: 100 },
  ],
  results: [
    {
      questionId: 'q1',
      questionNumber: 1,
      content: 'Tính đạo hàm của hàm số $f(x) = x^3 - 3x^2 + 2x - 1$.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: 'Áp dụng công thức đạo hàm: $f\'(x) = 3x^2 - 6x + 2$.',
      topic: 'DERIVATIVE',
      options: { A: '$3x^2 - 6x + 2$', B: '$3x^2 - 6x - 2$', C: '$x^2 - 6x + 2$', D: '$3x^2 + 6x + 2$' },
    },
    {
      questionId: 'q2',
      questionNumber: 2,
      content: 'Tìm nguyên hàm của $f(x) = 2x + 3$.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$\\int (2x+3)dx = x^2 + 3x + C$.',
      topic: 'INTEGRAL',
      options: { A: '$x^2 + 3x + C$', B: '$x^2 + 3 + C$', C: '$2x^2 + 3x + C$', D: '$x^2 - 3x + C$' },
    },
    {
      questionId: 'q3',
      questionNumber: 3,
      content: 'Giải phương trình $\\log_2(x+1) = 3$.',
      userAnswer: 'B',
      correctAnswer: 'A',
      isCorrect: false,
      explanation: '$\\log_2(x+1) = 3 \\Leftrightarrow x+1 = 2^3 = 8 \\Leftrightarrow x = 7$. Đáp án đúng là A.',
      topic: 'LOGARITHM',
      options: { A: '$x = 7$', B: '$x = 8$', C: '$x = 6$', D: '$x = 9$' },
    },
    {
      questionId: 'q4',
      questionNumber: 4,
      content: 'Tính $\\int_0^1 x^2 \\, dx$.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$\\int_0^1 x^2 dx = \\frac{x^3}{3}\\Big|_0^1 = \\frac{1}{3}$.',
      topic: 'INTEGRAL',
      options: { A: '$\\frac{1}{3}$', B: '$\\frac{1}{2}$', C: '$1$', D: '$\\frac{2}{3}$' },
    },
    {
      questionId: 'q5',
      questionNumber: 5,
      content: 'Cho hàm số $f(x) = x^4 - 2x^2 + 1$. Tìm giá trị nhỏ nhất của hàm số.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$f(x) = (x^2-1)^2 \\geq 0$. Giá trị nhỏ nhất là $0$ tại $x = \\pm 1$.',
      topic: 'DERIVATIVE',
      options: { A: '$0$', B: '$1$', C: '$-1$', D: '$2$' },
    },
    {
      questionId: 'q6',
      questionNumber: 6,
      content: 'Số phức $z = 3 + 4i$ có mô-đun bằng bao nhiêu?',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$|z| = \\sqrt{3^2 + 4^2} = \\sqrt{25} = 5$.',
      topic: 'COMPLEX_NUMBER',
      options: { A: '$5$', B: '$7$', C: '$\\sqrt{7}$', D: '$25$' },
    },
    {
      questionId: 'q7',
      questionNumber: 7,
      content: 'Xác suất để gieo một xúc xắc ra mặt chẵn là bao nhiêu?',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: 'Mặt chẵn: $\\{2, 4, 6\\}$ → 3 kết quả thuận lợi / 6 kết quả → $P = \\frac{1}{2}$.',
      topic: 'PROBABILITY',
      options: { A: '$\\frac{1}{2}$', B: '$\\frac{1}{3}$', C: '$\\frac{1}{6}$', D: '$\\frac{2}{3}$' },
    },
    {
      questionId: 'q8',
      questionNumber: 8,
      content: 'Cho hàm số $f(x) = x^3 - 3x^2 + 4$. Tìm tất cả các giá trị của x để hàm số đạt cực trị.',
      userAnswer: 'B',
      correctAnswer: 'A',
      isCorrect: false,
      explanation: "$f'(x) = 3x^2 - 6x = 3x(x-2)$. $f'(x) = 0$ khi $x = 0$ hoặc $x = 2$.\n$f'(x)$ đổi dấu từ $+$ sang $-$ tại $x=0$ → cực đại.\n$f'(x)$ đổi dấu từ $-$ sang $+$ tại $x=2$ → cực tiểu.",
      topic: 'DERIVATIVE',
      options: {
        A: '$x = 0$ và $x = 2$ (cực đại tại $x = 0$, cực tiểu tại $x = 2$)',
        B: '$x = 0$ và $x = 2$ (cực tiểu tại $x = 0$, cực đại tại $x = 2$)',
        C: 'Chỉ $x = 0$ là điểm cực trị',
        D: '$x = 0$ và $x = 2$ (cực đại tại $x = 2$, cực tiểu tại $x = 0$)',
      },
    },
    {
      questionId: 'q9',
      questionNumber: 9,
      content: 'Tính $C_5^2$.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$C_5^2 = \\frac{5!}{2! \\cdot 3!} = \\frac{120}{2 \\cdot 6} = 10$.',
      topic: 'COMBINATORICS',
      options: { A: '$10$', B: '$20$', C: '$5$', D: '$15$' },
    },
    {
      questionId: 'q10',
      questionNumber: 10,
      content: 'Cho cấp số cộng có $u_1 = 3$, $d = 2$. Tìm $u_{10}$.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$u_{10} = u_1 + 9d = 3 + 18 = 21$.',
      topic: 'SEQUENCE',
      options: { A: '$21$', B: '$23$', C: '$19$', D: '$25$' },
    },
    {
      questionId: 'q11',
      questionNumber: 11,
      content: 'Tính $\\int_0^{\\pi} \\sin(x) \\, dx$.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$\\int_0^{\\pi} \\sin x\\,dx = [-\\cos x]_0^{\\pi} = -\\cos\\pi + \\cos 0 = 1 + 1 = 2$.',
      topic: 'INTEGRAL',
      options: { A: '$2$', B: '$0$', C: '$1$', D: '$-2$' },
    },
    {
      questionId: 'q12',
      questionNumber: 12,
      content: 'Cho $z = 1 + i$. Tính $z^2$.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$z^2 = (1+i)^2 = 1 + 2i + i^2 = 1 + 2i - 1 = 2i$.',
      topic: 'COMPLEX_NUMBER',
      options: { A: '$2i$', B: '$2$', C: '$-2i$', D: '$1 + 2i$' },
    },
    {
      questionId: 'q13',
      questionNumber: 13,
      content: 'Tìm đạo hàm của $f(x) = \\ln(2x + 1)$.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$f\'(x) = \\frac{(2x+1)\'}{2x+1} = \\frac{2}{2x+1}$.',
      topic: 'DERIVATIVE',
      options: { A: '$\\frac{2}{2x+1}$', B: '$\\frac{1}{2x+1}$', C: '$\\frac{1}{x}$', D: '$\\frac{2}{x+1}$' },
    },
    {
      questionId: 'q14',
      questionNumber: 14,
      content: 'Giải bất phương trình $\\log_3(x) > 2$.',
      userAnswer: 'C',
      correctAnswer: 'A',
      isCorrect: false,
      explanation: '$\\log_3(x) > 2 \\Leftrightarrow x > 3^2 = 9$. Đáp án đúng là $x > 9$.',
      topic: 'LOGARITHM',
      options: { A: '$x > 9$', B: '$x > 6$', C: '$x > 3$', D: '$x > 8$' },
    },
    {
      questionId: 'q15',
      questionNumber: 15,
      content: 'Thể tích khối cầu bán kính $R$ là bao nhiêu?',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: 'Công thức thể tích khối cầu: $V = \\frac{4}{3}\\pi R^3$.',
      topic: 'GEOMETRY',
      options: { A: '$\\frac{4}{3}\\pi R^3$', B: '$4\\pi R^2$', C: '$\\frac{2}{3}\\pi R^3$', D: '$\\pi R^3$' },
    },
    {
      questionId: 'q16',
      questionNumber: 16,
      content: "Cho $f(x) = e^{2x}$. Tính $f'(x)$.",
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: "$f'(x) = (2x)' \\cdot e^{2x} = 2e^{2x}$.",
      topic: 'DERIVATIVE',
      options: { A: '$2e^{2x}$', B: '$e^{2x}$', C: '$2xe^{2x}$', D: '$e^{x}$' },
    },
    {
      questionId: 'q17',
      questionNumber: 17,
      content: 'Gieo 2 xúc xắc. Xác suất để tổng bằng 7 là bao nhiêu?',
      userAnswer: 'B',
      correctAnswer: 'A',
      isCorrect: false,
      explanation: 'Các cặp có tổng = 7: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$ → 6 cặp. $P = \\frac{6}{36} = \\frac{1}{6}$.',
      topic: 'PROBABILITY',
      options: { A: '$\\frac{1}{6}$', B: '$\\frac{1}{12}$', C: '$\\frac{5}{36}$', D: '$\\frac{7}{36}$' },
    },
    {
      questionId: 'q18',
      questionNumber: 18,
      content: 'Tìm số hạng tổng quát của cấp số nhân: $2, 6, 18, 54, ...$',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: 'Công bội $q = 3$, $u_1 = 2$ → $u_n = 2 \\cdot 3^{n-1}$.',
      topic: 'SEQUENCE',
      options: { A: '$u_n = 2 \\cdot 3^{n-1}$', B: '$u_n = 2 \\cdot 3^{n}$', C: '$u_n = 3 \\cdot 2^{n-1}$', D: '$u_n = 6^{n-1}$' },
    },
    {
      questionId: 'q19',
      questionNumber: 19,
      content: 'Tính diện tích hình phẳng giới hạn bởi $y = x^2$ và trục $Ox$ trên đoạn $[0, 2]$.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$S = \\int_0^2 x^2 \\, dx = \\frac{x^3}{3}\\Big|_0^2 = \\frac{8}{3}$.',
      topic: 'INTEGRAL',
      options: { A: '$\\frac{8}{3}$', B: '$4$', C: '$\\frac{4}{3}$', D: '$2$' },
    },
    {
      questionId: 'q20',
      questionNumber: 20,
      content: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình vuông cạnh $a$, $SA \\perp (ABCD)$, $SA = a\\sqrt{2}$. Tính thể tích khối chóp.',
      userAnswer: 'A',
      correctAnswer: 'A',
      isCorrect: true,
      explanation: '$V = \\frac{1}{3} \\cdot S_{ABCD} \\cdot SA = \\frac{1}{3} \\cdot a^2 \\cdot a\\sqrt{2} = \\frac{a^3\\sqrt{2}}{3}$.',
      topic: 'GEOMETRY',
      options: { A: '$\\frac{a^3\\sqrt{2}}{3}$', B: '$\\frac{a^3}{3}$', C: '$a^3\\sqrt{2}$', D: '$\\frac{a^3\\sqrt{2}}{6}$' },
    },
  ],
};

// ─── Helper: score label ──────────────────────────────────────────────────────

function getScoreLabel(percentage: number): { text: string; emoji: string } {
  if (percentage >= 90) return { text: 'Xuất sắc!', emoji: '🌟' };
  if (percentage >= 80) return { text: 'Giỏi!', emoji: '🎉' };
  if (percentage >= 65) return { text: 'Khá!', emoji: '👍' };
  if (percentage >= 50) return { text: 'Trung bình', emoji: '📚' };
  return { text: 'Cần cố gắng', emoji: '💪' };
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ─── Score Circle ─────────────────────────────────────────────────────────────

function ScoreCircle({ score, total }: { score: number; total: number }) {
  const percentage = total > 0 ? (score / total) * 100 : 0;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="54" fill="none"
          stroke="white" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white">{score}</span>
        <span className="text-white/70 text-sm font-medium">/{total}</span>
      </div>
    </div>
  );
}

// ─── Topic Progress Bar ───────────────────────────────────────────────────────

function TopicBar({ label, accuracy, correct, total }: { label: string; accuracy: number; correct: number; total: number }) {
  const barColor = accuracy >= 80 ? 'bg-[#059669]' : accuracy >= 50 ? 'bg-[#eab308]' : 'bg-red-500';

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 w-24 truncate font-medium">{label}</span>
      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
          style={{ width: `${accuracy}%` }}
        />
      </div>
      <span className="text-sm font-bold text-gray-600 w-20 text-right">
        {correct}/{total} ({accuracy}%)
      </span>
    </div>
  );
}

// ─── Question Result Item ─────────────────────────────────────────────────────

function QuestionItem({ result, isExpanded, onToggle }: {
  result: QuestionResult;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all ${
      result.isCorrect ? 'border-[#059669]/20' : 'border-red-200'
    }`}>
      {/* Header row */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 bg-white hover:bg-gray-50/50 transition-colors text-left"
      >
        {/* Question number */}
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          result.isCorrect
            ? 'bg-[#f0fdf9] text-[#059669]'
            : 'bg-red-50 text-red-500'
        }`}>
          {result.questionNumber}
        </span>

        {/* Question text (truncated) */}
        <span className="flex-1 text-sm text-gray-700 truncate">
          <MathRenderer content={result.content} />
        </span>

        {/* Status badge */}
        <span className={`text-xs font-bold flex-shrink-0 ${
          result.isCorrect ? 'text-[#059669]' : 'text-red-500'
        }`}>
          {result.isCorrect ? '✓ Đúng' : '✗ Sai'}
        </span>

        {/* Expand icon */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-100 bg-gray-50/30">
          {/* Show user answer vs correct answer for wrong questions */}
          {!result.isCorrect && (
            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-gray-400 w-20 pt-0.5 flex-shrink-0">Bạn chọn:</span>
                <span className="text-sm text-red-500 font-semibold">
                  {result.userAnswer} — <MathRenderer content={result.options[result.userAnswer as keyof typeof result.options] || 'Bỏ qua'} />
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs font-bold text-gray-400 w-20 pt-0.5 flex-shrink-0">Đáp án đúng:</span>
                <span className="text-sm text-[#059669] font-semibold">
                  {result.correctAnswer} — <MathRenderer content={result.options[result.correctAnswer as keyof typeof result.options]} />
                </span>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div className="mt-4 pl-4 border-l-4 border-[#059669] bg-white py-3 px-4 rounded-r-xl">
            <p className="text-xs font-bold text-gray-400 mb-1.5">Giải thích:</p>
            <div className="text-sm text-gray-700 leading-relaxed">
              <MathRenderer content={result.explanation} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExamResultsPage() {
  const data = MOCK_RESULT;
  const wrongQuestions = data.results.filter((r) => !r.isCorrect);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Auto-expand wrong questions
    return new Set(wrongQuestions.map((r) => r.questionId));
  });
  const [showAll, setShowAll] = useState(false);

  const scoreLabel = getScoreLabel(data.percentage);
  const wrongCount = data.totalQuestions - data.totalScore;
  const improvement = data.previousAttempt
    ? data.percentage - data.previousAttempt.percentage
    : null;

  const wrongTopics = data.topicStats
    .filter((t) => t.accuracy < 80)
    .map((t) => t.label);

  const displayedResults = showAll
    ? data.results
    : data.results.filter((r) => !r.isCorrect || expandedIds.has(r.questionId));

  function toggleQuestion(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#f0fdf9]">
      {/* ── Top bar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#059669] to-[#0891b2] flex items-center justify-center text-white font-black text-xs">
                M
              </div>
              <span className="text-lg font-black tracking-tighter text-gray-900 uppercase italic">
                MathBot
              </span>
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors">
              ← Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
              Làm lại đề này
            </button>
            <Link
              href={`/chat?context=exam-review&attemptId=${data.attemptId}`}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#059669] to-[#0891b2] rounded-xl hover:shadow-lg hover:shadow-[#059669]/20 transition-all"
            >
              Hỏi AI giải thích →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero section ── */}
      <section className="bg-gradient-to-br from-[#059669] to-[#0891b2] py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4">
            Kết quả bài thi
          </p>

          <ScoreCircle score={data.totalScore} total={data.totalQuestions} />

          <h1 className="text-2xl font-black text-white mt-4">
            {scoreLabel.text} {scoreLabel.emoji}
          </h1>
          <p className="text-white/70 text-sm mt-1">
            {data.examTitle} · {data.totalQuestions} câu · Hoàn thành lúc {formatTime(data.timeTakenSecs)}
          </p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {[
              { value: `${data.percentage}%`, label: 'Điểm số' },
              { value: String(data.totalScore), label: 'Câu đúng' },
              { value: String(wrongCount), label: 'Câu sai' },
              { value: formatTime(data.timeTakenSecs), label: 'Thời gian' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/15 backdrop-blur-sm rounded-2xl px-6 py-3 min-w-[100px]"
              >
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="text-white/60 text-xs font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Topic + Comparison row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Topic breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-5">Kết quả theo chủ đề</h2>
            <div className="space-y-3.5">
              {data.topicStats.map((stat) => (
                <TopicBar
                  key={stat.topic}
                  label={stat.label}
                  accuracy={stat.accuracy}
                  correct={stat.correct}
                  total={stat.total}
                />
              ))}
            </div>
          </div>

          {/* Comparison with previous */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-5">So sánh với lần trước</h2>

            {data.previousAttempt ? (
              <div className="space-y-4">
                {/* Current */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Lần này</span>
                  <span className="text-3xl font-black text-[#059669]">{data.percentage}%</span>
                </div>

                {/* Previous */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Lần trước</span>
                  <span className="text-2xl font-bold text-gray-400">{data.previousAttempt.percentage}%</span>
                </div>

                <hr className="border-gray-100" />

                {/* Improvement */}
                <div className="flex items-center justify-between bg-[#f0fdf9] rounded-xl p-4">
                  <span className="text-sm font-medium text-gray-600">Cải thiện</span>
                  <span className={`text-lg font-black ${
                    improvement !== null && improvement >= 0 ? 'text-[#059669]' : 'text-red-500'
                  }`}>
                    {improvement !== null && improvement >= 0 ? '↑' : '↓'} {improvement !== null ? `${improvement >= 0 ? '+' : ''}${improvement}%` : '—'}
                  </span>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  {data.percentage >= 90
                    ? 'Tiếp tục phát huy!'
                    : `Tiếp tục luyện tập để đạt ${Math.min(data.percentage + 10, 100)}%!`}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <p className="text-sm">Đây là lần thi đầu tiên</p>
                <p className="text-xs mt-1">Kết quả sẽ được so sánh ở lần sau</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Question list ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-900">Chi tiết từng câu</h2>
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm font-semibold text-[#0891b2] hover:underline"
            >
              {showAll ? 'Chỉ xem câu sai' : 'Xem tất cả'}
            </button>
          </div>

          <div className="space-y-3">
            {(showAll ? data.results : data.results).map((result) => {
              // When not showing all, only show wrong ones and correctly answered ones as collapsed
              if (!showAll && result.isCorrect) {
                return (
                  <div
                    key={result.questionId}
                    className="flex items-center gap-4 px-5 py-3 border-2 border-[#059669]/10 rounded-2xl bg-white"
                  >
                    <span className="w-8 h-8 rounded-full bg-[#f0fdf9] text-[#059669] flex items-center justify-center text-sm font-bold">
                      {result.questionNumber}
                    </span>
                    <span className="flex-1 text-sm text-gray-500 truncate">
                      <MathRenderer content={result.content} />
                    </span>
                    <span className="text-xs font-bold text-[#059669]">✓ Đúng</span>
                  </div>
                );
              }

              return (
                <QuestionItem
                  key={result.questionId}
                  result={result}
                  isExpanded={expandedIds.has(result.questionId)}
                  onToggle={() => toggleQuestion(result.questionId)}
                />
              );
            })}
          </div>
        </div>

        {/* ── CTA Banner ── */}
        {wrongCount > 0 && (
          <div className="bg-gradient-to-r from-[#059669] to-[#0891b2] rounded-2xl p-8 text-center">
            <h3 className="text-xl font-black text-white">
              Còn {wrongCount} câu sai cần ôn lại 💪
            </h3>
            <p className="text-white/70 text-sm mt-1">
              AI đã phân tích — bạn cần ôn thêm phần{' '}
              {wrongTopics.length > 0 ? wrongTopics.join(' và ') : 'các chủ đề'}
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-white text-gray-800 font-bold rounded-xl hover:shadow-lg transition-all text-sm"
              >
                Về Dashboard
              </Link>
              <Link
                href={`/chat?context=exam-review&attemptId=${data.attemptId}&wrongTopics=${wrongTopics.join(',')}`}
                className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-all text-sm"
              >
                Hỏi AI về câu sai
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Footer spacing */}
      <div className="h-12" />
    </div>
  );
}
