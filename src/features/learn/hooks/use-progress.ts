'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { progressService } from '@/features/learn/services/progress.service';

export const progressKeys = {
  course: (courseId: string) => ['progress', courseId] as const,
};

export function useCourseProgress(courseId: string) {
  return useQuery({
    queryKey: progressKeys.course(courseId),
    queryFn: () => progressService.getCourseProgress(courseId),
    enabled: !!courseId,
  });
}

export function useUpdateProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, completed }: { lessonId: string; completed: boolean }) =>
      progressService.update(lessonId, completed),
    onSuccess: (_data, variables) => {
      void qc.invalidateQueries({ queryKey: ['progress'] });
    },
  });
}
