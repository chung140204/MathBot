'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MathRenderer from '@/shared/components/MathRenderer';
import { CheckCircle, XCircle, ArrowLeft, Trophy } from 'lucide-react';

interface QuestionResult {
  questionId: string; userAnswer: string | null; shortAnswer: string | null;
  correctAnswer: string; isCorrect: boolean; score: number; explanation: string;
}
interface ExamResult { attemptId: string; totalScore: number; totalQuestions: number; percentage: number; results: QuestionResult[]; }

export default function ClassroomResultClient({ classroomId, assignmentId }: { classroomId: string; assignmentId: string }) {
  const [result, setResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    // Try to load from localStorage first (set during submit)
    const stored = localStorage.getItem(`exam-result-${assignmentId}`);
    if (stored) {
      try { setResult(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, [assignmentId]);

  if (!result) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Không tìm thấy kết quả</p>
        <Link href={`/classrooms/${classroomId}`} className="text-emerald-600 hover:underline text-sm mt-2 inline-block">Quay lại lớp học</Link>
      </div>
    );
  }

  const scoreColor = result.percentage >= 80 ? 'text-green-600' : result.percentage >= 50 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="p-6 md:p-8 w-full max-w-4xl mx-auto">
      <Link href={`/classrooms/${classroomId}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-emerald-600 mb-6">
        <ArrowLeft size={14} /> Quay lại lớp học
      </Link>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8 text-center">
        <Trophy size={40} className={`mx-auto mb-3 ${scoreColor}`} />
        <p className={`text-4xl font-bold ${scoreColor}`}>{result.percentage}%</p>
        <p className="text-gray-600 mt-1">{result.totalScore}/{result.totalQuestions} câu đúng</p>
      </div>

      {/* Per-question review */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết bài làm</h2>
      <div className="space-y-4">
        {result.results.map((r, i) => (
          <div key={r.questionId} className={`bg-white rounded-xl border p-5 ${r.isCorrect ? 'border-green-200' : 'border-red-200'}`}>
            <div className="flex items-start gap-3 mb-3">
              {r.isCorrect ? <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" /> : <XCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">Câu {i + 1} ({r.score} điểm)</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <div><span className="text-gray-500">Đáp án bạn: </span><span className={r.isCorrect ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{r.userAnswer || r.shortAnswer || '(bỏ trống)'}</span></div>
                  {!r.isCorrect && <div><span className="text-gray-500">Đáp án đúng: </span><span className="text-green-600 font-medium">{r.correctAnswer}</span></div>}
                </div>
              </div>
            </div>
            {r.explanation && (
              <div className="ml-8 mt-2 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="text-blue-700 font-medium mb-1">Giải thích:</p>
                <MathRenderer content={r.explanation} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
