'use client';

import { useSession } from 'next-auth/react';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0fdf9]">
        <div className="w-8 h-8 border-2 border-[#059669]/20 border-t-[#059669] rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
