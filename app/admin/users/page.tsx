import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import UsersClient from './UsersClient';

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <UsersClient user={session.user} />
    </div>
  );
}
