'use client';

import * as React from 'react';
import { BookOpen, CheckCircle2, Bookmark, Loader2 } from 'lucide-react';

import { ProtectedRoute } from '@/features/learn/components/protected-route';
import { LearningProgressCard } from '@/features/learn/components/learning-progress-card';
import { SubscriptionStatusCard } from '@/features/learn/components/subscription-status-card';
import { EmptyState } from '@/features/learn/components/empty-state';
import { useUserDashboard } from '@/features/learn/hooks/use-user-dashboard';
import { useAuth } from '@/features/learn/auth/context/auth-context';
import { useRouter } from 'next/navigation';

export function DashboardOverviewPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { data, isLoading } = useUserDashboard();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Continue your learning journey.
        </p>
      </div>

      {data?.subscription && (
        <SubscriptionStatusCard subscription={data.subscription} />
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          In Progress
        </h2>
        {data?.inProgressCourses.length === 0 ? (
          <EmptyState
            title="No courses in progress"
            description="Start a course to track your progress here."
            action={{
              label: 'Browse Courses',
              onClick: () => router.push('/learn/courses'),
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.inProgressCourses.map((course) => (
              <LearningProgressCard
                key={course.id}
                course={course}
                percentComplete={0}
              />
            ))}
          </div>
        )}
      </div>

      {(data?.completedCourses.length ?? 0) > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald-500" />
            Completed
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data?.completedCourses.map((course) => (
              <LearningProgressCard
                key={course.id}
                course={course}
                percentComplete={100}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
