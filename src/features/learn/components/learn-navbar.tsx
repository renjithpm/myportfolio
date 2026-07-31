'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap, BookOpen, LayoutDashboard, Menu, X, Shield } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { useAuth } from '@/features/learn/auth/context/auth-context';

const NAV_LINKS = [
  { href: '/learn/courses', label: 'Courses', icon: BookOpen },
  { href: '/learn/plans', label: 'Plans', icon: GraduationCap },
];

export function LearnNavbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = React.useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '';

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <nav
        aria-label="Learning platform"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6 lg:px-8"
      >
        <Link
          href="/learn"
          className="flex items-center gap-2 rounded-md font-bold tracking-tight focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <GraduationCap className="size-5 text-primary" aria-hidden />
          <span>LearnHub</span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  'hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none',
                  pathname.startsWith(link.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground',
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative size-9 rounded-full p-0"
                  aria-label="User menu"
                >
                  <Avatar className="size-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/learn/dashboard">
                    <LayoutDashboard className="size-4 mr-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/learn/admin">
                      <Shield className="size-4 mr-2" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => {
                    logout();
                    toast.success('Signed out.');
                  }}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                <Link href="/learn/auth/login">Sign In</Link>
              </Button>
              <Button asChild variant="gradient" size="sm" className="hidden md:inline-flex">
                <Link href="/learn/auth/register">Get Started</Link>
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="learn-mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div id="learn-mobile-menu" className="border-t border-border bg-background md:hidden">
          <ul className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-6 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <link.icon className="size-4" aria-hidden />
                  {link.label}
                </Link>
              </li>
            ))}
            {!isAuthenticated && (
              <li className="pt-2 flex gap-2">
                <Button asChild variant="outline" className="flex-1" onClick={() => setOpen(false)}>
                  <Link href="/learn/auth/login">Sign In</Link>
                </Button>
                <Button asChild variant="gradient" className="flex-1" onClick={() => setOpen(false)}>
                  <Link href="/learn/auth/register">Get Started</Link>
                </Button>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
