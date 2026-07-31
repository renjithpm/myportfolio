import * as React from 'react';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  discountPrice?: number;
  currency?: string;
  isFree?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({
  price,
  discountPrice,
  currency = 'AED',
  isFree = false,
  className,
  size = 'md',
}: PriceDisplayProps) {
  const sizeMap = {
    sm: { main: 'text-sm font-semibold', original: 'text-xs' },
    md: { main: 'text-lg font-bold', original: 'text-sm' },
    lg: { main: 'text-2xl font-bold', original: 'text-base' },
  };
  const { main, original } = sizeMap[size];

  if (isFree || price === 0) {
    return (
      <span className={cn('font-bold text-emerald-500', main, className)}>
        Free
      </span>
    );
  }

  const display = discountPrice ?? price;

  return (
    <span className={cn('flex items-baseline gap-1.5', className)}>
      <span className={cn('text-foreground', main)}>
        {currency} {display.toFixed(2)}
      </span>
      {discountPrice !== undefined && discountPrice < price && (
        <span className={cn('text-muted-foreground line-through', original)}>
          {currency} {price.toFixed(2)}
        </span>
      )}
    </span>
  );
}
