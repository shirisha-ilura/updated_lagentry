import React, { useState } from 'react';
import { DraggableSidebar } from './DraggableSidebar';
import { 
  User, 
  FileText, 
  Calendar, 
  BarChart3, 
  Hash, 
  ChevronRight,
  Sun,
  Bell,
  Square
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { resolvedTheme } = useTheme();
  const [activeSidebarItem, setActiveSidebarItem] = useState('Workflow Runs');
  const [sidebarLeft, setSidebarLeft] = useState(0);

  const workspaceItems = [
    { id: 'My tasks', icon: User, label: 'My tasks' },
    { id: 'Workflow Runs', icon: FileText, label: 'Workflow Runs' },
    { id: 'Schedules', icon: Calendar, label: 'Schedules' },
    { id: 'Status', icon: BarChart3, label: 'Status' }
  ];

  const agents = [
    'HR Agent',
    'Gmail Agent', 
    'Marketing Agent'
  ];

  return (
  <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 pt-24">
      <div className="flex">
        {/* Sidebar */}
  <DraggableSidebar onMove={setSidebarLeft}>
          <div className="p-6">
            {/* Workspace Section */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Workspace
              </h3>
              <div className="space-y-2">
                {workspaceItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSidebarItem === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSidebarItem(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? resolvedTheme === 'dark' ? 'bg-purple-600 text-white' : 'bg-orange-500 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/20'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Your Agents Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Your Agents
              </h3>
              <div className="space-y-2">
                {agents.map((agent) => (
                  <button
                    key={agent}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/20 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Hash className="h-4 w-4" />
                      <span>{agent}</span>
                    </div>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DraggableSidebar>

        {/* Main Content */}
  <div className="flex-1" style={{ marginLeft: `${256 + sidebarLeft}px`, transition: 'margin-left 0.1s' }}>
          {children}
        </div>
      </div>
    </div>
  );
} 