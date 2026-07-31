'use client';

import * as React from 'react';
import { Tag, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { couponsService } from '@/features/learn/services/coupons.service';

interface CouponInputProps {
  courseId: string;
  amount: number;
  onApply: (discountAmount: number, code: string) => void;
  onRemove: () => void;
  appliedCode?: string;
  appliedDiscount?: number;
}

export function CouponInput({
  courseId,
  amount,
  onApply,
  onRemove,
  appliedCode,
  appliedDiscount,
}: CouponInputProps) {
  const [code, setCode] = React.useState('');
  const [isValidating, setIsValidating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validate = async () => {
    if (!code.trim()) return;
    setIsValidating(true);
    setError(null);
    try {
      const res = await couponsService.validate(code.trim(), courseId, amount);
      if (res.valid) {
        onApply(res.discountAmount, code.trim());
        setCode('');
      } else {
        setError('Invalid or expired coupon code.');
      }
    } catch {
      setError('Could not validate coupon. Please try again.');
    } finally {
      setIsValidating(false);
    }
  };

  if (appliedCode) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2">
        <CheckCircle2 className="size-4 text-emerald-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{appliedCode}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400">
            AED {appliedDiscount?.toFixed(2)} discount applied
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={onRemove}
        >
          <XCircle className="size-3.5 mr-1" />
          Remove
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Coupon code"
            className="pl-8 h-9 text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void validate();
              }
            }}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!code.trim() || isValidating}
          onClick={() => void validate()}
        >
          {isValidating ? <Loader2 className="size-4 animate-spin" /> : 'Apply'}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
