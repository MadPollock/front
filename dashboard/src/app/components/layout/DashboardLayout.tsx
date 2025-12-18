import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { SyncStatus } from './SyncStatusIndicator';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeNav: string;
  onNavChange: (navId: string) => void;
}

export function DashboardLayout({ children, activeNav, onNavChange }: DashboardLayoutProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('live');
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulate periodic sync status changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly switch between live and syncing to demonstrate the indicator
      const isLive = Math.random() > 0.3;
      setSyncStatus(isLive ? 'live' : 'syncing');
      if (isLive) {
        setLastSync(new Date());
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleNavChange = (navId: string) => {
    onNavChange(navId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar activeNav={activeNav} onNavChange={onNavChange} />
      </div>

      {/* Mobile Menu Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <VisuallyHidden.Root>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Access all dashboard sections and features</SheetDescription>
          </VisuallyHidden.Root>
          <Sidebar activeNav={activeNav} onNavChange={handleNavChange} forceExpanded={true} />
        </SheetContent>
      </Sheet>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <Button
            size="icon"
            className="h-14 w-14 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="size-6 text-white" />
          </Button>
        </div>

        <Topbar syncStatus={syncStatus} lastSync={lastSync} />
        <main className="flex-1 overflow-y-auto py-6 px-4 md:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}