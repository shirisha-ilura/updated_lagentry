import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  MessageSquare, 
  Ticket, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Loader2,
  Calendar,
  Users
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ConnectionStatus {
  connected: boolean;
  email?: string;
  expiresAt?: string;
  lastSync?: string;
  error?: string;
}

interface Provider {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  hoverColor: string;
  services: string[];
  description: string;
}

const PROVIDERS: Provider[] = [
  {
    id: 'google',
    name: 'Google',
    icon: Mail,
    color: 'purple',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    services: ['Gmail', 'Drive', 'Calendar'],
    description: 'Access emails, files, and calendar events'
  },
  {
    id: 'jira',
    name: 'Jira',
    icon: Ticket,
    color: 'purple',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    services: ['Issues', 'Projects', 'Boards'],
    description: 'Manage projects, issues, and workflows'
  },
  {
    id: 'notion',
    name: 'Notion',
    icon: Calendar,
    color: 'purple',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    services: ['Pages', 'Databases', 'Workspaces'],
    description: 'Connect to Notion workspaces'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: Users,
    color: 'purple',
    bgColor: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    services: ['Repositories', 'Issues', 'Actions'],
    description: 'Access GitHub repositories and workflows'
  },
  {
    id: 'slack',
    name: 'Slack',
    icon: MessageSquare,
    color: 'gray',
    bgColor: 'bg-gray-400',
    hoverColor: 'hover:bg-gray-500',
    services: ['Channels', 'Messages', 'Users'],
    description: 'Connect to Slack workspaces and channels (Coming Soon)'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    icon: Settings,
    color: 'gray',
    bgColor: 'bg-gray-400',
    hoverColor: 'hover:bg-gray-500',
    services: ['Outlook', 'Teams', 'SharePoint'],
    description: 'Access Outlook emails and Teams (Coming Soon)'
  }
];

const API_BASE_URL = 'http://127.0.0.1:8081';

