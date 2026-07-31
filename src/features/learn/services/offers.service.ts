import { publicGet } from './api-client';
import type { Offer } from '@/features/learn/types';

export const offersService = {
  list: () => publicGet<Offer[]>('/offers'),
};
