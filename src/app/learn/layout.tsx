import * as React from 'react';
import type { Metadata } from 'next';
import { LearnNavbar } from '@/features/learn/components/learn-navbar';

export const metadata: Metadata = {
  title: {
    default: 'LearnHub',
    template: '%s | LearnHub',
  },
  description: 'Learn new skills with premium online courses.',
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <LearnNavbar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
