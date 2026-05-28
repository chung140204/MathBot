import Link from 'next/link';

export function LandingHero() {
  return (
    <section className="pt-44 pb-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#059669]/10 border border-[#059669]/20 text-[#059669] text-sm font-semibold mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]" />
          </span>
          Đột phá ôn thi đại học cùng AI
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
          Chinh phục <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#059669] via-[#0891b2] to-[#6366f1]">Môn Toán 12</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          MathBot là trợ lý học tập AI giúp học sinh lớp 12 nắm vững kiến thức, giải quyết bài tập hóc búa và xây dựng chiến thuật thi đại học tối ưu.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white rounded-xl shadow-xl shadow-[#059669]/30 flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[#059669]/40 transition-all group font-bold">
            Sử dụng miễn phí <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">Đăng nhập</Link>
        </div>
        {/* Chat preview card */}
        <div className="mt-16 max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#059669] to-[#0891b2] flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                </div>
                <span className="text-xs font-bold text-slate-700">MathBot AI</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#059669] font-bold">● Trực tuyến</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-end"><div className="max-w-[75%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#059669] to-[#0891b2] text-white text-sm font-medium shadow-sm">Tính đạo hàm của f(x) = x² · sin(x)</div></div>
              <div className="flex gap-2.5 items-end">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#059669] to-[#0891b2] flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">AI</div>
                <div className="max-w-[80%] space-y-1.5">
                  <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 text-sm text-slate-700">Áp dụng <span className="font-bold text-[#059669]">quy tắc tích</span>: (uv)&apos; = u&apos;v + uv&apos;</div>
                  <div className="px-3.5 py-2 rounded-xl bg-[#f0fdf9] border-l-2 border-[#059669] text-sm font-mono text-[#059669] font-semibold">f&apos;(x) = 2x·sin(x) + x²·cos(x)</div>
                </div>
              </div>
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#059669] to-[#0891b2] flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">AI</div>
                <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-slate-400 mt-3 font-medium">Xem trước — AI giải toán từng bước</p>
        </div>
      </div>
    </section>
  );
}
