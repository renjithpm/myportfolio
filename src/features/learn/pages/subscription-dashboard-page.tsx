'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { ProtectedRoute } from '@/features/learn/components/protected-route';
import { SubscriptionStatusCard } from '@/features/learn/components/subscription-status-card';
import { EmptyState } from '@/features/learn/components/empty-state';
import { useMySubscription } from '@/features/learn/hooks/use-subscriptions';

export function SubscriptionDashboardPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}

function Content() {
  const router = useRouter();
  const { data, isLoading } = useMySubscription();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold">Subscription</h1>

      {data?.subscription ? (
        <SubscriptionStatusCard subscription={data.subscription} />
      ) : (
        <EmptyState
          title="No active subscription"
          description="Subscribe to get unlimited access to all premium courses."
          action={{ label: 'View Plans', onClick: () => router.push('/learn/plans') }}
        />
      )}
    </div>
  );
}
