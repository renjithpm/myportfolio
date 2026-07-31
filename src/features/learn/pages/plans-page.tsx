'use client';

import * as React from 'react';
import { toast } from 'sonner';

import { PlanCard } from '@/features/learn/components/plan-card';
import { PlanToggle } from '@/features/learn/components/plan-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { useSubscriptionPlans, useMySubscription, useSubscribe } from '@/features/learn/hooks/use-subscriptions';
import { useAuth } from '@/features/learn/auth/context/auth-context';
import type { BillingCycle } from '@/features/learn/types';
import { useRouter } from 'next/navigation';

export function PlansPage() {
  const router = useRouter();
  const [cycle, setCycle] = React.useState<BillingCycle>('MONTHLY');
  const { data: plans, isLoading } = useSubscriptionPlans();
  const { data: mySubscription } = useMySubscription();
  const { mutateAsync: subscribe, isPending } = useSubscribe();
  const { isAuthenticated } = useAuth();

  const currentPlanId = mySubscription?.subscription?.planId;

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      router.push('/learn/auth/login?redirect=/learn/plans');
      return;
    }
    try {
      await subscribe({ planId, billingCycle: cycle });
      toast.success('Subscription activated!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Subscription failed.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">Choose your plan</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Get unlimited access to all courses. Cancel anytime.
        </p>
        <div className="flex justify-center pt-2">
          <PlanToggle value={cycle} onChange={setCycle} />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-96 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {plans?.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingCycle={cycle}
              isActive={plan.tier === 'PRO'}
              isCurrent={plan.id === currentPlanId}
              onSubscribe={() => void handleSubscribe(plan.id)}
              isLoading={isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
