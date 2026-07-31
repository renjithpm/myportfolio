'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CourseGrid } from '@/features/learn/components/course-grid';
import { CourseFilters } from '@/features/learn/components/course-filters';
import { SearchBar } from '@/features/learn/components/search-bar';
import { useCourses } from '@/features/learn/hooks/use-courses';
import { useBookmarks } from '@/features/learn/hooks/use-bookmarks';
import { useAuth } from '@/features/learn/auth/context/auth-context';
import type { CourseFilters as FiltersType } from '@/features/learn/types';

export function CoursesListPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [filters, setFilters] = React.useState<FiltersType>({
    page: 1,
    limit: 12,
    category: params.get('category') ?? '',
    difficulty: (params.get('difficulty') as FiltersType['difficulty']) ?? '',
    search: params.get('search') ?? '',
    sort: (params.get('sort') as FiltersType['sort']) ?? 'newest',
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const { data, isLoading } = useCourses(filters);
  const { data: bookmarkedCourses } = useBookmarks();
  const { isAuthenticated } = useAuth();

  const bookmarkedIds = React.useMemo(
    () => new Set(bookmarkedCourses?.map((c) => c.id) ?? []),
    [bookmarkedCourses],
  );

  const updateFilters = (newFilters: FiltersType) => {
    setFilters(newFilters);
    const p = new URLSearchParams();
    if (newFilters.search) p.set('search', newFilters.search);
    if (newFilters.category) p.set('category', newFilters.category);
    if (newFilters.difficulty) p.set('difficulty', newFilters.difficulty);
    if (newFilters.sort && newFilters.sort !== 'newest') p.set('sort', newFilters.sort);
    const qs = p.toString();
    router.replace(qs ? `/learn/courses?${qs}` : '/learn/courses', { scroll: false });
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">All Courses</h1>
        <div className="flex items-center gap-3">
          <SearchBar
            value={filters.search ?? ''}
            onChange={(v) => updateFilters({ ...filters, search: v, page: 1 })}
            className="flex-1 max-w-md"
          />
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 lg:hidden"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="size-4" />
            Filters
          </Button>
        </div>
        {data && (
          <p className="text-sm text-muted-foreground">
            {data.total} course{data.total !== 1 ? 's' : ''} found
          </p>
        )}
      </div>

      <div className="flex gap-8">
        <CourseFilters
          filters={filters}
          onChange={updateFilters}
          className="hidden lg:block w-56 flex-shrink-0"
        />

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-72 bg-card border-r border-border p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Filters</span>
                <Button variant="ghost" size="sm" onClick={() => setMobileFiltersOpen(false)}>
                  Close
                </Button>
              </div>
              <CourseFilters filters={filters} onChange={updateFilters} />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <CourseGrid
            data={data}
            isLoading={isLoading}
            bookmarkedIds={isAuthenticated ? bookmarkedIds : new Set()}
            currentPage={filters.page ?? 1}
            onPageChange={(page) => updateFilters({ ...filters, page })}
          />
        </div>
      </div>
    </div>
  );
}
