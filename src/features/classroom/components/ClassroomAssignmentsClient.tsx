'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

interface Assignment {
  id: string; assignedAt: string; dueAt: string | null; isExpired: boolean; hasSubmitted: boolean;
  examSet: { id: string; title: string; description: string | null; timeLimit: number | null; _count: { questions: number } };
  attempt: { id: string; totalScore: number; totalQuestions: number } | null;
}

export default function ClassroomAssignmentsClient({ classroomId }: { classroomId: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/classroom/${classroomId}/assignments`).then(r => r.ok ? r.json() : []).then(setAssignments).catch(() => {}).finally(() => setLoading(false));
  }, [classroomId]);

  if (loading) return <div className="p-8"><div className="h-8 w-48 bg-gray-200 animate-pulse rounded" /></div>;

  return (
    <div className="p-6 md:p-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/classrooms" className="text-sm text-gray-500 hover:text-emerald-600">&larr; Lớp học</Link>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bài tập</h1>

      {assignments.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-50" />
          <p>Chưa có bài tập nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {assignments.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{a.examSet.title}</h3>
                  {a.examSet.description && <p className="text-sm text-gray-500 mb-2">{a.examSet.description}</p>}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><FileText size={12} />{a.examSet._count.questions} câu</span>
                    {a.examSet.timeLimit && <span className="flex items-center gap-1"><Clock size={12} />{Math.floor(a.examSet.timeLimit / 60)} phút</span>}
                    {a.dueAt && (
                      <span className={`flex items-center gap-1 ${a.isExpired ? 'text-red-500' : ''}`}>
                        {a.isExpired ? <AlertTriangle size={12} /> : <Clock size={12} />}
                        Hạn: {new Date(a.dueAt).toLocaleDateString('vi-VN')}
                        {a.isExpired && ' (Quá hạn)'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {a.hasSubmitted ? (
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-green-600 mb-1"><CheckCircle size={16} /><span className="text-sm font-medium">Đã nộp</span></div>
                      {a.attempt && <p className="text-lg font-bold text-gray-900">{a.attempt.totalScore}/{a.attempt.totalQuestions}</p>}
                      <Link href={`/classrooms/${classroomId}/assignments/${a.id}/result`} className="text-xs text-blue-600 hover:underline">Xem kết quả</Link>
                    </div>
                  ) : a.isExpired ? (
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded-lg font-medium">Quá hạn</span>
                  ) : (
                    <Link href={`/classrooms/${classroomId}/assignments/${a.id}`}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium inline-block">
                      Làm bài
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
