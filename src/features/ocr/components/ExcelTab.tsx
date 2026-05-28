'use client';

import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { TOPICS } from '@/shared/constants/topics';
import {
  Download, Upload, Check, FileText, CheckCircle2, Info,
  Loader2, FileCheck,
} from 'lucide-react';
import { Badge, SuccessHero, DIFFICULTIES } from './SharedUI';
import { ExcelValidationResults, type ValidationData } from './ExcelValidationResults';

interface ExcelTabProps {
  apiBasePath: string;
}

export default function ExcelTab({ apiBasePath }: ExcelTabProps) {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationData, setValidationData] = useState<ValidationData | null>(null);
  const [config, setConfig] = useState({
    type: 'PRACTICE',
    topic: 'DERIVATIVES',
    difficulty: 'RECOGNITION',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setSelectedFile(file); setStep(2); }
  };

  const startValidation = async () => {
    if (!selectedFile) return;
    setStep(3); setIsUploading(true); setUploadProgress(30);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('dryRun', 'true');
      formData.append('type', config.type);
      formData.append('topic', config.topic);
      formData.append('difficulty', config.difficulty);
      const response = await fetch(`${apiBasePath}/excel`, { method: 'POST', body: formData });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || 'Validation failed'); }
      const data = await response.json();
      setValidationData({ ...data, errorCount: data.errorCount ?? 0, dupCount: data.dupCount ?? 0 });
      setUploadProgress(100); setStep(4);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Validation failed';
      toast.error(`Lỗi khi validate file: ${message}`); setStep(2);
    } finally { setIsUploading(false); }
  };

  const handleFinalUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true); setUploadProgress(50);
    const originalStep = step; setStep(3);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('dryRun', 'false');
      formData.append('type', config.type);
      formData.append('topic', config.topic);
      formData.append('difficulty', config.difficulty);
      const response = await fetch(`${apiBasePath}/excel`, { method: 'POST', body: formData });
      if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || 'Upload failed'); }
      setUploadProgress(100); setStep(5);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Upload failed';
      toast.error(`Lỗi khi lưu dữ liệu: ${message}`); setStep(originalStep);
    } finally { setIsUploading(false); }
  };

  const resetWizard = () => { setStep(1); setSelectedFile(null); setValidationData(null); setUploadProgress(0); };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Step indicator */}
      <div className="bg-white rounded-[12px] p-1 flex items-stretch border border-[#e2e8f0] overflow-x-auto">
        {[
          { s: 1, n: 'Tải template', icon: Download },
          { s: 2, n: 'Cấu hình', icon: Upload },
          { s: 3, n: 'Validate', icon: Check },
          { s: 4, n: 'Xem trước', icon: FileText },
          { s: 5, n: 'Xong', icon: CheckCircle2 },
        ].map((item, idx) => (
          <React.Fragment key={item.s}>
            <div className={`flex-1 min-w-0 flex items-center gap-2 px-3 lg:px-6 py-3 rounded-xl transition-all duration-300 ${
              step === item.s ? 'bg-gradient-to-br from-[#d1fae5] to-[#e0f2fe] text-[#059669]'
                : step > item.s ? 'text-[#059669]' : 'text-[#94a3b8]'
            }`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-bold border ${
                step === item.s ? 'bg-[#059669] text-white border-transparent'
                  : step > item.s ? 'bg-[#d1fae5] text-[#059669] border-transparent' : 'bg-transparent border-[#e2e8f0]'
              }`}>{step > item.s ? <Check size={14} /> : item.s}</div>
              <span className="text-[12px] font-bold whitespace-nowrap hidden sm:inline">{item.n}</span>
            </div>
            {idx < 4 && <div className="w-[1px] bg-[#e2e8f0] self-center h-8 my-1 mx-1 lg:mx-2 flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Download Templates */}
      {step === 1 && (
        <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {[
            { type: 'questions', title: 'Câu hỏi thông thường', desc: 'Ôn luyện theo chủ đề hoặc bộ đề thi thử.', icon: '📚', filename: 'template_questions.xlsx' },
            { type: 'thpt', title: 'Đề thi THPT Quốc Gia', desc: '3 sheets: Phần I (12 MC) · Phần II (4 Đ/S) · Phần III (6 TL ngắn).', icon: '🏆', filename: 'template_thpt.xlsx' },
          ].map((tpl) => (
            <div key={tpl.type} className="bg-white p-8 rounded-2xl border border-[#e2e8f0] flex flex-col items-center text-center group hover:border-[#059669]/30 hover:shadow-xl transition-all">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{tpl.icon}</div>
              <h3 className="text-[#0f172a] text-[15px] font-bold mb-2">{tpl.title}</h3>
              <p className="text-[#64748b] text-[12px] mb-6 leading-relaxed">{tpl.desc}</p>
              <a href={`${apiBasePath}/excel/template?type=${tpl.type}`} download={tpl.filename}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity">
                <Download size={15} /> Tải template Excel
              </a>
            </div>
          ))}
          <div className="col-span-2 bg-white p-8 rounded-2xl border border-[#e2e8f0]">
            <h4 className="text-[#0f172a] text-[14px] font-bold mb-6 flex items-center gap-2">
              <Info size={16} className="text-[#059669]" /> Cấu trúc cột bắt buộc
            </h4>
            <table className="w-full">
              <thead><tr className="text-left text-[#94a3b8] text-[10px] uppercase font-bold border-b border-[#f1f5f9]">
                <th className="pb-4">Tên cột</th><th className="pb-4">Bắt buộc</th><th className="pb-4">Giá trị hợp lệ</th><th className="pb-4">Ví dụ</th>
              </tr></thead>
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
              <select value={config.type} onChange={(e) => setConfig({ ...config, type: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#059669] transition-all">
                <option value="PRACTICE">Ôn luyện theo chủ đề</option>
                <option value="EXAM_SET">Bộ đề thi thử</option>
                <option value="THPT_EXAM">Câu hỏi đề THPT</option>
              </select>
            </div>
            <div>
              <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Chủ đề mặc định</label>
              <select value={config.topic} onChange={(e) => setConfig({ ...config, topic: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#059669] transition-all">
                {TOPICS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Độ khó mặc định</label>
              <select value={config.difficulty} onChange={(e) => setConfig({ ...config, difficulty: e.target.value })}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#059669] transition-all">
                {DIFFICULTIES.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
          <div onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
              selectedFile ? 'border-[#059669] bg-[#f0fdf9]' : 'border-[#d1fae5] hover:border-[#059669] hover:bg-[#f0fdf9]'
            }`}>
            <input type="file" ref={fileInputRef} className="hidden" accept=".xlsx,.csv" onChange={handleFileSelect} />
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#059669] shadow-sm mb-4">
              {selectedFile ? <FileCheck size={32} /> : <Upload size={32} />}
            </div>
            <p className="text-[#0f172a] font-bold mb-1">{selectedFile ? selectedFile.name : 'Click để chọn file hoặc kéo thả vào đây'}</p>
            <p className="text-[#94a3b8] text-[12px]">Hỗ trợ định dạng .xlsx, .csv (Tối đa 20MB)</p>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button onClick={() => setStep(1)} className="px-6 py-2.5 rounded-xl border border-[#e2e8f0] text-[#64748b] font-bold text-[13px] hover:bg-slate-50">Quay lại</button>
            <button disabled={!selectedFile} onClick={startValidation}
              className="px-8 py-2.5 rounded-xl bg-gradient-to-br from-[#059669] to-[#0891b2] text-white font-bold text-[13px] shadow-lg shadow-emerald-500/20 disabled:opacity-50">
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
                className="transition-all duration-300" />
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
        <ExcelValidationResults
          validationData={validationData}
          onBack={() => setStep(2)}
          onUpload={handleFinalUpload}
        />
      )}

      {/* Step 5: Success */}
      {step === 5 && validationData && (
        <SuccessHero stats={{ total: validationData.total, success: validationData.valid, warning: validationData.dupCount }} onReset={resetWizard} />
      )}
    </div>
  );
}
