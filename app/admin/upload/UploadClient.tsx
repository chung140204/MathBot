'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import AdminSidebar from '@/components/AdminSidebar';
import MathRenderer from '@/components/exam/MathRenderer';
import {
  FileSpreadsheet,
  FileText,
  History,
  Check,
  Upload,
  ArrowRight,
  Download,
  AlertCircle,
  CheckCircle2,
  Info,
  PenLine,
  FileCheck,
  Loader2,
  AlertTriangle
} from 'lucide-react';

import ManualInputForm from '@/components/admin/ManualInputForm';
import { ExtractedQuestion } from '@/lib/ocr-prompt';
import { pdfToImages, cropPageImage } from '@/lib/pdf-to-images';

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
  errorCount: number;
  dupCount: number;
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

  // --- THPT OCR states ---
  const [thptYear, setThptYear] = useState('2025');
  const [thptCode, setThptCode] = useState('');
  const [thptFiles, setThptFiles] = useState<File[]>([]);
  const [ocrQuestions, setOcrQuestions] = useState<ExtractedQuestion[]>([]);
  const [ocrProgress, setOcrProgress] = useState({ current: 0, total: 22 });
  const [ocrStatus, setOcrStatus] = useState<'idle' | 'converting' | 'extracting' | 'done' | 'saving' | 'saved' | 'error'>('idle');
  const [ocrError, setOcrError] = useState('');
  const thptFileRef = useRef<HTMLInputElement>(null);

  // Image crop states
  const [pageDataUrls, setPageDataUrls] = useState<string[]>([]);
  const [pagePositions, setPagePositions] = useState<Record<number, { label: string; type?: string; yStart: number; yEnd: number; xStart?: number; xEnd?: number; questionLabel?: string }[]>>({});
  const [questionFigures, setQuestionFigures] = useState<Record<number, string>>({}); // questionNumber → figure/table crop data URL

  // Persist OCR results to sessionStorage so navigation doesn't lose them
  const OCR_STORAGE_KEY = 'mathbot_ocr_session';
  useEffect(() => {
    if (ocrStatus === 'done' && ocrQuestions.length > 0) {
      try {
        sessionStorage.setItem(OCR_STORAGE_KEY, JSON.stringify({
          ocrQuestions, ocrStatus, ocrProgress, questionFigures, pagePositions,
          thptYear, thptCode,
        }));
      } catch { /* sessionStorage full or unavailable */ }
    } else if (ocrStatus === 'saved' || ocrStatus === 'idle') {
      sessionStorage.removeItem(OCR_STORAGE_KEY);
    }
  }, [ocrStatus, ocrQuestions, questionFigures, ocrProgress, pagePositions, thptYear, thptCode]);

  // Restore OCR results from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(OCR_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.ocrQuestions?.length > 0 && data.ocrStatus === 'done') {
          setOcrQuestions(data.ocrQuestions);
          setOcrStatus('done');
          setOcrProgress(data.ocrProgress || { current: 0, total: 22 });
          setQuestionFigures(data.questionFigures || {});
          setPagePositions(data.pagePositions || {});
          setThptYear(data.thptYear || '2025');
          setThptCode(data.thptCode || '');
          setActiveTab('thpt');
        }
      }
    } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Warn before leaving page when OCR results are unsaved
  useEffect(() => {
    const shouldWarn = ocrStatus === 'extracting' || ocrStatus === 'done';
    if (!shouldWarn) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [ocrStatus]);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchHistory();
    }
  }, [activeTab]);

  // Strip Vietnamese diacritics: "Cấu" → "Cau", "Câu" → "Cau", "Phần" → "Phan"
  // Handles OCR typos where accents differ (ấ vs â, ầ vs â, etc.)
  const stripDiacritics = (s: string) =>
    s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Helper: match a position label to a questionNumber
  const labelToQuestionNumber = (label: string): number | null => {
    const normalized = stripDiacritics(label.replace(/\s+/g, '').toLowerCase());
    // "cau5" → 5, "phaniicau2" → 14, "phaniiicau1" → 17
    let m = normalized.match(/^phaniiicau(\d+)$/);
    if (m) return parseInt(m[1], 10) + 16;
    m = normalized.match(/^phaniicau(\d+)$/);
    if (m) return parseInt(m[1], 10) + 12;
    m = normalized.match(/^cau(\d+)$/);
    if (m) return parseInt(m[1], 10);
    return null;
  };

  // Auto-crop figure/table regions once extraction is done
  useEffect(() => {
    if (ocrStatus !== 'done' || !ocrQuestions.length || !pageDataUrls.length) return;

    for (const [pageStr, positions] of Object.entries(pagePositions)) {
      const pageNum = parseInt(pageStr, 10);
      const dataUrl = pageDataUrls[pageNum - 1];
      if (!dataUrl || !positions.length) continue;

      for (const pos of positions) {
        const posType = pos.type || 'question';
        if (posType === 'figure' || posType === 'table') {
          const ownerLabel = pos.questionLabel || '';
          let qNum = labelToQuestionNumber(ownerLabel);
          if (qNum) {
            // Fallback label "Câu 2" → qNum=2, but could be PHẦN II (14) or PHẦN III (18)
            if (!ocrQuestions.some((qq) => qq.questionNumber === qNum)) {
              const p2 = qNum + 12; // PHẦN II offset
              const p3 = qNum + 16; // PHẦN III offset
              if (ocrQuestions.some((qq) => qq.questionNumber === p2)) qNum = p2;
              else if (ocrQuestions.some((qq) => qq.questionNumber === p3)) qNum = p3;
            }
            const finalQNum = qNum;
            cropPageImage(dataUrl, pos.yStart, pos.yEnd, 0, pos.xStart ?? 0, pos.xEnd ?? 1).then((cropUrl) => {
              setQuestionFigures((prev) => prev[finalQNum] ? prev : { ...prev, [finalQNum]: cropUrl });
            });
          }
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ocrStatus]);

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
      setValidationData({
        ...data,
        errorCount: data.errorCount ?? 0,
        dupCount: data.dupCount ?? 0,
      });
      setUploadProgress(100);
      setStep(4);
    } catch (error: unknown) {
       console.error(error);
       const message = error instanceof Error ? error.message : 'Validation failed';
       toast.error(`Lỗi khi validate file: ${message}`);
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
       toast.error(`Lỗi khi lưu dữ liệu: ${message}`);
       setStep(originalStep);
    } finally {
       setIsUploading(false);
    }
  };

  // --- THPT OCR handlers ---

  const handleThptFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) setThptFiles(Array.from(files));
  };

  const handleThptExtract = async () => {
    if (!thptFiles.length) return;
    setOcrError('');
    setOcrQuestions([]);
    setOcrProgress({ current: 0, total: 22 });
    setPageDataUrls([]);
    setPagePositions({});
    setQuestionFigures({});

    try {
      // 1. Convert PDFs to images (client-side)
      setOcrStatus('converting');
      const images: File[] = [];
      for (const f of thptFiles) {
        if (f.type === 'application/pdf') {
          const pages = await pdfToImages(f);
          images.push(...pages);
        } else {
          images.push(f);
        }
      }

      // Store page images as data URLs for later cropping
      const dataUrls = await Promise.all(
        images.map(
          (img) =>
            new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(img);
            }),
        ),
      );
      setPageDataUrls(dataUrls);

      // 2. Send to OCR API
      setOcrStatus('extracting');
      const formData = new FormData();
      images.forEach((f) => formData.append('images', f));
      formData.append('examYear', thptYear);
      formData.append('examCode', thptCode);

      const res = await fetch('/api/v1/admin/upload/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok || !res.body) {
        throw new Error('Không thể kết nối đến server OCR');
      }

      // 3. Parse SSE stream
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6);
          if (raw === '[DONE]') continue;

          try {
            const parsed = JSON.parse(raw);
            if (parsed.event === 'question') {
              setOcrQuestions((prev) => [...prev, parsed.data]);
              setOcrProgress(parsed.progress);
            } else if (parsed.event === 'pagePositions') {
              console.log('[OCR] pagePositions page', parsed.page, JSON.stringify(parsed.positions));
              setPagePositions((prev) => ({ ...prev, [parsed.page]: parsed.positions }));
            } else if (parsed.event === 'complete') {
              setOcrStatus('done');
            } else if (parsed.event === 'error') {
              setOcrError(parsed.message);
              setOcrStatus('error');
            }
          } catch {
            // skip malformed SSE
          }
        }
      }

      // If stream ended without 'complete' event
      setOcrStatus((prev) => (prev === 'extracting' ? 'done' : prev));
    } catch (err) {
      setOcrError(err instanceof Error ? err.message : 'Extraction failed');
      setOcrStatus('error');
    }
  };

  const updateOcrQuestion = (index: number, updates: Partial<ExtractedQuestion>) => {
    setOcrQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...updates } : q)));
  };

  const allAnswersFilled = ocrQuestions.every((q) => {
    if (q.format === 'MULTIPLE_CHOICE') return !!q.answer;
    if (q.format === 'TRUE_FALSE')
      return q.answerA !== undefined && q.answerB !== undefined && q.answerC !== undefined && q.answerD !== undefined;
    if (q.format === 'SHORT_ANSWER') return !!q.correctAnswer;
    return false;
  });

  const handleThptSave = async () => {
    if (!allAnswersFilled) return;
    setOcrStatus('saving');

    try {
      // Upload figure/table crops and attach imageUrl to questions
      const questionsWithImages = await Promise.all(
        ocrQuestions.map(async (q) => {
          const figureDataUrl = questionFigures[q.questionNumber];
          if (!figureDataUrl) return q;
          try {
            const blob = await (await fetch(figureDataUrl)).blob();
            const file = new File([blob], `fig-q${q.questionNumber}.png`, { type: 'image/png' });
            const fd = new FormData();
            fd.append('file', file);
            const uploadRes = await fetch('/api/v1/admin/upload/image', { method: 'POST', body: fd });
            if (uploadRes.ok) {
              const { url } = await uploadRes.json();
              return { ...q, imageUrl: url };
            }
          } catch {
            // Upload failed — save without image
          }
          return q;
        }),
      );

      const res = await fetch('/api/v1/admin/upload/ocr/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: questionsWithImages,
          examYear: thptYear,
          examCode: thptCode,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Save failed');
      }

      setOcrStatus('saved');
    } catch (err) {
      setOcrError(err instanceof Error ? err.message : 'Save failed');
      setOcrStatus('error');
    }
  };

  const resetThptOcr = () => {
    setOcrStatus('idle');
    setOcrQuestions([]);
    setOcrProgress({ current: 0, total: 22 });
    setOcrError('');
    setThptFiles([]);
    setThptCode('');
    setPageDataUrls([]);
    setPagePositions({});
    setQuestionFigures({});
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
                      step === item.s
                        ? 'bg-gradient-to-br from-[#d1fae5] to-[#e0f2fe] text-[#059669]'
                        : step > item.s ? 'text-[#059669]' : 'text-[#94a3b8]'
                    }`}>
                      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[12px] font-bold border ${
                        step === item.s ? 'bg-[#059669] text-white border-transparent' :
                        step > item.s ? 'bg-[#d1fae5] text-[#059669] border-transparent' : 'bg-transparent border-[#e2e8f0]'
                      }`}>
                        {step > item.s ? <Check size={14} /> : item.s}
                      </div>
                      <span className="text-[12px] font-bold whitespace-nowrap hidden sm:inline">{item.n}</span>
                    </div>
                    {idx < 4 && <div className="w-[1px] bg-[#e2e8f0] self-center h-8 my-1 mx-1 lg:mx-2 flex-shrink-0"></div>}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Download Templates */}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {[
                    {
                      type: 'questions',
                      title: 'Câu hỏi thông thường',
                      desc: 'Ôn luyện theo chủ đề hoặc bộ đề thi thử (PRACTICE / EXAM_SET). Hỗ trợ MC, Đúng/Sai và Trả lời ngắn trong 1 file.',
                      icon: '📚',
                      filename: 'template_questions.xlsx',
                    },
                    {
                      type: 'thpt',
                      title: 'Đề thi THPT Quốc Gia',
                      desc: '3 sheets riêng biệt: Phần I (12 MC) · Phần II (4 Đúng/Sai) · Phần III (6 Trả lời ngắn). Đúng cấu trúc đề thật 2025.',
                      icon: '🏆',
                      filename: 'template_thpt.xlsx',
                    },
                  ].map((tpl) => (
                    <div key={tpl.type} className="bg-white p-8 rounded-2xl border border-[#e2e8f0] flex flex-col items-center text-center group hover:border-[#059669]/30 hover:shadow-xl transition-all">
                      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{tpl.icon}</div>
                      <h3 className="text-[#0f172a] text-[15px] font-bold mb-2">{tpl.title}</h3>
                      <p className="text-[#64748b] text-[12px] mb-6 leading-relaxed">{tpl.desc}</p>
                      <a
                        href={`/api/v1/admin/upload/excel/template?type=${tpl.type}`}
                        download={tpl.filename}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <Download size={15} /> Tải template Excel
                      </a>
                    </div>
                  ))}

                  {/* Template table structure */}
                  <div className="col-span-2 bg-white p-8 rounded-2xl border border-[#e2e8f0]">
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
                      <p className="text-[#ef4444] text-[24px] font-black">{validationData.errorCount}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-[#fef3c7]">
                      <p className="text-[#f59e0b] text-[10px] uppercase font-bold mb-1">Trùng lặp</p>
                      <p className="text-[#f59e0b] text-[24px] font-black">{validationData.dupCount}</p>
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
                              <td className="px-6 py-4 font-medium text-[#0f172a] max-w-md">
                                <MathRenderer content={row.content} className="line-clamp-2 text-[12px]" />
                              </td>
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
                      * Các hàng lỗi (ERROR) và trùng lặp (DUP) sẽ bị bỏ qua khi lưu.
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
                  stats={{ total: validationData.total, success: validationData.valid, warning: validationData.dupCount }}
                  onReset={resetWizard}
                />
              )}
            </div>
          )}

          {activeTab === 'thpt' && (
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0]">
                <h2 className="text-[#0f172a] text-[18px] font-bold mb-1">Import Đề THPT Quốc Gia</h2>
                <p className="text-[#64748b] text-[12px]">Upload ảnh hoặc PDF đề thi → AI tự động nhận diện và trích xuất câu hỏi</p>
              </div>

              {/* Step 1: Upload config (idle) */}
              {ocrStatus === 'idle' && (
                <div className="bg-white p-8 rounded-2xl border border-[#e2e8f0] animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Năm thi</label>
                      <select
                        value={thptYear}
                        onChange={(e) => setThptYear(e.target.value)}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#059669]"
                      >
                        {[2025, 2024, 2023, 2022, 2021].map((y) => (
                          <option key={y} value={String(y)}>{y}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#0f172a] text-[12px] font-bold mb-2">Mã đề</label>
                      <input
                        type="text"
                        value={thptCode}
                        onChange={(e) => setThptCode(e.target.value)}
                        placeholder="VD: 101, 102..."
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-[13px] outline-none focus:border-[#059669]"
                      />
                    </div>
                  </div>

                  <div
                    onClick={() => thptFileRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
                      thptFiles.length > 0 ? 'border-[#059669] bg-[#f0fdf9]' : 'border-[#d1fae5] hover:border-[#059669] hover:bg-[#f0fdf9]'
                    }`}
                  >
                    <input
                      type="file"
                      ref={thptFileRef}
                      className="hidden"
                      accept=".jpg,.jpeg,.png,.webp,.pdf"
                      multiple
                      onChange={handleThptFileSelect}
                    />
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm mb-4">
                      {thptFiles.length > 0 ? <FileCheck size={32} /> : <Upload size={32} />}
                    </div>
                    <p className="text-[#0f172a] font-bold mb-1">
                      {thptFiles.length > 0
                        ? `${thptFiles.length} file: ${thptFiles.map((f) => f.name).join(', ')}`
                        : 'Click để chọn ảnh hoặc PDF đề thi'}
                    </p>
                    <p className="text-[#94a3b8] text-[11px]">Hỗ trợ .jpg, .png, .pdf (nhiều file/trang)</p>
                  </div>

                  <div className="mt-4 bg-[#f0fdf9] border-l-4 border-[#059669] p-4 rounded-r-xl">
                    <div className="flex gap-3">
                      <Info className="text-[#059669] flex-shrink-0" size={18} />
                      <p className="text-[#065f46] text-[12px] leading-relaxed">
                        <b>Lưu ý:</b> Sau khi trích xuất, kiểm tra và nhập đáp án đúng cho từng câu hỏi trước khi lưu vào hệ thống.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleThptExtract}
                    disabled={!thptFiles.length}
                    className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-[#059669] to-[#0891b2] text-white font-bold text-[14px] shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Bắt đầu phân tích bằng AI
                  </button>
                </div>
              )}

              {/* Converting PDF */}
              {ocrStatus === 'converting' && (
                <div className="bg-white p-12 rounded-2xl border border-[#e2e8f0] flex flex-col items-center animate-in fade-in zoom-in duration-500">
                  <Loader2 size={40} className="animate-spin text-[#059669] mb-4" />
                  <h3 className="text-[#0f172a] text-[18px] font-bold mb-2">Đang chuyển PDF thành ảnh...</h3>
                  <p className="text-[#64748b] text-[14px]">Vui lòng chờ trong giây lát.</p>
                </div>
              )}

              {/* Extracting / Done — streaming questions */}
              {(ocrStatus === 'extracting' || ocrStatus === 'done') && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  {/* Progress bar */}
                  <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[12px] font-bold text-[#0f172a]">
                        {ocrStatus === 'extracting' ? 'Đang trích xuất...' : 'Trích xuất hoàn tất'}
                      </span>
                      <span className="text-[12px] font-bold text-[#059669]">
                        {ocrProgress.current}/{ocrProgress.total} câu
                      </span>
                    </div>
                    <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#059669] to-[#0891b2] rounded-full transition-all duration-500"
                        style={{ width: `${(ocrProgress.current / ocrProgress.total) * 100}%` }}
                      />
                    </div>
                    {ocrStatus === 'done' && ocrProgress.current < 22 && (
                      <p className="text-[11px] text-amber-600 mt-2">
                        <AlertTriangle size={12} className="inline mr-1" />
                        Chỉ trích xuất được {ocrProgress.current}/22 câu. Vui lòng kiểm tra lại.
                      </p>
                    )}
                  </div>

                  {/* Question cards */}
                  {ocrQuestions.map((q, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-6 rounded-2xl border border-[#e2e8f0] animate-in fade-in slide-in-from-bottom-2 duration-300"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-[12px] font-black text-slate-400">Câu {q.questionNumber}</span>
                        <Badge variant={q.format === 'MULTIPLE_CHOICE' ? 'blue' : q.format === 'TRUE_FALSE' ? 'purple' : 'green'}>
                          {q.format === 'MULTIPLE_CHOICE' ? 'Trắc nghiệm' : q.format === 'TRUE_FALSE' ? 'Đúng/Sai' : 'Trả lời ngắn'}
                        </Badge>
                        <div className="ml-auto flex gap-2">
                          <select
                            value={q.topic}
                            onChange={(e) => updateOcrQuestion(idx, { topic: e.target.value })}
                            className="text-[11px] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-2 py-1 outline-none"
                          >
                            {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                          </select>
                          <select
                            value={q.difficulty}
                            onChange={(e) => updateOcrQuestion(idx, { difficulty: e.target.value })}
                            className="text-[11px] bg-[#f8fafc] border border-[#e2e8f0] rounded-lg px-2 py-1 outline-none"
                          >
                            {DIFFICULTIES.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                          </select>
                        </div>
                      </div>

                      {/* Content + inline figure: split at [Hình:]/[Bảng:] marker */}
                      {(() => {
                        // Insert line breaks before event/variable definitions: A:, B:, etc.
                        const formatContent = (text: string) =>
                          text.replace(/([;:])\s+([A-Z]:\s*[""])/g, '$1\n$2');
                        const hasFigure = !!questionFigures[q.questionNumber];
                        if (!hasFigure) {
                          return (
                            <div className="mb-4 text-[13px] text-[#0f172a] leading-relaxed whitespace-pre-line">
                              <MathRenderer content={formatContent(q.content)} />
                            </div>
                          );
                        }
                        // Try [Bảng:]/[Hình:] marker first, fallback to inline markdown table
                        const markerRegex = /\s*\[(?:Hình|Bảng):[\s\S]*?\](?=[.,;]\s|\s*$)\s*/;
                        const mdTableRegex = /(?:\s*\|(?:[^|]*\|){2,}\s*){2,}/;
                        const splitRegex = markerRegex.test(q.content) ? markerRegex : mdTableRegex;
                        const parts = q.content.split(splitRegex);
                        const before = (parts[0] || '').replace(/\.+\s*$/, '').trim();
                        const after = (parts[1] || '').replace(/^[:.]\s*/, '').trim();
                        return (
                          <>
                            {before && (
                              <div className="mb-3 text-[13px] text-[#0f172a] leading-relaxed whitespace-pre-line">
                                <MathRenderer content={formatContent(before)} />
                              </div>
                            )}
                            <div className="mb-3 flex justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={questionFigures[q.questionNumber]}
                                alt={`Hình câu ${q.questionNumber}`}
                                className="max-h-48 w-auto rounded-lg border border-[#e2e8f0] cursor-zoom-in hover:opacity-90 transition-opacity"
                                onClick={() => window.open(questionFigures[q.questionNumber], '_blank')}
                              />
                            </div>
                            {after && (
                              <div className="mb-4 text-[13px] text-[#0f172a] leading-relaxed whitespace-pre-line">
                                <MathRenderer content={formatContent(after)} />
                              </div>
                            )}
                          </>
                        );
                      })()}

                      {/* MC: options + answer */}
                      {q.format === 'MULTIPLE_CHOICE' && q.options && (
                        <div className="space-y-2">
                          {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                            <div key={opt} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] ${
                              q.answer === opt ? 'bg-emerald-50 border border-emerald-200' : 'bg-[#f8fafc]'
                            }`}>
                              <button
                                onClick={() => updateOcrQuestion(idx, { answer: opt })}
                                className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center border-2 transition-all ${
                                  q.answer === opt
                                    ? 'bg-[#059669] text-white border-[#059669]'
                                    : 'border-[#d1d5db] text-[#6b7280] hover:border-[#059669]'
                                }`}
                              >
                                {opt}
                              </button>
                              <MathRenderer content={q.options![opt]} className="flex-1" />
                            </div>
                          ))}
                          {!q.answer && (
                            <p className="text-[11px] text-red-500 font-medium">* Vui lòng chọn đáp án đúng</p>
                          )}
                        </div>
                      )}

                      {/* TF: statements + toggles */}
                      {q.format === 'TRUE_FALSE' && (
                        <div className="space-y-2">
                          {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                            const stKey = `statement${letter}` as keyof ExtractedQuestion;
                            const ansKey = `answer${letter}` as keyof ExtractedQuestion;
                            const ansVal = q[ansKey] as boolean | undefined;
                            return (
                              <div key={letter} className="flex items-center gap-3 px-3 py-2 bg-[#f8fafc] rounded-lg text-[12px]">
                                <span className="text-[10px] font-bold text-slate-400 w-4">{letter.toLowerCase()})</span>
                                <MathRenderer content={String(q[stKey] || '')} className="flex-1" />
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => updateOcrQuestion(idx, { [ansKey]: true } as Partial<ExtractedQuestion>)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                      ansVal === true ? 'bg-emerald-500 text-white' : 'bg-white border border-[#d1d5db] text-[#6b7280] hover:border-emerald-400'
                                    }`}
                                  >Đ</button>
                                  <button
                                    onClick={() => updateOcrQuestion(idx, { [ansKey]: false } as Partial<ExtractedQuestion>)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                                      ansVal === false ? 'bg-red-500 text-white' : 'bg-white border border-[#d1d5db] text-[#6b7280] hover:border-red-400'
                                    }`}
                                  >S</button>
                                </div>
                              </div>
                            );
                          })}
                          {(q.answerA === undefined || q.answerB === undefined || q.answerC === undefined || q.answerD === undefined) && (
                            <p className="text-[11px] text-red-500 font-medium">* Vui lòng chọn Đ/S cho tất cả mệnh đề</p>
                          )}
                        </div>
                      )}

                      {/* SA: answer input */}
                      {q.format === 'SHORT_ANSWER' && (
                        <div>
                          <label className="block text-[11px] font-bold text-[#0f172a] mb-1">Đáp án đúng:</label>
                          <input
                            type="text"
                            value={q.correctAnswer || ''}
                            onChange={(e) => updateOcrQuestion(idx, { correctAnswer: e.target.value })}
                            placeholder="VD: 4, 2+a, 120..."
                            className={`w-full bg-[#f8fafc] border rounded-lg px-3 py-2 text-[13px] outline-none transition-all ${
                              !q.correctAnswer ? 'border-red-300 focus:border-red-500' : 'border-[#e2e8f0] focus:border-[#059669]'
                            }`}
                          />
                          {!q.correctAnswer && (
                            <p className="text-[11px] text-red-500 font-medium mt-1">* Vui lòng nhập đáp án</p>
                          )}
                        </div>
                      )}

                    </div>
                  ))}

                  {/* Action buttons */}
                  {ocrStatus === 'done' && ocrQuestions.length > 0 && (
                    <div className="flex justify-between items-center">
                      <button
                        onClick={resetThptOcr}
                        className="px-6 py-2.5 rounded-xl border border-[#e2e8f0] text-[#64748b] font-bold text-[13px] hover:bg-slate-50"
                      >
                        Hủy & Thử lại
                      </button>
                      <button
                        onClick={handleThptSave}
                        disabled={!allAnswersFilled}
                        className="px-8 py-2.5 rounded-xl bg-[#0f172a] text-white font-bold text-[13px] shadow-lg shadow-slate-900/10 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {allAnswersFilled
                          ? `Lưu ${ocrQuestions.length} câu hỏi vào kho đề`
                          : 'Vui lòng nhập đáp án cho tất cả câu'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Saving spinner */}
              {ocrStatus === 'saving' && (
                <div className="bg-white p-12 rounded-2xl border border-[#e2e8f0] flex flex-col items-center animate-in fade-in zoom-in duration-500">
                  <Loader2 size={40} className="animate-spin text-[#059669] mb-4" />
                  <h3 className="text-[#0f172a] text-[18px] font-bold">Đang lưu vào kho đề...</h3>
                </div>
              )}

              {/* Saved success */}
              {ocrStatus === 'saved' && (
                <SuccessHero
                  stats={{ total: ocrQuestions.length, success: ocrQuestions.length }}
                  onReset={resetThptOcr}
                />
              )}

              {/* Error */}
              {ocrStatus === 'error' && (
                <div className="bg-white p-8 rounded-2xl border border-red-200 text-center animate-in fade-in duration-500">
                  <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
                  <h3 className="text-[#0f172a] text-[18px] font-bold mb-2">Đã xảy ra lỗi</h3>
                  <p className="text-[#64748b] text-[13px] mb-6">{ocrError}</p>
                  <button
                    onClick={resetThptOcr}
                    className="px-8 py-2.5 rounded-xl bg-[#0f172a] text-white font-bold text-[13px]"
                  >
                    Thử lại
                  </button>
                </div>
              )}
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
