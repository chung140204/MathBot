import ClassroomExamClient from '@/features/classroom/components/ClassroomExamClient';
export default async function TakeAssignmentPage({ params }: { params: Promise<{ id: string; assignmentId: string }> }) {
  const { id, assignmentId } = await params;
  return <ClassroomExamClient classroomId={id} assignmentId={assignmentId} />;
}
