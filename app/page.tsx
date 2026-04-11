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
      icon: (
        <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: "AI giải bài 24/7",
      desc: "Chatbot AI giải thích từng bước, render công thức Toán với KaTeX.",
      icon: (
        <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      title: "Phân tích năng lực",
      desc: "Dashboard thống kê điểm mạnh, điểm yếu và tiến trình học theo thời gian.",
      icon: (
        <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      title: "Lộ trình cá nhân",
      desc: "AI đề xuất nội dung ôn tập dựa trên lịch sử làm bài của từng học sinh.",
      icon: (
        <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      title: "RAG chính xác",
      desc: "Tra cứu tài liệu Toán 12 nội bộ trước khi trả lời — không bịa đặt.",
      icon: (
        <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Streak học tập",
      desc: "Duy trì chuỗi học tập mỗi ngày với hệ thống điểm thưởng và thành tích.",
      icon: (
        <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
    },
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
              <a href="#how-it-works" className="hover:text-[#059669] transition-colors">Cách dùng</a>
              <a href="#features" className="hover:text-[#059669] transition-colors">Tính năng</a>
              <a href="#topics" className="hover:text-[#059669] transition-colors">Chủ đề</a>
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

          {/* Chat preview card */}
          <div className="mt-16 max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden">
              {/* Card header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#059669] to-[#0891b2] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-slate-700">MathBot AI</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d1fae5] text-[#059669] font-bold">● Trực tuyến</span>
              </div>
              {/* Messages */}
              <div className="p-4 space-y-3">
                <div className="flex justify-end">
                  <div className="max-w-[75%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#059669] to-[#0891b2] text-white text-sm font-medium shadow-sm">
                    Tính đạo hàm của f(x) = x² · sin(x)
                  </div>
                </div>
                <div className="flex gap-2.5 items-end">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#059669] to-[#0891b2] flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold">AI</div>
                  <div className="max-w-[80%] space-y-1.5">
                    <div className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 text-sm text-slate-700">
                      Áp dụng <span className="font-bold text-[#059669]">quy tắc tích</span>: (uv)&apos; = u&apos;v + uv&apos;
                    </div>
                    <div className="px-3.5 py-2 rounded-xl bg-[#f0fdf9] border-l-2 border-[#059669] text-sm font-mono text-[#059669] font-semibold">
                      f&apos;(x) = 2x·sin(x) + x²·cos(x)
                    </div>
                  </div>
                </div>
                {/* Typing indicator */}
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

      {/* How it works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-[#059669] text-sm font-bold tracking-[0.2em] uppercase mb-4">Đơn giản & hiệu quả</h3>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Bắt đầu chỉ trong 3 bước</h2>
            <p className="text-slate-500">Không cần cài đặt, không cần thẻ tín dụng</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting lines (desktop) */}
            <div className="hidden md:block absolute top-10 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-[#059669]/30 via-[#0891b2]/30 to-[#6366f1]/30" />

            {[
              {
                step: '01',
                title: 'Đăng ký miễn phí',
                desc: 'Tạo tài khoản trong 30 giây với email. Không cần thẻ tín dụng, không giới hạn thời gian.',
                color: '#059669',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Chọn chủ đề & luyện tập',
                desc: 'Chọn 1 trong 12 chủ đề Toán 12. Làm bài trắc nghiệm hoặc hỏi AI giải thích từng bước.',
                color: '#0891b2',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'AI phân tích & cải thiện',
                desc: 'Dashboard tự động chỉ ra điểm yếu. AI đề xuất bài ôn tập phù hợp với năng lực của bạn.',
                color: '#6366f1',
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center relative">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                  style={{ backgroundColor: `${item.color}15`, color: item.color, border: `1.5px solid ${item.color}25` }}
                >
                  {item.icon}
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: item.color }}>
                  Bước {item.step}
                </span>
                <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white font-bold rounded-xl shadow-lg shadow-[#059669]/25 hover:-translate-y-0.5 hover:shadow-[#059669]/35 transition-all">
              Bắt đầu ngay — miễn phí
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
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
                <div className="w-12 h-12 rounded-xl bg-[#f0fdf9] flex items-center justify-center mb-6 group-hover:bg-[#059669]/10 transition-colors">
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
          <h2 className="text-4xl font-bold text-slate-900 mb-4">12 chủ đề Toán 12</h2>
          <p className="text-slate-500 mb-16">Bao phủ toàn bộ chương trình THPT Quốc gia</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-slate-100 hover:border-[#059669]/20 transition-all hover:shadow-sm">
                <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-[#059669]' : i % 3 === 1 ? 'bg-[#0891b2]' : 'bg-[#6366f1]'}`} />
                <span className="text-sm font-semibold text-slate-700">{topic}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/register" className="inline-flex items-center gap-2 text-sm font-bold text-[#059669] hover:text-[#047857] transition-colors group">
              Bắt đầu ôn tập tất cả chủ đề
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
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
      <footer className="bg-slate-900 text-slate-400 px-4 pt-16 pb-8">
        <div className="max-w-7xl mx-auto">

          {/* Main grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">

            {/* Brand column */}
            <div className="md:col-span-2">
              <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image src="/logo.png" alt="MathBot Logo" fill sizes="40px" className="object-contain mix-blend-screen" />
                </div>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#34d399] to-[#38bdf8] bg-clip-text text-transparent">
                  MathBot
                </span>
              </Link>
              <p className="text-sm leading-relaxed text-slate-400 max-w-xs mb-6">
                Nền tảng luyện thi Toán 12 tích hợp AI — giúp học sinh hiểu sâu, nhớ lâu và tự tin bước vào kỳ thi đại học.
              </p>
              {/* Mini stats */}
              <div className="flex items-center gap-6">
                {[
                  { value: '200+', label: 'Câu hỏi' },
                  { value: '12', label: 'Chủ đề' },
                  { value: '24/7', label: 'AI hỗ trợ' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-base font-black text-white">{s.value}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav columns */}
            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Sản phẩm</p>
              <ul className="space-y-2.5 text-sm">
                {[
                  { href: '/register', label: 'Bắt đầu miễn phí' },
                  { href: '#how-it-works', label: 'Cách hoạt động' },
                  { href: '#features', label: 'Tính năng' },
                  { href: '#topics', label: '12 chủ đề Toán 12' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-[#34d399] transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Tài khoản</p>
              <ul className="space-y-2.5 text-sm mb-8">
                {[
                  { href: '/register', label: 'Đăng ký' },
                  { href: '/login', label: 'Đăng nhập' },
                  { href: '/dashboard', label: 'Dashboard' },
                  { href: '/chat', label: 'AI Chat' },
                ].map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="hover:text-[#34d399] transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>

              <p className="text-[11px] font-black uppercase tracking-widest text-slate-500 mb-4">Công nghệ</p>
              <ul className="space-y-2 text-sm">
                {['Next.js 14', 'GPT-4o + RAG', 'KaTeX', 'pgvector'].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#34d399]" />
                    <span className="text-slate-500">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <p>© {new Date().getFullYear()} MathBot. Được xây dựng cho học sinh Việt Nam.</p>
            <p className="flex items-center gap-1.5">
              Làm bằng
              <svg className="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              cho kỳ thi THPT Quốc gia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
