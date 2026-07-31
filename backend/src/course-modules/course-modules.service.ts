import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { CourseModule } from '@prisma/client';

export interface ReorderItem {
  id: string;
  order: number;
}

@Injectable()
export class CourseModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(courseId: string, dto: CreateModuleDto): Promise<CourseModule> {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return this.prisma.courseModule.create({ data: { ...dto, courseId } });
  }

  async update(id: string, dto: UpdateModuleDto): Promise<CourseModule> {
    await this.findOne(id);
    return this.prisma.courseModule.update({ where: { id }, data: dto });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.courseModule.delete({ where: { id } });
  }

  async reorder(items: ReorderItem[]): Promise<void> {
    await Promise.all(
      items.map((item) =>
        this.prisma.courseModule.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
  }

  private async findOne(id: string): Promise<CourseModule> {
    const mod = await this.prisma.courseModule.findUnique({ where: { id } });
    if (!mod) {
      throw new NotFoundException('Module not found');
    }
    return mod;
  }
}
