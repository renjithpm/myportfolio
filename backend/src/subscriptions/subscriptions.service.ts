import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { BillingCycle, SubStatus } from '@prisma/client';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPlans() {
    return this.prisma.subscriptionPlan.findMany({ orderBy: { monthlyPrice: 'asc' } });
  }

  async subscribe(userId: string, dto: CreateSubscriptionDto) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: dto.planId } });
    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    await this.prisma.subscription.updateMany({
      where: { userId, status: SubStatus.ACTIVE },
      data: { status: SubStatus.CANCELLED, cancelledAt: new Date() },
    });

    const expiresAt = new Date();
    if (dto.billingCycle === BillingCycle.MONTHLY) {
      expiresAt.setDate(expiresAt.getDate() + 30);
    } else {
      expiresAt.setDate(expiresAt.getDate() + 365);
    }

    return this.prisma.subscription.create({
      data: {
        userId,
        planId: dto.planId,
        billingCycle: dto.billingCycle,
        expiresAt,
      },
      include: { plan: true },
    });
  }

  async getMySubscription(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, status: SubStatus.ACTIVE },
      include: { plan: true },
      orderBy: { startedAt: 'desc' },
    });
    return { subscription: subscription ?? null };
  }

  async cancel(userId: string) {
    await this.prisma.subscription.updateMany({
      where: { userId, status: SubStatus.ACTIVE },
      data: { status: SubStatus.CANCELLED, cancelledAt: new Date() },
    });
    return { message: 'Subscription cancelled' };
  }

  async findAll(opts: { page: number; limit: number }) {
    const skip = (opts.page - 1) * opts.limit;
    const [data, total] = await Promise.all([
      this.prisma.subscription.findMany({
        skip,
        take: opts.limit,
        orderBy: { startedAt: 'desc' },
        include: {
          plan: { select: { id: true, name: true, tier: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.subscription.count(),
    ]);
    return { data, total, page: opts.page, limit: opts.limit };
  }
}