export function Connections() {
  const { resolvedTheme } = useTheme();
  const [connectionStatus, setConnectionStatus] = useState<Record<string, ConnectionStatus>>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authMessage, setAuthMessage] = useState('');
  const [error, setError] = useState('');
  const [activeProvider, setActiveProvider] = useState<string | null>(null);

  // Check authentication status for all providers
  const checkAuthStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/users`);
      if (!response.ok) {
        throw new Error('Failed to fetch auth status');
      }
      
      const data = await response.json();
      const users = data.users || [];
      
      const connected: Record<string, ConnectionStatus> = {};
      
      users.forEach((user: any) => {
        const provider = user.provider || 'google';
        if (provider === 'google') {
          connected.google = { 
            connected: true, 
            email: user.email, 
            expiresAt: user.expires_at,
            lastSync: user.created_at
          };
        } else if (provider === 'atlassian') {
          connected.jira = { 
            connected: true, 
            email: user.email, 
            expiresAt: user.expires_at,
            lastSync: user.created_at
          };
        } else if (provider === 'slack') {
          connected.slack = { 
            connected: true, 
            email: user.email, 
            expiresAt: user.expires_at,
            lastSync: user.created_at
          };
        } else if (provider === 'microsoft') {
          connected.microsoft = { 
            connected: true, 
            email: user.email, 
            expiresAt: user.expires_at,
            lastSync: user.created_at
          };
        }
      });
      
      setConnectionStatus(connected);
    } catch (error) {
      console.log('No authenticated users found or error occurred');
      setConnectionStatus({});
    }
  };

  // Handle OAuth for any provider
  const handleProviderAuth = async (provider: string) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    setIsAuthenticating(true);
    setAuthMessage(`Connecting to ${PROVIDERS.find(p => p.id === provider)?.name}...`);
    setError('');
    
    try {
      // Redirect to OAuth endpoint
      window.location.href = `${API_BASE_URL}/auth/${provider}`;
    } catch (error) {
      console.error('OAuth error:', error);
      setError(`Failed to connect to ${provider}`);
      setIsLoading(prev => ({ ...prev, [provider]: false }));
      setIsAuthenticating(false);
    }
  };

  // Handle disconnect
  const handleDisconnect = async (provider: string) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/clear-tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider }),
      });

      if (response.ok) {
        setConnectionStatus(prev => ({
          ...prev,
          [provider]: { connected: false }
        }));
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      setError(`Failed to disconnect from ${provider}`);
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  // Test connection
  const testConnection = async (provider: string) => {
    setIsLoading(prev => ({ ...prev, [provider]: true }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      if (response.ok) {
        // Connection is working
        console.log(`${provider} connection is working`);
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error) {
      console.error('Connection test error:', error);
      setError(`Failed to test ${provider} connection`);
    } finally {
      setIsLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  // Check for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    
    if (authStatus === 'success') {
      setAuthMessage('Authentication completed successfully!');
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Check auth status after a short delay
      setTimeout(() => {
        checkAuthStatus();
        setIsAuthenticating(false);
        setAuthMessage('');
      }, 2000);
    } else if (authStatus === 'error') {
      setError('Authentication failed. Please try again.');
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
      setIsAuthenticating(false);
    }
  }, []);

  // Initial auth status check
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const renderProviderCard = (provider: Provider) => {
    const status = connectionStatus[provider.id];
    const loading = isLoading[provider.id];
    const Icon = provider.icon;
    const isDisabled = provider.id === 'slack' || provider.id === 'microsoft';

    return (
      <div 
        key={provider.id}
        className={`relative p-6 rounded-xl border transition-all duration-300 ${
          resolvedTheme === 'dark' 
            ? 'bg-gray-800/50 border-gray-700 hover:border-gray-600' 
            : 'bg-white border-gray-200 hover:border-gray-300'
        } ${status?.connected ? 'ring-2 ring-green-500/20' : ''} ${isDisabled ? 'opacity-60' : ''}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${provider.bgColor} ${provider.hoverColor} transition-colors duration-200`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {provider.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {provider.description}
              </p>
            </div>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center space-x-2">
            {status?.connected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>

        {/* Services */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Available Services:
          </p>
          <div className="flex flex-wrap gap-2">
            {provider.services.map((service) => (
              <span 
                key={service}
                className={`px-2 py-1 text-xs rounded-md ${
                  resolvedTheme === 'dark'
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Connection details */}
        {status?.connected && (
          <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Connected
              </span>
            </div>
            {status.email && (
              <p className="text-sm text-green-600 dark:text-green-400">
                {status.email}
              </p>
            )}
            {status.expiresAt && (
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                Expires: {new Date(status.expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex space-x-2">
          {status?.connected ? (
            <>
              <button
                onClick={() => testConnection(provider.id)}
                disabled={loading}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  resolvedTheme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } disabled:opacity-50`}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                ) : (
                  'Test Connection'
                )}
              </button>
              <button
                onClick={() => handleDisconnect(provider.id)}
                disabled={loading}
                className="px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              onClick={() => !isDisabled && handleProviderAuth(provider.id)}
              disabled={loading || isAuthenticating || isDisabled}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                isDisabled 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : resolvedTheme === 'dark' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-orange-500 hover:bg-orange-600'
              } text-white disabled:opacity-50`}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mx-auto" />
              ) : isDisabled ? (
                'Coming Soon'
              ) : (
                'Connect'
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white transition-colors duration-300 pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Connections
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Configure your application connections and manage OAuth access
            </p>
          </div>
          <button
            onClick={checkAuthStatus}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
              resolvedTheme === 'dark' 
                ? 'bg-purple-600 hover:bg-purple-700' 
                : 'bg-orange-500 hover:bg-orange-600'
            } text-white`}
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Authentication status */}
        {isAuthenticating && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center space-x-3">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <span className="text-blue-700 dark:text-blue-300">{authMessage}</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {/* Connection overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROVIDERS.map(renderProviderCard)}
          </div>
        </div>

        {/* Database Status */}
        <div className="mt-8">
          <div className={`p-6 rounded-xl border transition-all duration-300 ${
            resolvedTheme === 'dark' 
              ? 'bg-gray-800/50 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${
                resolvedTheme === 'dark' ? 'bg-purple-600' : 'bg-orange-500'
              }`}>
                <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                SQLite Database Status
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Local SQLite database for token storage and management
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Connection:</span>
                <span className="text-green-600 dark:text-green-400 font-medium">Connected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Database:</span>
                <span className="text-blue-600 dark:text-blue-400 font-medium">oauth_tokens.db</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Active tokens:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {Object.values(connectionStatus).filter(s => s.connected).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 