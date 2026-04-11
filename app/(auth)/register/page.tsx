'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface ApiError {
  error: string;
  code: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const name = `${firstName} ${lastName}`.trim();

    console.log('Registering with:', { name, email, password });
    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        router.push('/login?registered=1');
        return;
      }

      const data = (await res.json()) as ApiError;
      switch (data.code) {
        case 'AUTH_EMAIL_TAKEN':
          setError('Email này đã được sử dụng bởi tài khoản khác.');
          break;
        case 'VALIDATION_ERROR':
          setError('Vui lòng kiểm tra lại thông tin nhập vào.');
          break;
        default:
          setError(data.error ?? 'Đăng ký không thành công. Vui lòng thử lại.');
      }
    } catch {
      setError('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[1100px] min-h-[750px] flex flex-col lg:flex-row overflow-hidden lg:rounded-[2.5rem] lg:shadow-[0_22px_70px_4px_rgba(0,0,0,0.12)] bg-[#f0fdf9]/60 backdrop-blur-2xl border border-white/40 font-sans">
      {/* LEFT PANEL: Branding Section mirroring Landing Page */}
      <div className="relative overflow-hidden flex flex-col justify-between w-full lg:w-[42%] p-10 lg:p-14 bg-gradient-to-br from-[#059669] via-[#0891b2] to-[#6366f1] text-white">
        {/* Decorative Glowing Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[100%] h-[100%] rounded-full bg-white/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[80%] h-[80%] rounded-full bg-[#0891b2]/30 blur-[130px] pointer-events-none" />
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-24 group">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg shadow-inner ring-1 ring-white/30 transition-transform group-hover:scale-110">
              M
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">MathBot</span>
          </Link>

          <h1 className="text-5xl font-extrabold leading-[1.1] mb-8 tracking-tight">
            Chinh phục <br />
            <span className="text-[#f0fdf9]">mọi kỳ thi Toán</span>
          </h1>
          <p className="text-[#f0fdf9]/80 text-lg leading-relaxed mb-14 font-medium max-w-sm">
            AI giải thích từng bước, phân tích điểm yếu và đề xuất lộ trình ôn tập cá nhân hóa cho bạn.
          </p>

          <div className="space-y-6">
            {[
              { 
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ), 
                title: 'Giải đáp bài tập tức thì',
                desc: 'Chụp ảnh hoặc nhập đề, AI phản hồi sau 3s'
              },
              { 
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ), 
                title: 'Luyện tập mục tiêu', 
                desc: 'Công nghệ AI tăng 2-3 điểm thi thử'
              },
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

        <div className="flex items-center gap-10 opacity-70">
          <div><p className="text-2xl font-black italic">1.2K+</p><p className="text-[10px] uppercase font-bold tracking-widest text-[#f0fdf9]/80">Học sinh</p></div>
          <div><p className="text-2xl font-black italic">200+</p><p className="text-[10px] uppercase font-bold tracking-widest text-[#f0fdf9]/80">Câu hỏi</p></div>
        </div>
      </div>

      {/* RIGHT PANEL: Form Section matching Landing Page Aesthetic */}
      <div className="flex-1 p-8 lg:p-14 bg-white/95 flex flex-col justify-center">
        <div className="max-w-[420px] mx-auto w-full">
          {/* Enhanced Tab Toggle with App Main Green */}
          <div className="flex p-1.5 bg-[#f0fdf9] rounded-2xl mb-12 ring-1 ring-[#059669]/10 shadow-inner">
            <Link href="/login" className="flex-1 py-3 text-gray-400 font-bold rounded-xl hover:text-[#059669] transition-all flex items-center justify-center gap-2">
              Đăng nhập
            </Link>
            <div className="flex-1 py-3 bg-white text-[#059669] font-bold rounded-xl shadow-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
              Đăng ký
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Tạo tài khoản mới</h2>
            <p className="text-gray-400 font-medium">Bắt đầu hành trình chinh phục MathBot</p>
          </div>

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 animate-shake">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2 ml-1">Họ</label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-5 py-4 bg-[#f0fdf9]/30 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#059669]/10 focus:border-[#059669] focus:bg-white transition-all duration-300 placeholder:text-gray-300 shadow-sm"
                />
              </div>
              <div>
                <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2 ml-1">Tên</label>
                <input
                  type="text"
                  required
                  placeholder="Thành"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-5 py-4 bg-[#f0fdf9]/30 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#059669]/10 focus:border-[#059669] focus:bg-white transition-all duration-300 placeholder:text-gray-300 shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2 ml-1">Địa chỉ Email</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-[#f0fdf9]/30 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#059669]/10 focus:border-[#059669] focus:bg-white transition-all duration-300 placeholder:text-gray-300"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#059669] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2 ml-1">Mật khẩu bảo mật</label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  placeholder="Tối thiểu 8 ký tự"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 bg-[#f0fdf9]/30 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#059669]/10 focus:border-[#059669] focus:bg-white transition-all duration-300 placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#0891b2] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white font-bold rounded-2xl shadow-[0_10px_20px_-5px_rgba(5,150,105,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(5,150,105,0.6)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0 mt-4"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-700 -translate-x-full" />
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <>
                  <span>Tạo tài khoản học ngay</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <span className="relative bg-white px-5 text-[10px] font-black uppercase text-gray-300 tracking-widest">Đăng ký bằng</span>
            </div>

            <button
              type="button"
              className="w-full py-4 bg-white border border-gray-200 flex items-center justify-center gap-4 rounded-2xl font-bold text-gray-700 hover:bg-[#f0fdf9]/50 hover:border-[#059669]/30 transition-all duration-200"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5 shadow-sm rounded-full" />
              Tiếp tục với Google
            </button>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-gray-400">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-extrabold text-[#0891b2] hover:text-[#059669] transition-colors">Đăng nhập ngay</Link>
          </p>

          <p className="mt-8 text-center text-[11px] text-gray-300 leading-relaxed uppercase tracking-wider font-bold">
            Bằng cách đăng ký, bạn đồng ý với <Link href="#" className="text-gray-400 hover:underline">Điều khoản</Link> và <Link href="#" className="text-gray-400 hover:underline">Chính sách bảo mật</Link>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
