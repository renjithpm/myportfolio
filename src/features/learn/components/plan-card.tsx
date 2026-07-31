'use client';

import * as React from 'react';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { BillingCycle, SubscriptionPlan } from '@/features/learn/types';

interface PlanCardProps {
  plan: SubscriptionPlan;
  billingCycle: BillingCycle;
  isActive?: boolean;
  isCurrent?: boolean;
  onSubscribe?: () => void;
  isLoading?: boolean;
}

export function PlanCard({
  plan,
  billingCycle,
  isActive = false,
  isCurrent = false,
  onSubscribe,
  isLoading = false,
}: PlanCardProps) {
  const price =
    billingCycle === 'ANNUAL' ? plan.annualPrice / 12 : plan.monthlyPrice;
  const isPopular = plan.tier === 'PRO';

  return (
    <Card
      className={cn(
        'relative flex flex-col transition-all duration-200',
        isActive && 'border-primary shadow-glow',
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-primary-foreground">
            Most Popular
          </span>
        </div>
      )}

      <CardHeader className="pb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {plan.tier}
        </p>
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">AED {price.toFixed(0)}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </div>
        {billingCycle === 'ANNUAL' && (
          <p className="text-xs text-muted-foreground">
            Billed annually (AED {plan.annualPrice}/year)
          </p>
        )}
        {plan.description && (
          <p className="text-sm text-muted-foreground">{plan.description}</p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-5">
        <ul className="space-y-2.5 flex-1">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="size-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {isCurrent ? (
          <Button variant="secondary" disabled className="w-full">
            Current Plan
          </Button>
        ) : (
          <Button
            variant={isPopular ? 'gradient' : 'outline'}
            className="w-full"
            disabled={isLoading || plan.tier === 'FREE'}
            onClick={onSubscribe}
          >
            {isLoading ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : plan.tier === 'FREE' ? (
              'Get Started Free'
            ) : (
              `Subscribe to ${plan.name}`
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
