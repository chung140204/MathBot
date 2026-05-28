import ClassroomDetailClient from '@/features/teacher/components/ClassroomDetailClient';
export default async function ClassroomDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClassroomDetailClient classroomId={id} />;
}
