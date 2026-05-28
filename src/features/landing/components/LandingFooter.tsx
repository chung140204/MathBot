import Link from 'next/link';
import Image from 'next/image';

export function LandingCTA() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto relative rounded-[40px] bg-gradient-to-br from-[#059669] via-[#0891b2] to-[#6366f1] p-12 lg:p-20 overflow-hidden text-center text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Sẵn sàng chinh phục Toán 12?</h2>
          <p className="text-white/80 mb-10 text-lg max-w-xl mx-auto">Tham gia miễn phí ngay hôm nay — không cần thẻ tín dụng</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-xl hover:bg-slate-900/60 transition-all font-bold">
            Bắt đầu miễn phí <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 px-4 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image src="/logo.png" alt="MathBot Logo" fill sizes="40px" className="object-contain mix-blend-screen" />
              </div>
              <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#34d399] to-[#38bdf8] bg-clip-text text-transparent">MathBot</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs mb-6">Nền tảng luyện thi Toán 12 tích hợp AI — giúp học sinh hiểu sâu, nhớ lâu và tự tin bước vào kỳ thi đại học.</p>
            <div className="flex items-center gap-6">
              {[{ value: '200+', label: 'Câu hỏi' }, { value: '11', label: 'Chủ đề' }, { value: '24/7', label: 'AI hỗ trợ' }].map(s => (
                <div key={s.label}><p className="text-base font-black text-white">{s.value}</p><p className="text-[11px] text-slate-500 font-medium">{s.label}</p></div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Sản phẩm</p>
            <ul className="space-y-2.5 text-sm">
              {[{ href: '/register', label: 'Bắt đầu miễn phí' }, { href: '#how-it-works', label: 'Cách hoạt động' }, { href: '#features', label: 'Tính năng' }, { href: '#topics', label: '11 chủ đề Toán 12' }].map(l => (
                <li key={l.label}><Link href={l.href} className="hover:text-[#34d399] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Tài khoản</p>
            <ul className="space-y-2.5 text-sm mb-8">
              {[{ href: '/register', label: 'Đăng ký' }, { href: '/login', label: 'Đăng nhập' }, { href: '/dashboard', label: 'Dashboard' }, { href: '/chat', label: 'AI Chat' }].map(l => (
                <li key={l.label}><Link href={l.href} className="hover:text-[#34d399] transition-colors">{l.label}</Link></li>
              ))}
            </ul>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Công nghệ</p>
            <ul className="space-y-2 text-sm">
              {['Next.js 14', 'GPT-4o + RAG', 'KaTeX', 'pgvector'].map(t => (
                <li key={t} className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#34d399]" /><span className="text-slate-500">{t}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} MathBot. Được xây dựng cho học sinh Việt Nam.</p>
          <p className="flex items-center gap-1.5">Làm bằng<svg className="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>cho kỳ thi THPT Quốc gia</p>
        </div>
      </div>
    </footer>
  );
}
