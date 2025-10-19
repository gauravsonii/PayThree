'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  DollarSign, 
  Gift
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NProgress from 'nprogress';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'My Pay',
    href: '/my-pay',
    icon: DollarSign,
  },
  {
    name: 'My ESOPs',
    href: '/my-esops',
    icon: Gift,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [orgName, setOrgName] = useState<string>('...');

  useEffect(() => {
    async function fetchOrgName() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setOrgName(data?.settings?.organizationName || 'Company');
      } catch {
        setOrgName('Company');
      }
    }
    fetchOrgName();
  }, []);

  return (
    <div className={cn('pb-12 min-h-screen bg-card', className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex flex-col items-start mb-4">
            <h2 className={cn(
              'text-lg font-bold tracking-tight transition-all text-foreground',
              collapsed && 'opacity-0 w-0 overflow-hidden'
            )}>
              {orgName} <span className="font-normal">Pay Portal</span>
            </h2>
            <span className={cn(
              'text-xs text-muted-foreground mt-1',
              collapsed && 'opacity-0 w-0 overflow-hidden'
            )}>
              Powered by <span className="font-semibold">PayThree</span>
            </span>
          </div>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => NProgress.start()}>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start transition-all text-muted-foreground hover:text-primary',
                    collapsed ? 'px-2' : 'px-3'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className={cn(
                    'ml-2 transition-all',
                    collapsed && 'opacity-0 w-0 overflow-hidden'
                  )}>
                    {item.name}
                  </span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}