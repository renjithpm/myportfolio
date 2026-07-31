import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CourseModulesService } from './course-modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { ReorderModulesDto } from './dto/reorder-modules.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}

  @Post('courses/:courseId/modules')
  @HttpCode(HttpStatus.CREATED)
  create(@Param('courseId') courseId: string, @Body() dto: CreateModuleDto) {
    return this.courseModulesService.create(courseId, dto);
  }

  @Put('modules/:id')
  update(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.courseModulesService.update(id, dto);
  }

  @Delete('modules/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.courseModulesService.delete(id);
  }

  @Patch('modules/reorder')
  reorder(@Body() dto: ReorderModulesDto): Promise<void> {
    return this.courseModulesService.reorder(dto.items);
  }
}
