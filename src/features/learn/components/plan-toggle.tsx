'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { BillingCycle } from '@/features/learn/types';

interface PlanToggleProps {
  value: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export function PlanToggle({ value, onChange }: PlanToggleProps) {
  return (
    <div
      role="group"
      aria-label="Billing cycle"
      className="inline-flex items-center rounded-full border border-border bg-muted p-1"
    >
      {(['MONTHLY', 'ANNUAL'] as BillingCycle[]).map((cycle) => (
        <button
          key={cycle}
          type="button"
          onClick={() => onChange(cycle)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
            value === cycle
              ? 'bg-background text-foreground shadow-soft'
              : 'text-muted-foreground hover:text-foreground',
          )}
          aria-pressed={value === cycle}
        >
          {cycle === 'MONTHLY' ? 'Monthly' : 'Annual'}
          {cycle === 'ANNUAL' && (
            <span className="ml-1.5 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-500">
              Save 20%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
