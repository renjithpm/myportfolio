'use client';

import * as React from 'react';
import { Loader2, Tag } from 'lucide-react';
import { AdminGuard } from '@/features/learn/components/admin-guard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/features/learn/components/empty-state';
import { useOffers } from '@/features/learn/hooks/use-offers';

export function AdminOffersPage() {
  return (
    <AdminGuard>
      <Content />
    </AdminGuard>
  );
}

function Content() {
  const { data: offers, isLoading } = useOffers();

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Offers</h1>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : !offers || offers.length === 0 ? (
        <EmptyState icon={<Tag className="size-8" />} title="No offers" description="Create offers to give discounts to your students." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{offer.name}</CardTitle>
                  <Badge variant={offer.isActive ? 'default' : 'secondary'}>
                    {offer.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>
                  {offer.offerType === 'PERCENTAGE'
                    ? `${offer.percentDiscount}% discount`
                    : `AED ${offer.fixedDiscount} off`}
                </p>
                <p>
                  {new Date(offer.startDate).toLocaleDateString()} —{' '}
                  {new Date(offer.endDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
