'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { SearchBar } from '@/features/learn/components/search-bar';
import { CourseGrid } from '@/features/learn/components/course-grid';
import { useCourses } from '@/features/learn/hooks/use-courses';

export function SearchResultsPage() {
  const params = useSearchParams();
  const initial = params.get('q') ?? '';
  const [search, setSearch] = React.useState(initial);
  const [query, setQuery] = React.useState(initial);
  const [page, setPage] = React.useState(1);

  const { data, isLoading } = useCourses({ search: query, page, limit: 12 });

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Search Courses</h1>
        <SearchBar
          value={search}
          onChange={(v) => {
            setSearch(v);
            setQuery(v);
            setPage(1);
          }}
          placeholder="Type to search..."
          className="max-w-lg"
        />
      </div>

      {query && (
        <p className="text-sm text-muted-foreground">
          {data ? `${data.total} result${data.total !== 1 ? 's' : ''}` : 'Searching...'}{' '}
          for &ldquo;{query}&rdquo;
        </p>
      )}

      <CourseGrid
        data={data}
        isLoading={isLoading}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}
