'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Logic gửi mail quên mật khẩu sẽ ở đây
      await new Promise(resolve => setTimeout(resolve, 1500)); // Giả lập call API
      setMessage('Nếu email tồn tại trong hệ thống, bạn sẽ nhận được liên kết đặt lại mật khẩu.');
    } catch {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
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
          {/* Logo */}
          <Link href="/" className="inline-flex flex-col items-start mb-12 group">
            <div className="flex items-center gap-4 mb-2">
              <div className="relative w-20 h-20 drop-shadow-2xl group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="MathBot Logo"
                  fill
                  sizes="80px"
                  className="object-contain mix-blend-screen"
                  priority
                />
              </div>
              <div>
                <p className="text-4xl font-black tracking-tight text-white leading-none">MathBot</p>
                <p className="text-sm font-semibold text-white/70 mt-1">Toán không khó — chỉ cần đúng cách</p>
              </div>
            </div>
          </Link>

          {/* Slogan */}
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-[1.05] mb-6 tracking-tight">
            An tâm<br />
            <span className="text-white drop-shadow-sm">phục hồi</span><br />
            <span className="text-white/60">tài khoản</span>
          </h1>
          <p className="text-white/75 text-base leading-relaxed mb-12 font-medium max-w-xs">
            Đừng lo lắng — chúng tôi sẽ giúp bạn lấy lại quyền truy cập vào lộ trình học tập chỉ sau vài bước.
          </p>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-10 -mt-10 transition-transform group-hover:scale-150" />
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-[#f0fdf9]">Mẹo bảo mật tài khoản:</p>
            <ul className="space-y-4">
              {[
                'Sử dụng mật khẩu ít nhất 8 ký tự',
                'Kết hợp chữ hoa, chữ thường và số',
                'Không chia sẻ mã khôi phục cho bất kỳ ai'
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                  <span className="w-5 h-5 rounded-full bg-[#f0fdf9]/20 flex items-center justify-center text-[10px] text-[#f0fdf9] mt-0.5 border border-[#f0fdf9]/30">✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 0 00-2 2v6a2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
           <span className="text-[10px] uppercase font-bold tracking-widest text-[#f0fdf9]">MathBot AI · Secure Recovery System</span>
        </div>
      </div>

      {/* RIGHT PANEL: Form Section matching Landing Page Aesthetic */}
      <div className="flex-1 p-8 lg:p-14 bg-white/95 flex flex-col justify-center">
        <div className="max-w-[420px] mx-auto w-full">
          <div className="mb-12">
            <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#059669] mb-8 group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Quay lại đăng nhập
            </Link>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Quên mật khẩu?</h2>
            <p className="text-gray-400 font-medium">Nhập email để nhận liên kết đặt lại mật khẩu</p>
          </div>

          {message && (
            <div className="mb-8 p-5 rounded-xl bg-[#f0fdf9] border border-[#059669]/20 text-[#059669] text-sm flex items-center gap-4 animate-slide-up shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#059669] text-white flex items-center justify-center text-lg shrink-0 shadow-lg shadow-[#059669]/30">📧</div>
              <p className="font-medium leading-relaxed">{message}</p>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3 animate-shake">
              <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">!</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-gray-400 mb-3 ml-1">Địa chỉ Email học viên</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-6 py-5 bg-[#f0fdf9]/30 border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#059669]/10 focus:border-[#059669] focus:bg-white transition-all duration-300 placeholder:text-gray-300"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#059669] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-5 bg-gradient-to-r from-[#059669] to-[#0891b2] text-white font-bold rounded-2xl shadow-[0_10px_20px_-5px_rgba(5,150,105,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(5,150,105,0.6)] hover:-translate-y-1 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
            >
              <div className="absolute inset-0 bg-white/10 group-hover:translate-x-full transition-transform duration-700 -translate-x-full" />
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <>
                  <span>Gửi liên kết khôi phục</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-16 text-center">
            <p className="text-sm font-medium text-gray-400">
              Bạn vẫn gặp sự cố?{' '}
              <Link href="#" className="font-extrabold text-[#0891b2] border-b-2 border-[#059669]/30 hover:border-[#059669] transition-all pb-0.5">Liên hệ bộ phận hỗ trợ</Link>
            </p>
          </div>
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
