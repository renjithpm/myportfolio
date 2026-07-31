'use client';

import * as React from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useCategories } from '@/features/learn/hooks/use-categories';
import type { CourseFilters, Difficulty } from '@/features/learn/types';

interface CourseFiltersProps {
  filters: CourseFilters;
  onChange: (filters: CourseFilters) => void;
  className?: string;
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
] as const;

export function CourseFilters({ filters, onChange, className }: CourseFiltersProps) {
  const { data: categories } = useCategories();

  const hasActiveFilters = Boolean(
    filters.category || filters.difficulty || filters.isFree !== undefined,
  );

  const reset = () =>
    onChange({
      ...filters,
      category: '',
      difficulty: '',
      isFree: '',
      page: 1,
    });

  return (
    <aside className={className} aria-label="Course filters">
      <div className="sticky top-24 space-y-6">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <SlidersHorizontal className="size-4" /> Filters
          </span>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={reset} className="h-7 text-xs">
              <X className="size-3 mr-1" /> Clear
            </Button>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Sort by
          </Label>
          <Select
            value={filters.sort ?? 'newest'}
            onValueChange={(v) =>
              onChange({ ...filters, sort: v as CourseFilters['sort'], page: 1 })
            }
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Category
          </Label>
          <Select
            value={filters.category ?? ''}
            onValueChange={(v) => onChange({ ...filters, category: v, page: 1 })}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories?.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Level
          </Label>
          <div className="space-y-2">
            {DIFFICULTIES.map((d) => (
              <div key={d.value} className="flex items-center gap-2">
                <Checkbox
                  id={`diff-${d.value}`}
                  checked={filters.difficulty === d.value}
                  onCheckedChange={(checked) =>
                    onChange({
                      ...filters,
                      difficulty: checked ? d.value : '',
                      page: 1,
                    })
                  }
                />
                <Label htmlFor={`diff-${d.value}`} className="text-sm font-normal cursor-pointer">
                  {d.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Price
          </Label>
          <div className="flex items-center gap-2">
            <Checkbox
              id="filter-free"
              checked={filters.isFree === true}
              onCheckedChange={(checked) =>
                onChange({ ...filters, isFree: checked ? true : '', page: 1 })
              }
            />
            <Label htmlFor="filter-free" className="text-sm font-normal cursor-pointer">
              Free only
            </Label>
          </div>
        </div>
      </div>
    </aside>
  );
}
