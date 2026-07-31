import * as React from 'react';
import { cn } from '@/lib/utils';
import type { Difficulty } from '@/features/learn/types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const MAP: Record<Difficulty, { label: string; className: string }> = {
  BEGINNER: {
    label: 'Beginner',
    className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  },
  INTERMEDIATE: {
    label: 'Intermediate',
    className: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  },
  ADVANCED: {
    label: 'Advanced',
    className: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  },
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const { label, className: colors } = MAP[difficulty];
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        colors,
        className,
      )}
    >
      {label}
    </span>
  );
}
