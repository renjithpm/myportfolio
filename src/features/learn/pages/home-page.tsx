'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Users, Award, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SearchBar } from '@/features/learn/components/search-bar';
import { CourseCard } from '@/features/learn/components/course-card';
import { CourseCardSkeleton } from '@/features/learn/components/course-card-skeleton';
import { useRouter } from 'next/navigation';
import { useFeaturedCourses } from '@/features/learn/hooks/use-courses';
import { useCategories } from '@/features/learn/hooks/use-categories';
import { useOffers } from '@/features/learn/hooks/use-offers';
import { useBookmarks } from '@/features/learn/hooks/use-bookmarks';
import { useAuth } from '@/features/learn/auth/context/auth-context';

export function LearnHomePage() {
  const router = useRouter();
  const [search, setSearch] = React.useState('');
  const { data: featured, isLoading: featuredLoading } = useFeaturedCourses();
  const { data: categories } = useCategories();
  const { data: offers } = useOffers();
  const { data: bookmarkedCourses } = useBookmarks();
  const { isAuthenticated } = useAuth();

  const bookmarkedIds = React.useMemo(
    () => new Set(bookmarkedCourses?.map((c) => c.id) ?? []),
    [bookmarkedCourses],
  );

  const activeOffers = offers?.filter((o) => o.isActive) ?? [];

  const handleSearch = (v: string) => {
    if (v.trim()) {
      router.push(`/learn/courses?search=${encodeURIComponent(v.trim())}`);
    }
  };

  return (
    <div className="space-y-0">
      {activeOffers.length > 0 && (
        <div className="bg-primary/10 border-b border-primary/20 text-center py-2 px-4">
          <p className="text-sm text-primary font-medium">
            {activeOffers[0]?.name}
            {activeOffers[0]?.percentDiscount && ` — ${activeOffers[0].percentDiscount}% off`}
            {activeOffers[0]?.fixedDiscount && ` — AED ${activeOffers[0].fixedDiscount} off`}
          </p>
        </div>
      )}

      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 py-24 sm:py-32">
        <div className="bg-grid absolute inset-0 pointer-events-none" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Learn from the{' '}
            <span className="text-gradient">best instructors</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Expand your skills with expertly crafted courses in development, design,
            and more. Learn at your own pace.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search courses..."
              className="w-full max-w-md"
            />
            <Button
              variant="gradient"
              size="lg"
              onClick={() => handleSearch(search)}
            >
              Search
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-4 text-primary" />
              100+ courses
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-primary" />
              10,000+ students
            </span>
            <span className="flex items-center gap-1.5">
              <Award className="size-4 text-primary" />
              Certificates included
            </span>
          </div>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Browse Categories</h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/learn/courses">
                  All courses <ArrowRight className="size-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/learn/courses?category=${cat.id}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/50 hover:bg-accent hover:-translate-y-0.5"
                >
                  {cat.imageUrl ? (
                    <div className="relative size-12 overflow-hidden rounded-lg">
                      <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary text-xl font-bold">
                      {cat.name[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 sm:py-20 bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Courses</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Hand-picked by our team
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/learn/courses">
                View all <ArrowRight className="size-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featuredLoading
              ? Array.from({ length: 4 }).map((_, i) => <CourseCardSkeleton key={i} />)
              : featured?.slice(0, 4).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    isBookmarked={bookmarkedIds.has(course.id)}
                    showBookmark={isAuthenticated}
                  />
                ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 sm:p-12 text-center space-y-6">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Ready to start learning?
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Join thousands of learners and start your journey today.
              Free courses available.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="gradient" size="lg">
                <Link href="/learn/courses">Browse Courses</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/learn/plans">View Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
