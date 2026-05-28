import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { redirect } from 'next/navigation';
import UploadClient from '@/features/ocr/components/UploadClient';

export default async function UploadPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <UploadClient user={session.user} />
    </div>
  );
}
