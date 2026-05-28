'use client';

import { useState } from 'react';
import { FileText, Users, BookOpen, CalendarClock, RotateCcw, Trash2, Clock, ChevronRight, Pencil, X, Save, BarChart3 } from 'lucide-react';

interface Assignment {
  id: string; assignedAt: string; dueAt: string | null; maxAttempts: number | null;
  isActive: boolean;
  examSet: { id: string; title: string; _count: { questions: number } };
  _count: { examAttempts: number };
}
interface ExamSetOption { id: string; title: string; _count: { questions: number }; }

function StatusBadge({ dueAt }: { dueAt: string | null }) {
  if (!dueAt) return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700">Không hạn</span>;
  const expired = new Date(dueAt) < new Date();
  return expired
    ? <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-red-600">Đã hết hạn</span>
    : <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-50 text-blue-700">Đang mở</span>;
}

interface Props {
  classroomId: string;
  assignments: Assignment[];
  availableExamSets: ExamSetOption[];
  onAssign: (examSetId: string, dueAt: string, maxAttempts: string) => Promise<void>;
  onRemove: (assignmentId: string) => void;
  onEdit: (assignmentId: string, dueAt: string, maxAttempts: string) => Promise<void>;
  onAnalytics: (assignment: Assignment) => void;
  assignError: string;
  assigning: boolean;
}

export function ClassroomAssignmentsTab({
  classroomId, assignments, availableExamSets,
  onAssign, onRemove, onEdit, onAnalytics, assignError, assigning,
}: Props) {
  const [assignExamSetId, setAssignExamSetId] = useState('');
  const [assignDueAt, setAssignDueAt] = useState('');
  const [assignMaxAttempts, setAssignMaxAttempts] = useState('1');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDueAt, setEditDueAt] = useState('');
  const [editMaxAttempts, setEditMaxAttempts] = useState('');
  const [saving, setSaving] = useState(false);

  const handleAssign = async () => {
    await onAssign(assignExamSetId, assignDueAt, assignMaxAttempts);
    setAssignExamSetId(''); setAssignDueAt(''); setAssignMaxAttempts('1');
  };

  const openEdit = (a: Assignment) => {
    setEditingId(a.id);
    setEditDueAt(a.dueAt ? new Date(a.dueAt).toISOString().slice(0, 16) : '');
    setEditMaxAttempts(a.maxAttempts ? String(a.maxAttempts) : '');
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    await onEdit(id, editDueAt, editMaxAttempts);
    setEditingId(null);
    setSaving(false);
  };

  return (
    <div className="space-y-5">
      {/* Assign form */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800">Giao bài mới</h3>
          <div className="flex items-center gap-3 text-xs">
            <a href={`/teacher/exam-sets/new?classroomId=${classroomId}`} className="text-blue-600 hover:underline font-medium">+ Tạo bộ đề mới</a>
            <span className="text-gray-200">|</span>
            <a href="/teacher/upload" className="text-blue-600 hover:underline font-medium">+ Upload đề</a>
          </div>
        </div>
        {availableExamSets.length === 0 ? (
          <div className="py-4 text-center">
            <p className="text-sm text-gray-400">Tất cả bộ đề đã được giao.</p>
            <a href="/teacher/exam-sets/new" className="text-sm text-blue-600 hover:underline mt-1 inline-block">Tạo bộ đề mới →</a>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5"><BookOpen size={12} className="inline mr-1" />Bộ đề *</label>
              <select value={assignExamSetId} onChange={e => setAssignExamSetId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Chọn bộ đề để giao...</option>
                {availableExamSets.map(es => <option key={es.id} value={es.id}>{es.title} ({es._count.questions} câu)</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5"><CalendarClock size={12} className="inline mr-1" />Deadline</label>
                <input type="datetime-local" value={assignDueAt} onChange={e => setAssignDueAt(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <p className="text-[11px] text-gray-400 mt-1">Để trống = không giới hạn</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5"><RotateCcw size={12} className="inline mr-1" />Số lượt làm</label>
                <select value={assignMaxAttempts} onChange={e => setAssignMaxAttempts(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Không giới hạn</option>
                  {[1, 2, 3, 5, 10].map(n => <option key={n} value={String(n)}>{n} lượt</option>)}
                </select>
                <p className="text-[11px] text-gray-400 mt-1">Để trống = không giới hạn</p>
              </div>
            </div>
            {assignError && <p className="text-sm text-red-500">{assignError}</p>}
            <div className="flex justify-end">
              <button onClick={handleAssign} disabled={!assignExamSetId || assigning}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 transition">
                {assigning ? 'Đang giao...' : <><ChevronRight size={15} /> Giao bài</>}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Assignment list */}
      {assignments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">Đã giao ({assignments.length})</h3>
          {assignments.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0"><FileText size={18} className="text-blue-600" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{a.examSet.title}</h4>
                    <StatusBadge dueAt={a.dueAt} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><BookOpen size={11} />{a.examSet._count.questions} câu</span>
                    <span className="flex items-center gap-1"><Users size={11} />{a._count.examAttempts} bài nộp</span>
                    {a.dueAt && <span className="flex items-center gap-1"><CalendarClock size={11} />Hạn: {new Date(a.dueAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
                    <span className="flex items-center gap-1">{a.maxAttempts ? <><RotateCcw size={11} />{a.maxAttempts} lượt</> : <><Clock size={11} />Không giới hạn lượt</>}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => onAnalytics(a)} title="Xem kết quả chi tiết" className="p-2 text-gray-300 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition"><BarChart3 size={15} /></button>
                  {editingId === a.id
                    ? <button onClick={() => setEditingId(null)} title="Hủy" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"><X size={15} /></button>
                    : <button onClick={() => openEdit(a)} title="Sửa" className="p-2 text-gray-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition"><Pencil size={15} /></button>}
                  <button onClick={() => onRemove(a.id)} title="Xóa bài giao" className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"><Trash2 size={15} /></button>
                </div>
              </div>
              {editingId === a.id && (
                <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                  <p className="text-xs font-semibold text-gray-500 mb-3">Chỉnh sửa cài đặt bài giao</p>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5"><CalendarClock size={11} className="inline mr-1" />Deadline</label>
                      <input type="datetime-local" value={editDueAt} onChange={e => setEditDueAt(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5"><RotateCcw size={11} className="inline mr-1" />Số lượt làm</label>
                      <select value={editMaxAttempts} onChange={e => setEditMaxAttempts(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="">Không giới hạn</option>
                        {[1, 2, 3, 5, 10].map(n => <option key={n} value={String(n)}>{n} lượt</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => saveEdit(a.id)} disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 transition">
                      <Save size={13} />{saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
