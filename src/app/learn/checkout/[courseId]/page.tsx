import type { Metadata } from 'next';
import { CheckoutPageClient } from '@/features/learn/pages/checkout-page';

interface Props {
  params: Promise<{ courseId: string }>;
}

export const metadata: Metadata = { title: 'Checkout' };

export default async function CheckoutPage({ params }: Props) {
  const { courseId } = await params;
  return <CheckoutPageClient courseId={courseId} />;
}
