import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ValidateCouponDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsNumber()
  @Min(0)
  amount: number;
}
