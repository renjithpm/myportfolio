import { apiClient } from './api-client';
import type { CouponValidateResponse } from '@/features/learn/types';

export const couponsService = {
  validate: (code: string, courseId: string, amount: number) =>
    apiClient.post<CouponValidateResponse>('/coupons/validate', {
      code,
      courseId,
      amount,
    }),
};
