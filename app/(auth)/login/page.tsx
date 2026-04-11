'use client';

import { useState, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Email hoặc mật khẩu không chính xác.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[1100px] min-h-[750px] flex flex-col lg:flex-row overflow-hidden lg:rounded-[2.5rem] lg:shadow-[0_22px_70px_4px_rgba(0,0,0,0.12)] bg-[#f0fdf9]/60 backdrop-blur-2xl border border-white/40 font-sans">
      {/* LEFT PANEL: Branding Section with Main Colors */}
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
            Nâng tầm <br />
            <span className="text-[#f0fdf9]">trí tuệ Toán học</span>
          </h1>
          <p className="text-[#f0fdf9]/80 text-lg leading-relaxed mb-14 font-medium max-w-sm">
            Trải nghiệm nền tảng học tập AI thế hệ mới, tối ưu hóa mọi công thức và bài toán dành riêng cho bạn.
          </p>

          <div className="space-y-6">
            {[
              { 
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ), 
                title: 'Thư viện câu hỏi khổng lồ',
                desc: '200+ câu hỏi sát đề thi THPT Quốc gia'
              },
              { 
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                ), 
                title: 'Hỗ trợ AI tức thì', 
                desc: 'Giải đáp thắc mắc bài tập 24/7'
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
          <div><p className="text-2xl font-black italic">11</p><p className="text-[10px] uppercase font-bold tracking-widest text-[#f0fdf9]/80">Chủ đề</p></div>
        </div>
      </div>

      {/* RIGHT PANEL: Form Section matching Landing Page Aesthetic */}
      <div className="flex-1 p-8 lg:p-14 bg-white/95 flex flex-col justify-center">
        <div className="max-w-[420px] mx-auto w-full">
          {/* Enhanced Tab Toggle with App Main Green */}
          <div className="flex p-1.5 bg-[#f0fdf9] rounded-2xl mb-12 ring-1 ring-[#059669]/10 shadow-inner">
            <div className="flex-1 py-3 bg-white text-[#059669] font-bold rounded-xl shadow-sm flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
              Đăng nhập
            </div>
            <Link href="/register" className="flex-1 py-3 text-gray-400 font-bold rounded-xl hover:text-[#059669] transition-all flex items-center justify-center gap-2">
              Đăng ký
            </Link>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Chào mừng trở lại</h2>
            <p className="text-gray-400 font-medium">Bắt đầu hành trình chinh phục cùng MathBot</p>
          </div>

          {registered && (
            <div className="mb-8 p-4 rounded-xl bg-[#f0fdf9] border border-[#059669]/20 text-[#059669] text-sm flex items-center gap-3 animate-slide-up">
              <span className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center text-xs">✓</span>
              Tài khoản đã sẵn sàng. Hãy đăng nhập ngay!
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 animate-shake">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-2 ml-1">Email</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 bg-[#f0fdf9]/30 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#059669]/10 focus:border-[#059669] focus:bg-white transition-all duration-300 placeholder:text-gray-300"
                />
                <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#059669] transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" /></svg>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="text-[11px] font-black uppercase tracking-wider text-gray-400">Mật khẩu</label>
                <Link href="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-[#059669] hover:text-[#0891b2] transition-colors">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
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
              className="group relative w-full py-4 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white font-bold rounded-2xl shadow-[0_10px_20px_-5px_rgba(5,150,105,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(5,150,105,0.6)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-700 -translate-x-full" />
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                <>
                  <span>Tiếp tục học tập</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
              <span className="relative bg-white px-5 text-[10px] font-black uppercase text-gray-300 tracking-widest">Phương thức khác</span>
            </div>

            <button
              type="button"
              disabled
              title="Sắp ra mắt"
              className="w-full py-4 bg-white border border-gray-200 flex items-center justify-center gap-4 rounded-2xl font-bold text-gray-400 cursor-not-allowed opacity-60"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Đăng nhập bằng Google <span className="text-xs font-normal">(Sắp ra mắt)</span>
            </button>
          </form>

          <p className="mt-12 text-center text-sm font-medium text-gray-400">
            Chưa có tài khoản MathBot?{' '}
            <Link href="/register" className="font-extrabold text-[#0891b2] hover:text-[#059669] transition-colors">Đăng ký thành viên</Link>
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
