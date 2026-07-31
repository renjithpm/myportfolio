import { apiClient, publicGet } from './api-client';
import type {
  SubscriptionPlan,
  Subscription,
  BillingCycle,
} from '@/features/learn/types';

export const subscriptionsService = {
  plans: () => publicGet<SubscriptionPlan[]>('/subscription-plans'),

  subscribe: (planId: string, billingCycle: BillingCycle) =>
    apiClient.post<Subscription>('/subscriptions', { planId, billingCycle }),

  me: () =>
    apiClient.get<{ subscription: Subscription; plan: SubscriptionPlan }>(
      '/subscriptions/me',
    ),

  cancel: () => apiClient.patch<void>('/subscriptions/me/cancel'),
};
