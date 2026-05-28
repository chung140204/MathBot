'use client';

import MathRenderer from '@/shared/components/MathRenderer';
import { AlertCircle } from 'lucide-react';
import { Badge } from './SharedUI';

export interface ValidationRow {
  id: number;
  content: string;
  status: 'OK' | 'ERROR' | 'DUP';
  message: string;
}

export interface ValidationData {
  total: number;
  valid: number;
  errorCount: number;
  dupCount: number;
  rows: ValidationRow[];
}

interface ExcelValidationResultsProps {
  validationData: ValidationData;
  onBack: () => void;
  onUpload: () => void;
}

export function ExcelValidationResults({ validationData, onBack, onUpload }: ExcelValidationResultsProps) {
  return (
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
                  row.status === 'OK' ? 'border-l-[#059669]' : row.status === 'ERROR' ? 'border-l-[#ef4444]' : 'border-l-[#f59e0b]'
                }`}>
                  <td className="px-6 py-4 text-center text-[#94a3b8] font-mono">{row.id}</td>
                  <td className="px-6 py-4 font-medium text-[#0f172a] max-w-md">
                    <MathRenderer content={row.content} className="line-clamp-2 text-[12px]" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Badge variant={row.status === 'OK' ? 'green' : row.status === 'ERROR' ? 'red' : 'amber'}>{row.status}</Badge>
                  </td>
                  <td className={`px-6 py-4 ${row.status === 'ERROR' ? 'text-red-500' : row.status === 'OK' ? 'text-green-600' : 'text-slate-500'}`}>
                    {row.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <p className="text-[11px] text-[#94a3b8] italic">* Các hàng lỗi (ERROR) và trùng lặp (DUP) sẽ bị bỏ qua khi lưu.</p>
        <div className="flex gap-3">
          <button onClick={onBack} className="px-6 py-2.5 rounded-xl border border-[#e2e8f0] text-[#64748b] font-bold text-[13px] hover:bg-slate-50">Sửa lại</button>
          <button onClick={onUpload} className="px-8 py-2.5 rounded-xl bg-[#0f172a] text-white font-bold text-[13px] shadow-lg shadow-slate-900/10">
            Lưu {validationData.valid} bản ghi
          </button>
        </div>
      </div>
    </div>
  );
}
