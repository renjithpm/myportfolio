'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookmarkIcon, Clock, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DifficultyBadge } from './difficulty-badge';
import { PriceDisplay } from './price-display';
import { useToggleBookmark } from '@/features/learn/hooks/use-bookmarks';
import type { Course } from '@/features/learn/types';

interface CourseCardProps {
  course: Course;
  isBookmarked?: boolean;
  showBookmark?: boolean;
  className?: string;
}

export function CourseCard({
  course,
  isBookmarked = false,
  showBookmark = true,
  className,
}: CourseCardProps) {
  const { mutate: toggle, isPending } = useToggleBookmark();

  return (
    <Card
      className={cn(
        'group overflow-hidden transition-all duration-200 hover:shadow-glow hover:-translate-y-0.5',
        className,
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-4xl font-bold text-primary/30">
              {course.title[0]}
            </span>
          </div>
        )}

        {course.isBestseller && (
          <span className="absolute left-2 top-2 rounded bg-amber-500 px-2 py-0.5 text-xs font-semibold text-white">
            Bestseller
          </span>
        )}

        {showBookmark && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              'absolute right-2 top-2 size-8 rounded-full bg-background/80 backdrop-blur-sm',
              'opacity-0 transition-opacity group-hover:opacity-100',
              isBookmarked && 'opacity-100 text-primary',
            )}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              toggle(course.id);
            }}
          >
            <BookmarkIcon
              className={cn('size-4', isBookmarked && 'fill-current')}
            />
          </Button>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={course.difficulty} />
          {course.category && (
            <span className="text-xs text-muted-foreground truncate">
              {course.category.name}
            </span>
          )}
        </div>

        <Link href={`/learn/courses/${course.slug}`}>
          <h3 className="font-semibold leading-snug line-clamp-2 hover:text-primary transition-colors">
            {course.title}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground">{course.instructor}</p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {course.durationHours}h
          </span>
          {course._count && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {course._count.purchases.toLocaleString()}
            </span>
          )}
        </div>

        <PriceDisplay
          price={course.price}
          discountPrice={course.discountPrice}
          currency={course.currency}
          isFree={course.isFree}
        />
      </CardContent>
    </Card>
  );
}
