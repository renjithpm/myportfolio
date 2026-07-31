import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class InitiatePurchaseDto {
  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsOptional()
  couponCode?: string;
}
