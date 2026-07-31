import * as React from 'react';
import {
  Lock,
  PlayCircle,
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lesson, LessonType } from '@/features/learn/types';

const TYPE_ICONS: Record<LessonType, React.ElementType> = {
  VIDEO: PlayCircle,
  PDF: FileText,
  ARTICLE: FileText,
  DOWNLOADABLE: Download,
  EXTERNAL_LINK: ExternalLink,
};

interface LessonItemProps {
  lesson: Lesson;
  isCompleted?: boolean;
  isActive?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

export function LessonItem({
  lesson,
  isCompleted = false,
  isActive = false,
  isLocked,
  onClick,
}: LessonItemProps) {
  const Icon = TYPE_ICONS[lesson.type];
  const locked = isLocked ?? (!lesson.previewEnabled && !lesson.resourceUrl);

  return (
    <button
      type="button"
      disabled={locked}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'hover:bg-accent text-foreground',
        locked && 'cursor-not-allowed opacity-60',
      )}
      aria-current={isActive ? 'true' : undefined}
    >
      <span className="flex-shrink-0">
        {isCompleted ? (
          <CheckCircle2 className="size-4 text-emerald-500" />
        ) : locked ? (
          <Lock className="size-4 text-muted-foreground" />
        ) : (
          <Icon className="size-4 text-muted-foreground" />
        )}
      </span>
      <span className="flex-1 leading-snug line-clamp-2">{lesson.title}</span>
      {lesson.durationMinutes !== undefined && lesson.durationMinutes > 0 && (
        <span className="flex-shrink-0 flex items-center gap-0.5 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {lesson.durationMinutes}m
        </span>
      )}
      {lesson.previewEnabled && !isCompleted && !isActive && (
        <span className="flex-shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
          Preview
        </span>
      )}
    </button>
  );
}
