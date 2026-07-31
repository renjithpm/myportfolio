'use client';

import * as React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

import { AdminGuard } from '@/features/learn/components/admin-guard';
import { CourseForm } from '@/features/learn/components/course-form';
import { useAdminCourse } from '@/features/learn/hooks/use-courses';

interface AdminEditCoursePageClientProps {
  courseId: string;
}

export function AdminEditCoursePageClient({ courseId }: AdminEditCoursePageClientProps) {
  return (
    <AdminGuard>
      <Content courseId={courseId} />
    </AdminGuard>
  );
}

function Content({ courseId }: { courseId: string }) {
  const { data: course, isLoading, error } = useAdminCourse(courseId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center p-6">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12">
        <AlertCircle className="size-10 text-muted-foreground" />
        <p>Course not found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">Edit Course</h1>
      <CourseForm initialData={course} />
    </div>
  );
}
