'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Zap, Target, Clock, TrendingUp } from 'lucide-react';

interface DiffData { name: string; total: number; correct: number; percentage: number; }
interface TopicData { name: string; total: number; correct: number; percentage: number; }
interface Suggestion { label: string; topic: string; desc: string; bg: string; border: string; text: string; }
interface TimeData { name: string; time: number; }

interface ExamResultDetailsGridProps {
  diffData: DiffData[];
  topicData: TopicData[];
  timeData: TimeData[];
  suggestions: Suggestion[];
}

export function ExamResultDetailsGrid({ diffData, topicData, timeData, suggestions }: ExamResultDetailsGridProps) {
  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Difficulty Breakdown */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" /> Kết quả theo độ khó
        </h3>
        <div className="space-y-6">
          {diffData.map(d => (
            <div key={d.name} className="flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-bold uppercase text-slate-400">
                <span>{d.name}</span><span className="text-slate-900">{d.correct}/{d.total}</span>
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${d.name === 'Nhận biết' ? 'bg-emerald-500' : d.name === 'Thông hiểu' ? 'bg-sky-500' : d.name === 'Vận dụng' ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${d.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
          <Target className="w-4 h-4 text-emerald-500" /> Kết quả theo chủ đề
        </h3>
        <div className="space-y-6">
          {topicData.map(t => (
            <div key={t.name} className="flex items-center gap-4">
              <div className={`w-2 h-2 rounded-full ${t.percentage > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-sm font-bold text-slate-700 flex-1">{t.name}</span>
              <span className="text-[13px] font-black text-slate-900">{t.correct}/{t.total}</span>
              <span className={`text-[11px] font-bold ${t.percentage > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{t.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Time per Question */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" /> Thời gian làm từng câu
        </h3>
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={timeData} layout="vertical" margin={{ left: -10, top: 0, right: 20, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} width={50} />
              <Tooltip cursor={{ fill: '#f8fafc' }} content={({ active, payload }) => active && payload?.length ? <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold">{payload[0].value}s</div> : null} />
              <Bar dataKey="time" radius={[0, 4, 4, 0]} barSize={8}>
                {timeData.map((_, index) => <Cell key={`cell-${index}`} fill={index === 3 ? '#f97316' : '#0ea5e9'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
        <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" /> Gợi ý ôn tập
        </h3>
        <div className="space-y-4">
          {suggestions.map((s, i) => (
            <div key={i} className={`p-4 ${s.bg} rounded-2xl border ${s.border} flex flex-col gap-1`}>
              <span className={`text-[10px] font-black uppercase ${s.text} tracking-widest`}>{s.label}</span>
              <span className="text-sm font-bold text-slate-900">{s.topic} — {s.desc.split('.')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
