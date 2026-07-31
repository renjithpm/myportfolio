'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { ProtectedRoute } from '@/features/learn/components/protected-route';
import { CourseCard } from '@/features/learn/components/course-card';
import { EmptyState } from '@/features/learn/components/empty-state';
import { useBookmarks } from '@/features/learn/hooks/use-bookmarks';

export function BookmarksPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}

function Content() {
  const router = useRouter();
  const { data: courses, isLoading } = useBookmarks();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Bookmarks</h1>

      {!courses || courses.length === 0 ? (
        <EmptyState
          title="No bookmarks yet"
          description="Bookmark courses to save them for later."
          action={{ label: 'Browse Courses', onClick: () => router.push('/learn/courses') }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} isBookmarked />
          ))}
        </div>
      )}
    </div>
  );
}
