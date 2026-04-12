'use client';

import MathRenderer from './MathRenderer';
import QuestionCard, { QuestionData } from './QuestionCard';

interface ExamQuestionProps {
  question: QuestionData;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  onSkip: () => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

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

const DIFFICULTY_LABELS: Record<string, string> = {
  EASY: 'Nhận biết',
  MEDIUM: 'Thông hiểu',
  HARD: 'Vận dụng',
  EXPERT: 'Vận dụng cao',
};

export default function ExamQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  onSkip,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: ExamQuestionProps) {
  const topicLabel = TOPIC_LABELS[question.topic] || question.topic;
  const difficultyLabel = DIFFICULTY_LABELS[question.difficulty] || question.difficulty;

  return (
    <div className="flex-1 flex flex-col h-screen bg-[#f0fdf9]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4">
          <p className="text-base text-gray-500">
            Câu <span className="font-black text-gray-900 text-lg">{questionNumber}</span> /{' '}
            {totalQuestions}
          </p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#f0fdf9] text-[#059669] text-xs font-bold rounded-full border border-[#059669]/20">
              {topicLabel}
            </span>
            <span className="px-3 py-1 bg-blue-50 text-[#0891b2] text-xs font-bold rounded-full border border-[#0891b2]/20">
              {difficultyLabel}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            disabled={!hasPrev}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200
              rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Câu trước
          </button>
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-200
              rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Câu tiếp →
          </button>
        </div>
      </div>

      {/* Question content */}
      <div className="flex-1 overflow-y-auto px-8 py-8">
        <QuestionCard
          question={question}
          questionNumber={questionNumber}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={onSelectAnswer}
        />
      </div>

      {/* Footer */}
      <div className="px-8 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={onSkip}
          className="px-6 py-3 text-sm font-semibold text-gray-600 bg-white border border-gray-200
            rounded-2xl hover:bg-gray-50 transition-all"
        >
          Bỏ qua câu này
        </button>

        <button
          className="px-6 py-3 text-sm font-semibold text-[#059669] bg-[#f0fdf9] border border-[#059669]/20
            rounded-2xl hover:bg-[#059669]/10 transition-all flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
          Gợi ý từ AI
        </button>
      </div>
    </div>
  );
}
