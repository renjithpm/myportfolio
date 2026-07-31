'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/features/learn/auth/context/auth-context';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.replace('/learn');
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-12 text-center">
        <ShieldAlert className="size-12 text-muted-foreground" />
        <p className="font-semibold">Access denied</p>
        <p className="text-sm text-muted-foreground">Admin role required.</p>
      </div>
    );
  }

  return <>{children}</>;
}
