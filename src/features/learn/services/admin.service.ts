import { apiClient } from './api-client';
import type { AdminDashboard } from '@/features/learn/types';

export const adminService = {
  dashboard: () => apiClient.get<AdminDashboard>('/admin/dashboard'),
};
