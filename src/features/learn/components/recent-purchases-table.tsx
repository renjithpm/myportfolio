import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Purchase, PurchaseStatus } from '@/features/learn/types';

const STATUS_VARIANT: Record<PurchaseStatus, 'default' | 'secondary' | 'outline'> = {
  PAID: 'default',
  PENDING: 'secondary',
  FAILED: 'outline',
  REFUNDED: 'outline',
};

interface RecentPurchasesTableProps {
  purchases: Purchase[];
}

export function RecentPurchasesTable({ purchases }: RecentPurchasesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Invoice</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
              No recent purchases
            </TableCell>
          </TableRow>
        ) : (
          purchases.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium max-w-48 truncate">
                {p.course?.title ?? '—'}
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {p.invoiceNumber}
              </TableCell>
              <TableCell>
                {p.currency} {p.amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[p.status] ?? 'outline'}>
                  {p.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {p.purchasedAt
                  ? new Date(p.purchasedAt).toLocaleDateString()
                  : '—'}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
