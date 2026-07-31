import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BillingCycle } from '@prisma/client';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  planId: string;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;
}
