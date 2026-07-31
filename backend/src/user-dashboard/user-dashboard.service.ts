import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseStatus, SubStatus } from '@prisma/client';

@Injectable()
export class UserDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const [purchasedCourses, subscription, bookmarkedCourses, recentActivity] = await Promise.all([
      this.prisma.purchase.findMany({
        where: { userId, status: PurchaseStatus.PAID },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              instructor: true,
              durationHours: true,
            },
          },
        },
        orderBy: { purchasedAt: 'desc' },
      }),
      this.prisma.subscription.findFirst({
        where: { userId, status: SubStatus.ACTIVE },
        include: { plan: true },
        orderBy: { startedAt: 'desc' },
      }),
      this.prisma.bookmark.findMany({
        where: { userId },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              thumbnail: true,
              instructor: true,
              price: true,
              discountPrice: true,
              currency: true,
              isFree: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.userProgress.findMany({
        where: { userId, completed: true },
        include: { lesson: { select: { title: true, moduleId: true } } },
        orderBy: { completedAt: 'desc' },
        take: 5,
      }),
    ]);

    const courseIds = purchasedCourses.map((p) => p.courseId);
    const progressData = await this.prisma.course.findMany({
      where: { id: { in: courseIds } },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                progress: { where: { userId }, select: { completed: true, lessonId: true } },
              },
            },
          },
        },
      },
    });

    const inProgressCourses: typeof progressData = [];
    const completedCourses: typeof progressData = [];

    for (const course of progressData) {
      const allLessons = course.modules.flatMap((m) => m.lessons);
      const totalLessons = allLessons.length;
      const completedLessons = allLessons.filter((l) => l.progress.some((p) => p.completed)).length;

      if (totalLessons === 0) continue;

      if (completedLessons === totalLessons) {
        completedCourses.push(course);
      } else if (completedLessons > 0) {
        inProgressCourses.push(course);
      }
    }

    return {
      purchasedCourses: purchasedCourses.map((p) => p.course),
      subscription: subscription ?? null,
      inProgressCourses: inProgressCourses.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        thumbnail: c.thumbnail,
      })),
      completedCourses: completedCourses.map((c) => ({
        id: c.id,
        title: c.title,
        slug: c.slug,
        thumbnail: c.thumbnail,
      })),
      bookmarkedCourses: bookmarkedCourses.map((b) => b.course),
      recentActivity,
    };
  }
}
