'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';

interface PortfolioShellProps {
  children: React.ReactNode;
}

export function PortfolioShell({ children }: PortfolioShellProps) {
  const pathname = usePathname();
  const isLearn = pathname.startsWith('/learn');

  return (
    <>
      {!isLearn && <Navbar />}
      {children}
      {!isLearn && <Footer />}
    </>
  );
}
