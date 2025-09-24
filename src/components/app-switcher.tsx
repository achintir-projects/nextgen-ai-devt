'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  History, 
  Settings, 
  CreditCard, 
  TrendingUp,
  Plus,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  BarChart3,
  Zap,
  ExternalLink,
  HandCoins,
  Users,
  LayoutDashboard,
  Brain,
  Code,
  Layers,
  Shield,
  Scale,
  FolderOpen,
  Rocket
} from 'lucide-react';

interface AppSwitcherProps {
  currentApp: string;
  onAppChange: (app: string) => void;
}

export default function AppSwitcher({ currentApp, onAppChange }: AppSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const apps = [
    {
      id: 'professional-chat',
      name: 'PAAM Copilot',
      description: 'Machine-executable specification compilation platform',
      icon: Brain,
      status: 'active',
      lastAccessed: 'Just now',
      color: 'bg-purple-600',
    },
    {
      id: 'studio',
      name: 'PAAM Studio',
      description: 'AI-powered development studio and project management',
      icon: Rocket,
      status: 'available',
      lastAccessed: '15 minutes ago',
      color: 'bg-blue-600',
    },
    {
      id: 'multi-platform',
      name: 'Multi-Platform Compiler',
      description: 'Real-time compilation to 8+ platforms',
      icon: Layers,
      status: 'available',
      lastAccessed: '30 minutes ago',
      color: 'bg-indigo-600',
    },
    {
      id: 'intent-validator',
      name: 'Intent Validator',
      description: 'Advanced intent preservation algorithms',
      icon: Shield,
      status: 'available',
      lastAccessed: '1 hour ago',
      color: 'bg-green-600',
    },
    {
      id: 'compliance',
      name: 'Compliance-as-Code',
      description: 'Regulatory compliance compilation system',
      icon: Scale,
      status: 'available',
      lastAccessed: '2 hours ago',
      color: 'bg-blue-600',
    },
    {
      id: 'performance',
      name: 'Performance Metrics',
      description: 'Real-time analytics and performance monitoring',
      icon: BarChart3,
      status: 'available',
      lastAccessed: '5 minutes ago',
      color: 'bg-orange-600',
    },
    {
      id: 'ai-platform',
      name: 'AI Development Platform',
      description: 'AI-powered coding assistant',
      icon: Zap,
      status: 'available',
      lastAccessed: '1 hour ago',
      color: 'bg-green-600',
    },
    {
      id: 'neobank',
      name: 'NeoBank App',
      description: 'Digital banking platform',
      icon: CreditCard,
      status: 'available',
      lastAccessed: '2 hours ago',
      color: 'bg-blue-600',
    },
    {
      id: 'p2p-lending',
      name: 'P2P Lending Platform',
      description: 'Peer-to-peer lending network',
      icon: HandCoins,
      status: 'available',
      lastAccessed: '1 day ago',
      color: 'bg-purple-600',
    },
    {
      id: 'unified-dashboard',
      name: 'Unified Dashboard',
      description: 'Cross-app insights and overview',
      icon: LayoutDashboard,
      status: 'available',
      lastAccessed: '30 minutes ago',
      color: 'bg-orange-600',
    },
    {
      id: 'app-history',
      name: 'Project History',
      description: 'View all your projects',
      icon: History,
      status: 'available',
      lastAccessed: '5 minutes ago',
      color: 'bg-gray-600',
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'E-commerce Dashboard',
      type: 'dashboard',
      status: 'completed',
      lastModified: '2024-01-08',
      stars: 4,
    },
    {
      id: 2,
      name: 'Task Management App',
      type: 'web-app',
      status: 'archived',
      lastModified: '2024-01-02',
      stars: 3,
    },
    {
      id: 3,
      name: 'Weather Widget',
      type: 'widget',
      status: 'completed',
      lastModified: '2023-12-18',
      stars: 4,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'available':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'available':
        return <ExternalLink className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative">
      {/* Main App Switcher Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <span>PAAM Copilot</span>
        <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Your Apps</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New App
              </Button>
            </div>

            {/* Current Apps */}
            <div className="space-y-2 mb-6">
              {apps.map((app) => {
                const IconComponent = app.icon;
                const isActive = app.id === currentApp;
                return (
                  <div
                    key={app.id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      isActive 
                        ? 'bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    onClick={() => {
                      onAppChange(app.id);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${app.color} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{app.name}</div>
                        <div className="text-sm text-slate-500">{app.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(app.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(app.status)}
                          <span className="capitalize text-xs">{app.status}</span>
                        </div>
                      </Badge>
                      {isActive && <ChevronRight className="w-4 h-4 text-blue-600" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Projects */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                Recent Projects
              </h4>
              <div className="space-y-2">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-slate-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{project.name}</div>
                        <div className="text-xs text-slate-500 capitalize">{project.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs">{project.stars}</span>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          project.status === 'completed' 
                            ? 'border-green-200 text-green-700 dark:border-green-800 dark:text-green-300'
                            : project.status === 'archived'
                            ? 'border-gray-200 text-gray-700 dark:border-gray-800 dark:text-gray-300'
                            : 'border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300'
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="justify-start">
                  <History className="w-4 h-4 mr-2" />
                  View All
                </Button>
                <Button variant="outline" size="sm" className="justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}