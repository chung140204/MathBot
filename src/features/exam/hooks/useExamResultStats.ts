'use client';
import { useState, useMemo } from 'react';
import { TOPIC_LABEL } from '@/shared/constants/topics';

const DIFFICULTY_LABELS: Record<string, string> = {
  RECOGNITION: 'Nhận biết', COMPREHENSION: 'Thông hiểu',
  APPLICATION: 'Vận dụng', ADVANCED: 'Vận dụng cao',
};
const TOPIC_LABELS = TOPIC_LABEL as Record<string, string>;

interface Question {
  id: string; content: string; options: Record<string, string>; answer: string;
  explanation: string; topic: string; difficulty: string; format: string;
  statementA?: string; statementB?: string; statementC?: string; statementD?: string;
  answerA?: boolean; answerB?: boolean; answerC?: boolean; answerD?: boolean; correctAnswer?: string;
}
interface ExamAnswer {
  id: string; questionId: string; userAnswer: string | null; isCorrect: boolean; score: number;
  shortAnswer: string | null; tfAnswerA: boolean | null; tfAnswerB: boolean | null;
  tfAnswerC: boolean | null; tfAnswerD: boolean | null; question: Question;
}
export interface ExamAttempt {
  id: string; totalScore: number; totalQuestions: number; timeTakenSecs: number;
  topics: string[]; submittedAt: string; answers: ExamAnswer[];
}

export function useExamResultStats(attempt: ExamAttempt | null) {
  const [filter, setFilter] = useState<'ALL' | 'CORRECT' | 'WRONG'>('ALL');
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    const next = new Set(expandedQuestions);
    if (next.has(id)) next.delete(id); else next.add(id);
    setExpandedQuestions(next);
  };

  const stats = useMemo(() => {
    if (!attempt) return null;
    const correct = attempt.answers.filter(a => a.isCorrect).length;
    const wrong = attempt.answers.filter(a => !a.isCorrect && a.userAnswer !== null).length;
    const skip = attempt.answers.filter(a => a.userAnswer === null && a.shortAnswer === null && a.tfAnswerA === null).length;
    const timeFormatted = `${Math.floor(attempt.timeTakenSecs / 60)}:${String(attempt.timeTakenSecs % 60).padStart(2, '0')}`;

    const diffMap: Record<string, { total: number; correct: number }> = {
      RECOGNITION: { total: 0, correct: 0 }, COMPREHENSION: { total: 0, correct: 0 },
      APPLICATION: { total: 0, correct: 0 }, ADVANCED: { total: 0, correct: 0 },
    };
    attempt.answers.forEach(a => {
      const q = a.question;
      if (diffMap[q.difficulty]) { diffMap[q.difficulty].total++; if (a.isCorrect) diffMap[q.difficulty].correct++; }
    });
    const diffData = Object.entries(diffMap).map(([key, val]) => ({
      name: DIFFICULTY_LABELS[key] || key, total: val.total, correct: val.correct,
      percentage: val.total > 0 ? (val.correct / val.total) * 100 : 0,
    }));

    const topicMap: Record<string, { total: number; correct: number }> = {};
    attempt.answers.forEach(a => {
      const t = a.question.topic;
      if (!topicMap[t]) topicMap[t] = { total: 0, correct: 0 };
      topicMap[t].total++; if (a.isCorrect) topicMap[t].correct++;
    });
    const topicData = Object.entries(topicMap).map(([key, val]) => ({
      name: TOPIC_LABELS[key] || key, total: val.total, correct: val.correct,
      percentage: val.total > 0 ? Math.round((val.correct / val.total) * 100) : 0,
    })).sort((a, b) => b.percentage - a.percentage);

    const sortedTopics = [...topicData].sort((a, b) => a.percentage - b.percentage);
    const suggestions = [
      { type: 'CRITICAL', label: 'Cần ôn lại', topic: sortedTopics[0]?.name || 'N/A', desc: 'Chủ đề này bạn đạt kết quả thấp nhất. Nên xem lại lý thuyết cơ bản và làm thêm bài tập nhận biết.', bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600' },
      { type: 'WARNING', label: 'Nên xem lại', topic: sortedTopics[1]?.name || 'N/A', desc: 'Bạn đã nắm được cơ bản nhưng còn sai ở một số dạng bài vận dụng.', bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' },
      { type: 'SUCCESS', label: 'Đã nắm tốt', topic: topicData[0]?.name || 'N/A', desc: 'Kết quả tuyệt vời! Bạn có thể chuyển sang ôn tập các dạng bài nâng cao hơn của chủ đề này.', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
    ];
    const avgTime = attempt.totalQuestions > 0 ? Math.floor(attempt.timeTakenSecs / attempt.totalQuestions) : 0;
    const timeData = attempt.answers.map((_, i) => ({ name: `Câu ${i + 1}`, time: avgTime }));

    return { correct, wrong, skip, timeFormatted, diffData, topicData, timeData, suggestions };
  }, [attempt]);

  const filteredAnswers = useMemo(() => {
    if (!attempt) return [];
    if (filter === 'ALL') return attempt.answers;
    if (filter === 'CORRECT') return attempt.answers.filter(a => a.isCorrect);
    return attempt.answers.filter(a => !a.isCorrect);
  }, [attempt, filter]);

  return { stats, filteredAnswers, filter, setFilter, expandedQuestions, toggleExpand };
}
