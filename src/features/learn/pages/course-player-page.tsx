'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Loader2, AlertCircle, Menu } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { ProtectedRoute } from '@/features/learn/components/protected-route';
import { LessonPlayer } from '@/features/learn/components/lesson-player';
import { CurriculumSidebar } from '@/features/learn/components/curriculum-sidebar';
import { useCourse } from '@/features/learn/hooks/use-courses';
import { useCourseProgress, useUpdateProgress } from '@/features/learn/hooks/use-progress';
import type { Lesson } from '@/features/learn/types';

interface CoursePlayerPageProps {
  courseId: string;
}

export function CoursePlayerPage({ courseId }: CoursePlayerPageProps) {
  return (
    <ProtectedRoute>
      <PlayerContent courseId={courseId} />
    </ProtectedRoute>
  );
}

function PlayerContent({ courseId }: { courseId: string }) {
  const { data: course, isLoading } = useCourse(courseId);
  const { data: progress } = useCourseProgress(courseId);
  const { mutateAsync: updateProgress } = useUpdateProgress();

  const [activeLesson, setActiveLesson] = React.useState<Lesson | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const allLessons = React.useMemo(
    () =>
      course?.modules
        .slice()
        .sort((a, b) => a.order - b.order)
        .flatMap((m) => m.lessons.slice().sort((a, b) => a.order - b.order)) ?? [],
    [course],
  );

  React.useEffect(() => {
    if (allLessons.length > 0 && !activeLesson) {
      const firstUnlocked = allLessons.find(
        (l) => l.resourceUrl || l.previewEnabled,
      );
      if (firstUnlocked) setActiveLesson(firstUnlocked);
    }
  }, [allLessons, activeLesson]);

  const completedIds = React.useMemo(
    () => new Set(progress?.completedLessons ?? []),
    [progress],
  );

  const currentIndex = activeLesson
    ? allLessons.findIndex((l) => l.id === activeLesson.id)
    : -1;

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const markComplete = async () => {
    if (!activeLesson) return;
    try {
      await updateProgress({ lessonId: activeLesson.id, completed: true });
      toast.success('Lesson marked as complete!');
      if (nextLesson) setActiveLesson(nextLesson);
    } catch {
      toast.error('Could not update progress.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4">
        <AlertCircle className="size-12 text-muted-foreground" />
        <p className="font-semibold">Course not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {sidebarOpen && (
        <div className="hidden w-72 flex-shrink-0 overflow-hidden border-r border-border lg:flex flex-col">
          <div className="p-3 border-b border-border">
            <p className="font-semibold text-sm truncate">{course.title}</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <CurriculumSidebar
              modules={course.modules}
              activeLesson={activeLesson}
              completedLessons={completedIds}
              onLessonSelect={setActiveLesson}
              percentComplete={progress?.percentComplete ?? 0}
            />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center gap-3 border-b border-border px-4 py-2.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            <Menu className="size-4" />
          </Button>
          <span className="text-sm font-medium truncate">
            {activeLesson?.title ?? 'Select a lesson'}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeLesson ? (
            <div className="mx-auto max-w-4xl space-y-6">
              <LessonPlayer lesson={activeLesson} />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!prevLesson}
                  onClick={() => prevLesson && setActiveLesson(prevLesson)}
                >
                  <ChevronLeft className="size-4 mr-1" />
                  Previous
                </Button>

                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => void markComplete()}
                  disabled={completedIds.has(activeLesson.id)}
                >
                  <CheckCircle2 className="size-4 mr-1.5" />
                  {completedIds.has(activeLesson.id) ? 'Completed' : 'Mark Complete'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={!nextLesson}
                  onClick={() => nextLesson && setActiveLesson(nextLesson)}
                >
                  Next
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select a lesson to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
