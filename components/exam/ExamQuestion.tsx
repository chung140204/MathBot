'use client';

import MathRenderer from './MathRenderer';

interface QuestionData {
  id: string;
  content: string;
  options: { A: string; B: string; C: string; D: string };
  topic: string;
  difficulty: string;
}

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

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

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
        <div className="max-w-3xl mx-auto">
          {/* Question label */}
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
            Câu hỏi {questionNumber}
          </p>

          {/* Question text */}
          <div className="text-lg text-gray-800 leading-relaxed mb-2">
            <MathRenderer content={question.content} />
          </div>

          {/* Math block area (if question has block math) */}
          {question.content.includes('$$') && (
            <div className="my-4 pl-4 border-l-4 border-[#059669] bg-white py-4 rounded-r-xl shadow-sm">
              <MathRenderer content={question.content.match(/\$\$[\s\S]*?\$\$/g)?.join(' ') || ''} />
            </div>
          )}

          {/* Options */}
          <div className="space-y-3 mt-8">
            {OPTION_LETTERS.map((letter) => {
              const isSelected = selectedAnswer === letter;

              return (
                <button
                  key={letter}
                  onClick={() => onSelectAnswer(letter)}
                  className={`w-full flex items-start gap-4 p-5 rounded-2xl text-left transition-all border-2
                    ${
                      isSelected
                        ? 'border-[#059669] bg-[#f0fdf9] shadow-md shadow-[#059669]/10'
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                    }
                  `}
                >
                  {/* Letter badge */}
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 transition-all
                      ${
                        isSelected
                          ? 'bg-[#059669] text-white'
                          : 'bg-gray-100 text-gray-500'
                      }
                    `}
                  >
                    {letter}
                  </span>

                  {/* Option text */}
                  <span className={`text-base pt-1.5 leading-relaxed ${isSelected ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                    <MathRenderer content={question.options[letter]} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
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
