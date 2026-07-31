'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/features/learn/components/protected-route';
import { CheckoutForm } from '@/features/learn/components/checkout-form';
import { useCourse } from '@/features/learn/hooks/use-courses';

interface CheckoutPageClientProps {
  courseId: string;
}

export function CheckoutPageClient({ courseId }: CheckoutPageClientProps) {
  return (
    <ProtectedRoute>
      <CheckoutContent courseId={courseId} />
    </ProtectedRoute>
  );
}

function CheckoutContent({ courseId }: { courseId: string }) {
  const { data: course, isLoading, error } = useCourse(courseId);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16 text-center">
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
    <div className="mx-auto max-w-2xl px-6 py-10 lg:px-8">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2">
        <Link href={`/learn/courses/${course.slug}`}>
          <ArrowLeft className="size-4 mr-1" />
          Back to course
        </Link>
      </Button>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      <CheckoutForm course={course} />
    </div>
  );
}
