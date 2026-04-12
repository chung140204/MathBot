'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import AdminSidebar from '@/components/AdminSidebar';
import { 
  FileSpreadsheet, 
  FileText, 
  Layers, 
  History, 
  Check, 
  Upload, 
  ArrowRight, 
  Download, 
  AlertCircle, 
  CheckCircle2,
  Info,
  PenLine,
  FileSearch,
  FileCheck,
  Loader2,
  AlertTriangle
} from 'lucide-react';

import ManualInputForm from '@/components/admin/ManualInputForm';

// --- Constants ---

import { TOPICS } from '@/lib/constants/topics';

const DIFFICULTIES = [
  { id: 'RECOGNITION', name: 'Nhận biết' },
  { id: 'COMPREHENSION', name: 'Thông hiểu' },
  { id: 'APPLICATION', name: 'Vận dụng' },
  { id: 'ADVANCED', name: 'Vận dụng cao' },
];

// --- Sub-components ---

interface BadgeProps {
  variant: 'green' | 'blue' | 'red' | 'amber' | 'purple' | 'gray';
  children: React.ReactNode;
  className?: string;
}

const Badge = ({ variant, children, className = '' }: BadgeProps) => {
  const styles: Record<BadgeProps['variant'], string> = {
    green: 'bg-[#d1fae5] text-[#065f46]',
    blue: 'bg-[#e0f2fe] text-[#075985]',
    red: 'bg-[#fee2e2] text-[#991b1b]',
    amber: 'bg-[#fef3c7] text-[#92400e]',
    purple: 'bg-[#ede9fe] text-[#4c1d95]',
    gray: 'bg-[#f1f5f9] text-[#64748b]',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface SuccessStats {
  total: number;
  success: number;
  warning?: number;
}

const SuccessHero = ({ stats, onReset }: { stats: SuccessStats, onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
    <div className="w-20 h-20 rounded-full bg-[#d1fae5] flex items-center justify-center text-[#059669] mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
      <CheckCircle2 size={40} />
    </div>
    <h2 className="text-[#0f172a] text-[24px] font-bold mb-2">Upload Thành Công!</h2>
    <p className="text-[#64748b] text-[14px] max-w-md mb-8">
      Dữ liệu đã được xử lý và cập nhật vào hệ thống. Bạn có thể kiểm tra kết quả chi tiết bên dưới.
    </p>
    
    <div className="grid grid-cols-3 gap-8 w-full max-w-2xl mb-12">
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0]">
        <p className="text-[#94a3b8] text-[11px] uppercase font-bold tracking-widest mb-1">Tổng cộng</p>
        <p className="text-[#0f172a] text-[32px] font-black">{stats.total}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-[#059669]/20 shadow-[0_4px_12px_rgba(5,150,105,0.05)]">
        <p className="text-[#059669] text-[11px] uppercase font-bold tracking-widest mb-1">Thành công</p>
        <p className="text-[#059669] text-[32px] font-black">{stats.success}</p>
      </div>
      <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0]">
        <p className="text-[#f59e0b] text-[11px] uppercase font-bold tracking-widest mb-1">Cảnh báo</p>
        <p className="text-[#f59e0b] text-[32px] font-black">{stats.warning || 0}</p>
      </div>
    </div>
    
    <button 
      onClick={onReset}
      className="px-8 py-3 rounded-xl bg-[#0f172a] text-white text-[14px] font-bold hover:bg-[#1e293b] transition-all flex items-center gap-2 group"
    >
      Tiếp tục upload mới
      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// --- Main Page Client ---

interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
}

interface ValidationRow {
  id: number;
  content: string;
  status: 'OK' | 'ERROR' | 'DUP';
  message: string;
}

interface ValidationData {
  total: number;
  valid: number;
  error: number;
  duplicate: number;
  rows: ValidationRow[];
}

interface HistoryItem {
  id: string;
  fileName: string;
  type: string;
  topic: string;
  time: string;
  total: number;
  success: number;
  error: number;
  status: string;
}

export default function UploadClient({ user }: { user: AuthUser }) {
  const [activeTab, setActiveTab] = useState('manual');
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationData, setValidationData] = useState<ValidationData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Form states
  const [config, setConfig] = useState({
    type: 'PRACTICE',
    topic: 'DERIVATIVES',
    difficulty: 'RECOGNITION',
    title: '',
    year: '2024',
    code: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch('/api/v1/admin/upload/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        // Mock data if API doesn't exist yet
        setHistory([
          { id: '1', fileName: 'Unit1_Derivatives.xlsx', type: 'Bài tập', topic: 'Đạo hàm', time: '2 giờ trước', total: 50, success: 48, error: 2, status: 'Completed' },
          { id: '2', fileName: 'Theory_Integrals.pdf', type: 'Lý thuyết', topic: 'Tích phân', time: '5 giờ trước', total: 1, success: 1, error: 0, status: 'Completed' },
          { id: '3', fileName: 'Exam_Set_A.csv', type: 'Bộ đề', topic: 'Tổng hợp', time: '1 ngày trước', total: 100, success: 95, error: 5, status: 'Warning' },
        ]);
      }
    } catch (error: unknown) {
      console.error('History fetch error:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setStep(2); // Jump to step 2 if file selected from step 1 download card or similar
    }
  };

  const startValidation = async () => {
    if (!selectedFile) return;
    setStep(3);
    setIsUploading(true);
    setUploadProgress(30);
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('dryRun', 'true');
      formData.append('type', config.type);
      formData.append('topic', config.topic);
      formData.append('difficulty', config.difficulty);
      
      const response = await fetch('/api/v1/admin/upload/excel', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Validation failed');
      }
      
      const data = await response.json();
      setValidationData(data);
      setUploadProgress(100);
      setStep(4);
    } catch (error: unknown) {
       console.error(error);
       const message = error instanceof Error ? error.message : 'Validation failed';
       alert(`Lỗi khi validate file: ${message}`);
       setStep(2);
    } finally {
       setIsUploading(false);
    }
  };

  const handleFinalUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setUploadProgress(50);
    // Switch to step 3 UI for "Processing" feedback
    const originalStep = step;
    setStep(3);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('dryRun', 'false');
      formData.append('type', config.type);
      formData.append('topic', config.topic);
      formData.append('difficulty', config.difficulty);
      
      const response = await fetch('/api/v1/admin/upload/excel', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Upload failed');
      }
      
      setUploadProgress(100);
      setStep(5);
    } catch (error: unknown) {
       console.error(error);
       const message = error instanceof Error ? error.message : 'Upload failed';
       alert(`Lỗi khi lưu dữ liệu: ${message}`);
       setStep(originalStep);
    } finally {
       setIsUploading(false);
    }
  };

  const resetWizard = () => {
    setStep(1);
    setSelectedFile(null);
    setValidationData(null);
    setUploadProgress(0);
  };

  return (
    <>
      <Toaster position="top-right" />
      <AdminSidebar user={user} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
        {/* Topbar */}
        <header className="h-[60px] bg-white border-b flex items-center justify-between px-8 flex-shrink-0" style={{ borderColor: '#e2e8f0' }}>
          <div>
            <h1 className="text-[#0f172a] text-[18px] font-bold">Upload nội dung</h1>
            <p className="text-[#94a3b8] text-[12px]">Upload câu hỏi, lý thuyết và bộ đề vào hệ thống</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b px-8 flex-shrink-0" style={{ borderColor: '#e2e8f0' }}>
          <div className="flex gap-8">
            {[
              { id: 'manual', label: 'Nhập tay', icon: PenLine },
              { id: 'excel', label: 'Excel / CSV', icon: FileSpreadsheet },
              { id: 'theory', label: 'Lý thuyết PDF', icon: FileSearch },
              { id: 'exam-set', label: 'Bộ đề thi', icon: Layers },
              { id: 'thpt', label: 'Đề THPT', icon: FileCheck },
              { id: 'history', label: 'Lịch sử', icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-[13px] font-bold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === tab.id 
                    ? 'border-[#059669] text-[#059669]' 
                    : 'border-transparent text-[#94a3b8] hover:text-[#64748b]'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activeTab === 'manual' && (
            <div className="max-width-6xl mx-auto">
               <ManualInputForm 
                 onSuccess={() => {
                   // Optional: refresh history or switch tab
                 }} 
               />
            </div>
          )}

          {activeTab === 'excel' && (
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Step indicator */}
              <div className="bg-white rounded-[12px] p-1 flex items-stretch border border-[#e2e8f0]">
                {[
                  { s: 1, n: 'Tải template', icon: Download },
                  { s: 2, n: 'Cấu hình & Upload', icon: Upload },
                  { s: 3, n: 'Validate', icon: Check },
                  { s: 4, n: 'Xem trước', icon: FileText },
                  { s: 5, n: 'Hoàn thành', icon: CheckCircle2 },
                ].map((item, idx) => (
                  <React.Fragment key={item.s}>
                    <div className={`flex-1 flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                      step === item.s 
                        ? 'bg-gradient-to-br from-[#d1fae5] to-[#e0f2fe] text-[#059669]' 
                        : step > item.s ? 'text-[#059669]' : 'text-[#94a3b8]'
                    }`}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold border ${
                        step === item.s ? 'bg-[#059669] text-white border-transparent' : 
                        step > item.s ? 'bg-[#d1fae5] text-[#059669] border-transparent' : 'bg-transparent border-[#e2e8f0]'
                      }`}>
                        {step > item.s ? <Check size={14} /> : item.s}
                      </div>
                      <span className="text-[12px] font-bold whitespace-nowrap">{item.n}</span>
                    </div>
                    {idx < 4 && <div className="w-[1px] bg-[#e2e8f0] self-center h-8 my-1 mx-2"></div>}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Download Templates */}
              {step === 1 && (
                <div className="grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {[
                    { type: 'PRACTICE', title: 'Practice Question', desc: 'Câu hỏi ôn tập từng chủ đề', icon: '📚' },
                    { type: 'EXAM_SET', title: 'Exam Set', desc: 'Bộ đề thi chuẩn 10-50 câu', icon: '📝' },
                    { type: 'THPT_EXAM', title: 'THPT Question', desc: 'Đề thi THPT quốc gia chính thức', icon: '🏆' },
                  ].map((tpl) => (
                    <div key={tpl.type} className="bg-white p-8 rounded-2xl border border-[#e2e8f0] flex flex-col items-center text-center group hover:border-[#059669]/30 hover:shadow-xl transition-all">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{tpl.icon}</div>
                      <h3 className="text-[#0f172a] text-[15px] font-bold mb-1">Template {tpl.type}</h3>
                      <p className="text-[#64748b] text-[12px] mb-6">{tpl.desc}</p>
                      <a 
                        href="/templates/questions_template.xlsx" 
                        download="questions_template.xlsx"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        📥 Tải template Excel
                      </a>
                    </div>
                  ))}

                  {/* Template table structure */}
                  <div className="col-span-3 bg-white p-8 rounded-2xl border border-[#e2e8f0]">
                    <h4 className="text-[#0f172a] text-[14px] font-bold mb-6 flex items-center gap-2">
                      <Info size={16} className="text-[#059669]" />
                      Cấu trúc cột bắt buộc
                    </h4>
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-[#94a3b8] text-[10px] uppercase font-bold border-b border-[#f1f5f9]">
                          <th className="pb-4">Tên cột</th>
                          <th className="pb-4">Bắt buộc</th>
                          <th className="pb-4">Giá trị hợp lệ</th>
                          <th className="pb-4">Ví dụ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9] text-[12px]">
                        {[
                          { name: 'content', req: 'Có', val: 'Text, LaTeX $...$', ex: 'Tính đạo hàm của $y=x^2$' },
                          { name: 'option_a / b / c / d', req: 'Có', val: 'Text', ex: '$2x$' },
                          { name: 'answer', req: 'Có', val: 'A, B, C, D', ex: 'A' },
                          { name: 'topic', req: 'Có', val: 'DERIVATIVES, INTEGRALS...', ex: 'DERIVATIVES' },
                        ].map((row) => (
                          <tr key={row.name}>
                            <td className="py-4 font-mono text-[#059669] font-bold">{row.name}</td>
                            <td className="py-4"><Badge variant="green">{row.req}</Badge></td>
                            <td className="py-4 text-[#64748b]">{row.val}</td>
                            <td className="py-4 text-[#374151]">{row.ex}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Step 2: Config & Upload */}
              {step === 2 && (
                <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0] animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-3 gap-8 mb-8">
                    <div>
                      <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Loại nội dung</label>
                      <select 
                        value={config.type}
                        onChange={(e) => setConfig({ ...config, type: e.target.value })}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#059669] transition-all"
                      >
                        <option value="PRACTICE">Ôn luyện theo chủ đề</option>
                        <option value="EXAM_SET">Bộ đề thi thử</option>
                        <option value="THPT_EXAM">Câu hỏi đề THPT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Chủ đề mặc định</label>
                      <select 
                         value={config.topic}
                         onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                         className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#059669] transition-all"
                      >
                        {TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Độ khó mặc định</label>
                      <select 
                         value={config.difficulty}
                         onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                         className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#059669] transition-all"
                      >
                        {DIFFICULTIES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      selectedFile ? 'border-[#059669] bg-[#f0fdf9]' : 'border-[#d1fae5] hover:border-[#059669] hover:bg-[#f0fdf9]'
                    }`}
                  >
                    <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.csv" onChange={handleFileSelect} />
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#059669] shadow-sm mb-4">
                      {selectedFile ? <FileCheck size={32} /> : <Upload size={32} />}
                    </div>
                    <p className="text-[#0f172a] font-bold mb-1">
                      {selectedFile ? selectedFile.name : 'Click để chọn file hoặc kéo thả vào đây'}
                    </p>
                    <p className="text-[#94a3b8] text-[12px]">Hỗ trợ định dạng .xlsx, .csv (Tối đa 20MB)</p>
                  </div>

                  <div className="mt-8 flex justify-end gap-3">
                    <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl border border-[#e2e8f0] text-[#64748b] font-bold text-[13px] hover:bg-slate-50">Quay lại</button>
                    <button 
                      disabled={!selectedFile}
                      onClick={startValidation}
                      className="px-8 py-2.5 rounded-xl bg-gradient-to-br from-[#059669] to-[#0891b2] text-white font-bold text-[13px] shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                    >
                      Bắt đầu xử lý
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Validation Progress */}
              {step === 3 && (
                <div className="bg-white p-12 rounded-2xl border border-[#e2e8f0] flex flex-col items-center animate-in fade-in zoom-in duration-500">
                  <div className="relative w-32 h-32 mb-8">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                      <circle cx="64" cy="64" r="58" stroke="#059669" strokeWidth="8" fill="transparent" 
                        strokeDasharray={364.42} strokeDashoffset={364.42 - (364.42 * uploadProgress) / 100} 
                        className="transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[#0f172a] text-[24px] font-black">{uploadProgress}%</span>
                    </div>
                  </div>
                  <h3 className="text-[#0f172a] text-[18px] font-bold mb-2">Đang kiểm tra dữ liệu...</h3>
                  <p className="text-[#64748b] text-[14px]">MathBot đang quét lỗi cú pháp và kiểm tra trùng lặp.</p>
                </div>
              )}

              {/* Step 4: Preview & Results */}
              {step === 4 && validationData && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0]">
                      <p className="text-[#94a3b8] text-[10px] uppercase font-bold mb-1">Tổng câu hỏi</p>
                      <p className="text-[#0f172a] text-[24px] font-black">{validationData.total}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-[#d1fae5] shadow-sm">
                      <p className="text-[#059669] text-[10px] uppercase font-bold mb-1">Hợp lệ</p>
                      <p className="text-[#059669] text-[24px] font-black">{validationData.valid}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-[#fee2e2]">
                      <p className="text-[#ef4444] text-[10px] uppercase font-bold mb-1">Lỗi dữ liệu</p>
                      <p className="text-[#ef4444] text-[24px] font-black">{validationData.error}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-[#fef3c7]">
                      <p className="text-[#f59e0b] text-[10px] uppercase font-bold mb-1">Trùng lặp</p>
                      <p className="text-[#f59e0b] text-[24px] font-black">{validationData.duplicate}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
                    <div className="px-6 py-4 border-b flex justify-between items-center bg-[#fafafa]">
                      <h3 className="text-[#0f172a] text-[13px] font-bold">Chi tiết bản ghi</h3>
                      <button className="text-[#64748b] text-[11px] font-medium flex items-center gap-1 hover:text-[#0f172a]">
                        <AlertCircle size={14} /> Chỉ hiện lỗi
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[#f8fafc] text-[#94a3b8] text-[10px] uppercase font-bold border-b">
                            <th className="px-6 py-3 w-12 text-center">Row</th>
                            <th className="px-6 py-3">Nội dung câu hỏi</th>
                            <th className="px-6 py-3 text-center">Trạng thái</th>
                            <th className="px-6 py-3">Thông báo</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#f1f5f9] text-[12px]">
                          {validationData.rows.map((row) => (
                            <tr key={row.id} className={`hover:bg-[#f8fafc] transition-colors border-l-4 ${
                              row.status === 'OK' ? 'border-l-[#059669]' : 
                              row.status === 'ERROR' ? 'border-l-[#ef4444]' : 
                              row.status === 'DUP' ? 'border-l-[#f59e0b]' : 'border-l-[#6366f1]'
                            }`}>
                              <td className="px-6 py-4 text-center text-[#94a3b8] font-mono">{row.id}</td>
                              <td className="px-6 py-4 font-medium text-[#0f172a] max-w-md truncate">{row.content}</td>
                              <td className="px-6 py-4 text-center">
                                <Badge variant={
                                  row.status === 'OK' ? 'green' : 
                                  row.status === 'ERROR' ? 'red' : 
                                  row.status === 'DUP' ? 'amber' : 'blue'
                                }>
                                  {row.status}
                                </Badge>
                              </td>
                              <td className={`px-6 py-4 ${
                                row.status === 'ERROR' ? 'text-red-500' : 
                                row.status === 'OK' ? 'text-green-600' : 'text-slate-500'
                              }`}>
                                {row.message}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-[#94a3b8] italic">
                      * Các hàng có lỗi sẽ bị bỏ qua khi click "Lưu vào hệ thống".
                    </p>
                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="px-6 py-2.5 rounded-xl border border-[#e2e8f0] text-[#64748b] font-bold text-[13px] hover:bg-slate-50">Sửa lại</button>
                      <button 
                        onClick={handleFinalUpload}
                        className="px-8 py-2.5 rounded-xl bg-[#0f172a] text-white font-bold text-[13px] shadow-lg shadow-slate-900/10"
                      >
                        Lưu {validationData.valid} bản ghi
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Final Result */}
              {step === 5 && validationData && (
                <SuccessHero 
                  stats={{ total: validationData.total, success: validationData.valid, warning: validationData.duplicate }} 
                  onReset={resetWizard}
                />
              )}
            </div>
          )}

          {activeTab === 'theory' && (
             <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0]">
                   <h2 className="text-[#0f172a] text-[18px] font-bold mb-6">Upload Lý thuyết thông minh (RAG)</h2>
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Chủ đề</label>
                            <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none">
                               {TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                         </div>
                         <div>
                            <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Tiêu đề tài liệu</label>
                            <input type="text" placeholder="VD: Công thức tính nhanh đạo hàm" className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none" />
                         </div>
                      </div>

                      <div className="border-2 border-dashed border-[#d1fae5] rounded-3xl p-12 flex flex-col items-center justify-center hover:bg-[#f0fdf9] hover:border-[#059669] transition-all cursor-pointer">
                         <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-red-500 shadow-sm mb-4">
                            <FileText size={32} />
                         </div>
                         <p className="text-[#0f172a] font-bold mb-1">Kéo thả file PDF vào đây</p>
                         <p className="text-[#94a3b8] text-[11px]">Hệ thống sẽ tự động tách nhỏ (chunking) và vector hóa để AI học.</p>
                      </div>

                      <div className="bg-[#f0fdf9] border-l-4 border-[#059669] p-4 rounded-r-xl">
                         <div className="flex gap-3">
                            <Info className="text-[#059669] flex-shrink-0" size={18} />
                            <p className="text-[#065f46] text-[12px] leading-relaxed">
                               <b>Ghi chú RAG:</b> Nội dung PDF sẽ được index vào cơ sở dữ liệu vector. AI MathBot sẽ ưu tiên sử dụng thông tin từ file này để trả lời câu hỏi của học sinh.
                            </p>
                         </div>
                      </div>

                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#0891b2] text-white font-bold text-[14px]">
                         Xử lý lý thuyết & Cập nhật AI
                      </button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'exam-set' && (
             <div className="max-w-3xl mx-auto">
                <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0]">
                   <h2 className="text-[#0f172a] text-[18px] font-bold mb-6">Tạo bộ đề thi mới</h2>
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                         <div className="col-span-2">
                            <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Tên bộ đề</label>
                            <input type="text" placeholder="VD: Đề thi thử học kỳ 2 - Trường chuyên ABC" className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none" />
                         </div>
                         <div>
                            <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Chủ đề chính</label>
                            <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none">
                               <option value="ALL">Tổng hợp</option>
                               {TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                         </div>
                         <div>
                            <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Phương thức upload</label>
                            <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none">
                               <option value="excel">Excel Template</option>
                               <option value="pdf">File PDF + Nhập đáp án</option>
                            </select>
                         </div>
                      </div>

                      <div className="border-2 border-dashed border-[#d1fae5] rounded-3xl p-12 flex flex-col items-center justify-center hover:bg-[#f0fdf9] hover:border-[#059669] transition-all cursor-pointer">
                         <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-indigo-500 shadow-sm mb-4">
                            <Layers size={32} />
                         </div>
                         <p className="text-[#0f172a] font-bold mb-1">Tải file đề thi lên</p>
                      </div>

                      <button className="w-full py-3 rounded-xl bg-[#0f172a] text-white font-bold text-[14px]">
                         Tạo bộ đề & Kiểm tra
                      </button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'thpt' && (
             <div className="max-w-3xl mx-auto">
                <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0]">
                   <h2 className="text-[#0f172a] text-[18px] font-bold mb-6">Import Đề THPT Quốc Gia</h2>
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                         <div>
                            <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Năm thi</label>
                            <select className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none">
                               <option>2024</option>
                               <option>2023</option>
                               <option>2022</option>
                               <option>2021</option>
                            </select>
                         </div>
                         <div>
                            <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Mã đề</label>
                            <input type="text" placeholder="VD: 101, 102..." className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none" />
                         </div>
                      </div>

                      <div className="border-2 border-dashed border-[#d1fae5] rounded-3xl p-12 flex flex-col items-center justify-center hover:bg-[#f0fdf9] hover:border-[#059669] transition-all cursor-pointer">
                         <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm mb-4">
                            <FileCheck size={32} />
                         </div>
                         <p className="text-[#0f172a] font-bold mb-1">Upload Đề & Đáp án</p>
                      </div>

                      <div className="bg-[#fffbeb] border-l-4 border-[#f59e0b] p-4 rounded-r-xl">
                         <div className="flex gap-3">
                            <AlertTriangle className="text-[#f59e0b] flex-shrink-0" size={18} />
                            <p className="text-[#92400e] text-[12px] leading-relaxed">
                               <b>Lưu ý quan trọng:</b> Hệ thống chỉ hỗ trợ tách tự động phần trắc nghiệm. Vui lòng đảm bảo file upload đúng định dạng đề minh họa/đề thật của Bộ GD&ĐT.
                            </p>
                         </div>
                      </div>

                      <button className="w-full py-3 rounded-xl bg-[#059669] text-white font-bold text-[14px]">
                         Bắt đầu Import
                      </button>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'history' && (
             <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden animate-in fade-in duration-500">
                <div className="px-8 py-4 border-b bg-white">
                   <h2 className="text-[#0f172a] text-[15px] font-bold">Lịch sử tải lên</h2>
                </div>
                {isLoadingHistory ? (
                   <div className="py-20 flex flex-col items-center justify-center text-[#94a3b8]">
                      <Loader2 size={32} className="animate-spin mb-4" />
                      <p className="text-[13px]">Đang tải dữ liệu lịch sử...</p>
                   </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-[#f8fafc] text-[#94a3b8] text-[10px] uppercase font-bold border-b">
                          <th className="px-8 py-4">File tải lên</th>
                          <th className="px-8 py-4">Loại</th>
                          <th className="px-8 py-4">Chủ đề</th>
                          <th className="px-8 py-4">Thời gian</th>
                          <th className="px-8 py-4 text-center">Tổng</th>
                          <th className="px-8 py-4 text-center">Import</th>
                          <th className="px-8 py-4 text-center">Lỗi</th>
                          <th className="px-8 py-4 text-right">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f1f5f9] text-[13px]">
                        {history.map((h) => (
                          <tr key={h.id} className="hover:bg-[#f8fafc] transition-colors">
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-50 text-[#64748b]">
                                  {h.fileName.endsWith('.pdf') ? <FileText size={16}/> : <FileSpreadsheet size={16}/>}
                                </div>
                                <span className="text-[#0f172a] font-bold">{h.fileName}</span>
                              </div>
                            </td>
                            <td className="px-8 py-4 text-[#64748b]">{h.type}</td>
                            <td className="px-8 py-4 text-[#374151]">{h.topic}</td>
                            <td className="px-8 py-4 text-[#94a3b8]">{h.time}</td>
                            <td className="px-8 py-4 text-center font-bold">{h.total}</td>
                            <td className="px-8 py-4 text-center text-[#059669] font-bold">{h.success}</td>
                            <td className="px-8 py-4 text-center text-[#ef4444] font-bold">{h.error}</td>
                            <td className="px-8 py-4 text-right">
                              <Badge variant={h.status === 'Completed' ? 'green' : h.status === 'Warning' ? 'amber' : 'red'}>
                                {h.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
             </div>
          )}

        </div>
      </main>
    </>
  );
}
