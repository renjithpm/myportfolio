'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { purchasesService } from '@/features/learn/services/purchases.service';
import type { ConfirmPurchasePayload } from '@/features/learn/types';

export const purchaseKeys = {
  all: ['purchases'] as const,
};

export function usePurchases() {
  return useQuery({
    queryKey: purchaseKeys.all,
    queryFn: purchasesService.list,
  });
}

export function useInitiatePurchase() {
  return useMutation({
    mutationFn: ({ courseId, couponCode }: { courseId: string; couponCode?: string }) =>
      purchasesService.initiate({ courseId, couponCode }),
  });
}

export function useConfirmPurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & ConfirmPurchasePayload) =>
      purchasesService.confirm(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: purchaseKeys.all });
    },
  });
}
