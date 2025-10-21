'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/logo';
import {
  User,
  Wallet,
  Users,
  Ticket,
  History,
  Trophy,
  LayoutGrid,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const menuItems = [
  { href: '/arena', label: 'Dashboard', icon: LayoutGrid },
  { href: '/arena/profile', label: 'Profile', icon: User },
  { href: '/arena/wallet', label: 'Wallet', icon: Wallet },
  { href: '/arena/friends', label: 'Friends', icon: Users },
  { href: '/arena/tickets', label: 'Game Tickets', icon: Ticket },
  { href: '/arena/history', label: 'Past Games', icon: History },
  { href: '/arena/winnings', label: 'Winnings', icon: Trophy },
  { href: '/arena/stats', label: 'Stats', icon: BarChart3 },
];

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8" />
            <span className="text-lg font-headline font-semibold">BingoTango</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Link href="/">
            <SidebarMenuButton>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/90 px-6 backdrop-blur">
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1">
            <h1 className="text-lg font-headline font-semibold">Arena</h1>
          </div>
          <Avatar>
            <AvatarImage src="https://picsum.photos/seed/avatar/40/40" />
            <AvatarFallback>GT</AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
