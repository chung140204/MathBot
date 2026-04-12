'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  Share2,
  RefreshCcw,
  Zap,
  TrendingUp,
  Target,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import MathRenderer from '@/components/exam/MathRenderer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Question {
  id: string;
  content: string;
  options: any;
  answer: string;
  explanation: string;
  topic: string;
  difficulty: string;
  format: string;
  statementA?: string;
  statementB?: string;
  statementC?: string;
  statementD?: string;
  answerA?: boolean;
  answerB?: boolean;
  answerC?: boolean;
  answerD?: boolean;
  correctAnswer?: string;
}

interface ExamAnswer {
  id: string;
  questionId: string;
  userAnswer: string | null;
  isCorrect: boolean;
  score: number;
  shortAnswer: string | null;
  tfAnswerA: boolean | null;
  tfAnswerB: boolean | null;
  tfAnswerC: boolean | null;
  tfAnswerD: boolean | null;
  question: Question;
}

interface ExamAttempt {
  id: string;
  totalScore: number;
  totalQuestions: number;
  timeTakenSecs: number;
  topics: string[];
  submittedAt: string;
  answers: ExamAnswer[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTY_LABELS: Record<string, string> = {
  RECOGNITION: 'Nhận biết',
  COMPREHENSION: 'Thông hiểu',
  APPLICATION: 'Vận dụng',
  ADVANCED: 'Vận dụng cao',
};

const TOPIC_LABELS: Record<string, string> = {
  DERIVATIVES: 'Đạo hàm',
  INTEGRALS: 'Tích phân',
  FUNCTIONS: 'Hàm số',
  LIMITS: 'Giới hạn',
  COMPLEX_NUMBERS: 'Số phức',
  PROBABILITY: 'Xác suất',
  SEQUENCES: 'Dãy số',
  EXPONENTIAL_LOG: 'Mũ & Logarit',
  VOLUME: 'Thể tích',
  ANALYTIC_GEOMETRY: 'Hình Oxyz',
  SOLID_GEOMETRY: 'Hình không gian',
};

// ─── Components ───────────────────────────────────────────────────────────────

export default function ExamResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const attemptId = searchParams.get('attemptId');
  
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'CORRECT' | 'WRONG'>('ALL');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!attemptId) return;
    
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/v1/exam/result?attemptId=${attemptId}`);
        if (res.ok) {
          const data = await res.json();
          setAttempt(data);
        } else {
          console.error('Failed to fetch exam result');
        }
      } catch (err) {
        console.error('Error fetching exam result:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  // ─── Data Processing ────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    if (!attempt) return null;
    
    const correct = attempt.answers.filter(a => a.isCorrect).length;
    const wrong = attempt.answers.filter(a => !a.isCorrect && a.userAnswer !== null).length;
    const skip = attempt.answers.filter(a => a.userAnswer === null && a.shortAnswer === null && a.tfAnswerA === null).length;
    
    const timeFormatted = `${Math.floor(attempt.timeTakenSecs / 60)}:${String(attempt.timeTakenSecs % 60).padStart(2, '0')}`;
    
    // Difficulty breakdown
    const diffMap: Record<string, { total: number; correct: number }> = {
      RECOGNITION: { total: 0, correct: 0 },
      COMPREHENSION: { total: 0, correct: 0 },
      APPLICATION: { total: 0, correct: 0 },
      ADVANCED: { total: 0, correct: 0 },
    };
    
    attempt.answers.forEach(a => {
      const q = a.question;
      if (diffMap[q.difficulty]) {
        diffMap[q.difficulty].total++;
        if (a.isCorrect) diffMap[q.difficulty].correct++;
      }
    });

    const diffData = Object.entries(diffMap).map(([key, val]) => ({
      name: DIFFICULTY_LABELS[key] || key,
      total: val.total,
      correct: val.correct,
      percentage: val.total > 0 ? (val.correct / val.total) * 100 : 0
    }));

    // Topic breakdown
    const topicMap: Record<string, { total: number; correct: number }> = {};
    attempt.answers.forEach(a => {
      const t = a.question.topic;
      if (!topicMap[t]) topicMap[t] = { total: 0, correct: 0 };
      topicMap[t].total++;
      if (a.isCorrect) topicMap[t].correct++;
    });

    const topicData = Object.entries(topicMap).map(([key, val]) => ({
      name: TOPIC_LABELS[key] || key,
      total: val.total,
      correct: val.correct,
      percentage: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0
    })).sort((a, b) => b.percentage - a.percentage);

    // AI Suggestions based on topic performance
    const sortedTopics = [...topicData].sort((a, b) => a.percentage - b.percentage);
    const suggestions = [
      {
        type: 'CRITICAL',
        label: 'Cần ôn lại',
        topic: sortedTopics[0]?.name || 'N/A',
        desc: 'Chủ đề này bạn đạt kết quả thấp nhất. Nên xem lại lý thuyết cơ bản và làm thêm bài tập nhận biết.',
        bg: 'bg-red-50',
        border: 'border-red-100',
        text: 'text-red-600'
      },
      {
        type: 'WARNING',
        label: 'Nên xem lại',
        topic: sortedTopics[1]?.name || 'N/A',
        desc: 'Bạn đã nắm được cơ bản nhưng còn sai ở một số dạng bài vận dụng.',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        text: 'text-amber-600'
      },
      {
        type: 'SUCCESS',
        label: 'Đã nắm tốt',
        topic: topicData[0]?.name || 'N/A',
        desc: 'Kết quả tuyệt vời! Bạn có thể chuyển sang ôn tập các dạng bài nâng cao hơn của chủ đề này.',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        text: 'text-emerald-600'
      }
    ];

    // Mock Time per question (since we don't have real timestamps yet)
    const timeData = attempt.answers.map((_, i) => ({
      name: `Câu ${i + 1}`,
      time: Math.floor(attempt.timeTakenSecs / attempt.totalQuestions) + (Math.random() > 0.5 ? 5 : -5)
    }));

    return { correct, wrong, skip, timeFormatted, diffData, topicData, timeData, suggestions };
  }, [attempt]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const toggleExpand = (id: string) => {
    const next = new Set(expandedQuestions);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedQuestions(next);
  };

  const filteredAnswers = useMemo(() => {
    if (!attempt) return [];
    if (filter === 'ALL') return attempt.answers;
    if (filter === 'CORRECT') return attempt.answers.filter(a => a.isCorrect);
    return attempt.answers.filter(a => !a.isCorrect);
  }, [attempt, filter]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
  );

  if (!attempt || !stats) return (
    <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-slate-900">Không tìm thấy kết quả</h1>
        <p className="text-slate-500 mt-2">Bài thi có thể chưa được nộp hoặc ID không hợp lệ.</p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="mt-6 px-6 py-2 bg-emerald-600 text-white font-bold rounded-xl"
        >
          Về Dashboard
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* ── Navbar ── */}
      <nav className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
          <span className="font-black text-xl text-slate-900 italic tracking-tighter">MathBot</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-600 font-bold hover:text-slate-900 transition-colors">Về trang chủ</Link>
          <button 
            onClick={() => router.push('/exam')}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors"
          >
            Thi lại ngay →
          </button>
        </div>
      </nav>

      {/* ── Hero section ── */}
      <header className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-gradient-to-br from-[#059669] to-[#0891b2] rounded-3xl p-8 text-center text-white relative overflow-hidden shadow-2xl shadow-emerald-200/50">
           {/* Achievement Badge */}
           <div className="absolute top-6 right-6">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <span className="font-black uppercase text-xs tracking-widest text-white">Xuất sắc</span>
              </div>
           </div>

           <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-widest mb-4">
             Thi nhanh · {attempt.totalQuestions} câu · 15 phút
           </span>

           <div className="flex flex-col items-center gap-1">
              <span className="text-8xl font-black italic tracking-tighter drop-shadow-lg">
                {attempt.totalScore}
              </span>
              <span className="text-white/70 font-bold uppercase tracking-widest text-sm">/ 10 điểm</span>
           </div>

           <div className="mt-8 flex justify-center gap-3 text-[13px] font-medium text-white/80">
              {attempt.topics.map(t => TOPIC_LABELS[t] || t).join(' · ')}
              <span> · Hoàn thành lúc {new Date(attempt.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
           </div>

           {/* Stats Summary */}
           <div className="grid grid-cols-4 gap-4 mt-8">
              {[
                { label: 'Câu đúng', value: stats.correct, color: 'bg-emerald-500/20 text-emerald-100' },
                { label: 'Câu sai', value: stats.wrong, color: 'bg-red-500/20 text-red-100' },
                { label: 'Bỏ qua', value: stats.skip, color: 'bg-slate-500/20 text-slate-100' },
                { label: 'Thời gian', value: stats.timeFormatted, color: 'bg-amber-500/20 text-amber-100' }
              ].map(s => (
                <div key={s.label} className={`${s.color} backdrop-blur-sm p-4 rounded-2xl flex flex-col items-center gap-1 border border-white/10`}>
                  <span className="text-2xl font-black">{s.value}</span>
                  <span className="text-[10px] font-bold uppercase opacity-70 tracking-widest">{s.label}</span>
                </div>
              ))}
           </div>
        </div>
      </header>

      {/* ── Details Grid ── */}
      <div className="max-w-4xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Difficulty Breakdown */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> Kết quả theo độ khó
          </h3>
          <div className="space-y-6">
            {stats.diffData.map(d => (
              <div key={d.name} className="flex flex-col gap-2">
                <div className="flex justify-between text-[11px] font-bold uppercase text-slate-400">
                  <span>{d.name}</span>
                  <span className="text-slate-900">{d.correct}/{d.total}</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      d.name === 'Nhận biết' ? 'bg-emerald-500' : 
                      d.name === 'Thông hiểu' ? 'bg-sky-500' : 
                      d.name === 'Vận dụng' ? 'bg-amber-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${d.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-500" /> Kết quả theo chủ đề
          </h3>
          <div className="space-y-6">
            {stats.topicData.map(t => (
              <div key={t.name} className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${t.percentage > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span className="text-sm font-bold text-slate-700 flex-1">{t.name}</span>
                <span className="text-[13px] font-black text-slate-900">{t.correct}/{t.total}</span>
                <span className={`text-[11px] font-bold ${t.percentage > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{t.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Time per Question */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
           <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" /> Thời gian làm từng câu
          </h3>
          <div className="h-[200px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.timeData} layout="vertical" margin={{ left: -10, top: 0, right: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} width={50} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold">
                          {payload[0].value}s
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="time" radius={[0, 4, 4, 0]} barSize={8}>
                  {stats.timeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 3 ? '#f97316' : '#0ea5e9'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> Gợi ý ôn tập
          </h3>
          <div className="space-y-4">
            {stats.suggestions.map((s, i) => (
              <div key={i} className={`p-4 ${s.bg} rounded-2xl border ${s.border} flex flex-col gap-1`}>
                <span className={`text-[10px] font-black uppercase ${s.text} tracking-widest`}>{s.label}</span>
                <span className="text-sm font-bold text-slate-900">{s.topic} — {s.desc.split('.')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Review Section ── */}
      <section className="max-w-4xl mx-auto mt-12 px-4 shadow-sm">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
          {/* Header & Filter */}
          <div className="px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-black text-slate-900 text-lg">Chi tiết từng câu</h2>
            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-200">
              {[
                { id: 'ALL' as const, label: `Tất cả (${attempt.totalQuestions})` },
                { id: 'WRONG' as const, label: `Sai (${stats.wrong + stats.skip})` },
                { id: 'CORRECT' as const, label: `Đúng (${stats.correct})` }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    filter === f.id ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question List */}
          <div className="divide-y divide-slate-100">
            {filteredAnswers.map((ans, idx) => (
              <div key={ans.id} className="p-0">
                <div 
                  onClick={() => toggleExpand(ans.id)}
                  className={`w-full group hover:bg-slate-50/80 transition-all cursor-pointer border-l-[6px] ${
                    ans.isCorrect ? 'border-emerald-500' : 'border-red-500'
                  }`}
                >
                  <div className="px-8 py-6 flex items-start gap-6">
                    {/* Status Badge */}
                    <div className={`mt-0.5 px-3 py-1 rounded-lg flex items-center gap-1.5 flex-shrink-0 ${
                      ans.isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {ans.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {ans.isCorrect ? 'Đúng' : 'Sai'}
                      </span>
                    </div>

                    {/* Question Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-black text-slate-900">Câu {idx + 1}</span>
                        <div className="h-4 w-px bg-slate-200" />
                        <span className="text-xs font-bold text-slate-500 line-clamp-1 flex-1">
                          <MathRenderer content={ans.question.content.substring(0, 100) + '...'} />
                        </span>
                      </div>
                      
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tight">
                           {TOPIC_LABELS[ans.question.topic] || ans.question.topic}
                        </span>
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-[10px] font-black uppercase tracking-tight">
                           {DIFFICULTY_LABELS[ans.question.difficulty] || ans.question.difficulty}
                        </span>
                        {ans.question.format === 'TRUE_FALSE' && (
                          <span className="px-2.5 py-1 bg-sky-100 text-sky-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                            Đúng/Sai
                          </span>
                        )}
                        {ans.question.format === 'SHORT_ANSWER' && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-tight">
                            Điền số
                          </span>
                        )}
                        <div className="ml-auto flex items-center gap-1 text-slate-400 font-bold text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{Math.floor(attempt.timeTakenSecs / attempt.totalQuestions)}s</span>
                          {expandedQuestions.has(ans.id) ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                {expandedQuestions.has(ans.id) && (
                  <div className="px-8 pb-8 pt-2 bg-slate-50/50">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                      <div className="text-slate-900 leading-relaxed mb-8">
                         <MathRenderer content={ans.question.content} />
                      </div>

                      {/* Render based on format */}
                      {ans.question.format === 'MULTIPLE_CHOICE' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {Object.entries(ans.question.options as Record<string, string>).map(([key, val]) => {
                             const isCorrect = key === ans.question.answer;
                             const isSelected = key === ans.userAnswer;
                             
                             let statusStyles = "border-slate-200 bg-white text-slate-700";
                             if (isCorrect) statusStyles = "border-emerald-500 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500 ring-inset";
                             else if (isSelected) statusStyles = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500 ring-inset";

                             return (
                               <div key={key} className={`p-4 rounded-xl border-2 flex items-start gap-4 transition-all duration-300 ${statusStyles}`}>
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black flex-shrink-0 ${
                                    isCorrect ? 'bg-emerald-500 text-white' : isSelected ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'
                                  }`}>
                                    {key}
                                  </div>
                                  <div className="flex-1 pt-1 font-medium">
                                    <MathRenderer content={val} />
                                    {isCorrect && (
                                      <div className="mt-2 text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3" /> Đáp án đúng
                                      </div>
                                    )}
                                    {isSelected && !isCorrect && (
                                      <div className="mt-2 text-[10px] font-black uppercase text-red-600 flex items-center gap-1">
                                        <XCircle className="w-3 h-3" /> Bạn chọn
                                      </div>
                                    )}
                                  </div>
                               </div>
                             );
                           })}
                        </div>
                      )}

                      {ans.question.format === 'TRUE_FALSE' && (
                        <div className="space-y-4">
                           {[
                             { label: 'a', content: ans.question.statementA, user: ans.tfAnswerA, correct: ans.question.answerA },
                             { label: 'b', content: ans.question.statementB, user: ans.tfAnswerB, correct: ans.question.answerB },
                             { label: 'c', content: ans.question.statementC, user: ans.tfAnswerC, correct: ans.question.answerC },
                             { label: 'd', content: ans.question.statementD, user: ans.tfAnswerD, correct: ans.question.answerD }
                           ].map((item) => (
                             <div key={item.label} className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                                <div className="flex items-start gap-4">
                                  <span className="font-black text-slate-400 w-6 uppercase">{item.label}.</span>
                                  <div className="flex-1 text-slate-800 font-medium">
                                    <MathRenderer content={item.content || ''} />
                                  </div>
                                </div>
                                <div className="mt-4 flex gap-3 pl-10">
                                  <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 ${
                                    item.user === item.correct ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                  }`}>
                                    <span>Bạn chọn: {item.user ? 'Đúng' : 'Sai'}</span>
                                    {item.user === item.correct ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                  </div>
                                  {item.user !== item.correct && (
                                    <div className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-600 shadow-sm animate-pulse-subtle">
                                      Đáp án đúng: {item.correct ? 'Đúng' : 'Sai'}
                                    </div>
                                  )}
                                </div>
                             </div>
                           ))}
                        </div>
                      )}

                      {ans.question.format === 'SHORT_ANSWER' && (
                         <div className="flex flex-col md:flex-row gap-6 p-8 bg-slate-50 rounded-2xl border border-slate-200 border-dashed">
                            <div className="flex-1 flex flex-col gap-2">
                               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Bạn nhập</span>
                               <span className={`text-4xl font-black italic tracking-tighter ${ans.isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>
                                  {ans.shortAnswer || '_(Bỏ trống)_'}
                               </span>
                            </div>
                            <div className="w-px bg-slate-200 hidden md:block" />
                            <div className="flex-1 flex flex-col gap-2 text-right">
                               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Đáp án đúng</span>
                               <span className="text-4xl font-black italic tracking-tighter text-emerald-600">
                                  {ans.question.correctAnswer}
                               </span>
                            </div>
                         </div>
                      )}

                      {/* Explanation */}
                      <div className="mt-8 pt-8 border-t border-slate-100">
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 relative overflow-hidden">
                           <div className="absolute -top-1 -right-1 opacity-5">
                             <TrendingUp className="w-24 h-24" />
                           </div>
                           <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-4">
                             <CheckCircle2 className="w-4 h-4" /> Giải thích chi tiết
                           </h4>
                           <div className="text-sm font-medium text-slate-700 leading-relaxed">
                              <MathRenderer content={ans.question.explanation} />
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="max-w-4xl mx-auto mt-12 mb-20 px-4 flex flex-col md:flex-row items-center justify-center gap-4">
        <button 
          onClick={() => router.push('/dashboard')}
          className="w-full md:w-auto px-8 py-3 bg-white text-slate-600 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Về trang luyện tập
        </button>
        <button className="w-full md:w-auto px-8 py-3 bg-white text-slate-900 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          <Share2 className="w-4 h-4" /> Xem AI giải thích
        </button>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-slate-200"
        >
          Thi lại ngay →
        </button>
      </footer>
    </div>
  );
}
