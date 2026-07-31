import { apiClient } from './api-client';
import type { CourseProgress } from '@/features/learn/types';

export const progressService = {
  update: (lessonId: string, completed: boolean) =>
    apiClient.post<void>('/progress', { lessonId, completed }),

  getCourseProgress: (courseId: string) =>
    apiClient.get<CourseProgress>(`/progress/course/${courseId}`),
};
