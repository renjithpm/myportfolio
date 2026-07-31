import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SearchResultsPage } from '@/features/learn/pages/search-results-page';

export const metadata: Metadata = { title: 'Search Courses' };

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResultsPage />
    </Suspense>
  );
}
