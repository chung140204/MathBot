'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, LogIn, CheckCircle, AlertCircle } from 'lucide-react';

interface MyClass { id: string; name: string; code: string; teacherName: string; assignmentCount: number; memberCount: number; }

export default function StudentClassroomClient() {
  const [classes, setClasses] = useState<MyClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState('');
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetch('/api/v1/classroom/my-classes').then(r => r.ok ? r.json() : []).then(setClasses).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setJoining(true); setMessage(null);
    try {
      const res = await fetch('/api/v1/classroom/join', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: `Đã tham gia lớp "${data.name}"!` });
        setCode('');
        // Refresh class list
        const updated = await fetch('/api/v1/classroom/my-classes');
        if (updated.ok) setClasses(await updated.json());
      } else {
        setMessage({ type: 'error', text: data.error || 'Không thể tham gia lớp' });
      }
    } catch { setMessage({ type: 'error', text: 'Lỗi kết nối' }); } finally { setJoining(false); }
  };

  return (
    <div className="p-6 md:p-8 w-full max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lớp học</h1>

      {/* Join section */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Tham gia lớp học</h2>
        <form onSubmit={handleJoin} className="flex gap-3">
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Nhập mã lớp (VD: MATH-A3K9)" className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-mono uppercase" maxLength={10} />
          <button type="submit" disabled={joining || !code.trim()} className="flex items-center gap-2 px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50">
            <LogIn size={16} /> {joining ? 'Đang tham gia...' : 'Tham gia'}
          </button>
        </form>
        {message && (
          <div className={`flex items-center gap-2 mt-3 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {message.text}
          </div>
        )}
      </div>

      {/* My classes */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Lớp học của tôi</h2>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1, 2].map(i => <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />)}</div>
      ) : classes.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-50" />
          <p>Chưa tham gia lớp nào</p>
          <p className="text-sm mt-1">Nhập mã lớp do giáo viên cung cấp để tham gia</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map(c => (
            <Link key={c.id} href={`/classrooms/${c.id}`} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition group">
              <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition mb-1">{c.name}</h3>
              <p className="text-xs text-gray-500 mb-3">GV: {c.teacherName}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>{c.memberCount} thành viên</span>
                <span>{c.assignmentCount} bài tập</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
