import * as React from 'react';
import type { Metadata } from 'next';
import { AdminNav } from '@/features/learn/components/admin-nav';

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s | Admin' },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden w-56 flex-shrink-0 border-r border-border lg:block">
        <AdminNav />
      </aside>
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
