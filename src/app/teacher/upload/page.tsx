import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { redirect } from 'next/navigation';
import UploadClient from '@/features/ocr/components/UploadClient';

export default async function TeacherUploadPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect('/login');

  return (
    <UploadClient
      user={session.user}
      apiBasePath="/api/v1/admin/upload"
      hideSidebar
    />
  );
}
