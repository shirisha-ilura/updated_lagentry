import React from 'react';
import { Settings, User, Bell, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

type DashboardView = 'workflow-runs' | 'analytics' | 'embed' | 'chat';
interface HeaderProps {
  currentView?: 'welcome' | 'building' | 'dashboard' | 'connections' | 'billing';
  onNavigate?: (view: 'welcome' | 'building' | 'dashboard' | 'connections' | 'billing') => void;
  dashboardView?: DashboardView;
  onDashboardViewChange?: (view: DashboardView) => void;
  onBillingClick?: () => void;
}

export function Header({ currentView = 'welcome', onNavigate, dashboardView = 'workflow-runs', onDashboardViewChange, onBillingClick }: HeaderProps) {
  const { resolvedTheme } = useTheme();
  // Removed unused isDropdownOpen state
  
  // Choose logo based on current theme
  const logoSrc = resolvedTheme === 'dark' 
    ? '/images/lagentry-dark-logo-no-bg.png' 
    : '/images/lagentry-light-logo.png';

  const handleLogoClick = () => {
    if (onNavigate) {
      onNavigate('welcome');
    }
  };

  const handleDashboardClick = () => {
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  const handleConnectionsClick = () => {
    if (onNavigate) {
      onNavigate('connections');
    }
  };

  const handleDashboardNavClick = (item: string) => {
    if (onDashboardViewChange) {
      if (item === 'Analytics') {
        onDashboardViewChange('analytics');
      } else if (item === 'Workflow Runs') {
        onDashboardViewChange('workflow-runs');
      } else if (item === 'Embed') {
        onDashboardViewChange('embed');
      } else if (item === 'Chat') {
        onDashboardViewChange('chat');
      }
    }
  };

  // Dashboard navigation items
  const dashboardNavItems = [
    'Analytics',
    'Sources', 
    'Chat',
    'Workflow Runs',
    'Tasks',
    'Agent Settings',
    'Knowledge Base',
    'Embed',
  ];

  return (
    <header
      className="px-2 py-7 transition-colors duration-300 fixed top-0 left-0 right-0 z-50"
      style={{
        background: resolvedTheme === 'dark'
          ? 'radial-gradient(ellipse at 50% 0%, #4b206b 0%, #181028 60%, #0a0a0a 100%)'
          : '#fff',
        borderBottom: resolvedTheme === 'dark' ? '1px solid #3a186a' : undefined,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        margin: 0,
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo on the left */}
        <div className="flex items-center">
          <button 
            onClick={handleLogoClick}
            className="transition-opacity duration-300 hover:opacity-80"
          >
            <img 
              src={logoSrc} 
              alt="Lagentry" 
              className="h-10 w-auto"
            />
          </button>
        </div>
        
        {/* Centered navigation */}
        <nav className="hidden md:flex space-x-6">
          {currentView === 'dashboard' ? (
            // Dashboard navigation items
            dashboardNavItems.map((item) => (
              <button 
                key={item}
                onClick={() => handleDashboardNavClick(item)}
                className={`text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200 ${
                  (item === 'Workflow Runs' && dashboardView === 'workflow-runs') || 
                  (item === 'Analytics' && dashboardView === 'analytics')
                    ? 'text-orange-600 dark:text-white font-medium' 
                    : ''
                }`}
              >
                {item}
              </button>
            ))
          ) : (
            // Regular navigation items
            <>
              <a href="#" className="text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200">Enterprise</a>
              <a href="#" className="text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200">Resources</a>
              <a href="#" className="text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200">Pricing</a>
              <button 
                onClick={handleDashboardClick}
                className="text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200"
              >
                Dashboard
              </button>
            </>
          )}
        </nav>
        
        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {/* Connections button (LayoutDashboard icon) */}
          <button 
            onClick={handleConnectionsClick}
            className="p-2 text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-orange-50 dark:hover:bg-white/10"
            title="Connections"
          >
            <LayoutDashboard className="h-4 w-4" />
          </button>
          
          <button className="p-2 text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-orange-50 dark:hover:bg-white/10">
            <Bell className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-900 dark:text-gray-300 hover:text-orange-600 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-orange-50 dark:hover:bg-white/10">
            <Settings className="h-5 w-5" />
          </button>
          <div className="relative group">
            <button
              className="p-2 text-orange-600 dark:text-gray-300 hover:text-orange-700 dark:hover:text-white transition-colors duration-200 rounded-lg hover:bg-orange-50 dark:hover:bg-white/10"
            >
              <User className="h-5 w-5" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 px-3 py-1 rounded bg-white dark:bg-gray-900 text-black dark:text-white text-xs opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity duration-200 z-50 whitespace-nowrap flex flex-col items-center border border-gray-200 dark:border-none">
              <button
                className="bg-transparent text-black dark:text-white hover:underline focus:outline-none"
                style={{ padding: 0, margin: 0 }}
                onClick={onBillingClick}
              >
                Billing Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}