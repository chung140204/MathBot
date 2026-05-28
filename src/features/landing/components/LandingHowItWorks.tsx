import Link from 'next/link';

const STEPS = [
  {
    step: '01', title: 'Đăng ký miễn phí', color: '#059669',
    desc: 'Tạo tài khoản trong 30 giây với email. Không cần thẻ tín dụng, không giới hạn thời gian.',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
  {
    step: '02', title: 'Chọn chủ đề & luyện tập', color: '#0891b2',
    desc: 'Chọn 1 trong 11 chủ đề Toán 12. Làm bài trắc nghiệm hoặc hỏi AI giải thích từng bước.',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  },
  {
    step: '03', title: 'AI phân tích & cải thiện', color: '#6366f1',
    desc: 'Dashboard tự động chỉ ra điểm yếu. AI đề xuất bài ôn tập phù hợp với năng lực của bạn.',
    icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-[#059669] text-sm font-bold tracking-[0.2em] uppercase mb-4">Đơn giản & hiệu quả</h3>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Bắt đầu chỉ trong 3 bước</h2>
          <p className="text-slate-500">Không cần cài đặt, không cần thẻ tín dụng</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-10 left-[calc(33%+1rem)] right-[calc(33%+1rem)] h-px bg-gradient-to-r from-[#059669]/30 via-[#0891b2]/30 to-[#6366f1]/30" />
          {STEPS.map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center relative">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg" style={{ backgroundColor: `${item.color}15`, color: item.color, border: `1.5px solid ${item.color}25` }}>
                {item.icon}
              </div>
              <span className="text-[11px] font-black uppercase tracking-widest mb-2" style={{ color: item.color }}>Bước {item.step}</span>
              <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white font-bold rounded-xl shadow-lg shadow-[#059669]/25 hover:-translate-y-0.5 hover:shadow-[#059669]/35 transition-all">
            Bắt đầu ngay — miễn phí
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
