import * as React from 'react';
import Link from 'next/link';
import { LayoutDashboard, BookOpen, Bookmark, ShoppingBag, CreditCard } from 'lucide-react';

const LINKS = [
  { href: '/learn/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/learn/dashboard/courses', label: 'My Courses', icon: BookOpen },
  { href: '/learn/dashboard/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/learn/dashboard/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/learn/dashboard/subscription', label: 'Subscription', icon: CreditCard },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full lg:w-52 flex-shrink-0">
          <nav aria-label="Dashboard navigation">
            <ul className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground whitespace-nowrap"
                  >
                    <link.icon className="size-4 flex-shrink-0" aria-hidden />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
