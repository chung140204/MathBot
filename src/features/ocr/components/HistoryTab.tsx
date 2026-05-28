'use client';

import { useState, useEffect } from 'react';
import { Upload, Loader2, FileText, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { Badge } from './SharedUI';

interface HistoryTabProps {
  apiBasePath: string;
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

export default function HistoryTab({ apiBasePath }: HistoryTabProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const res = await fetch(`${apiBasePath}/history`);
        if (!res.ok) throw new Error(`Lỗi tải lịch sử (${res.status})`);
        if (!cancelled) {
          const data = await res.json();
          setHistory(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : 'Lỗi không xác định');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [apiBasePath]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e8f0] py-20 flex flex-col items-center justify-center text-[#94a3b8]">
        <Loader2 size={32} className="animate-spin mb-4" />
        <p className="text-[13px]">Đang tải dữ liệu lịch sử...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="bg-white rounded-2xl border border-red-200 py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
          <AlertCircle size={28} />
        </div>
        <h3 className="text-[16px] font-bold text-[#0f172a] mb-1">Không thể tải lịch sử</h3>
        <p className="text-[13px] text-[#64748b] max-w-sm text-center">{fetchError}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2e8f0] py-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#94a3b8] mb-4">
          <Upload size={28} />
        </div>
        <h3 className="text-[16px] font-bold text-[#0f172a] mb-1">Chưa có lịch sử upload</h3>
        <p className="text-[13px] text-[#64748b] max-w-sm text-center">
          Các file đã upload sẽ xuất hiện tại đây. Hãy bắt đầu bằng cách upload file đầu tiên.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden animate-in fade-in duration-500">
      <div className="px-8 py-4 border-b bg-white">
        <h2 className="text-[#0f172a] text-[15px] font-bold">Lịch sử tải lên</h2>
      </div>
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
                      {h.fileName.endsWith('.pdf') ? <FileText size={16} /> : <FileSpreadsheet size={16} />}
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
    </div>
  );
}
