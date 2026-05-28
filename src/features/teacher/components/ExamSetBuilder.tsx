'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Save, CalendarClock, Users, List, Wand2, Loader2 } from 'lucide-react';
import MathRenderer from '@/shared/components/MathRenderer';
import { pdfToImages } from '@/features/ocr/lib/pdf-to-images';
import { AutoGeneratePanel } from './exam-builder/AutoGeneratePanel';
import { SelectedQuestionsPanel } from './exam-builder/SelectedQuestionsPanel';

interface ClassroomOption { id: string; name: string; code: string; memberCount: number; }

const TOPICS: Record<string, string> = {
  DERIVATIVES: 'Đạo hàm', INTEGRALS: 'Tích phân', FUNCTIONS: 'Hàm số', LIMITS: 'Giới hạn',
  COMPLEX_NUMBERS: 'Số phức', PROBABILITY: 'Xác suất', SEQUENCES: 'Dãy số',
  EXPONENTIAL_LOG: 'Mũ - Logarit', VOLUME: 'Thể tích', ANALYTIC_GEOMETRY: 'HH giải tích', SOLID_GEOMETRY: 'HH không gian',
};

interface Question { id: string; content: string; topic: string; difficulty: string; format: string; }
interface GenStats { byTopic: Record<string, number>; byDifficulty: Record<string, number>; byFormat: Record<string, number>; total: number; poolSize: number; }

