import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LessonsService, AccessResult, ReorderItem } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { ReorderLessonsDto } from './dto/reorder-lessons.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtGuard } from '../auth/guards/optional-jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';
import { AuthenticatedUser } from '../auth/interfaces/auth.interface';

@Controller()
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Post('modules/:moduleId/lessons')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Param('moduleId') moduleId: string, @Body() dto: CreateLessonDto) {
    return this.lessonsService.create(moduleId, dto);
  }

  @Put('lessons/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.lessonsService.update(id, dto);
  }

  @Delete('lessons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string): Promise<void> {
    return this.lessonsService.delete(id);
  }

  @Patch('lessons/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  reorder(@Body() dto: ReorderLessonsDto): Promise<void> {
    return this.lessonsService.reorder(dto.items as ReorderItem[]);
  }

  @Get('lessons/:id/access')
  @UseGuards(OptionalJwtGuard)
  checkAccess(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser | null,
  ): Promise<AccessResult> {
    return this.lessonsService.checkAccess(id, user?.id);
  }
}
