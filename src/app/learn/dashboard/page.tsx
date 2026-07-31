import type { Metadata } from 'next';
import { DashboardOverviewPage } from '@/features/learn/pages/dashboard-overview-page';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return <DashboardOverviewPage />;
}
