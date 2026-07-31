import * as React from 'react';
import { BookOpen, Clock, Lock } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LessonItem } from './lesson-item';
import type { CourseModule } from '@/features/learn/types';

interface CurriculumProps {
  modules: CourseModule[];
  completedLessons?: Set<string>;
  onLessonClick?: (lesson: { id: string; moduleId: string }) => void;
}

export function Curriculum({
  modules,
  completedLessons = new Set(),
  onLessonClick,
}: CurriculumProps) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalMinutes = modules.reduce(
    (sum, m) =>
      sum + m.lessons.reduce((ls, l) => ls + (l.durationMinutes ?? 0), 0),
    0,
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BookOpen className="size-4" />
          {modules.length} modules, {totalLessons} lessons
        </span>
        {totalMinutes > 0 && (
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" />
            {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m
          </span>
        )}
      </div>

      <Accordion type="multiple" defaultValue={modules.slice(0, 1).map((m) => m.id)}>
        {modules.map((mod) => {
          const modCompleted = mod.lessons.filter((l) =>
            completedLessons.has(l.id),
          ).length;

          return (
            <AccordionItem key={mod.id} value={mod.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex flex-col items-start gap-0.5 text-left">
                  <span className="font-medium">{mod.title}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {modCompleted}/{mod.lessons.length} completed
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-2">
                <div className="space-y-0.5 pl-1">
                  {mod.lessons
                    .sort((a, b) => a.order - b.order)
                    .map((lesson) => (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        isCompleted={completedLessons.has(lesson.id)}
                        onClick={
                          onLessonClick
                            ? () =>
                                onLessonClick({
                                  id: lesson.id,
                                  moduleId: mod.id,
                                })
                            : undefined
                        }
                      />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
