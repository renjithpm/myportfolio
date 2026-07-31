'use client';

import * as React from 'react';
import { Loader2 } from 'lucide-react';

import { ProtectedRoute } from '@/features/learn/components/protected-route';
import { RecentPurchasesTable } from '@/features/learn/components/recent-purchases-table';
import { usePurchases } from '@/features/learn/hooks/use-purchases';

export function OrdersPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}

function Content() {
  const { data: purchases, isLoading } = usePurchases();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Order History</h1>
      <RecentPurchasesTable purchases={purchases ?? []} />
    </div>
  );
}
