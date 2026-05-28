'use client';
import { Loader2, Wand2 } from 'lucide-react';

const TOPICS: Record<string, string> = {
  DERIVATIVES: 'Đạo hàm', INTEGRALS: 'Tích phân', FUNCTIONS: 'Hàm số', LIMITS: 'Giới hạn',
  COMPLEX_NUMBERS: 'Số phức', PROBABILITY: 'Xác suất', SEQUENCES: 'Dãy số',
  EXPONENTIAL_LOG: 'Mũ - Logarit', VOLUME: 'Thể tích', ANALYTIC_GEOMETRY: 'HH giải tích', SOLID_GEOMETRY: 'HH không gian',
};
const DIFFICULTIES: Record<string, string> = { RECOGNITION: 'Nhận biết', COMPREHENSION: 'Thông hiểu', APPLICATION: 'Vận dụng', ADVANCED: 'Vận dụng cao' };
const FORMATS: Record<string, string> = { MULTIPLE_CHOICE: 'Trắc nghiệm', TRUE_FALSE: 'Đúng/Sai', SHORT_ANSWER: 'Trả lời ngắn' };

interface GenStats { byTopic: Record<string, number>; byDifficulty: Record<string, number>; byFormat: Record<string, number>; total: number; poolSize: number; }

interface AutoGeneratePanelProps {
  genMode: 'thpt' | 'custom';
  genSource: 'all' | 'mine' | 'system';
  genTopics: string[];
  genTotal: number;
  genWeights: { RECOGNITION: number; COMPREHENSION: number; APPLICATION: number; ADVANCED: number };
  generating: boolean;
  genError: string;
  genStats: GenStats | null;
  weightSum: number;
  setGenMode: (mode: 'thpt' | 'custom') => void;
  setGenSource: (source: 'all' | 'mine' | 'system') => void;
  toggleGenTopic: (topic: string) => void;
  setGenTotal: (total: number) => void;
  setGenWeights: (fn: (prev: { RECOGNITION: number; COMPREHENSION: number; APPLICATION: number; ADVANCED: number }) => { RECOGNITION: number; COMPREHENSION: number; APPLICATION: number; ADVANCED: number }) => void;
  handleGenerate: () => void;
}

export function AutoGeneratePanel({ genMode, genSource, genTopics, genTotal, genWeights, generating, genError, genStats, weightSum, setGenMode, setGenSource, toggleGenTopic, setGenTotal, setGenWeights, handleGenerate }: AutoGeneratePanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-5">
      <h2 className="font-semibold text-gray-900">Cấu hình tạo tự động</h2>

      <div className="flex gap-2">
        <button onClick={() => setGenMode('thpt')} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition ${genMode === 'thpt' ? 'bg-purple-50 border-purple-200 text-purple-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Đề thi THPT</button>
        <button onClick={() => setGenMode('custom')} className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border transition ${genMode === 'custom' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>Tùy chỉnh</button>
      </div>

      {genMode === 'thpt' && (
        <div className="bg-purple-50 rounded-lg p-3 text-xs text-purple-700 space-y-1">
          <p className="font-semibold">Cấu trúc đề THPT 2025:</p>
          <p>12 Trắc nghiệm (4 NB + 4 TH + 3 VD + 1 VDC)</p>
          <p>4 Đúng/Sai (1 NB + 1 TH + 1 VD + 1 VDC)</p>
          <p>6 Trả lời ngắn (2 NB + 2 TH + 1 VD + 1 VDC)</p>
          <p className="font-semibold mt-1">Tổng: 22 câu — 90 phút</p>
        </div>
      )}

      {genMode === 'custom' && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">Số câu hỏi</label>
          <div className="flex gap-2">
            {[10, 20, 30, 50].map(n => (
              <button key={n} onClick={() => setGenTotal(n)} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition ${genTotal === n ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>{n}</button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nguồn câu hỏi</label>
        <select value={genSource} onChange={e => setGenSource(e.target.value as 'all' | 'mine' | 'system')} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả (của tôi + hệ thống)</option>
          <option value="mine">Chỉ câu hỏi của tôi</option>
          <option value="system">Chỉ ngân hàng hệ thống</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Chủ đề {genTopics.length > 0 ? `(${genTopics.length})` : '(tất cả)'}</label>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(TOPICS).map(([k, v]) => (
            <button key={k} onClick={() => toggleGenTopic(k)} className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${genTopics.includes(k) ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>{v}</button>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-1">Để trống = lấy tất cả chủ đề</p>
      </div>

      {genMode === 'custom' && (
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1.5">
            Phân bổ mức độ <span className={weightSum === 100 ? 'text-green-600' : 'text-red-500'}>({weightSum}%)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(genWeights) as [string, number][]).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-24">{DIFFICULTIES[k]}</span>
                <input type="number" value={v} min={0} max={100}
                  onChange={e => setGenWeights(prev => ({ ...prev, [k]: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) }))}
                  className="w-16 px-2 py-1 border border-gray-200 rounded text-sm text-center" />
                <span className="text-xs text-gray-400">%</span>
              </div>
            ))}
          </div>
          {weightSum !== 100 && <p className="text-xs text-red-500 mt-1">Tổng phải bằng 100%</p>}
        </div>
      )}

      <button onClick={handleGenerate} disabled={generating || (genMode === 'custom' && weightSum !== 100)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 text-sm font-semibold disabled:opacity-50 transition shadow-sm">
        {generating ? <><Loader2 size={16} className="animate-spin" /> Đang tạo...</> : <><Wand2 size={16} /> Tạo đề</>}
      </button>

      {genError && <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{genError}</p>}

      {genStats && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
          <p className="font-semibold text-gray-700">Kết quả: {genStats.total} câu (từ {genStats.poolSize} câu khả dụng)</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-gray-500 font-medium">Mức độ:</span>
            {Object.entries(genStats.byDifficulty).map(([k, v]) => <span key={k} className="text-gray-600">{DIFFICULTIES[k] || k}: <b>{v}</b></span>)}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="text-gray-500 font-medium">Dạng:</span>
            {Object.entries(genStats.byFormat).map(([k, v]) => <span key={k} className="text-gray-600">{FORMATS[k] || k}: <b>{v}</b></span>)}
          </div>
        </div>
      )}
    </div>
  );
}
