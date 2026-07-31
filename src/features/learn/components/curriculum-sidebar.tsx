'use client';

import * as React from 'react';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LessonItem } from './lesson-item';
import type { CourseModule, Lesson } from '@/features/learn/types';

interface CurriculumSidebarProps {
  modules: CourseModule[];
  activeLesson: Lesson | null;
  completedLessons: Set<string>;
  onLessonSelect: (lesson: Lesson) => void;
  percentComplete: number;
}

export function CurriculumSidebar({
  modules,
  activeLesson,
  completedLessons,
  onLessonSelect,
  percentComplete,
}: CurriculumSidebarProps) {
  const [expandedModules, setExpandedModules] = React.useState<Set<string>>(
    () => new Set(modules.slice(0, 1).map((m) => m.id)),
  );

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <aside className="flex flex-col h-full">
      <div className="p-4 border-b border-border space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Your progress</span>
          <span className="text-muted-foreground">{Math.round(percentComplete)}%</span>
        </div>
        <Progress value={percentComplete} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {modules.map((mod) => {
          const isExpanded = expandedModules.has(mod.id);
          const completed = mod.lessons.filter((l) => completedLessons.has(l.id)).length;
          const allDone = completed === mod.lessons.length && mod.lessons.length > 0;

          return (
            <div key={mod.id} className="border-b border-border last:border-0">
              <button
                type="button"
                onClick={() => toggleModule(mod.id)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
                aria-expanded={isExpanded}
              >
                <div className="flex items-start gap-2 flex-1 min-w-0 mr-2">
                  {allDone && (
                    <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug line-clamp-2">{mod.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {completed}/{mod.lessons.length}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="size-4 flex-shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="size-4 flex-shrink-0 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="pb-2 space-y-0.5 px-2">
                  {mod.lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      isCompleted={completedLessons.has(lesson.id)}
                      isActive={activeLesson?.id === lesson.id}
                      isLocked={!lesson.resourceUrl && !lesson.previewEnabled}
                      onClick={() => {
                        if (lesson.resourceUrl || lesson.previewEnabled) {
                          onLessonSelect(lesson);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
