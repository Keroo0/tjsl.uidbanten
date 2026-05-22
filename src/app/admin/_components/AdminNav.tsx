'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Zap, LayoutDashboard, List, LogOut, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/programs', label: 'Program', icon: List, exact: false },
];

function NavLinks({ isActive, handleLogout }: { isActive: (href: string, exact: boolean) => boolean; handleLogout: () => void }) {
  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer',
              isActive(href, exact)
                ? 'bg-primary text-white shadow-sm shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={isActive(href, exact) ? 2.5 : 1.75} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-3 pb-4 border-t border-border/60 pt-3">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          Keluar
        </button>
      </div>
    </>
  );
}

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {/* Mobile header with hamburger */}
      <div className="flex md:hidden items-center justify-between px-4 py-3 border-b border-border/60 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="font-heading font-bold text-sm text-foreground">Admin Panel</span>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={<Button variant="ghost" size="icon" className="cursor-pointer" aria-label="Menu navigasi" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-56 p-0 flex flex-col">
            <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border/60">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Zap className="h-4 w-4" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading font-bold text-sm text-foreground">Admin Panel</span>
                <span className="text-[10px] text-muted-foreground">TJSL UID Banten</span>
              </div>
            </div>
            <NavLinks isActive={isActive} handleLogout={handleLogout} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="w-56 shrink-0 hidden md:flex flex-col border-r border-border/60 bg-white min-h-dvh">
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-bold text-sm text-foreground">Admin Panel</span>
            <span className="text-[10px] text-muted-foreground">TJSL UID Banten</span>
          </div>
        </div>
        <NavLinks isActive={isActive} handleLogout={handleLogout} />
      </aside>
    </>
  );
}
