import type { Metadata } from 'next';
import { AdminDashboardPage } from '@/features/learn/pages/admin-dashboard-page';

export const metadata: Metadata = { title: 'Dashboard' };

export default function AdminDashboard() {
  return <AdminDashboardPage />;
}
