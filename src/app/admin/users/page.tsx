import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import { redirect } from 'next/navigation';
import UsersClient from '@/features/admin/components/UsersClient';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <UsersClient user={session.user} />
    </div>
  );
}
