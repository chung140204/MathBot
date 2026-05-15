'use client';

import React from 'react';
import MathRenderer from './MathRenderer';
import AIHintModal from './AIHintModal';

export type QuestionFormat = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';

export interface QuestionData {
  id: string;
  content: string;
  format: QuestionFormat;
  options?: { A: string; B: string; C: string; D: string };
  statementA?: string;
  statementB?: string;
  statementC?: string;
  statementD?: string;
  topic: string;
  difficulty: string;
  imageUrl?: string | null;
}

interface QuestionCardProps {
  question: QuestionData;
  questionNumber: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export default function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
}: QuestionCardProps) {
  const [isHintOpen, setIsHintOpen] = React.useState(false);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Question label */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Câu hỏi {questionNumber}
        </p>
        <button
          onClick={() => setIsHintOpen(true)}
          className="px-4 py-1.5 text-xs font-semibold text-[#059669] bg-[#f0fdf9] border border-[#059669]/20
            rounded-full hover:bg-[#059669]/10 transition-all flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
          Gợi ý từ AI
        </button>
      </div>

      <AIHintModal 
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        questionContent={question.content}
      />

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

      {/* Question image (figure/table from exam) */}
      {question.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={question.imageUrl}
          alt={`Hình minh họa câu ${questionNumber}`}
          className="w-full max-w-lg mx-auto rounded-xl border border-gray-100 shadow-sm my-4"
        />
      )}

      {/* Render by Format */}
      {question.format === 'MULTIPLE_CHOICE' && (
        <div className="space-y-3 mt-8">
          {OPTION_LETTERS.map((letter) => {
            const isSelected = selectedAnswer === letter;

            return (
              <button
                key={letter}
                onClick={() => onSelectAnswer(letter)}
                className={`w-full flex items-start gap-4 p-5 rounded-2xl text-left transition-all border-2 group
                  ${
                    isSelected
                      ? 'border-[#059669] bg-[#f0fdf9] shadow-md shadow-[#059669]/10'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }
                `}
              >
                {/* Letter badge */}
                <span
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 transition-all
                    ${isSelected 
                      ? 'bg-gradient-to-br from-[#059669] to-[#0891b2] text-white shadow-lg' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}
                  `}
                >
                  {letter}
                </span>

                {/* Option text */}
                <span
                  className={`text-base pt-2 leading-relaxed ${
                    isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'
                  }`}
                >
                  <MathRenderer content={question.options?.[letter] || ''} />
                </span>
              </button>
            );
          })}
        </div>
      )}

      {question.format === 'TRUE_FALSE' && (
        <div className="mt-8 space-y-6">
          {[
            { label: 'a', content: question.statementA },
            { label: 'b', content: question.statementB },
            { label: 'c', content: question.statementC },
            { label: 'd', content: question.statementD },
          ].map((item, idx) => {
            const currentAnswers = selectedAnswer?.split(',') || ['', '', '', ''];
            const currentVal = currentAnswers[idx];

            const handleSelect = (val: 'T' | 'F') => {
              const newAnswers = [...currentAnswers];
              newAnswers[idx] = val;
              onSelectAnswer(newAnswers.join(','));
            };

            return (
              <div
                key={item.label}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4"
              >
                <div className="flex gap-4">
                  <span className="w-7 h-7 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {item.label}
                  </span>
                  <div className="text-gray-700 font-medium pt-0.5">
                    <MathRenderer content={item.content || ''} />
                  </div>
                </div>

                <div className="flex gap-2 ml-11">
                  <button
                    onClick={() => handleSelect('T')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold border-2 transition-all
                      ${
                        currentVal === 'T'
                          ? 'bg-[#059669] border-[#059669] text-white shadow-lg shadow-[#059669]/20'
                          : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                      }
                    `}
                  >
                    Đúng
                  </button>
                  <button
                    onClick={() => handleSelect('F')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold border-2 transition-all
                      ${
                        currentVal === 'F'
                          ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                          : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                      }
                    `}
                  >
                    Sai
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {question.format === 'SHORT_ANSWER' && (
        <div className="mt-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-md mx-auto">
          <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Đáp án của bạn
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="Nhập đáp án số..."
              value={selectedAnswer || ''}
              onChange={(e) => onSelectAnswer(e.target.value)}
              className="w-full text-2xl font-black text-[#059669] px-6 py-5 bg-[#f0fdf9] border-2 border-[#059669]/20 rounded-2xl
                focus:outline-none focus:border-[#059669] placeholder:text-gray-300 transition-all text-center"
            />
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 font-medium">
                Lưu ý: Chỉ nhập chữ số và dấu ngăn cách thập phân nếu có.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
