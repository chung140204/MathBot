'use client';

import MathRenderer from '@/shared/components/MathRenderer';
import type { QuestionResult } from './types';

function MCResult({ result }: { result: QuestionResult }) {
  return (
    <div className="mt-4 space-y-2">
      {!result.isCorrect && (
        <>
          <div className="flex items-start gap-2">
            <span className="text-xs font-bold text-gray-400 w-20 pt-0.5 flex-shrink-0">Bạn chọn:</span>
            <span className="text-sm text-red-500 font-semibold">
              {result.userAnswer} — <MathRenderer content={result.options?.[result.userAnswer as keyof typeof result.options] || 'Bỏ qua'} />
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-xs font-bold text-gray-400 w-20 pt-0.5 flex-shrink-0">Đáp án đúng:</span>
            <span className="text-sm text-[#059669] font-semibold">
              {result.correctAnswer} — <MathRenderer content={result.options?.[result.correctAnswer as keyof typeof result.options] || ''} />
            </span>
          </div>
        </>
      )}
      {result.isCorrect && (
        <div className="flex items-start gap-2">
          <span className="text-xs font-bold text-gray-400 w-20 pt-0.5 flex-shrink-0">Đáp án:</span>
          <span className="text-sm text-[#059669] font-semibold">
            {result.correctAnswer} — <MathRenderer content={result.options?.[result.correctAnswer as keyof typeof result.options] || ''} />
          </span>
        </div>
      )}
    </div>
  );
}

function TFResult({ result }: { result: QuestionResult }) {
  const userAnswers = result.userAnswer?.split(',') || ['_', '_', '_', '_'];
  const st = result.statements;
  if (!st) return null;
  const items = [
    { label: 'a)', text: st.A, user: userAnswers[0], correct: st.ansA },
    { label: 'b)', text: st.B, user: userAnswers[1], correct: st.ansB },
    { label: 'c)', text: st.C, user: userAnswers[2], correct: st.ansC },
    { label: 'd)', text: st.D, user: userAnswers[3], correct: st.ansD },
  ];
  return (
    <div className="mt-4 space-y-3">
      <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Kết quả từng ý:</div>
      {items.map((item, idx) => {
        const userVal = item.user === 'T' ? true : item.user === 'F' ? false : null;
        const isItemCorrect = userVal === item.correct;
        return (
          <div key={idx} className={`p-3 rounded-xl border-l-4 ${isItemCorrect ? 'bg-emerald-50/50 border-emerald-500' : 'bg-red-50/50 border-red-500'}`}>
            <div className="flex items-start gap-3">
              <span className="font-bold text-gray-700 w-6 flex-shrink-0">{item.label}</span>
              <div className="flex-1 text-sm text-gray-700"><MathRenderer content={item.text} /></div>
            </div>
            <div className="mt-2 flex items-center gap-4 pl-9">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Bạn chọn:</span>
                <span className={`text-xs font-bold ${userVal === null ? 'text-gray-400' : userVal === item.correct ? 'text-emerald-600' : 'text-red-500'}`}>
                  {userVal === true ? 'Đúng' : userVal === false ? 'Sai' : 'Bỏ qua'}
                </span>
              </div>
              {!isItemCorrect && (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Đáp án:</span>
                  <span className="text-xs font-bold text-emerald-600">{item.correct ? 'Đúng' : 'Sai'}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div className="mt-2 text-right">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Điểm đạt được: {result.score}đ</span>
      </div>
    </div>
  );
}

function SAResult({ result }: { result: QuestionResult }) {
  return (
    <div className="mt-4 space-y-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-gray-400 uppercase">Bạn nhập:</span>
          <span className={`text-lg font-black ${result.isCorrect ? 'text-emerald-600' : 'text-red-500'}`}>
            {result.userAnswer || '_(Bỏ trống)_'}
          </span>
        </div>
        {!result.isCorrect && (
          <div className="flex flex-col gap-1 text-right">
            <span className="text-xs font-bold text-gray-400 uppercase">Đáp án đúng:</span>
            <span className="text-lg font-black text-emerald-600">{result.correctAnswer}</span>
          </div>
        )}
      </div>
      <div className="mt-2 text-right">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Điểm: {result.score}đ</span>
      </div>
    </div>
  );
}

export function QuestionResultItem({ result, isExpanded, onToggle }: {
  result: QuestionResult; isExpanded: boolean; onToggle: () => void;
}) {
  return (
    <div className={`border-2 rounded-2xl overflow-hidden transition-all ${
      result.isCorrect ? 'border-[#059669]/20' : result.score > 0 ? 'border-yellow-200' : 'border-red-200'
    }`}>
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-5 py-4 bg-white hover:bg-gray-50/50 transition-colors text-left">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          result.isCorrect ? 'bg-[#f0fdf9] text-[#059669]' : result.score > 0 ? 'bg-yellow-50 text-yellow-600' : 'bg-red-50 text-red-500'
        }`}>{result.questionNumber}</span>
        <span className="flex-1 text-sm text-gray-700 truncate"><MathRenderer content={result.content} /></span>
        <span className={`text-xs font-bold flex-shrink-0 ${
          result.isCorrect ? 'text-[#059669]' : result.score > 0 ? 'text-yellow-600' : 'text-red-500'
        }`}>{result.isCorrect ? '✓ Đúng' : result.score > 0 ? `! Đúng ${result.score * 10 || 0}/4 ý` : '✗ Sai'}</span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-gray-100 bg-gray-50/30">
          {result.format === 'MULTIPLE_CHOICE' && <MCResult result={result} />}
          {result.format === 'TRUE_FALSE' && <TFResult result={result} />}
          {result.format === 'SHORT_ANSWER' && <SAResult result={result} />}
          <div className="mt-4 pl-4 border-l-4 border-[#059669] bg-white py-3 px-4 rounded-r-xl shadow-sm">
            <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Hướng dẫn giải:</p>
            <div className="text-sm text-gray-700 leading-relaxed"><MathRenderer content={result.explanation} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
