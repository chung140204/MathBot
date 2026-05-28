const FEATURES = [
  { title: 'Kiểm tra trắc nghiệm', desc: '200+ câu hỏi phân loại theo chủ đề và độ khó, sát đề thi THPT Quốc gia.', icon: <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
  { title: 'AI giải bài 24/7', desc: 'Chatbot AI giải thích từng bước, render công thức Toán với KaTeX.', icon: <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg> },
  { title: 'Phân tích năng lực', desc: 'Dashboard thống kê điểm mạnh, điểm yếu và tiến trình học theo thời gian.', icon: <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
  { title: 'Lộ trình cá nhân', desc: 'AI đề xuất nội dung ôn tập dựa trên lịch sử làm bài của từng học sinh.', icon: <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg> },
  { title: 'RAG chính xác', desc: 'Tra cứu tài liệu Toán 12 nội bộ trước khi trả lời — không bịa đặt.', icon: <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
  { title: 'Streak học tập', desc: 'Duy trì chuỗi học tập mỗi ngày với hệ thống điểm thưởng và thành tích.', icon: <svg className="w-6 h-6 text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg> },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-[#059669] text-sm font-bold tracking-[0.2em] uppercase mb-4">Tính năng nổi bật</h3>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Học thông minh hơn, không phải nhiều hơn</h2>
          <p className="text-slate-500">Kết hợp AI tiên tiến với phương pháp học tập cá nhân hóa</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-[#059669]/30 transition-all hover:shadow-2xl hover:shadow-[#059669]/5 group">
              <div className="w-12 h-12 rounded-xl bg-[#f0fdf9] flex items-center justify-center mb-6 group-hover:bg-[#059669]/10 transition-colors">{f.icon}</div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
