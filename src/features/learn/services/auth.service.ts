import { apiClient, publicGet } from './api-client';
import type { AuthTokens, User } from '@/features/learn/types';

interface LoginPayload { email: string; password: string }
interface RegisterPayload { name: string; email: string; password: string }

export const authService = {
  login: (payload: LoginPayload) =>
    publicGet<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  register: (payload: RegisterPayload) =>
    publicGet<AuthTokens>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  refresh: (refreshToken: string) =>
    publicGet<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    }),

  me: () => apiClient.get<User>('/auth/me'),
};
