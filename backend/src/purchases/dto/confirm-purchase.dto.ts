import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmPurchaseDto {
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @IsString()
  @IsNotEmpty()
  razorpayOrderId: string;

  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;
}
