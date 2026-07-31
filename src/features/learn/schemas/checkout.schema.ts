import { z } from 'zod';

export const couponSchema = z.object({
  code: z.string().min(1, 'Enter a coupon code').max(50),
});

export const checkoutSchema = z.object({
  couponCode: z.string().optional(),
  paymentMethod: z.enum(['CARD', 'BANK_TRANSFER', 'WALLET']).default('CARD'),
  transactionId: z.string().optional(),
});

export type CouponValues = z.infer<typeof couponSchema>;
export type CheckoutValues = z.infer<typeof checkoutSchema>;
