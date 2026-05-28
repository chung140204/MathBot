import Link from 'next/link';
import Image from 'next/image';

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-16 h-16 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo.png" alt="MathBot Logo" fill sizes="48px" className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#059669] to-[#0ea5e9] bg-clip-text text-transparent leading-tight">MathBot</span>
              <span className="text-[10px] font-semibold whitespace-nowrap bg-gradient-to-r from-[#059669] to-[#0ea5e9] bg-clip-text text-transparent">Toán không khó — chỉ cần đúng cách</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-[#059669] transition-colors">Cách dùng</a>
            <a href="#features" className="hover:text-[#059669] transition-colors">Tính năng</a>
            <a href="#topics" className="hover:text-[#059669] transition-colors">Chủ đề</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">Đăng nhập</Link>
          <Link href="/register" className="px-5 py-2.5 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-[#059669] to-[#0891b2] hover:shadow-lg hover:shadow-[#059669]/25 hover:-translate-y-px transition-all">Bắt đầu ngay</Link>
        </div>
      </div>
    </nav>
  );
}
