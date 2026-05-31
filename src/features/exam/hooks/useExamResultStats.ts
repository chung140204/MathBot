'use client';
import { useState, useMemo } from 'react';
import { TOPIC_LABEL } from '@/shared/constants/topics';
import { difficultyLabel } from '@/shared/constants/difficulty';

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
      name: difficultyLabel(key), total: val.total, correct: val.correct,
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

    // Phân loại chủ đề theo mức điểm THỰC TẾ (không theo thứ hạng) để mỗi thẻ
    // phản ánh đúng năng lực: tránh khen chủ đề điểm thấp và tránh một chủ đề
    // vừa "cần ôn lại" vừa "đã nắm tốt" khi đề chỉ có ít chủ đề.
    // topicData đã sắp xếp giảm dần theo percentage (cao → thấp).
    const critical = topicData.filter(t => t.percentage < 50);
    const warning = topicData.filter(t => t.percentage >= 50 && t.percentage < 75);
    const strong = topicData.filter(t => t.percentage >= 75);
    const moreText = (n: number) => (n > 1 ? ` (và ${n - 1} chủ đề khác)` : '');

    const suggestions: Array<{
      type: string; label: string; topic: string; desc: string;
      bg: string; border: string; text: string;
    }> = [];

    if (critical.length) {
      const worst = critical[critical.length - 1]; // thấp nhất
      suggestions.push({
        type: 'CRITICAL', label: 'Cần ôn lại', topic: worst.name + moreText(critical.length),
        desc: `Bạn đạt ${worst.percentage}%, cần xem lại lý thuyết cơ bản và làm thêm bài tập nhận biết`,
        bg: 'bg-red-50', border: 'border-red-100', text: 'text-red-600',
      });
    }
    if (warning.length) {
      const w = warning[0]; // cao nhất trong nhóm trung bình
      suggestions.push({
        type: 'WARNING', label: 'Nên xem lại', topic: w.name + moreText(warning.length),
        desc: `Bạn đạt ${w.percentage}%, đã nắm cơ bản nhưng còn sai ở một số dạng bài vận dụng`,
        bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600',
      });
    }
    if (strong.length) {
      const s = strong[0]; // tốt nhất
      suggestions.push({
        type: 'SUCCESS', label: 'Đã nắm tốt', topic: s.name + moreText(strong.length),
        desc: `Bạn đạt ${s.percentage}%, có thể chuyển sang các dạng bài nâng cao hơn của chủ đề này`,
        bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600',
      });
    }
    if (suggestions.length === 0) {
      suggestions.push({
        type: 'NEUTRAL', label: 'Tiếp tục luyện tập', topic: 'Chưa đủ dữ liệu',
        desc: 'Hãy làm thêm bài để hệ thống đánh giá chính xác điểm mạnh và điểm yếu của bạn',
        bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-600',
      });
    }
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
