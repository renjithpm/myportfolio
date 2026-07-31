import type { Metadata } from 'next';
import { AdminEditCoursePageClient } from '@/features/learn/pages/admin-edit-course-page';

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: 'Edit Course' };

export default async function EditCoursePage({ params }: Props) {
  const { id } = await params;
  return <AdminEditCoursePageClient courseId={id} />;
}
