'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { configureApiClient } from '@/features/learn/services/api-client';
import { authService } from '@/features/learn/services/auth.service';
import type { User, AuthTokens } from '@/features/learn/types';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'learn_access_token';
const REFRESH_KEY = 'learn_refresh_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const storeTokens = React.useCallback((tokens: AuthTokens) => {
    localStorage.setItem(TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
    setAccessToken(tokens.accessToken);
    setUser(tokens.user);
  }, []);

  const clearTokens = React.useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

  const refreshToken = React.useCallback(async (): Promise<string | null> => {
    const stored = localStorage.getItem(REFRESH_KEY);
    if (!stored) return null;
    try {
      const tokens = await authService.refresh(stored);
      storeTokens(tokens);
      return tokens.accessToken;
    } catch {
      clearTokens();
      return null;
    }
  }, [storeTokens, clearTokens]);

  React.useEffect(() => {
    configureApiClient({
      getToken: () => localStorage.getItem(TOKEN_KEY),
      onRefresh: refreshToken,
      onUnauthorized: () => {
        clearTokens();
        router.push('/learn/auth/login');
      },
    });

    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedToken) {
      setAccessToken(storedToken);
      authService
        .me()
        .then((u) => setUser(u))
        .catch(() => {
          refreshToken().then((t) => {
            if (!t) clearTokens();
          });
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [router, refreshToken, clearTokens]);

  const login = React.useCallback(
    async (email: string, password: string) => {
      const tokens = await authService.login({ email, password });
      storeTokens(tokens);
    },
    [storeTokens],
  );

  const register = React.useCallback(
    async (name: string, email: string, password: string) => {
      const tokens = await authService.register({ name, email, password });
      storeTokens(tokens);
    },
    [storeTokens],
  );

  const logout = React.useCallback(() => {
    clearTokens();
    router.push('/learn');
  }, [clearTokens, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
