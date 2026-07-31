import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { LessonType } from '@prisma/client';

export class CreateLessonDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(LessonType)
  type: LessonType;

  @IsInt()
  @Min(0)
  @IsOptional()
  durationMinutes?: number;

  @IsString()
  @IsOptional()
  resourceUrl?: string;

  @IsBoolean()
  @IsOptional()
  downloadAllowed?: boolean;

  @IsBoolean()
  @IsOptional()
  previewEnabled?: boolean;

  @IsInt()
  @Min(0)
  order: number;
}
