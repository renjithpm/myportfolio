import type { Metadata } from 'next';
import { SubscriptionDashboardPage } from '@/features/learn/pages/subscription-dashboard-page';

export const metadata: Metadata = { title: 'Subscription' };

export default function SubscriptionPage() {
  return <SubscriptionDashboardPage />;
}
