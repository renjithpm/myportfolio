'use client';

import { useQuery } from '@tanstack/react-query';
import { userDashboardService } from '@/features/learn/services/user-dashboard.service';

export const dashboardKeys = {
  user: ['user-dashboard'] as const,
};

export function useUserDashboard() {
  return useQuery({
    queryKey: dashboardKeys.user,
    queryFn: userDashboardService.get,
  });
}
