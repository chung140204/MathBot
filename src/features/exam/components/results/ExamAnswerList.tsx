'use client';

import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import MathRenderer from '@/shared/components/MathRenderer';

interface Question {
  id: string; content: string; options: Record<string, string>;
  answer: string; explanation: string; topic: string; difficulty: string; format: string;
  statementA?: string; statementB?: string; statementC?: string; statementD?: string;
  answerA?: boolean; answerB?: boolean; answerC?: boolean; answerD?: boolean;
  correctAnswer?: string;
}

interface ExamAnswer {
  id: string; questionId: string; userAnswer: string | null; isCorrect: boolean; score: number;
  shortAnswer: string | null;
  tfAnswerA: boolean | null; tfAnswerB: boolean | null; tfAnswerC: boolean | null; tfAnswerD: boolean | null;
  question: Question;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  RECOGNITION: 'Nhận biết', COMPREHENSION: 'Thông hiểu', APPLICATION: 'Vận dụng', ADVANCED: 'Vận dụng cao',
};

export function ExamAnswerList({ answers, topicLabels, avgTimeSecs, expandedIds, onToggle }: {
  answers: ExamAnswer[];
  topicLabels: Record<string, string>;
  avgTimeSecs: number;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="divide-y divide-slate-100">
      {answers.map((ans, idx) => (
        <div key={ans.id}>
          <div onClick={() => onToggle(ans.id)}
            className={`w-full group hover:bg-slate-50/80 transition-all cursor-pointer border-l-[6px] ${ans.isCorrect ? 'border-emerald-500' : 'border-red-500'}`}>
            <div className="px-8 py-6 flex items-start gap-6">
              <div className={`mt-0.5 px-3 py-1 rounded-lg flex items-center gap-1.5 flex-shrink-0 ${ans.isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {ans.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-black uppercase tracking-widest">{ans.isCorrect ? 'Đúng' : 'Sai'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-black text-slate-900">Câu {idx + 1}</span>
                  <div className="h-4 w-px bg-slate-200" />
                  <span className="text-xs font-bold text-slate-500 line-clamp-1 flex-1"><MathRenderer content={ans.question.content.substring(0, 100) + '...'} /></span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tight">{topicLabels[ans.question.topic] || ans.question.topic}</span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tight">{DIFFICULTY_LABELS[ans.question.difficulty] || ans.question.difficulty}</span>
                  {ans.question.format === 'TRUE_FALSE' && <span className="px-2.5 py-1 bg-sky-100 text-sky-600 rounded-lg text-[10px] font-black uppercase tracking-tight">Đúng/Sai</span>}
                  {ans.question.format === 'SHORT_ANSWER' && <span className="px-2.5 py-1 bg-amber-100 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-tight">Điền số</span>}
                  <div className="ml-auto flex items-center gap-1 text-slate-400 font-bold text-xs">
                    <Clock className="w-3.5 h-3.5" /><span>{avgTimeSecs}s</span>
                    {expandedIds.has(ans.id) ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {expandedIds.has(ans.id) && (
            <div className="px-8 pb-8 pt-2 bg-slate-50/50">
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                <div className="text-slate-900 leading-relaxed mb-8"><MathRenderer content={ans.question.content} /></div>

                {/* MC */}
                {ans.question.format === 'MULTIPLE_CHOICE' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(ans.question.options).map(([key, val]) => {
                      const isCorrect = key === ans.question.answer;
                      const isSelected = key === ans.userAnswer;
                      const styles = isCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500 ring-inset'
                        : isSelected ? 'border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500 ring-inset' : 'border-slate-200 bg-white text-slate-700';
                      return (
                        <div key={key} className={`p-4 rounded-xl border-2 flex items-start gap-4 transition-all duration-300 ${styles}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black flex-shrink-0 ${isCorrect ? 'bg-emerald-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'}`}>{key}</div>
                          <div className="flex-1 pt-1 font-medium">
                            <MathRenderer content={val as string} />
                            {isCorrect && <div className="mt-2 text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Đáp án đúng</div>}
                            {isSelected && !isCorrect && <div className="mt-2 text-[10px] font-black uppercase text-red-600 flex items-center gap-1"><XCircle className="w-3 h-3" /> Bạn chọn</div>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TF */}
                {ans.question.format === 'TRUE_FALSE' && (
                  <div className="space-y-4">
                    {[
                      { label: 'a', content: ans.question.statementA, user: ans.tfAnswerA, correct: ans.question.answerA },
                      { label: 'b', content: ans.question.statementB, user: ans.tfAnswerB, correct: ans.question.answerB },
                      { label: 'c', content: ans.question.statementC, user: ans.tfAnswerC, correct: ans.question.answerC },
                      { label: 'd', content: ans.question.statementD, user: ans.tfAnswerD, correct: ans.question.answerD },
                    ].map(item => (
                      <div key={item.label} className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                        <div className="flex items-start gap-4"><span className="font-black text-slate-400 w-6 uppercase">{item.label}.</span><div className="flex-1 text-slate-800 font-medium"><MathRenderer content={item.content || ''} /></div></div>
                        <div className="mt-4 flex gap-3 pl-10">
                          <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${item.user === item.correct ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            <span>Bạn chọn: {item.user ? 'Đúng' : 'Sai'}</span>
                            {item.user === item.correct ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          </div>
                          {item.user !== item.correct && <div className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-600 shadow-sm">Đáp án đúng: {item.correct ? 'Đúng' : 'Sai'}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SA */}
                {ans.question.format === 'SHORT_ANSWER' && (
                  <div className="flex flex-col md:flex-row gap-6 p-8 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                    <div className="flex-1 flex flex-col gap-2"><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bạn nhập</span><span className={`text-4xl font-black italic tracking-tighter ${ans.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>{ans.shortAnswer || '_(Bỏ trống)_'}</span></div>
                    <div className="w-px bg-slate-200 hidden md:block" />
                    <div className="flex-1 flex flex-col gap-2 text-right"><span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Đáp án đúng</span><span className="text-4xl font-black italic tracking-tighter text-emerald-600">{ans.question.correctAnswer}</span></div>
                  </div>
                )}

                {/* Explanation */}
                <div className="mt-8 pt-8 border-t border-slate-100">
                  <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden">
                    <div className="absolute -top-1 -right-1 opacity-5"><TrendingUp className="w-24 h-24" /></div>
                    <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4"><CheckCircle2 className="w-4 h-4" /> Giải thích chi tiết</h4>
                    <div className="text-sm font-medium text-slate-700 leading-relaxed"><MathRenderer content={ans.question.explanation} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
