'use client';

import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/features/learn/services/admin.service';
import { useAdminCourses } from './use-courses';

export const adminKeys = {
  dashboard: ['admin-dashboard'] as const,
};

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: adminService.dashboard,
  });
}

export { useAdminCourses };
