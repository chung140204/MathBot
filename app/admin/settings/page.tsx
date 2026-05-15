import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <SettingsClient user={session.user} />
    </div>
  );
}
