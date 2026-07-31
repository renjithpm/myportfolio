import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PurchaseStatus, SubStatus, Prisma } from '@prisma/client';

interface RevenueRow {
  month: Date;
  revenue: number;
}

@Injectable()
export class AdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalCourses,
      publishedCourses,
      draftCourses,
      totalUsers,
      totalSubscribers,
      todaySalesAgg,
      monthlySalesAgg,
      topSellingCourses,
      recentPurchases,
      popularCategories,
    ] = await Promise.all([
      this.prisma.course.count(),
      this.prisma.course.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.course.count({ where: { status: 'DRAFT' } }),
      this.prisma.user.count(),
      this.prisma.subscription.count({ where: { status: SubStatus.ACTIVE } }),
      this.prisma.purchase.aggregate({
        where: { status: PurchaseStatus.PAID, purchasedAt: { gte: startOfToday } },
        _sum: { amount: true },
      }),
      this.prisma.purchase.aggregate({
        where: { status: PurchaseStatus.PAID, purchasedAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      this.prisma.course.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { purchases: { _count: 'desc' } },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          thumbnail: true,
          _count: { select: { purchases: true } },
        },
      }),
      this.prisma.purchase.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          course: { select: { id: true, title: true, slug: true } },
          user: { select: { id: true, name: true } },
        },
      }),
      this.prisma.category.findMany({
        orderBy: { courses: { _count: 'desc' } },
        take: 8,
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { courses: true } },
        },
      }),
    ]);

    const revenueByMonth = await this.prisma.$queryRaw<RevenueRow[]>`
      SELECT
        DATE_TRUNC('month', "purchasedAt")::timestamp AS month,
        SUM(amount)::float AS revenue
      FROM purchases
      WHERE status = 'PAID'
        AND "purchasedAt" >= NOW() - INTERVAL '6 months'
      GROUP BY 1
      ORDER BY 1 ASC
    `;

    return {
      totalCourses,
      publishedCourses,
      draftCourses,
      totalUsers,
      totalSubscribers,
      todaySales: todaySalesAgg._sum.amount ?? 0,
      monthlySales: monthlySalesAgg._sum.amount ?? 0,
      revenueByMonth: revenueByMonth.map((r) => ({
        month: r.month,
        revenue: r.revenue,
      })),
      topSellingCourses,
      recentPurchases,
      popularCategories,
    };
  }
}
