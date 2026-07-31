import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseQueryDto } from './dto/course-query.dto';
import { Course, CourseStatus, Prisma } from '@prisma/client';

const SAFE_COURSE_SELECT = {
  id: true,
  title: true,
  subtitle: true,
  slug: true,
  shortDescription: true,
  thumbnail: true,
  instructor: true,
  difficulty: true,
  durationHours: true,
  language: true,
  price: true,
  discountPrice: true,
  currency: true,
  isFree: true,
  isFeatured: true,
  isBestseller: true,
  status: true,
  courseOrder: true,
  createdAt: true,
  updatedAt: true,
  category: { select: { id: true, name: true, slug: true } },
  tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
} as const;

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: CourseQueryDto): Promise<{
    data: Prisma.CourseGetPayload<{ select: typeof SAFE_COURSE_SELECT }>[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const skip = (page - 1) * limit;

    const where: Prisma.CourseWhereInput = {
      status: CourseStatus.PUBLISHED,
    };

    if (query.category) {
      where.category = { slug: query.category };
    }
    if (query.tag) {
      where.tags = { some: { tag: { slug: query.tag } } };
    }
    if (query.difficulty) {
      where.difficulty = query.difficulty;
    }
    if (typeof query.isFree === 'boolean') {
      where.isFree = query.isFree;
    }
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { shortDescription: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    const orderBy: Prisma.CourseOrderByWithRelationInput =
      query.sort === 'price_asc'
        ? { price: 'asc' }
        : query.sort === 'price_desc'
          ? { price: 'desc' }
          : query.sort === 'newest'
            ? { createdAt: 'desc' }
            : { courseOrder: 'asc' };

    const [data, total] = await Promise.all([
      this.prisma.course.findMany({ where, skip, take: limit, orderBy, select: SAFE_COURSE_SELECT }),
      this.prisma.course.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findFeatured() {
    return this.prisma.course.findMany({
      where: { isFeatured: true, status: CourseStatus.PUBLISHED },
      select: SAFE_COURSE_SELECT,
      take: 8,
      orderBy: { courseOrder: 'asc' },
    });
  }

  async findBySlug(slug: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                type: true,
                durationMinutes: true,
                downloadAllowed: true,
                previewEnabled: true,
                order: true,
                resourceUrl: true,
              },
            },
          },
        },
      },
    });

    if (!course || course.status !== CourseStatus.PUBLISHED) {
      throw new NotFoundException('Course not found');
    }

    let hasPurchase = false;
    let hasSubscription = false;

    if (userId) {
      const purchase = await this.prisma.purchase.findFirst({
        where: { userId, courseId: course.id, status: 'PAID' },
      });
      hasPurchase = !!purchase;

      if (!hasPurchase) {
        const subscription = await this.prisma.subscription.findFirst({
          where: { userId, status: 'ACTIVE', plan: { premiumAccess: true } },
        });
        hasSubscription = !!subscription;
      }
    }

    const modulesWithAccess = course.modules.map((mod) => ({
      ...mod,
      lessons: mod.lessons.map((lesson) => {
        const hasAccess =
          course.isFree || lesson.previewEnabled || hasPurchase || hasSubscription;
        return hasAccess
          ? lesson
          : { id: lesson.id, title: lesson.title, type: lesson.type, durationMinutes: lesson.durationMinutes, previewEnabled: false, downloadAllowed: false, order: lesson.order, resourceUrl: null, description: null };
      }),
    }));

    const { modules: _m, ...rest } = course;
    return { ...rest, modules: modulesWithAccess };
  }

  async findById(id: string): Promise<Course> {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }
    return course;
  }

  async create(dto: CreateCourseDto) {
    const { tagIds, ...data } = dto;
    const slug = await this.generateSlug(data.title);

    return this.prisma.course.create({
      data: {
        ...data,
        slug,
        tags: tagIds
          ? { create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) }
          : undefined,
      },
      select: SAFE_COURSE_SELECT,
    });
  }

  async update(id: string, dto: UpdateCourseDto) {
    await this.findById(id);
    const { tagIds, ...data } = dto;

    return this.prisma.course.update({
      where: { id },
      data: {
        ...data,
        tags: tagIds
          ? {
              deleteMany: {},
              create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
            }
          : undefined,
      },
      select: SAFE_COURSE_SELECT,
    });
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.course.delete({ where: { id } });
  }

  async togglePublish(id: string): Promise<{ status: CourseStatus }> {
    const course = await this.findById(id);
    const status =
      course.status === CourseStatus.PUBLISHED ? CourseStatus.DRAFT : CourseStatus.PUBLISHED;
    await this.prisma.course.update({ where: { id }, data: { status } });
    return { status };
  }

  async findForAdmin() {
    return this.prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        ...SAFE_COURSE_SELECT,
        description: true,
        _count: { select: { modules: true, purchases: true } },
      },
    });
  }

  async findByIdForAdmin(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: { orderBy: { order: 'asc' } },
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  private async generateSlug(title: string): Promise<string> {
    const base = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    let slug = base;
    let counter = 1;
    while (await this.prisma.course.findUnique({ where: { slug } })) {
      slug = `${base}-${counter}`;
      counter++;
    }
    return slug;
  }
}
