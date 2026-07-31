import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProgressDto {
  @IsString()
  @IsNotEmpty()
  lessonId: string;

  @IsBoolean()
  completed: boolean;
}
