import Link from 'next/link';
import { LandingHero } from '@/features/landing/components/LandingHero';
import { LandingNavbar } from '@/features/landing/components/LandingNavbar';
import { LandingHowItWorks } from '@/features/landing/components/LandingHowItWorks';
import { LandingFeatures } from '@/features/landing/components/LandingFeatures';
import { LandingCTA, LandingFooter } from '@/features/landing/components/LandingFooter';

const TOPICS = [
  "Đạo hàm", "Nguyên hàm & Tích phân", "Khảo sát hàm số", "Xác suất – Tổ hợp",
  "Hình học không gian", "Dãy số", "Số phức", "Giới hạn – Liên tục",
  "Hàm số mũ – Logarit", "Hình học giải tích", "Thể tích"
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f0fdf9] font-sans text-slate-900">
      <LandingNavbar />
      <LandingHero />

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Câu hỏi", value: "200+" },
            { label: "Chủ đề", value: "11" },
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

      <LandingHowItWorks />
      <LandingFeatures />

      {/* Topics Section */}
      <section id="topics" className="py-24 bg-white/50 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-[#059669] text-sm font-bold tracking-[0.2em] uppercase mb-4">Nội dung ôn thi</h3>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">11 chủ đề Toán 12</h2>
          <p className="text-slate-500 mb-16">Bao phủ toàn bộ chương trình THPT Quốc gia</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TOPICS.map((topic, i) => (
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

      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
