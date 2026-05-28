'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Plus, Copy, Check } from 'lucide-react';

interface Classroom { id: string; name: string; code: string; description: string | null; createdAt: string; _count: { members: number }; }

export default function ClassroomListClient() {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState('');

  const fetchClassrooms = async () => {
    try {
      const res = await fetch('/api/v1/teacher/classrooms');
      if (res.ok) setClassrooms(await res.json());
    } catch { /* ignore */ } finally { setLoading(false); }
  };

  useEffect(() => { fetchClassrooms(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/v1/teacher/classrooms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), description: description.trim() || undefined }),
      });
      if (res.ok) {
        setName(''); setDescription(''); setShowForm(false);
        fetchClassrooms();
      }
    } catch { /* ignore */ } finally { setCreating(false); }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(''), 2000);
  };

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lớp học</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus size={16} /> Tạo lớp mới
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên lớp *</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="VD: Toán 12A1" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả ngắn..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50">
              {creating ? 'Đang tạo...' : 'Tạo lớp'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm">Hủy</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : classrooms.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">Chưa có lớp học nào</p>
          <p className="text-sm mt-1">Nhấn &quot;Tạo lớp mới&quot; để bắt đầu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classrooms.map(c => (
            <Link key={c.id} href={`/teacher/classrooms/${c.id}`} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition group">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition">{c.name}</h3>
                <span className="text-xs text-gray-400">{c._count.members} HS</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-mono font-bold rounded">{c.code}</span>
                <button onClick={(e) => { e.preventDefault(); copyCode(c.code, c.id); }} className="p-1 hover:bg-gray-100 rounded" title="Copy mã lớp">
                  {copiedId === c.id ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-gray-400" />}
                </button>
              </div>
              {c.description && <p className="text-xs text-gray-500 truncate">{c.description}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
