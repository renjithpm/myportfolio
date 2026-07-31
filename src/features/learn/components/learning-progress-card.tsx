import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { DifficultyBadge } from './difficulty-badge';
import type { Course } from '@/features/learn/types';

interface LearningProgressCardProps {
  course: Course;
  percentComplete: number;
}

export function LearningProgressCard({
  course,
  percentComplete,
}: LearningProgressCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-glow">
      <div className="relative aspect-video w-full bg-muted">
        {course.thumbnail ? (
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <span className="text-3xl font-bold text-primary/30">{course.title[0]}</span>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <DifficultyBadge difficulty={course.difficulty} />
        <h3 className="font-semibold leading-snug line-clamp-2">{course.title}</h3>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(percentComplete)}%</span>
          </div>
          <Progress value={percentComplete} />
        </div>
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link href={`/learn/player/${course.id}`}>
            <Play className="size-3.5 mr-1.5" />
            {percentComplete > 0 ? 'Continue' : 'Start'} Learning
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
