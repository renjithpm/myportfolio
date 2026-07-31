'use client';

import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/features/learn/services/categories.service';

export const categoryKeys = {
  all: ['categories'] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoriesService.list,
  });
}
