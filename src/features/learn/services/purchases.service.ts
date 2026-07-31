import { apiClient } from './api-client';
import type { Purchase, PurchaseInitiateResponse, ConfirmPurchasePayload } from '@/features/learn/types';

interface InitiatePayload { courseId: string; couponCode?: string }

export const purchasesService = {
  initiate: (payload: InitiatePayload) =>
    apiClient.post<PurchaseInitiateResponse>('/purchases/initiate', payload),

  confirm: (id: string, payload: ConfirmPurchasePayload) =>
    apiClient.post<{ status: string }>(`/purchases/${id}/confirm`, payload),

  list: () => apiClient.get<Purchase[]>('/purchases'),
};
