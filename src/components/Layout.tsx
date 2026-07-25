import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Receipt,
  CreditCard,
  TrendingUp,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  Tag,
  Database,
  Users,
  HandCoins,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/auth';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { cn } from '../lib/utils';

import { AlertBell } from './AlertBell';
import { APP_VERSION, APP_ENVIRONMENT } from '../lib/appVersion';
import { getSecureMode, onSecureModeChange } from '../services/secureApi';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [secureMode, setSecureMode] = React.useState(getSecureMode());

  React.useEffect(() => {
    return onSecureModeChange(setSecureMode);
  }, []);

  const navigationGroups = [
    {
      label: 'Main',
      items: [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Masters', href: '/masters', icon: Database, roles: ['ADMIN', 'PROJECT_MANAGER', 'CEO'] },
      ]
    },
    {
      label: 'Operations',
      items: [
        { name: 'Work Orders', href: '/work-orders', icon: FileText, roles: ['ADMIN', 'PROJECT_MANAGER', 'CEO', 'ACCOUNTS'] },
        { name: 'Variation Orders', href: '/variation-orders', icon: TrendingUp, roles: ['ADMIN', 'PROJECT_MANAGER', 'CEO', 'ACCOUNTS'] },
        { name: 'Bills', href: '/bills', icon: Receipt, roles: ['ADMIN', 'ACCOUNTS', 'CEO'] },
        { name: 'Payments', href: '/payments', icon: CreditCard, roles: ['ADMIN', 'ACCOUNTS', 'CEO'] },
        { name: 'Payment Requests', href: '/payment-requests', icon: Wallet, roles: ['ADMIN', 'PROJECT_MANAGER', 'ACCOUNTS', 'CEO'] },
        { name: 'Unit Sales', href: '/sales', icon: HandCoins, roles: ['ADMIN', 'PROJECT_MANAGER', 'ACCOUNTS', 'CEO'] },
        { name: 'Recovery', href: '/recovery', icon: TrendingUp, roles: ['ADMIN', 'PROJECT_MANAGER', 'ACCOUNTS', 'CEO'] },
      ]
    },
    {
      label: 'Analytics',
      items: [
        { name: 'Budget vs Actual', href: '/budget-analytics', icon: BarChart3, roles: ['ADMIN', 'CEO', 'PROJECT_MANAGER', 'ACCOUNTS'] },
      ]
    },
    {
      label: 'System',
      items: [
        { name: 'User Management', href: '/admin/users', icon: Users, roles: ['ADMIN'] },
        { name: 'Version History', href: '/version-history', icon: Tag, roles: ['ADMIN'] },
      ]
    }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-[#111827] text-white">
      <div className="p-6 pb-8">
        <h1 className="text-xl font-extrabold text-[#2563eb] tracking-tight">DSBC Civil</h1>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6b7280] mt-1">Enterprise Construction ERP</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {navigationGroups.map((group) => {
          const filteredItems = group.items.filter(item =>
            !item.roles || (profile && (item.roles.includes(profile.role) || profile.role === 'SUPER_ADMIN'))
          );
          
          if (filteredItems.length === 0) return null;

          return (
            <div key={group.label} className="mb-6">
              <div className="px-6 mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#4b5563]">
                {group.label}
              </div>
              <nav className="space-y-0.5">
                {filteredItems.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center px-6 py-2.5 text-sm transition-colors border-l-3",
                        isActive 
                          ? "bg-white/5 text-white border-[#2563eb]" 
                          : "text-[#9ca3af] border-transparent hover:text-white"
                      )}
                    >
                      <item.icon className={cn("mr-3 h-4 w-4", isActive ? "text-white" : "text-[#9ca3af]")} />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#1f2937]">
        <div className="flex items-center p-2 rounded-lg bg-white/5">
          <Avatar className="h-8 w-8 border border-[#1f2937]">
            <AvatarImage src={profile?.photoURL} />
            <AvatarFallback className="bg-[#1f2937] text-white text-xs">{profile?.displayName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium truncate text-white">{profile?.displayName}</p>
            <p className="text-[10px] font-bold text-[#1e40af] bg-[#dbeafe] px-2 py-0.5 rounded-full inline-block uppercase">{profile?.role}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-[#9ca3af] hover:text-white hover:bg-transparent">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f3f4f6] text-[#1f2937] overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-[240px] md:flex-col flex-shrink-0">
        <NavContent />
      </aside>

      {/* Main Content Area. `min-w-0` is the standard flex-child fix
          to prevent the column expanding to fit its content's intrinsic
          width. `overflow-x-hidden` here AND on <main> below clips
          anything wider than the layout edge — wide tables still
          scroll inside their own overflow-x-auto cards. */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header className="flex items-center justify-between h-16 px-8 bg-white border-b border-[#e5e7eb] flex-shrink-0">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                }
              />
              <SheetContent side="left" className="p-0 w-[240px] border-none">
                <NavContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold">Operational Overview</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <AlertBell />
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold">{profile?.displayName}</span>
              <span className="text-xs text-[#6b7280]">{profile?.role}</span>
            </div>
          </div>
        </header>

        {/* Main Content. Both axes set explicitly:
            - overflow-y-auto: vertical scroll for long pages.
            - overflow-x-hidden: blocks the CSS-spec quirk where an
              unspecified overflow-x is coerced to `auto` whenever
              overflow-y is non-visible. Without this, any wide
              child would render its own scrollbar at the bottom of
              <main>, which the user perceives as a "page-level"
              horizontal scroll. Tables that genuinely need
              horizontal scroll do so inside their own
              overflow-x-auto card wrappers. */}
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden focus:outline-none p-8">
          <div className="max-w-full min-w-0 mx-auto">
            {children}
          </div>
        </main>

        {/* Version footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-2 bg-white border-t border-[#e5e7eb] text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest flex-shrink-0">
          {/* Fallback indicator — visible in non-production when client-fallback is detected */}
          {secureMode === 'client-fallback' && APP_ENVIRONMENT !== 'production' && (
            <span className="px-2 py-0.5 rounded text-[8px] bg-amber-50 text-amber-600 border border-amber-200 normal-case tracking-normal">
              Client mode — server routes unavailable
            </span>
          )}
          <span>v{APP_VERSION}</span>
          <span className={cn(
            "px-1.5 py-0.5 rounded text-[8px]",
            APP_ENVIRONMENT === 'production' ? "bg-red-100 text-red-600" :
            APP_ENVIRONMENT === 'staging' ? "bg-amber-100 text-amber-600" :
            "bg-blue-100 text-blue-600"
          )}>
            {APP_ENVIRONMENT}
          </span>
        </div>
      </div>
    </div>
  );
};
