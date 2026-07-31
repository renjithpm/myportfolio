import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CoursesListPage } from '@/features/learn/pages/courses-list-page';

export const metadata: Metadata = {
  title: 'All Courses',
  description: 'Browse all available courses.',
};

export default function CoursesPage() {
  return (
    <Suspense>
      <CoursesListPage />
    </Suspense>
  );
}
