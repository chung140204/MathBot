import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from '@/features/admin/components/DashboardClient';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <DashboardClient user={session.user} />
    </div>
  );
}
