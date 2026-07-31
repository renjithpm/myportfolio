import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

export interface CourseProgressResult {
  completedLessons: string[];
  totalLessons: number;
  percentComplete: number;
}

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(userId: string, dto: UpdateProgressDto) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id: dto.lessonId } });
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return this.prisma.userProgress.upsert({
      where: { userId_lessonId: { userId, lessonId: dto.lessonId } },
      create: {
        userId,
        lessonId: dto.lessonId,
        completed: dto.completed,
        completedAt: dto.completed ? new Date() : null,
      },
      update: {
        completed: dto.completed,
        completedAt: dto.completed ? new Date() : null,
      },
    });
  }

  async getCourseProgress(userId: string, courseId: string): Promise<CourseProgressResult> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: { include: { lessons: { select: { id: true } } } },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const totalLessons = allLessonIds.length;

    const completedProgress = await this.prisma.userProgress.findMany({
      where: {
        userId,
        lessonId: { in: allLessonIds },
        completed: true,
      },
      select: { lessonId: true },
    });

    const completedLessons = completedProgress.map((p) => p.lessonId);
    const percentComplete =
      totalLessons === 0 ? 0 : Math.round((completedLessons.length / totalLessons) * 100);

    return { completedLessons, totalLessons, percentComplete };
  }
}
