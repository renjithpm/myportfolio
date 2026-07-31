import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
  constructor(private readonly prisma: PrismaService) {}

  async findByUser(userId: string) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            instructor: true,
            difficulty: true,
            price: true,
            discountPrice: true,
            currency: true,
            isFree: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return bookmarks.map((b) => b.course);
  }

  async toggle(userId: string, courseId: string): Promise<{ bookmarked: boolean }> {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existing = await this.prisma.bookmark.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existing) {
      await this.prisma.bookmark.delete({
        where: { userId_courseId: { userId, courseId } },
      });
      return { bookmarked: false };
    }

    await this.prisma.bookmark.create({ data: { userId, courseId } });
    return { bookmarked: true };
  }
}
