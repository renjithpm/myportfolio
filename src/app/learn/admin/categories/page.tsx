import type { Metadata } from 'next';
import { AdminCategoriesPage } from '@/features/learn/pages/admin-categories-page';

export const metadata: Metadata = { title: 'Categories' };

export default function CategoriesPage() {
  return <AdminCategoriesPage />;
}
