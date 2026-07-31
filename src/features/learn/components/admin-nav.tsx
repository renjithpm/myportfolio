'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Tag,
  Ticket,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const LINKS = [
  { href: '/learn/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/learn/admin/courses', label: 'Courses', icon: BookOpen, exact: false },
  { href: '/learn/admin/categories', label: 'Categories', icon: Tag, exact: false },
  { href: '/learn/admin/offers', label: 'Offers', icon: Ticket, exact: false },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col gap-1 p-3">
      <Button asChild variant="ghost" size="sm" className="w-full justify-start mb-2">
        <Link href="/learn">
          <ChevronLeft className="size-4 mr-1" />
          Back to Platform
        </Link>
      </Button>

      <p className="px-3 mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Admin
      </p>

      {LINKS.map((link) => {
        const isActive = link.exact
          ? pathname === link.href
          : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground',
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <link.icon className="size-4" aria-hidden />
            {link.label}
          </Link>
        );
      })}
    </aside>
  );
}
