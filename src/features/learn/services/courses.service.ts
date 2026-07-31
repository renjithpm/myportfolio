import { apiClient, publicGet } from './api-client';
import type { Course, PaginatedResponse, CourseFilters } from '@/features/learn/types';
import type { CourseFormValues, ModuleFormValues } from '@/features/learn/schemas/course.schema';

function buildQuery(filters: CourseFilters): string {
  const params = new URLSearchParams();
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  if (filters.category) params.set('category', filters.category);
  if (filters.tag) params.set('tag', filters.tag);
  if (filters.difficulty) params.set('difficulty', filters.difficulty);
  if (filters.isFree !== undefined && filters.isFree !== '') {
    params.set('isFree', String(filters.isFree));
  }
  if (filters.search) params.set('search', filters.search);
  if (filters.sort) params.set('sort', filters.sort);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function sanitizeCourse(payload: Omit<CourseFormValues, 'modules'>) {
  return {
    ...payload,
    subtitle:         payload.subtitle         || undefined,
    shortDescription: payload.shortDescription || undefined,
    thumbnail:        payload.thumbnail        || undefined,
    bannerImage:      payload.bannerImage      || undefined,
    categoryId:       payload.categoryId       || undefined,
    durationHours:    Number(payload.durationHours) || 0,
    price:            Number(payload.price) || 0,
    discountPrice:    payload.discountPrice != null ? Number(payload.discountPrice) : undefined,
  };
}

async function createModules(courseId: string, modules: ModuleFormValues[]) {
  for (const mod of modules) {
    const { lessons, ...moduleData } = mod;
    const created = await apiClient.post<{ id: string }>(
      `/courses/${courseId}/modules`,
      {
        title: moduleData.title,
        description: moduleData.description || undefined,
        order: Number(moduleData.order) || 0,
      },
    );
    for (const lesson of lessons) {
      await apiClient.post(`/modules/${created.id}/lessons`, {
        title: lesson.title,
        description: lesson.description || undefined,
        type: lesson.type,
        durationMinutes: lesson.durationMinutes ? Number(lesson.durationMinutes) : undefined,
        resourceUrl: lesson.resourceUrl || undefined,
        downloadAllowed: lesson.downloadAllowed,
        previewEnabled: lesson.previewEnabled,
        order: Number(lesson.order) || 0,
      });
    }
  }
}

export const coursesService = {
  list: (filters: CourseFilters = {}) =>
    publicGet<PaginatedResponse<Course>>(`/courses${buildQuery(filters)}`),

  featured: () => publicGet<Course[]>('/courses/featured'),

  bySlug: (slug: string) => publicGet<Course>(`/courses/${slug}`),

  create: async (payload: CourseFormValues) => {
    const { modules, ...courseData } = payload;
    const course = await apiClient.post<Course>('/courses', sanitizeCourse(courseData));
    if (modules.length > 0) {
      await createModules(course.id, modules);
    }
    return course;
  },

  update: async (id: string, payload: CourseFormValues) => {
    const { modules, ...courseData } = payload;
    const course = await apiClient.put<Course>(`/courses/${id}`, sanitizeCourse(courseData));
    if (modules.length > 0) {
      await createModules(course.id, modules);
    }
    return course;
  },

  delete: (id: string) => apiClient.delete<void>(`/courses/${id}`),

  publish: (id: string) =>
    apiClient.patch<Course>(`/courses/${id}/publish`),

  adminList: () => apiClient.get<Course[]>('/admin/courses'),

  adminById: (id: string) => apiClient.get<Course>(`/admin/courses/${id}`),
};
