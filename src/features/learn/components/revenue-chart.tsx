'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
  className?: string;
}

export function RevenueChart({ data, className }: RevenueChartProps) {
  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Monthly Revenue (AED)</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="flex items-end gap-2 h-40"
          role="img"
          aria-label="Monthly revenue bar chart"
        >
          {data.map((d) => {
            const heightPct = (d.revenue / max) * 100;
            return (
              <div
                key={d.month}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {d.revenue > 0
                    ? d.revenue >= 1000
                      ? `${(d.revenue / 1000).toFixed(1)}k`
                      : String(d.revenue)
                    : ''}
                </span>
                <div
                  className={cn(
                    'w-full rounded-t-sm bg-primary/70 transition-all hover:bg-primary',
                    heightPct === 0 && 'opacity-20',
                  )}
                  style={{ height: `${Math.max(heightPct, 4)}%` }}
                  title={`${d.month}: AED ${d.revenue.toLocaleString()}`}
                />
                <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                  {d.month}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
