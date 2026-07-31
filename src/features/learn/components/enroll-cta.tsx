'use client';

import * as React from 'react';
import Link from 'next/link';
import { ShoppingCart, Play, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PriceDisplay } from './price-display';
import type { Course } from '@/features/learn/types';

interface EnrollCtaProps {
  course: Course;
  isPurchased?: boolean;
  hasSubscription?: boolean;
}

export function EnrollCta({ course, isPurchased = false, hasSubscription = false }: EnrollCtaProps) {
  const hasAccess = isPurchased || hasSubscription;

  return (
    <Card className="sticky top-24">
      <CardContent className="p-5 space-y-4">
        <PriceDisplay
          price={course.price}
          discountPrice={course.discountPrice}
          currency={course.currency}
          isFree={course.isFree}
          size="lg"
        />

        {hasAccess ? (
          <Button
            asChild
            variant="gradient"
            className="w-full"
          >
            <Link href={`/learn/player/${course.id}`}>
              <Play className="size-4 mr-2" />
              Continue Learning
            </Link>
          </Button>
        ) : (
          <>
            {course.isFree || course.price === 0 ? (
              <Button asChild variant="gradient" className="w-full">
                <Link href={`/learn/player/${course.id}`}>
                  <Play className="size-4 mr-2" />
                  Enroll Free
                </Link>
              </Button>
            ) : (
              <Button asChild variant="gradient" className="w-full">
                <Link href={`/learn/checkout/${course.slug}`}>
                  <ShoppingCart className="size-4 mr-2" />
                  Enroll Now
                </Link>
              </Button>
            )}
          </>
        )}

        <ul className="space-y-2 text-sm text-muted-foreground">
          {[
            `${course.durationHours}h of content`,
            `${course.language} language`,
            course.modules.length > 0 && `${course.modules.length} modules`,
            'Certificate on completion',
          ]
            .filter(Boolean)
            .map((item) => (
              <li key={String(item)} className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
