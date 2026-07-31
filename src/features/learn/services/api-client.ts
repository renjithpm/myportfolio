import type { ApiError } from '@/features/learn/types';

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001') + '/api/v1';

let _getToken: (() => string | null) | null = null;
let _onRefresh: (() => Promise<string | null>) | null = null;
let _onUnauthorized: (() => void) | null = null;

export function configureApiClient(opts: {
  getToken: () => string | null;
  onRefresh: () => Promise<string | null>;
  onUnauthorized: () => void;
}) {
  _getToken = opts.getToken;
  _onRefresh = opts.onRefresh;
  _onUnauthorized = opts.onUnauthorized;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = _getToken?.();
  const isFormData = init.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(init.headers as Record<string, string>),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE}${path}`, { ...init, headers });

  if (res.status === 401 && retry && _onRefresh) {
    const newToken = await _onRefresh();
    if (newToken) {
      return request<T>(path, init, false);
    }
    _onUnauthorized?.();
    throw new LearnApiError('Session expired. Please sign in again.', 401);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as Partial<ApiError>;
    throw new LearnApiError(body.message ?? 'Something went wrong', res.status);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export class LearnApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = 'LearnApiError';
  }
}

export const apiClient = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'GET' }),

  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: 'DELETE' }),

  upload: <T>(path: string, formData: FormData) =>
    request<T>(path, { method: 'POST', body: formData }),
};

export async function publicGet<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers as Record<string, string>) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as Partial<ApiError>;
    throw new LearnApiError(body.message ?? 'Something went wrong', res.status);
  }
  return res.json() as Promise<T>;
}
