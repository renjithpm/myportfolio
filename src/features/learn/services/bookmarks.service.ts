import { apiClient } from './api-client';
import type { Course } from '@/features/learn/types';

export const bookmarksService = {
  list: () => apiClient.get<Course[]>('/bookmarks'),

  toggle: (courseId: string) =>
    apiClient.post<{ bookmarked: boolean }>('/bookmarks', { courseId }),
};
