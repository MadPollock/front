import React, { useEffect } from 'react';
import { Bell, User, Moon, Sun } from 'lucide-react';
import { SyncStatusIndicator, SyncStatus } from './SyncStatusIndicator';
import { SetupProgressBar } from './SetupProgressBar';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useTheme } from 'next-themes';
import { useUserPreferences } from '../../store/userPreferences';

interface TopbarProps {
  syncStatus: SyncStatus;
  lastSync?: Date;
}

export function Topbar({ syncStatus, lastSync }: TopbarProps) {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const setThemePreference = useUserPreferences((state) => state.setTheme);
  const storedTheme = useUserPreferences((state) => state.theme);

  // Sync persisted theme with next-themes
  useEffect(() => {
    if (storedTheme && storedTheme !== theme) {
      setTheme(storedTheme);
    }
  }, [storedTheme, theme, setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    setThemePreference(newTheme as 'light' | 'dark');
  };

  return (
    <>
      {/* Setup Progress Bar */}
      <SetupProgressBar />
      
      <header className="h-16 border-b bg-card dark:bg-card flex items-center justify-between px-4 md:px-6 sticky top-0 z-10">
        {/* Left Section - Empty for now */}
        <div className="flex items-center gap-2">
          {/* Title removed as requested */}
        </div>

        {/* Right Section - Dark Mode, Sync Status, Notifications, User */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          
          {/* Sync Status - Hidden on small mobile */}
          <div className="hidden sm:block">
            <SyncStatusIndicator status={syncStatus} lastSync={lastSync} />
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="size-8 bg-muted rounded-full flex items-center justify-center">
                  <User className="size-4 text-muted-foreground" />
                </div>
                <span className="hidden md:inline">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </>
  );
}
