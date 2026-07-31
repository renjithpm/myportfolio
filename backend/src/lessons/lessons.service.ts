import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { Lesson } from '@prisma/client';

export interface AccessResult {
  hasAccess: boolean;
  reason: 'preview' | 'free' | 'purchased' | 'subscribed' | 'locked';
}

export interface ReorderItem {
  id: string;
  order: number;
}

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(moduleId: string, dto: CreateLessonDto): Promise<Lesson> {
    const mod = await this.prisma.courseModule.findUnique({ where: { id: moduleId } });
    if (!mod) {
      throw new NotFoundException('Module not found');
    }
    return this.prisma.lesson.create({ data: { ...dto, moduleId } });
  }

  async update(id: string, dto: UpdateLessonDto): Promise<Lesson> {
    await this.findOne(id);
    return this.prisma.lesson.update({ where: { id }, data: dto });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.lesson.delete({ where: { id } });
  }

  async reorder(items: ReorderItem[]): Promise<void> {
    await Promise.all(
      items.map((item) =>
        this.prisma.lesson.update({
          where: { id: item.id },
          data: { order: item.order },
        }),
      ),
    );
  }

  async checkAccess(lessonId: string, userId?: string): Promise<AccessResult> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (lesson.previewEnabled) {
      return { hasAccess: true, reason: 'preview' };
    }

    const course = lesson.module.course;

    if (course.isFree) {
      return { hasAccess: true, reason: 'free' };
    }

    if (!userId) {
      return { hasAccess: false, reason: 'locked' };
    }

    const purchase = await this.prisma.purchase.findFirst({
      where: { userId, courseId: course.id, status: 'PAID' },
    });
    if (purchase) {
      return { hasAccess: true, reason: 'purchased' };
    }

    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE', plan: { premiumAccess: true } },
    });
    if (subscription) {
      return { hasAccess: true, reason: 'subscribed' };
    }

    return { hasAccess: false, reason: 'locked' };
  }

  private async findOne(id: string): Promise<Lesson> {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }
    return lesson;
  }
}