export default function ExamSetBuilder({ examSetId }: { examSetId?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedClassroomId = searchParams.get('classroomId') ?? '';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [selected, setSelected] = useState<Question[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [available, setAvailable] = useState<Question[]>([]);
  const [topic, setTopic] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [assignToClass, setAssignToClass] = useState(!!preselectedClassroomId);
  const [classrooms, setClassrooms] = useState<ClassroomOption[]>([]);
  const [selectedClassId, setSelectedClassId] = useState(preselectedClassroomId);
  const [deadline, setDeadline] = useState('');
  const [buildMode, setBuildMode] = useState<'manual' | 'auto'>('manual');

  const [genMode, setGenMode] = useState<'thpt' | 'custom'>('thpt');
  const [genSource, setGenSource] = useState<'all' | 'mine' | 'system'>('all');
  const [genTopics, setGenTopics] = useState<string[]>([]);
  const [genTotal, setGenTotal] = useState(30);
  const [genWeights, setGenWeights] = useState({ RECOGNITION: 40, COMPREHENSION: 30, APPLICATION: 20, ADVANCED: 10 });
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [genStats, setGenStats] = useState<GenStats | null>(null);
  const [uploading, setUploading] = useState(false);
  const uploadRef = React.useRef<HTMLInputElement>(null);

  const fetchQuestions = useCallback(async () => {
    const params = new URLSearchParams({ page: String(page), limit: '10', source: 'all' });
    if (topic) params.set('topic', topic);
    try {
      const res = await fetch(`/api/v1/teacher/questions?${params}`);
      if (res.ok) { const data = await res.json(); setAvailable(data.questions || []); setTotalPages(data.totalPages || 1); }
    } catch { /* ignore */ }
  }, [page, topic]);

  useEffect(() => { if (buildMode === 'manual') fetchQuestions(); }, [fetchQuestions, buildMode]);

  useEffect(() => {
    if (!assignToClass || classrooms.length > 0) return;
    fetch('/api/v1/teacher/classrooms').then(r => r.ok ? r.json() : []).then((data: ClassroomOption[]) => {
      setClassrooms(Array.isArray(data) ? data.map(c => ({ id: c.id, name: c.name, code: c.code, memberCount: (c as unknown as { _count?: { members: number } })._count?.members ?? 0 })) : []);
    }).catch(() => {});
  }, [assignToClass, classrooms.length]);

  useEffect(() => {
    if (!examSetId) { setLoading(false); return; }
    fetch(`/api/v1/teacher/exam-sets/${examSetId}`).then(r => r.ok ? r.json() : null).then(data => {
      if (data) {
        setTitle(data.title || '');
        setDescription(data.description || '');
        setTimeLimit(data.timeLimit ? String(Math.floor(data.timeLimit / 60)) : '');
        setSelected(data.questions?.map((esq: { question: Question }) => esq.question) || []);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [examSetId]);

  const addQuestion = (q: Question) => { if (!selected.find(s => s.id === q.id)) setSelected(prev => [...prev, q]); };
  const removeQuestion = (id: string) => setSelected(prev => prev.filter(q => q.id !== id));
  const moveUp = (idx: number) => { if (idx === 0) return; const arr = [...selected]; [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]]; setSelected(arr); };
  const moveDown = (idx: number) => { if (idx === selected.length - 1) return; const arr = [...selected]; [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]; setSelected(arr); };
  const toggleGenTopic = (t: string) => setGenTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const handleGenerate = async () => {
    setGenerating(true); setGenError(''); setGenStats(null);
    try {
      const body: Record<string, unknown> = { mode: genMode, source: genSource };
      if (genTopics.length > 0) body.topics = genTopics;
      if (genMode === 'custom') {
        body.totalQuestions = genTotal;
        if (genTopics.length === 0) body.topics = Object.keys(TOPICS);
        body.difficultyWeights = { RECOGNITION: genWeights.RECOGNITION / 100, COMPREHENSION: genWeights.COMPREHENSION / 100, APPLICATION: genWeights.APPLICATION / 100, ADVANCED: genWeights.ADVANCED / 100 };
      }
      const res = await fetch('/api/v1/teacher/exam-sets/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { setGenError((await res.json()).error || 'Không đủ câu hỏi'); return; }
      const data = await res.json();
      setSelected(data.questions); setGenStats(data.stats);
      if (genMode === 'thpt' && !timeLimit) setTimeLimit('90');
    } catch { setGenError('Đã xảy ra lỗi'); } finally { setGenerating(false); }
  };

  const handleUploadImages = async (files: FileList) => {
    setUploading(true);
    try {
      const images: File[] = [];
      for (const f of Array.from(files)) {
        if (f.type === 'application/pdf') { images.push(...await pdfToImages(f)); } else images.push(f);
      }
      const fd = new FormData();
      images.forEach(img => fd.append('images', img));
      fd.append('mode', 'individual');
      const res = await fetch('/api/v1/admin/upload/ocr', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('OCR failed');
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No stream');
      const decoder = new TextDecoder();
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n'); buffer = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const payload = JSON.parse(line.slice(6));
              if (payload.event === 'question' && payload.data) {
                const q = payload.data;
                setSelected(prev => prev.find(s => s.content === q.content) ? prev : [...prev, { id: `ocr-${Date.now()}-${Math.random()}`, content: q.content, topic: q.topic, difficulty: q.difficulty, format: q.format }]);
              }
            } catch { /* skip */ }
          }
        }
      }
    } catch { /* ignore */ } finally { setUploading(false); }
  };

  const handleSave = async () => {
    if (!title.trim() || selected.length === 0) return;
    setSaving(true);
    const body = { title: title.trim(), description: description.trim() || undefined, timeLimit: timeLimit ? parseInt(timeLimit) * 60 : undefined, questionIds: selected.map(q => q.id) };
    try {
      const url = examSetId ? `/api/v1/teacher/exam-sets/${examSetId}` : '/api/v1/teacher/exam-sets';
      const res = await fetch(url, { method: examSetId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) return;
      if (assignToClass && selectedClassId) {
        const esData = await res.json();
        const esId = esData.id || examSetId;
        if (esId) {
          const assignBody: { examSetId: string; dueAt?: string } = { examSetId: esId };
          if (deadline) assignBody.dueAt = new Date(deadline).toISOString();
          await fetch(`/api/v1/teacher/classrooms/${selectedClassId}/assign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(assignBody) });
        }
      }
      router.push('/teacher/exam-sets');
    } catch { /* ignore */ } finally { setSaving(false); }
  };

  if (loading) return <div className="p-8"><div className="h-8 w-48 bg-gray-200 animate-pulse rounded" /></div>;

  const weightSum = genWeights.RECOGNITION + genWeights.COMPREHENSION + genWeights.APPLICATION + genWeights.ADVANCED;

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{examSetId ? 'Sửa bộ đề' : 'Tạo bộ đề mới'}</h1>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6 grid gap-4 md:grid-cols-3">
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Tên bộ đề *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="VD: Kiểm tra Chương 3" required /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
          <input value={description} onChange={e => setDescription(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Mô tả ngắn..." /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1">Thời gian (phút)</label>
          <input type="number" value={timeLimit} onChange={e => setTimeLimit(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Không giới hạn" min="1" /></div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={assignToClass} onChange={e => setAssignToClass(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-blue-600" />
            <span className="text-sm font-semibold text-gray-900">Giao bài cho lớp ngay sau khi lưu</span>
          </div>
        </label>
        {assignToClass && (
          <div className="grid gap-4 md:grid-cols-2 mt-4 pl-7">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"><Users size={14} className="inline mr-1" />Chọn lớp *</label>
              <select value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                <option value="">-- Chọn lớp --</option>
                {classrooms.map(c => <option key={c.id} value={c.id}>{c.name} ({c.code}) — {c.memberCount} HS</option>)}
              </select>
              {classrooms.length === 0 && <p className="text-xs text-gray-400 mt-1">Chưa có lớp nào. <a href="/teacher/classrooms" className="text-blue-600 hover:underline">Tạo lớp</a></p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1"><CalendarClock size={14} className="inline mr-1" />Deadline</label>
              <input type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              <p className="text-xs text-gray-400 mt-1">Để trống nếu không giới hạn thời gian nộp</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
        <button onClick={() => setBuildMode('manual')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition ${buildMode === 'manual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <List size={15} /> Chọn thủ công
        </button>
        <button onClick={() => setBuildMode('auto')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition ${buildMode === 'auto' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
          <Wand2 size={15} /> Tạo tự động
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {buildMode === 'manual' ? (
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Ngân hàng câu hỏi</h2>
            <select value={topic} onChange={e => { setTopic(e.target.value); setPage(1); }} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm mb-3">
              <option value="">Tất cả chủ đề</option>
              {Object.entries(TOPICS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {available.map(q => (
                <div key={q.id} className={`p-3 rounded-lg border text-sm ${selected.find(s => s.id === q.id) ? 'bg-green-50 border-green-200' : 'border-gray-100 hover:border-blue-200'}`}>
                  <p className="text-gray-800 truncate mb-1"><MathRenderer content={q.content.length > 80 ? q.content.slice(0, 80) + '...' : q.content} /></p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{TOPICS[q.topic] || q.topic}</span>
                    {!selected.find(s => s.id === q.id) && (
                      <button onClick={() => addQuestion(q)} className="text-blue-600 hover:text-blue-700"><Plus size={14} /></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-3">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 text-xs border rounded disabled:opacity-30">Trước</button>
                <span className="text-xs text-gray-500 py-1">{page}/{totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 text-xs border rounded disabled:opacity-30">Sau</button>
              </div>
            )}
          </div>
        ) : (
          <AutoGeneratePanel
            genMode={genMode} genSource={genSource} genTopics={genTopics} genTotal={genTotal}
            genWeights={genWeights} generating={generating} genError={genError} genStats={genStats}
            weightSum={weightSum} setGenMode={setGenMode} setGenSource={setGenSource}
            toggleGenTopic={toggleGenTopic} setGenTotal={setGenTotal} setGenWeights={setGenWeights}
            handleGenerate={handleGenerate}
          />
        )}

        <SelectedQuestionsPanel
          selected={selected} buildMode={buildMode} uploading={uploading}
          uploadRef={uploadRef} handleUploadImages={handleUploadImages}
          moveUp={moveUp} moveDown={moveDown} removeQuestion={removeQuestion}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button onClick={handleSave} disabled={saving || !title.trim() || selected.length === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium disabled:opacity-50">
          <Save size={16} /> {saving ? 'Đang lưu...' : 'Lưu bộ đề'}
        </button>
      </div>
    </div>
  );
}
