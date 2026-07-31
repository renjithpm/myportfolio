import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
  constructor(private readonly prisma: PrismaService) {}

  async findActive() {
    const now = new Date();
    return this.prisma.offer.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        offerCourses: { include: { course: { select: { id: true, title: true, slug: true } } } },
        offerCategories: { include: { category: { select: { id: true, name: true, slug: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.offer.findMany({
      include: {
        offerCourses: { include: { course: { select: { id: true, title: true, slug: true } } } },
        offerCategories: { include: { category: { select: { id: true, name: true, slug: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateOfferDto) {
    const { courseIds, categoryIds, startDate, endDate, ...data } = dto;
    return this.prisma.offer.create({
      data: {
        ...data,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        offerCourses: courseIds
          ? { create: courseIds.map((courseId) => ({ courseId })) }
          : undefined,
        offerCategories: categoryIds
          ? { create: categoryIds.map((categoryId) => ({ categoryId })) }
          : undefined,
      },
    });
  }

  async update(id: string, dto: UpdateOfferDto) {
    await this.findOne(id);
    const { courseIds, categoryIds, startDate, endDate, ...data } = dto;

    return this.prisma.offer.update({
      where: { id },
      data: {
        ...data,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(courseIds && {
          offerCourses: { deleteMany: {}, create: courseIds.map((courseId) => ({ courseId })) },
        }),
        ...(categoryIds && {
          offerCategories: { deleteMany: {}, create: categoryIds.map((categoryId) => ({ categoryId })) },
        }),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.offer.delete({ where: { id } });
  }

  private async findOne(id: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id } });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }
}
