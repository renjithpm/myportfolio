import { apiClient } from './api-client';
import type { UserDashboard } from '@/features/learn/types';

export const userDashboardService = {
  get: () => apiClient.get<UserDashboard>('/user/dashboard'),
};
