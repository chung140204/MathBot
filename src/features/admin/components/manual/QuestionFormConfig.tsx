'use client';

import { TOPICS } from '@/shared/constants/topics';

type Format = 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';

interface QuestionFormConfigProps {
  format: Format;
  setFormat: (f: Format) => void;
  topic: string;
  setTopic: (t: string) => void;
  difficulty: string;
  setDifficulty: (d: string) => void;
  questionType: string;
  setQuestionType: (q: string) => void;
}

export function QuestionFormConfig({
  format, setFormat, topic, setTopic, difficulty, setDifficulty, questionType, setQuestionType,
}: QuestionFormConfigProps) {
  return (
    <>
      {/* Format Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block">Định dạng câu hỏi</label>
        <div className="grid grid-cols-3 gap-3">
          {([
            { id: 'MULTIPLE_CHOICE' as const, label: 'Trắc nghiệm ABCD', icon: '📝' },
            { id: 'TRUE_FALSE' as const, label: 'Đúng / Sai', icon: '⚖️' },
            { id: 'SHORT_ANSWER' as const, label: 'Trả lời ngắn', icon: '🔢' },
          ]).map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id)}
              className={`p-4 rounded-xl border-2 transition-all text-center space-y-2 ${
                format === f.id
                  ? 'border-indigo-600 bg-indigo-50/50 ring-4 ring-indigo-50'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="text-2xl">{f.icon}</div>
              <div className={`text-xs font-bold ${format === f.id ? 'text-indigo-700' : 'text-slate-500'}`}>
                {f.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Config Dropdowns */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Chủ đề</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500">
            {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Mức độ</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500">
            <option value="RECOGNITION">Nhận biết</option>
            <option value="COMPREHENSION">Thông hiểu</option>
            <option value="APPLICATION">Vận dụng</option>
            <option value="ADVANCED">Vận dụng cao</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Loại</label>
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500">
            <option value="PRACTICE">Luyện tập</option>
            <option value="EXAM_SET">Bộ đề</option>
            <option value="THPT_EXAM">Đề thi THPT</option>
          </select>
        </div>
      </div>
    </>
  );
}
