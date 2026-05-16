import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <p className="text-7xl font-black text-[#059669] mb-2">404</p>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Trang không tồn tại</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-[#059669] text-white rounded-xl font-semibold text-sm hover:bg-[#047857] transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
