'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { ProtectedRoute } from '@/features/learn/components/protected-route';
import { LearningProgressCard } from '@/features/learn/components/learning-progress-card';
import { EmptyState } from '@/features/learn/components/empty-state';
import { usePurchases } from '@/features/learn/hooks/use-purchases';

export function MyCoursesDashboard() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}

function Content() {
  const router = useRouter();
  const { data: purchases, isLoading } = usePurchases();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const paid = purchases?.filter((p) => p.status === 'PAID') ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Courses</h1>

      {paid.length === 0 ? (
        <EmptyState
          title="No courses yet"
          description="Enroll in a course to start learning."
          action={{ label: 'Browse Courses', onClick: () => router.push('/learn/courses') }}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paid.map((p) => (
            <LearningProgressCard key={p.id} course={p.course} percentComplete={0} />
          ))}
        </div>
      )}
    </div>
  );
}
