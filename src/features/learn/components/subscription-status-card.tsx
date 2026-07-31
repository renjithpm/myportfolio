'use client';

import * as React from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCancelSubscription } from '@/features/learn/hooks/use-subscriptions';
import type { Subscription } from '@/features/learn/types';

interface SubscriptionStatusCardProps {
  subscription: Subscription;
}

export function SubscriptionStatusCard({ subscription }: SubscriptionStatusCardProps) {
  const { mutateAsync: cancel, isPending } = useCancelSubscription();

  const isActive = subscription.status === 'ACTIVE';
  const expiresAt = subscription.expiresAt
    ? new Date(subscription.expiresAt)
    : null;

  const handleCancel = async () => {
    if (!confirm('Cancel your subscription? You will retain access until expiry.')) return;
    try {
      await cancel();
      toast.success('Subscription cancelled.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed to cancel.');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{subscription.plan.name}</CardTitle>
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {subscription.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          {isActive ? (
            <CheckCircle2 className="size-4 text-emerald-500" />
          ) : (
            <AlertCircle className="size-4 text-muted-foreground" />
          )}
          <span className="text-muted-foreground">
            {subscription.billingCycle === 'ANNUAL' ? 'Annual' : 'Monthly'} billing
          </span>
        </div>

        {expiresAt && (
          <p className="text-sm text-muted-foreground">
            {subscription.status === 'CANCELLED' ? 'Access until ' : 'Renews on '}
            <span className="font-medium text-foreground">
              {expiresAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </p>
        )}

        {isActive && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:text-destructive"
            disabled={isPending}
            onClick={() => void handleCancel()}
          >
            {isPending && <Loader2 className="size-4 mr-2 animate-spin" />}
            Cancel Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
