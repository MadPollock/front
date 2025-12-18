import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Settings, 
  Wallet,
  UserPlus,
  ListChecks,
  ChevronLeft,
  ChevronRight,
  Zap,
  FileText,
  Building2
} from 'lucide-react';
import { useIsSidebarCollapsed, useUserPreferences } from '../../store/userPreferences';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import type { RBACRole } from '../../contexts/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  isWriteAction?: boolean;
  allowedRoles?: RBACRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="size-5" /> },
      { id: 'transactions', label: 'Payments', icon: <Wallet className="size-5" /> },
      { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="size-5" /> },
      { id: 'accounts', label: 'Accounts', icon: <Building2 className="size-5" /> },
    ],
  },
  {
    title: 'Actions',
    items: [
      { 
        id: 'withdraw', 
        label: 'Withdraw', 
        icon: <Wallet className="size-5" />,
        isWriteAction: true,
        allowedRoles: ['admin'],
      },
      { 
        id: 'whitelist', 
        label: 'Whitelist', 
        icon: <ListChecks className="size-5" />,
        isWriteAction: true,
        allowedRoles: ['admin'],
      },
      { 
        id: 'add-user', 
        label: 'Add User', 
        icon: <UserPlus className="size-5" />,
        isWriteAction: true,
        allowedRoles: ['admin'],
      },
      { 
        id: 'templates', 
        label: 'Templates', 
        icon: <FileText className="size-5" />,
        isWriteAction: true,
        allowedRoles: ['admin'],
      },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'settings', label: 'Settings', icon: <Settings className="size-5" /> },
    ],
  },
];

interface SidebarProps {
  activeNav: string;
  onNavChange: (navId: string) => void;
  forceExpanded?: boolean;
}

export function Sidebar({ activeNav, onNavChange, forceExpanded = false }: SidebarProps) {
  const isCollapsed = useIsSidebarCollapsed();
  const toggleSidebar = useUserPreferences((state) => state.toggleSidebar);
  const { hasRole } = useAuth();
  
  // On mobile sheet, always show expanded
  const showExpanded = forceExpanded || !isCollapsed;

  return (
    <aside className={`h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ${forceExpanded ? 'w-full' : (isCollapsed ? 'w-20' : 'w-64')}`}>
      {/* Logo - Crossramp Branding - Minimal, monochrome */}
      <div className="h-16 border-b border-sidebar-border flex items-center px-6 justify-between">
        {showExpanded && (
          <div className="flex items-center gap-2.5">
            <div className="size-9 bg-primary rounded-xl flex items-center justify-center">
              <Zap className="size-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground" style={{ fontFamily: 'Manrope' }}>Crossramp</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Dashboard</span>
            </div>
          </div>
        )}
        {!showExpanded && (
          <div className="size-9 bg-primary rounded-xl flex items-center justify-center mx-auto">
            <Zap className="size-5 text-white fill-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navSections.map((section) => (
          <div key={section.title}>
            {showExpanded && (
              <h3 className="px-3 mb-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items
                .filter((item) => !item.allowedRoles || hasRole(item.allowedRoles))
                .map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavChange(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                      ${activeNav === item.id 
                        ? 'bg-accent text-foreground' 
                        : 'hover:bg-sidebar-accent text-sidebar-foreground'
                      }
                      ${!showExpanded ? 'justify-center' : ''}
                    `}
                    title={!showExpanded ? item.label : undefined}
                  >
                    <span className="relative flex-shrink-0">
                      {item.icon}
                      {item.isWriteAction && (
                        <span className="size-2 bg-primary rounded-full absolute -top-0.5 -right-0.5 border-2 border-sidebar" />
                      )}
                    </span>
                    {showExpanded && (
                      <span className="text-sm font-medium">{item.label}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle Button */}
      {!forceExpanded && (
        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-center hover:bg-sidebar-accent"
            onClick={toggleSidebar}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
          </Button>
        </div>
      )}
    </aside>
  );
}
