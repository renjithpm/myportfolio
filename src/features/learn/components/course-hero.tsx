import * as React from 'react';
import Image from 'next/image';
import { BookOpen, Clock, Globe, Users } from 'lucide-react';
import { DifficultyBadge } from './difficulty-badge';
import { Badge } from '@/components/ui/badge';
import type { Course } from '@/features/learn/types';

interface CourseHeroProps {
  course: Course;
}

export function CourseHero({ course }: CourseHeroProps) {
  const totalLessons = course.modules.reduce(
    (sum, m) => sum + m.lessons.length,
    0,
  );

  return (
    <div className="space-y-6">
      {course.bannerImage && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted">
          <Image
            src={course.bannerImage}
            alt={course.title}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={course.difficulty} />
          {course.isBestseller && (
            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
              Bestseller
            </Badge>
          )}
          {course.isFeatured && (
            <Badge variant="secondary">Featured</Badge>
          )}
          {course.category && (
            <Badge variant="outline">{course.category.name}</Badge>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {course.title}
        </h1>

        {course.subtitle && (
          <p className="text-lg text-muted-foreground">{course.subtitle}</p>
        )}

        <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            By {course.instructor}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {course.durationHours}h of content
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-4" />
            {totalLessons} lessons
          </span>
          <span className="flex items-center gap-1.5">
            <Globe className="size-4" />
            {course.language}
          </span>
          {course._count && (
            <span className="flex items-center gap-1.5">
              <Users className="size-4" />
              {course._count.purchases.toLocaleString()} students
            </span>
          )}
        </div>

        {course.shortDescription && (
          <p className="text-muted-foreground leading-relaxed">
            {course.shortDescription}
          </p>
        )}

        {course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {course.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
