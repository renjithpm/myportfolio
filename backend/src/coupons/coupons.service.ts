import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { Coupon } from '@prisma/client';

export interface ValidationResult {
  valid: boolean;
  discountAmount: number;
  coupon: Coupon | null;
}

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(dto: ValidateCouponDto, userId: string): Promise<ValidationResult> {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.code } });

    if (!coupon || !coupon.isActive) {
      return { valid: false, discountAmount: 0, coupon: null };
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return { valid: false, discountAmount: 0, coupon: null };
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discountAmount: 0, coupon: null };
    }

    if (coupon.minPurchaseAmount !== null && dto.amount < coupon.minPurchaseAmount) {
      return { valid: false, discountAmount: 0, coupon: null };
    }

    const userUses = await this.prisma.purchase.count({
      where: { userId, couponId: dto.code },
    });
    if (userUses >= coupon.perUserLimit) {
      return { valid: false, discountAmount: 0, coupon: null };
    }

    let discountAmount = 0;
    if (coupon.percentDiscount !== null) {
      discountAmount = (dto.amount * coupon.percentDiscount) / 100;
    } else if (coupon.fixedDiscount !== null) {
      discountAmount = Math.min(coupon.fixedDiscount, dto.amount);
    }

    return { valid: true, discountAmount, coupon };
  }

  async create(dto: CreateCouponDto): Promise<Coupon> {
    const existing = await this.prisma.coupon.findUnique({ where: { code: dto.code } });
    if (existing) {
      throw new BadRequestException('Coupon code already exists');
    }
    return this.prisma.coupon.create({
      data: {
        ...dto,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      },
    });
  }

  async findAll(): Promise<Coupon[]> {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async toggleActive(code: string): Promise<Coupon> {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return this.prisma.coupon.update({
      where: { code },
      data: { isActive: !coupon.isActive },
    });
  }
}
