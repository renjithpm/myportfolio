'use client';

import * as React from 'react';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { CourseHero } from '@/features/learn/components/course-hero';
import { Curriculum } from '@/features/learn/components/curriculum';
import { EnrollCta } from '@/features/learn/components/enroll-cta';
import { useCourse } from '@/features/learn/hooks/use-courses';
import { usePurchases } from '@/features/learn/hooks/use-purchases';
import { useMySubscription } from '@/features/learn/hooks/use-subscriptions';
import { useAuth } from '@/features/learn/auth/context/auth-context';

interface CourseDetailPageProps {
  slug: string;
}

export function CourseDetailPage({ slug }: CourseDetailPageProps) {
  const { data: course, isLoading, error } = useCourse(slug);
  const { isAuthenticated } = useAuth();
  const { data: purchases } = usePurchases();
  const { data: subscriptionData } = useMySubscription();

  const isPurchased = React.useMemo(
    () =>
      !!purchases?.some(
        (p) => p.courseId === course?.id && p.status === 'PAID',
      ),
    [purchases, course?.id],
  );

  const hasSubscription = subscriptionData?.subscription?.status === 'ACTIVE';

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16 text-center">
        <AlertCircle className="mx-auto size-12 text-muted-foreground mb-4" />
        <p className="font-semibold">Course not found</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/learn/courses">
            <ArrowLeft className="size-4 mr-2" />
            Back to courses
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link href="/learn/courses">
          <ArrowLeft className="size-4 mr-1" />
          All Courses
        </Link>
      </Button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-10">
          <CourseHero course={course} />

          {course.description && (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">About this course</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {course.description}
              </p>
            </div>
          )}

          {course.modules.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Curriculum</h2>
              <Curriculum modules={course.modules} />
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <EnrollCta
            course={course}
            isPurchased={isAuthenticated && isPurchased}
            hasSubscription={isAuthenticated && hasSubscription}
          />
        </div>
      </div>
    </div>
  );
}
