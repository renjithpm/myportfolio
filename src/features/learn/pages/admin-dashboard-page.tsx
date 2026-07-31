'use client';

import * as React from 'react';
import { BookOpen, Users, DollarSign, CreditCard, Loader2 } from 'lucide-react';

import { AdminGuard } from '@/features/learn/components/admin-guard';
import { StatsCard } from '@/features/learn/components/stats-card';
import { RevenueChart } from '@/features/learn/components/revenue-chart';
import { RecentPurchasesTable } from '@/features/learn/components/recent-purchases-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAdminDashboard } from '@/features/learn/hooks/use-admin';

export function AdminDashboardPage() {
  return (
    <AdminGuard>
      <Content />
    </AdminGuard>
  );
}

function Content() {
  const { data, isLoading } = useAdminDashboard();

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatsCard
            label="Total Courses"
            value={data?.totalCourses ?? 0}
            icon={<BookOpen className="size-5" />}
          />
          <StatsCard
            label="Total Users"
            value={data?.totalUsers ?? 0}
            icon={<Users className="size-5" />}
          />
          <StatsCard
            label="Monthly Revenue"
            value={`AED ${(data?.monthlySales ?? 0).toLocaleString()}`}
            icon={<DollarSign className="size-5" />}
          />
          <StatsCard
            label="Active Subscribers"
            value={data?.totalSubscribers ?? 0}
            icon={<CreditCard className="size-5" />}
          />
        </div>
      )}

      {data?.revenueByMonth && data.revenueByMonth.length > 0 && (
        <RevenueChart data={data.revenueByMonth} />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Purchases</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RecentPurchasesTable purchases={data?.recentPurchases ?? []} />
        </CardContent>
      </Card>
    </div>
  );
}
