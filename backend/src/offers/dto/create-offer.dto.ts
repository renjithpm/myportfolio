import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OfferType } from '@prisma/client';

export class CreateOfferDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(OfferType)
  offerType: OfferType;

  @IsNumber()
  @Min(0)
  @IsOptional()
  percentDiscount?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  fixedDiscount?: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  maxUses?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  courseIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds?: string[];
}
