import type { Metadata } from 'next';
import { AdminOffersPage } from '@/features/learn/pages/admin-offers-page';

export const metadata: Metadata = { title: 'Offers' };

export default function OffersPage() {
  return <AdminOffersPage />;
}
