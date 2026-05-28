'use client';

import { useState, useEffect } from 'react';
import { X, TrendingUp, AlertCircle } from 'lucide-react';

interface Assignment {
  id: string;
  examSet: { id: string; title: string; _count: { questions: number } };
}

interface QuestionStat {
  index: number; id: string; content: string;
  totalAnswers: number; correctCount: number; wrongCount: number;
  correctPct: number; wrongPct: number;
}

interface AssignmentAnalytics {
  assignmentId: string; examSetTitle: string;
  totalMembers: number; totalSubmitted: number; totalAttempts: number;
  avgScore: number | null;
  questions: QuestionStat[];
}

function DonutChart({ correctPct, wrongPct, size = 44 }: { correctPct: number; wrongPct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const cx = size / 2, cy = size / 2;
  const total = correctPct + wrongPct;
  const hasData = total > 0;
  const correctDash = hasData ? (correctPct / 100) * circ : 0;
  const wrongDash = hasData ? (wrongPct / 100) * circ : 0;
  const rotateOffset = -90;
  const wrongOffset = (correctPct / 100) * 360;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={hasData ? 'transparent' : '#e5e7eb'} strokeWidth={7} />
      {hasData ? (
        <>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#10b981" strokeWidth={7} strokeDasharray={`${correctDash} ${circ}`} strokeLinecap="butt" transform={`rotate(${rotateOffset} ${cx} ${cy})`} />
          {wrongPct > 0 && <circle cx={cx} cy={cy} r={r} fill="none" stroke="#ef4444" strokeWidth={7} strokeDasharray={`${wrongDash} ${circ}`} strokeLinecap="butt" transform={`rotate(${rotateOffset + wrongOffset} ${cx} ${cy})`} />}
        </>
      ) : <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={7} />}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={size < 44 ? 9 : 10} fontWeight="600"
        fill={hasData ? (wrongPct > 50 ? '#ef4444' : '#10b981') : '#9ca3af'}>{hasData ? `${wrongPct}%` : '—'}</text>
    </svg>
  );
}

export function AssignmentAnalyticsModal({ classroomId, assignment, onClose }: {
  classroomId: string; assignment: Assignment; onClose: () => void;
}) {
  const [data, setData] = useState<AssignmentAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/teacher/classrooms/${classroomId}/assignments/${assignment.id}/analytics`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [classroomId, assignment.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-base">{assignment.examSet.title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">Phân tích kết quả bài giao</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition"><X size={16} className="text-gray-400" /></button>
        </div>

        {loading ? (
          <div className="p-8 space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-lg" />)}</div>
        ) : !data ? (
          <div className="p-12 text-center text-gray-400 text-sm">Không thể tải dữ liệu</div>
        ) : (
          <div className="overflow-y-auto flex-1">
            {/* Summary cards */}
            <div className="grid grid-cols-4 gap-3 p-5 border-b border-gray-100">
              <div className="bg-blue-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-blue-700">{data.totalSubmitted}</p><p className="text-[11px] text-blue-500 mt-0.5">Đã làm</p></div>
              <div className="bg-gray-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-gray-700">{data.totalMembers}</p><p className="text-[11px] text-gray-500 mt-0.5">Thành viên</p></div>
              <div className="bg-purple-50 rounded-xl p-3 text-center"><p className="text-2xl font-bold text-purple-700">{data.totalAttempts}</p><p className="text-[11px] text-purple-500 mt-0.5">Tổng lượt nộp</p></div>
              <div className={`rounded-xl p-3 text-center ${data.avgScore !== null ? (data.avgScore >= 7 ? 'bg-emerald-50' : data.avgScore >= 5 ? 'bg-amber-50' : 'bg-red-50') : 'bg-gray-50'}`}>
                <p className={`text-2xl font-bold ${data.avgScore !== null ? (data.avgScore >= 7 ? 'text-emerald-700' : data.avgScore >= 5 ? 'text-amber-700' : 'text-red-600') : 'text-gray-400'}`}>
                  {data.avgScore !== null ? data.avgScore.toFixed(1) : '—'}
                </p>
                <p className={`text-[11px] mt-0.5 ${data.avgScore !== null ? (data.avgScore >= 7 ? 'text-emerald-500' : data.avgScore >= 5 ? 'text-amber-500' : 'text-red-400') : 'text-gray-400'}`}>Điểm TB</p>
              </div>
            </div>

            {/* Completion bar */}
            {(() => {
              const completionPct = data.totalMembers > 0 ? Math.round((data.totalSubmitted / data.totalMembers) * 100) : 0;
              return (
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5"><TrendingUp size={12} />Tỉ lệ hoàn thành</span>
                    <span className="text-xs font-bold text-gray-700">{completionPct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{data.totalSubmitted}/{data.totalMembers} học sinh đã nộp bài</p>
                </div>
              );
            })()}

            {/* Per-question stats */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={13} className="text-gray-400" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tỉ lệ sai theo câu</p>
                <div className="flex items-center gap-3 ml-auto text-[11px] text-gray-400">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />Đúng</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />Sai</span>
                </div>
              </div>
              {data.questions.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">Chưa có bài nộp</p>
              ) : (
                <div className="space-y-2.5">
                  {data.questions.map(q => (
                    <div key={q.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                      <DonutChart correctPct={q.correctPct} wrongPct={q.wrongPct} size={44} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">Câu {q.index}</span>
                          {q.totalAnswers === 0 ? <span className="text-[11px] text-gray-400">Chưa có dữ liệu</span>
                            : <span className={`text-[11px] font-semibold ${q.wrongPct > 60 ? 'text-red-500' : q.wrongPct > 30 ? 'text-amber-500' : 'text-emerald-600'}`}>
                                {q.wrongPct > 60 ? 'Câu khó' : q.wrongPct > 30 ? 'Trung bình' : 'Dễ'}
                              </span>}
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-2">{q.content}</p>
                      </div>
                      <div className="text-right flex-shrink-0 min-w-[80px]">
                        {q.totalAnswers > 0 ? (
                          <>
                            <p className="text-xs text-gray-400">{q.correctCount}<span className="text-gray-300">/</span>{q.totalAnswers}</p>
                            <div className="flex h-1.5 rounded-full overflow-hidden mt-1 w-20">
                              <div className="bg-emerald-400 h-full" style={{ width: `${q.correctPct}%` }} />
                              <div className="bg-red-400 h-full" style={{ width: `${q.wrongPct}%` }} />
                            </div>
                          </>
                        ) : <p className="text-xs text-gray-300">—</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
