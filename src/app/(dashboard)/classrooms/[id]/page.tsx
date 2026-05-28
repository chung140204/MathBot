import ClassroomAssignmentsClient from '@/features/classroom/components/ClassroomAssignmentsClient';
export default async function ClassroomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClassroomAssignmentsClient classroomId={id} />;
}
