import { Suspense } from 'react';
import ExamSetBuilder from '@/features/teacher/components/ExamSetBuilder';

export default async function EditExamSetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="p-8"><div className="h-8 w-48 bg-gray-200 animate-pulse rounded" /></div>}>
      <ExamSetBuilder examSetId={id} />
    </Suspense>
  );
}
