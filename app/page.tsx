'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  const topics = [
    "Đạo hàm", "Tích phân", "Khảo sát hàm số", "Xác suất – Tổ hợp",
    "Hình học không gian", "Dãy số", "Số phức", "Giới hạn – Liên tục",
    "Hàm số mũ – Logarit", "Hình học giải tích", "Thể tích", "Nguyên hàm"
  ];

  const features = [
    {
      title: "Kiểm tra trắc nghiệm",
      desc: "200+ câu hỏi phân loại theo chủ đề và độ khó, sát đề thi THPT Quốc gia.",
      icon: "📝"
    },
    {
      title: "AI giải bài 24/7",
      desc: "Chatbot AI giải thích từng bước, render công thức Toán với KaTeX.",
      icon: "🤖"
    },
    {
      title: "Phân tích năng lực",
      desc: "Dashboard thống kê điểm mạnh, điểm yếu và tiến trình học theo thời gian.",
      icon: "📊"
    },
    {
      title: "Lộ trình cá nhân",
      desc: "AI đề xuất nội dung ôn tập dựa trên lịch sử làm bài của từng học sinh.",
      icon: "🎯"
    },
    {
      title: "RAG chính xác",
      desc: "Tra cứu tài liệu Toán 12 nội bộ trước khi trả lời — không bịa đặt.",
      icon: "⚡"
    },
    {
      title: "Streak học tập",
      desc: "Duy trì chuỗi học tập mỗi ngày với hệ thống điểm thưởng và thành tích.",
      icon: "🔥"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f0fdf9] font-sans text-slate-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-16 h-16 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="MathBot Logo"
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-[#059669] to-[#0ea5e9] bg-clip-text text-transparent leading-tight">
                  MathBot
                </span>
                <span className="text-[10px] font-semibold whitespace-nowrap bg-gradient-to-r from-[#059669] to-[#0ea5e9] bg-clip-text text-transparent">
                  Toán không khó — chỉ cần đúng cách
                </span>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-[#059669] transition-colors">Tính năng</a>
              <a href="#topics" className="hover:text-[#059669] transition-colors">Chủ đề</a>
              <a href="#" className="hover:text-[#059669] transition-colors">Về chúng tôi</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              Đăng nhập
            </Link>
            <Link href="/register" className="px-5 py-2.5 text-sm font-bold text-white rounded-lg bg-gradient-to-r from-[#059669] to-[#0891b2] hover:shadow-lg hover:shadow-[#059669]/25 hover:-translate-y-px transition-all">
              Bắt đầu ngay
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-44 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#059669]/10 border border-[#059669]/20 text-[#059669] text-sm font-semibold mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#059669] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
            </span>
            Đột phá ôn thi đại học cùng AI
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            Chinh phục <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#059669] via-[#0891b2] to-[#6366f1]">
              Môn Toán 12
            </span>
          </h1>

          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            MathBot là trợ lý học tập AI giúp học sinh lớp 12 nắm vững kiến thức, giải quyết bài tập hóc búa và xây dựng chiến thuật thi đại học tối ưu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white rounded-xl shadow-xl shadow-[#059669]/30 flex items-center justify-center gap-2 hover:-translate-y-1 hover:shadow-[#059669]/40 transition-all group font-bold">
              Sử dụng miễn phí
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
              Đăng nhập
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Câu hỏi", value: "200+" },
            { label: "Chủ đề", value: "12" },
            { label: "AI hỗ trợ", value: "24/7" },
            { label: "Miễn phí", value: "100%" }
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 border-x border-slate-200/50 first:border-l-0 last:border-r-0">
              <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#059669] to-[#0891b2] mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-[#059669] text-sm font-bold tracking-[0.2em] uppercase mb-4">Tính năng nổi bật</h3>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Học thông minh hơn, không phải nhiều hơn</h2>
            <p className="text-slate-500">Kết hợp AI tiên tiến với phương pháp học tập cá nhân hóa</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-[#059669]/30 transition-all hover:shadow-2xl hover:shadow-[#059669]/5 group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl mb-6 group-hover:bg-[#059669]/10 transition-colors">
                  {f.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Topics Section */}
      <section id="topics" className="py-24 bg-white/50 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-[#059669] text-sm font-bold tracking-[0.2em] uppercase mb-4">Nội dung ôn thi</h3>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">11 chủ đề Toán 12</h2>
          <p className="text-slate-500 mb-16">Bao phủ toàn bộ chương trình THPT Quốc gia</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-slate-100 hover:border-[#059669]/20 transition-all hover:shadow-sm">
                <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-[#059669]' : i % 3 === 1 ? 'bg-[#0891b2]' : 'bg-[#6366f1]'}`} />
                <span className="text-sm font-semibold text-slate-700">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto relative rounded-[40px] bg-gradient-to-br from-[#059669] via-[#0891b2] to-[#6366f1] p-12 lg:p-20 overflow-hidden text-center text-white">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Sẵn sàng chinh phục Toán 12?</h2>
            <p className="text-white/80 mb-10 text-lg max-w-xl mx-auto">
              Tham gia miễn phí ngay hôm nay — không cần thẻ tín dụng
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 px-10 py-4 bg-slate-900/40 backdrop-blur-md border border-white/20 rounded-xl hover:bg-slate-900/60 transition-all font-bold">
              Bắt đầu miễn phí
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} MathBot · Hệ thống luyện thi Toán 12 tích hợp AI
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/register" className="hover:text-[#059669] transition-colors">Đăng ký</Link>
            <Link href="/login" className="hover:text-[#059669] transition-colors">Đăng nhập</Link>
            <a href="#features" className="hover:text-[#059669] transition-colors">Tính năng</a>
            <a href="#topics" className="hover:text-[#059669] transition-colors">Chủ đề</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
