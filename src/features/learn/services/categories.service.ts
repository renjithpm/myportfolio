import { apiClient, publicGet } from './api-client';
import type { Category } from '@/features/learn/types';

interface CategoryPayload { name: string; slug: string; description?: string; imageUrl?: string }

export const categoriesService = {
  list: () => publicGet<Category[]>('/categories'),
  create: (payload: CategoryPayload) => apiClient.post<Category>('/categories', payload),
  update: (id: string, payload: Partial<CategoryPayload>) =>
    apiClient.put<Category>(`/categories/${id}`, payload),
  delete: (id: string) => apiClient.delete<void>(`/categories/${id}`),
};
