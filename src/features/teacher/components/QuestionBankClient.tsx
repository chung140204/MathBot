'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import MathRenderer from '@/shared/components/MathRenderer';

const TOPICS: Record<string, string> = {
  DERIVATIVES: 'Đạo hàm', INTEGRALS: 'Nguyên hàm & Tích phân', FUNCTIONS: 'Khảo sát hàm số',
  LIMITS: 'Giới hạn', COMPLEX_NUMBERS: 'Số phức', PROBABILITY: 'Xác suất',
  SEQUENCES: 'Dãy số', EXPONENTIAL_LOG: 'Hàm số mũ - Logarit', VOLUME: 'Thể tích',
  ANALYTIC_GEOMETRY: 'Hình học giải tích', SOLID_GEOMETRY: 'Hình học không gian',
};
const DIFFICULTIES: Record<string, string> = { RECOGNITION: 'Nhận biết', COMPREHENSION: 'Thông hiểu', APPLICATION: 'Vận dụng', ADVANCED: 'Vận dụng cao' };
const FORMATS: Record<string, string> = { MULTIPLE_CHOICE: 'Trắc nghiệm', TRUE_FALSE: 'Đúng/Sai', SHORT_ANSWER: 'Trả lời ngắn' };

interface Question { id: string; content: string; topic: string; difficulty: string; format: string; createdAt: string; }

export default function QuestionBankClient() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [format, setFormat] = useState('');
  const [source, setSource] = useState<'all' | 'mine' | 'system'>('all');
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20', source });
    if (topic) params.set('topic', topic);
    if (difficulty) params.set('difficulty', difficulty);
    if (format) params.set('format', format);
    try {
      const res = await fetch(`/api/v1/teacher/questions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch { /* ignore */ } finally { setLoading(false); }
  }, [page, topic, difficulty, format, source]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ngân hàng câu hỏi</h1>
          <p className="text-sm text-gray-500 mt-1">{total} câu hỏi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={topic} onChange={e => { setTopic(e.target.value); setPage(1); }} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="">Tất cả chủ đề</option>
          {Object.entries(TOPICS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={difficulty} onChange={e => { setDifficulty(e.target.value); setPage(1); }} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="">Tất cả mức độ</option>
          {Object.entries(DIFFICULTIES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={format} onChange={e => { setFormat(e.target.value); setPage(1); }} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="">Tất cả dạng</option>
          {Object.entries(FORMATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={source} onChange={e => { setSource(e.target.value as 'all' | 'mine' | 'system'); setPage(1); }} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white">
          <option value="all">Tất cả nguồn</option>
          <option value="mine">Câu hỏi của tôi</option>
          <option value="system">Ngân hàng hệ thống</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Đang tải...</div>
        ) : questions.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen size={32} className="mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">Chưa có câu hỏi nào</p>
            <a href="/teacher/upload" className="text-sm text-blue-600 hover:underline mt-2 inline-block">Upload đề thi để bắt đầu</a>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">#</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Nội dung</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Chủ đề</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Mức độ</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Dạng</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q, i) => (
                <tr key={q.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{(page - 1) * 20 + i + 1}</td>
                  <td className="px-4 py-3 text-gray-800 max-w-md truncate"><MathRenderer content={q.content.length > 100 ? q.content.slice(0, 100) + '...' : q.content} /></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700">{TOPICS[q.topic] || q.topic}</span></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-700">{DIFFICULTIES[q.difficulty] || q.difficulty}</span></td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-50 text-purple-700">{FORMATS[q.format] || q.format}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"><ChevronLeft size={16} /></button>
          <span className="text-sm text-gray-600">Trang {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"><ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  );
}
