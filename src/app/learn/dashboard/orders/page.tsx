import type { Metadata } from 'next';
import { OrdersPage } from '@/features/learn/pages/orders-page';

export const metadata: Metadata = { title: 'Orders' };

export default function Orders() {
  return <OrdersPage />;
}
