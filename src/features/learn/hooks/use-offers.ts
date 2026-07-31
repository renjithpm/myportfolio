'use client';

import { useQuery } from '@tanstack/react-query';
import { offersService } from '@/features/learn/services/offers.service';

export const offerKeys = {
  all: ['offers'] as const,
};

export function useOffers() {
  return useQuery({
    queryKey: offerKeys.all,
    queryFn: offersService.list,
  });
}
