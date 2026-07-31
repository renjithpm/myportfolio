'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CourseCard } from './course-card';
import { CourseGridSkeleton } from './course-card-skeleton';
import { EmptyState } from './empty-state';
import type { Course, PaginatedResponse } from '@/features/learn/types';

interface CourseGridProps {
  data?: PaginatedResponse<Course>;
  isLoading?: boolean;
  bookmarkedIds?: Set<string>;
  onPageChange?: (page: number) => void;
  currentPage?: number;
  className?: string;
}

export function CourseGrid({
  data,
  isLoading = false,
  bookmarkedIds = new Set(),
  onPageChange,
  currentPage = 1,
  className,
}: CourseGridProps) {
  if (isLoading) {
    return (
      <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3', className)}>
        <CourseGridSkeleton count={6} />
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        title="No courses found"
        description="Try adjusting your filters or search terms."
        className={className}
      />
    );
  }

  const totalPages = Math.ceil(data.total / data.limit);

  return (
    <div className={cn('space-y-8', className)}>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.data.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isBookmarked={bookmarkedIds.has(course.id)}
          />
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <nav
          aria-label="Course list pagination"
          className="flex items-center justify-center gap-2"
        >
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </nav>
      )}
    </div>
  );
}
