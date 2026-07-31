import type { Metadata } from 'next';
import { PlansPage } from '@/features/learn/pages/plans-page';

export const metadata: Metadata = { title: 'Subscription Plans' };

export default function SubscriptionPlansPage() {
  return <PlansPage />;
}
