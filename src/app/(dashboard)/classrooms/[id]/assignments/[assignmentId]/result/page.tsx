import ClassroomResultClient from '@/features/classroom/components/ClassroomResultClient';
export default async function AssignmentResultPage({ params }: { params: Promise<{ id: string; assignmentId: string }> }) {
  const { id, assignmentId } = await params;
  return <ClassroomResultClient classroomId={id} assignmentId={assignmentId} />;
}
