'use client';

import Link from 'next/link';

interface TargetProgressProps {
  /** Độ chính xác trung bình, thang 0–100 */
  averageScore: number;
  /** Điểm cao nhất, thang 0–100 */
  bestScore: number;
  /** Điểm mục tiêu theo thang 0–10 (chuỗi), hoặc null nếu chưa đặt */
  targetScore: string | null;
}

function barColor(pct: number): string {
  if (pct >= 70) return '#059669';
  if (pct >= 40) return '#d97706';
  return '#dc2626';
}

export function TargetProgress({ averageScore, bestScore, targetScore }: TargetProgressProps) {
  const parsed = targetScore != null ? parseFloat(targetScore) : NaN;
  const hasTarget = !Number.isNaN(parsed);

  // ── Chưa đặt mục tiêu → CTA ──
  if (!hasTarget) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <p className="text-sm font-black text-gray-900">Đặt mục tiêu điểm số</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Đặt mục tiêu điểm thi để theo dõi tiến độ của bạn theo thời gian.
            </p>
          </div>
        </div>
        <Link
          href="/settings"
          className="flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white text-xs font-black rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          Đặt mục tiêu ngay
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    );
  }

  // targetScore (0–10) → phần trăm (0–100)
  const targetPct = Math.min(100, Math.max(0, parsed * 10));
  const avgOnTen = (averageScore / 10).toFixed(1);
  const achieved = targetPct > 0 ? Math.min(100, Math.round((averageScore / targetPct) * 100)) : 0;
  const reached = averageScore >= targetPct;
  const gapPts = Math.max(0, (targetPct - averageScore) / 10);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <h2 className="text-sm font-black text-gray-800">Tiến độ mục tiêu</h2>
        </div>
        <Link href="/settings" className="text-xs font-bold text-[#059669] hover:text-[#0891b2] transition-colors">
          Đổi mục tiêu
        </Link>
      </div>

      <div className="flex items-end justify-between gap-2 mb-2">
        <p className="text-xs font-semibold text-gray-500">
          Điểm TB hiện tại: <span className="font-black text-gray-800">{avgOnTen}</span>
          {' / '}Mục tiêu: <span className="font-black text-[#059669]">{targetScore}</span>
        </p>
        <span className="text-sm font-black" style={{ color: barColor(achieved) }}>{achieved}%</span>
      </div>

      {/* Thanh tiến độ: averageScore tiến tới targetPct */}
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${achieved}%`, backgroundColor: barColor(achieved) }}
        />
      </div>

      <p className="text-xs font-semibold mt-2.5">
        {reached ? (
          <span className="text-[#059669]">🎉 Bạn đã đạt mục tiêu! Tiếp tục duy trì phong độ.</span>
        ) : (
          <span className="text-gray-500">
            Còn <span className="font-black text-amber-600">{gapPts.toFixed(1)} điểm</span> nữa để đạt mục tiêu. Cố lên!
          </span>
        )}
      </p>
    </div>
  );
}
