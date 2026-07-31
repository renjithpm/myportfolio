import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RazorpayService } from '../payments/razorpay.service';
import { InitiatePurchaseDto } from './dto/initiate-purchase.dto';
import { ConfirmPurchaseDto } from './dto/confirm-purchase.dto';
import { PurchaseStatus } from '@prisma/client';

export interface InitiateResult {
  purchaseId: string;
  invoiceNumber: string;
  amount: number;
  currency: string;
  appliedDiscount: number;
  razorpayOrderId: string;
  razorpayKey: string;
}

@Injectable()
export class PurchasesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly razorpayService: RazorpayService,
  ) {}

  async initiate(userId: string, dto: InitiatePurchaseDto): Promise<InitiateResult> {
    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const existing = await this.prisma.purchase.findFirst({
      where: { userId, courseId: dto.courseId, status: PurchaseStatus.PAID },
    });
    if (existing) {
      throw new BadRequestException('You already own this course');
    }

    let amount = course.discountPrice ?? course.price;
    let appliedDiscount = 0;
    let couponId: string | undefined;

    if (dto.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({ where: { code: dto.couponCode } });
      if (!coupon || !coupon.isActive) {
        throw new BadRequestException('Invalid or inactive coupon');
      }
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new BadRequestException('Coupon has expired');
      }
      if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
        throw new BadRequestException('Coupon usage limit reached');
      }
      if (coupon.minPurchaseAmount !== null && amount < coupon.minPurchaseAmount) {
        throw new BadRequestException(
          `Minimum purchase amount for this coupon is ${coupon.minPurchaseAmount} ${course.currency}`,
        );
      }

      const userCouponUses = await this.prisma.purchase.count({
        where: { userId, couponId: dto.couponCode },
      });
      if (userCouponUses >= coupon.perUserLimit) {
        throw new BadRequestException('You have already used this coupon');
      }

      if (coupon.percentDiscount !== null) {
        appliedDiscount = (amount * coupon.percentDiscount) / 100;
      } else if (coupon.fixedDiscount !== null) {
        appliedDiscount = Math.min(coupon.fixedDiscount, amount);
      }
      amount = Math.max(0, amount - appliedDiscount);
      couponId = dto.couponCode;
    }

    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const rzpOrder = await this.razorpayService.createOrder(amount, course.currency, invoiceNumber);

    const purchase = await this.prisma.purchase.create({
      data: {
        userId,
        courseId: dto.courseId,
        amount,
        currency: course.currency,
        status: PurchaseStatus.PENDING,
        invoiceNumber,
        couponId,
        transactionId: `RZP_ORDER_${rzpOrder.id}`,
      },
    });

    return {
      purchaseId: purchase.id,
      invoiceNumber,
      amount,
      currency: course.currency,
      appliedDiscount,
      razorpayOrderId: rzpOrder.id,
      razorpayKey: this.razorpayService.keyId,
    };
  }

  async confirm(purchaseId: string, dto: ConfirmPurchaseDto) {
    const purchase = await this.prisma.purchase.findUnique({ where: { id: purchaseId } });
    if (!purchase) {
      throw new NotFoundException('Purchase not found');
    }
    if (purchase.status !== PurchaseStatus.PENDING) {
      throw new BadRequestException('Purchase is not in pending state');
    }

    const isValid = this.razorpayService.verifySignature(
      dto.razorpayOrderId,
      dto.razorpayPaymentId,
      dto.razorpaySignature,
    );
    if (!isValid) {
      throw new BadRequestException('Payment verification failed');
    }

    const updated = await this.prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        status: PurchaseStatus.PAID,
        transactionId: dto.razorpayPaymentId,
        provider: 'razorpay',
        purchasedAt: new Date(),
      },
      include: { course: { select: { id: true, title: true, slug: true } } },
    });

    if (purchase.couponId) {
      await this.prisma.coupon.update({
        where: { code: purchase.couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return updated;
  }

  async findByUser(userId: string) {
    return this.prisma.purchase.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: { select: { id: true, title: true, slug: true, thumbnail: true } },
        coupon: { select: { code: true, percentDiscount: true, fixedDiscount: true } },
      },
    });
  }

  async findAll(opts: { page: number; limit: number }) {
    const skip = (opts.page - 1) * opts.limit;
    const [data, total] = await Promise.all([
      this.prisma.purchase.findMany({
        skip,
        take: opts.limit,
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { id: true, title: true, slug: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.purchase.count(),
    ]);
    return { data, total, page: opts.page, limit: opts.limit };
  }
}
