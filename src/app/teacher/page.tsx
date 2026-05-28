import { getServerSession } from 'next-auth';
import { authOptions } from '@/features/auth/lib/auth';
import TeacherDashboardClient from '@/features/teacher/components/TeacherDashboardClient';

export default async function TeacherPage() {
  const session = await getServerSession(authOptions);
  return <TeacherDashboardClient userName={session?.user?.name ?? undefined} />;
}
