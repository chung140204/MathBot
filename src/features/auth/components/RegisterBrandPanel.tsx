import Link from 'next/link';
import Image from 'next/image';

export function RegisterBrandPanel() {
  return (
    <div className="relative overflow-hidden flex flex-col justify-between w-full lg:w-[42%] p-10 lg:p-14 bg-gradient-to-br from-[#059669] via-[#0891b2] to-[#6366f1] text-white">
      <div className="absolute top-[-10%] left-[-10%] w-[100%] h-[100%] rounded-full bg-white/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[80%] h-[80%] rounded-full bg-[#0891b2]/30 blur-[130px] pointer-events-none" />

      <div className="relative z-10">
        <Link href="/" className="inline-flex flex-col items-start mb-12 group">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative w-20 h-20 drop-shadow-2xl group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo.png" alt="MathBot Logo" fill sizes="80px" className="object-contain mix-blend-screen" priority />
            </div>
            <div>
              <p className="text-4xl font-black tracking-tight text-white leading-none">MathBot</p>
              <p className="text-sm font-semibold text-white/70 mt-1">Toán không khó — chỉ cần đúng cách</p>
            </div>
          </div>
        </Link>

        <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6 tracking-tight">
          Chinh phục<br /><span className="text-white drop-shadow-sm">mọi kỳ thi</span><br /><span className="text-white/60">Toán học</span>
        </h1>
        <p className="text-white/75 text-base leading-relaxed mb-12 font-medium max-w-xs">
          AI giải thích từng bước, phân tích điểm yếu và đề xuất lộ trình ôn tập cá nhân hóa cho bạn.
        </p>

        <div className="space-y-6">
          {[
            { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, title: 'Giải đáp bài tập tức thì', desc: 'Chụp ảnh hoặc nhập đề, AI phản hồi sau 3s' },
            { icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>, title: 'Luyện tập mục tiêu', desc: 'Công nghệ AI tăng 2-3 điểm thi thử' },
          ].map((f, i) => (
            <div key={i} className="flex items-start gap-5 group/item cursor-default">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center transition-all group-hover/item:bg-white/20 group-hover/item:scale-105 ring-1 ring-white/20">
                {f.icon}
              </div>
              <div>
                <h4 className="font-bold text-white group-hover/item:text-[#f0fdf9] transition-colors uppercase text-xs tracking-widest mb-1">{f.title}</h4>
                <p className="text-white/70 text-sm font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-8">
        {[{ value: '200+', label: 'Câu hỏi' }, { value: '12', label: 'Chủ đề' }, { value: '100%', label: 'Miễn phí' }].map((s) => (
          <div key={s.label} className="text-center">
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/50">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
