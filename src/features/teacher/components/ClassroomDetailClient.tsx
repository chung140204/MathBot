'use client';

import { useState, useEffect, useCallback } from 'react';
import { Copy, Check, RefreshCw, Users, FileText, BarChart3, Info } from 'lucide-react';
import { AssignmentAnalyticsModal } from './classroom/AssignmentAnalyticsModal';
import { ClassroomAssignmentsTab } from './classroom/ClassroomAssignmentsTab';

interface Member { user: { id: string; name: string; email: string }; joinedAt: string; }
interface Assignment {
  id: string; assignedAt: string; dueAt: string | null; maxAttempts: number | null;
  isActive: boolean;
  examSet: { id: string; title: string; _count: { questions: number } };
  _count: { examAttempts: number };
}
interface Classroom { id: string; name: string; code: string; description: string | null; createdAt: string; members: Member[]; assignments: Assignment[]; _count: { members: number }; }
interface Result { id: string; totalScore: number; totalQuestions: number; timeTakenSecs: number; submittedAt: string; user: { name: string; email: string }; classAssignment: { examSet: { title: string } } | null; }
interface ExamSetOption { id: string; title: string; _count: { questions: number }; }

export default function ClassroomDetailClient({ classroomId }: { classroomId: string }) {
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [examSets, setExamSets] = useState<ExamSetOption[]>([]);
  const [tab, setTab] = useState<'info' | 'members' | 'assignments' | 'results'>('info');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [analyticsAssignment, setAnalyticsAssignment] = useState<Assignment | null>(null);
  const [resultsFetched, setResultsFetched] = useState(false);
  const [examSetsFetched, setExamSetsFetched] = useState(false);

  const fetchClassroom = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/teacher/classrooms/${classroomId}`);
      if (res.ok) setClassroom(await res.json());
    } catch (err) { console.warn('[ClassroomDetail] fetch failed:', err); }
    finally { setLoading(false); }
  }, [classroomId]);

  useEffect(() => { fetchClassroom(); }, [fetchClassroom]);

  useEffect(() => {
    if (tab === 'results' && !resultsFetched) {
      fetch(`/api/v1/teacher/classrooms/${classroomId}/results`).then(r => r.ok ? r.json() : []).then(d => { setResults(d); setResultsFetched(true); }).catch(() => {});
    }
    if (tab === 'assignments' && !examSetsFetched) {
      fetch('/api/v1/teacher/exam-sets').then(r => r.ok ? r.json() : []).then(d => { setExamSets(d); setExamSetsFetched(true); }).catch(() => {});
    }
  }, [tab, classroomId, resultsFetched, examSetsFetched]);

  const copyCode = () => {
    if (classroom) { navigator.clipboard.writeText(classroom.code); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const regenerateCode = async () => {
    const res = await fetch(`/api/v1/teacher/classrooms/${classroomId}/regenerate-code`, { method: 'POST' });
    if (res.ok) fetchClassroom();
  };

  const handleAssign = async (examSetId: string, dueAt: string, maxAttempts: string) => {
    setAssigning(true); setAssignError('');
    try {
      const body: Record<string, unknown> = { examSetId, dueAt: dueAt ? new Date(dueAt).toISOString() : undefined, maxAttempts: maxAttempts ? parseInt(maxAttempts) : undefined };
      const res = await fetch(`/api/v1/teacher/classrooms/${classroomId}/assign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!res.ok) { const err = await res.json(); setAssignError(err.error || 'Giao bài thất bại'); return; }
      fetchClassroom();
    } catch { setAssignError('Đã xảy ra lỗi'); } finally { setAssigning(false); }
  };

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!window.confirm('Xóa bài giao này?')) return;
    await fetch(`/api/v1/teacher/classrooms/${classroomId}/assign/${assignmentId}`, { method: 'DELETE' });
    fetchClassroom();
  };

  const handleEditAssignment = async (assignmentId: string, dueAt: string, maxAttempts: string) => {
    const body: Record<string, unknown> = { dueAt: dueAt ? new Date(dueAt).toISOString() : null, maxAttempts: maxAttempts ? parseInt(maxAttempts) : null };
    const res = await fetch(`/api/v1/teacher/classrooms/${classroomId}/assign/${assignmentId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (res.ok) fetchClassroom();
  };

  if (loading) return <div className="p-8 space-y-4"><div className="h-8 w-48 bg-gray-100 animate-pulse rounded" /><div className="h-4 w-32 bg-gray-100 animate-pulse rounded" /></div>;
  if (!classroom) return <div className="p-8 text-gray-500">Không tìm thấy lớp học</div>;

  const tabs = [
    { key: 'info' as const, label: 'Thông tin', icon: Info },
    { key: 'members' as const, label: `Thành viên (${classroom._count.members})`, icon: Users },
    { key: 'assignments' as const, label: `Bài giao (${classroom.assignments.length})`, icon: FileText },
    { key: 'results' as const, label: 'Kết quả', icon: BarChart3 },
  ];

  const assignedIds = new Set(classroom.assignments.map(a => a.examSet.id));
  const availableExamSets = examSets.filter(es => !assignedIds.has(es.id));

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{classroom.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-sm font-mono font-bold rounded-lg border border-blue-100">{classroom.code}</span>
            <button onClick={copyCode} className="p-1.5 hover:bg-gray-100 rounded-lg transition" title="Copy mã lớp">
              {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} className="text-gray-400" />}
            </button>
            <span className="text-xs text-gray-400">Chia sẻ mã này cho học sinh để tham gia lớp</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Info tab */}
      {tab === 'info' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-5 max-w-lg">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Mô tả</p>
            <p className="text-gray-800 text-sm">{classroom.description || '(chưa có)'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Ngày tạo</p>
            <p className="text-gray-800 text-sm">{new Date(classroom.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>
          <div className="pt-2 border-t border-gray-100">
            <button onClick={regenerateCode} className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 text-sm font-medium transition">
              <RefreshCw size={13} /> Tạo lại mã lớp
            </button>
            <p className="text-xs text-gray-400 mt-1.5">Mã cũ sẽ không còn hiệu lực</p>
          </div>
        </div>
      )}

      {/* Members tab */}
      {tab === 'members' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {classroom.members.length === 0 ? (
            <div className="p-12 text-center">
              <Users size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500 text-sm">Chưa có thành viên</p>
              <p className="text-xs text-gray-400 mt-1">Chia sẻ mã <span className="font-mono font-bold text-blue-600">{classroom.code}</span> để học sinh tham gia</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tên</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                </tr>
              </thead>
              <tbody>
                {classroom.members.map((m, i) => (
                  <tr key={m.user.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{m.user.name}</td>
                    <td className="px-4 py-3 text-gray-500">{m.user.email}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{new Date(m.joinedAt).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Assignments tab — extracted component */}
      {tab === 'assignments' && (
        <ClassroomAssignmentsTab
          classroomId={classroomId}
          assignments={classroom.assignments}
          availableExamSets={availableExamSets}
          onAssign={handleAssign}
          onRemove={handleRemoveAssignment}
          onEdit={handleEditAssignment}
          onAnalytics={setAnalyticsAssignment}
          assignError={assignError}
          assigning={assigning}
        />
      )}

      {/* Results tab */}
      {tab === 'results' && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {results.length === 0 ? (
            <div className="p-12 text-center">
              <BarChart3 size={32} className="mx-auto mb-2 text-gray-300" />
              <p className="text-gray-500 text-sm">Chưa có kết quả nào</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Học sinh</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Bộ đề</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Điểm</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời gian</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày nộp</th>
                </tr>
              </thead>
              <tbody>
                {results.map(r => {
                  const pct = Math.round((r.totalScore / r.totalQuestions) * 100);
                  return (
                    <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3"><p className="font-medium text-gray-900">{r.user.name}</p><p className="text-xs text-gray-400">{r.user.email}</p></td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{r.classAssignment?.examSet.title || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold text-sm ${pct >= 70 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{r.totalScore}/{r.totalQuestions}</span>
                        <span className="text-xs text-gray-400 ml-1">({pct}%)</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{Math.floor(r.timeTakenSecs / 60)}p {r.timeTakenSecs % 60}s</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{new Date(r.submittedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Analytics modal */}
      {analyticsAssignment && (
        <AssignmentAnalyticsModal classroomId={classroomId} assignment={analyticsAssignment} onClose={() => setAnalyticsAssignment(null)} />
      )}
    </div>
  );
}
