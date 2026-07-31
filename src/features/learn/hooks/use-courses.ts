'use client';

import { useQuery } from '@tanstack/react-query';
import { coursesService } from '@/features/learn/services/courses.service';
import type { CourseFilters } from '@/features/learn/types';

export const courseKeys = {
  all: ['courses'] as const,
  list: (filters: CourseFilters) => ['courses', 'list', filters] as const,
  detail: (slug: string) => ['courses', 'detail', slug] as const,
  featured: () => ['courses', 'featured'] as const,
  adminList: () => ['courses', 'admin'] as const,
};

export function useCourses(filters: CourseFilters = {}) {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: () => coursesService.list(filters),
  });
}

export function useCourse(slug: string) {
  return useQuery({
    queryKey: courseKeys.detail(slug),
    queryFn: () => coursesService.bySlug(slug),
    enabled: !!slug,
  });
}

export function useFeaturedCourses() {
  return useQuery({
    queryKey: courseKeys.featured(),
    queryFn: coursesService.featured,
  });
}

export function useAdminCourses() {
  return useQuery({
    queryKey: courseKeys.adminList(),
    queryFn: coursesService.adminList,
  });
}

export function useAdminCourse(id: string) {
  return useQuery({
    queryKey: [...courseKeys.adminList(), id] as const,
    queryFn: () => coursesService.adminById(id),
    enabled: !!id,
  });
}
