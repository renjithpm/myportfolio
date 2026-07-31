'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CouponInput } from './coupon-input';
import { PriceDisplay } from './price-display';
import { useInitiatePurchase, useConfirmPurchase } from '@/features/learn/hooks/use-purchases';
import { useAuth } from '@/features/learn/auth/context/auth-context';
import { loadRazorpay } from '@/features/learn/lib/razorpay';
import type { Course } from '@/features/learn/types';

interface CheckoutFormProps {
  course: Course;
}

export function CheckoutForm({ course }: CheckoutFormProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { mutateAsync: initiate, isPending: isInitiating } = useInitiatePurchase();
  const { mutateAsync: confirm, isPending: isConfirming } = useConfirmPurchase();

  const [appliedCode, setAppliedCode] = React.useState<string | undefined>();
  const [appliedDiscount, setAppliedDiscount] = React.useState(0);
  const [isLoadingScript, setIsLoadingScript] = React.useState(false);
  const paymentCompletedRef = React.useRef(false);

  const subtotal = course.discountPrice ?? course.price;
  const total = Math.max(subtotal - appliedDiscount, 0);
  const isPending = isInitiating || isLoadingScript || isConfirming;

  const handleCheckout = async () => {
    try {
      const res = await initiate({ courseId: course.id, couponCode: appliedCode });

      setIsLoadingScript(true);
      const loaded = await loadRazorpay();
      setIsLoadingScript(false);

      if (!loaded) {
        toast.error('Failed to load payment gateway. Please check your connection and try again.');
        return;
      }

      paymentCompletedRef.current = false;

      const rzp = new window.Razorpay({
        key: res.razorpayKey,
        amount: res.amount * 100,
        currency: res.currency,
        name: 'Renjith PM Academy',
        description: course.title,
        order_id: res.razorpayOrderId,
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        theme: { color: '#6366f1' },
        handler: (response) => {
          paymentCompletedRef.current = true;
          void (async () => {
            try {
              await confirm({
                id: res.purchaseId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              });
              toast.success('Enrollment successful! Enjoy the course.');
              router.push(`/learn/player/${course.id}`);
            } catch (e) {
              toast.error(e instanceof Error ? e.message : 'Payment confirmation failed. Contact support.');
            }
          })();
        },
        modal: {
          ondismiss: () => {
            if (!paymentCompletedRef.current) {
              toast.error('Payment cancelled.');
            }
          },
        },
      });

      rzp.open();
    } catch (e) {
      setIsLoadingScript(false);
      toast.error(e instanceof Error ? e.message : 'Checkout failed. Please try again.');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm leading-snug">{course.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{course.instructor}</p>
          </div>
          <PriceDisplay
            price={course.price}
            discountPrice={course.discountPrice}
            currency={course.currency}
            isFree={course.isFree}
            size="sm"
          />
        </div>

        <Separator />

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">Have a coupon?</Label>
          <CouponInput
            courseId={course.id}
            amount={subtotal}
            appliedCode={appliedCode}
            appliedDiscount={appliedDiscount}
            onApply={(discount, code) => {
              setAppliedDiscount(discount);
              setAppliedCode(code);
            }}
            onRemove={() => {
              setAppliedDiscount(0);
              setAppliedCode(undefined);
            }}
          />
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              {course.currency} {subtotal.toFixed(2)}
            </span>
          </div>
          {appliedDiscount > 0 && (
            <div className="flex justify-between text-emerald-500">
              <span>Coupon discount</span>
              <span>- {course.currency} {appliedDiscount.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>
              {course.currency} {total.toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          className="w-full"
          variant="gradient"
          disabled={isPending}
          onClick={() => void handleCheckout()}
        >
          {isPending ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <CreditCard className="size-4 mr-2" />
          )}
          {isInitiating && 'Preparing order...'}
          {isLoadingScript && 'Loading payment...'}
          {isConfirming && 'Confirming payment...'}
          {!isPending && `Pay ${course.currency} ${total.toFixed(2)}`}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Lock className="size-3" aria-hidden="true" />
          Secured by Razorpay
        </p>
      </CardContent>
    </Card>
  );
}
