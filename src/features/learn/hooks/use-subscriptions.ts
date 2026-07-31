'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionsService } from '@/features/learn/services/subscriptions.service';
import type { BillingCycle } from '@/features/learn/types';

export const subscriptionKeys = {
  plans: ['subscription-plans'] as const,
  me: ['subscription-me'] as const,
};

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: subscriptionKeys.plans,
    queryFn: subscriptionsService.plans,
  });
}

export function useMySubscription() {
  return useQuery({
    queryKey: subscriptionKeys.me,
    queryFn: subscriptionsService.me,
    retry: false,
  });
}

export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ planId, billingCycle }: { planId: string; billingCycle: BillingCycle }) =>
      subscriptionsService.subscribe(planId, billingCycle),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: subscriptionKeys.me });
    },
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionsService.cancel,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: subscriptionKeys.me });
    },
  });
}
