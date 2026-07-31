import type { Metadata } from 'next';
import { AdminGuard } from '@/features/learn/components/admin-guard';
import { CourseForm } from '@/features/learn/components/course-form';

export const metadata: Metadata = { title: 'New Course' };

export default function NewCoursePage() {
  return (
    <AdminGuard>
      <div className="p-6 space-y-6 max-w-4xl">
        <h1 className="text-2xl font-bold">Create Course</h1>
        <CourseForm />
      </div>
    </AdminGuard>
  );
}
