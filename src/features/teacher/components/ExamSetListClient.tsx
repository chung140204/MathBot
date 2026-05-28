'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Trash2, Clock } from 'lucide-react';

interface ExamSet { id: string; title: string; description: string | null; timeLimit: number | null; createdAt: string; _count: { questions: number; assignments: number }; }

export default function ExamSetListClient() {
  const [examSets, setExamSets] = useState<ExamSet[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExamSets = async () => {
    try {
      const res = await fetch('/api/v1/teacher/exam-sets');
      if (res.ok) setExamSets(await res.json());
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchExamSets(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa bộ đề này?')) return;
    const res = await fetch(`/api/v1/teacher/exam-sets/${id}`, { method: 'DELETE' });
    if (res.ok) setExamSets(prev => prev.filter(es => es.id !== id));
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bộ đề thi</h1>
        <Link href="/teacher/exam-sets/new" className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
          <Plus size={16} /> Tạo bộ đề mới
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{[1, 2, 3].map(i => <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : examSets.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FileText size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">Chưa có bộ đề nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {examSets.map(es => (
            <div key={es.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition group">
              <div className="flex items-start justify-between mb-3">
                <Link href={`/teacher/exam-sets/${es.id}`} className="font-semibold text-gray-900 group-hover:text-purple-600 transition">{es.title}</Link>
                <button onClick={() => handleDelete(es.id)} className="text-gray-300 hover:text-red-500 transition p-1" title="Xóa"><Trash2 size={14} /></button>
              </div>
              {es.description && <p className="text-xs text-gray-500 mb-3 truncate">{es.description}</p>}
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><FileText size={12} />{es._count.questions} câu</span>
                {es.timeLimit && <span className="flex items-center gap-1"><Clock size={12} />{Math.floor(es.timeLimit / 60)} phút</span>}
                <span>{es._count.assignments} lớp</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
