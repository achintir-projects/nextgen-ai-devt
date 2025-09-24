/**
 * PAAM AI Studio Landing Page
 * Replit-style studio interface for project management and navigation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Plus, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Code, 
  Globe, 
  Smartphone,
  Server,
  Zap,
  Shield,
  BarChart3,
  Settings,
  Bell,
  BookOpen,
  Key,
  Command,
  LayoutDashboard,
  Activity,
  FolderOpen,
  Rocket,
  Database,
  FileText,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  type: 'web' | 'mobile' | 'api' | 'fullstack';
  status: 'active' | 'building' | 'deployed' | 'archived';
  lastModified: Date;
  platforms: string[];
  compliance: number;
  quality: number;
  stars: number;
  isPublic: boolean;
  collaborators: number;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  tags: string[];
  popularity: number;
  isFeatured: boolean;
}

interface ActivityItem {
  id: string;
  type: 'compile' | 'deploy' | 'compliance' | 'update';
  project: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'error' | 'pending';
  user?: string;
}

export default function StudioLanding() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    // Initialize mock data
    initializeData();
  }, []);

  const initializeData = () => {
    // Mock projects data
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution with payment integration',
        type: 'fullstack',
        status: 'active',
        lastModified: new Date('2024-01-15'),
        platforms: ['React', 'Node.js', 'PostgreSQL'],
        compliance: 92,
        quality: 88,
        stars: 5,
        isPublic: false,
        collaborators: 3
      },
      {
        id: '2',
        name: 'Mobile Banking App',
        description: 'Secure mobile banking application with biometric auth',
        type: 'mobile',
        status: 'deployed',
        lastModified: new Date('2024-01-14'),
        platforms: ['React Native', 'Node.js'],
        compliance: 98,
        quality: 95,
        stars: 4,
        isPublic: false,
        collaborators: 5
      },
      {
        id: '3',
        name: 'Analytics Dashboard',
        description: 'Real-time analytics dashboard with data visualization',
        type: 'web',
        status: 'building',
        lastModified: new Date('2024-01-13'),
        platforms: ['Vue.js', 'Python', 'Redis'],
        compliance: 85,
        quality: 82,
        stars: 3,
        isPublic: true,
        collaborators: 2
      },
      {
        id: '4',
        name: 'API Gateway',
        description: 'Microservices API gateway with rate limiting',
        type: 'api',
        status: 'active',
        lastModified: new Date('2024-01-12'),
        platforms: ['Node.js', 'Docker'],
        compliance: 90,
        quality: 91,
        stars: 4,
        isPublic: true,
        collaborators: 1
      }
    ];

    // Mock templates data
    const mockTemplates: Template[] = [
      {
        id: 'ecommerce',
        name: 'E-commerce Starter',
        description: 'Complete e-commerce platform with shopping cart and payments',
        category: 'Business',
        icon: <Rocket className="w-8 h-8 text-blue-500" />,
        tags: ['React', 'Node.js', 'Payment', 'Inventory'],
        popularity: 95,
        isFeatured: true
      },
      {
        id: 'blog',
        name: 'Blog Platform',
        description: 'Modern blog platform with CMS and SEO optimization',
        category: 'Content',
        icon: <FileText className="w-8 h-8 text-green-500" />,
        tags: ['React', 'Markdown', 'SEO', 'CMS'],
        popularity: 88,
        isFeatured: true
      },
      {
        id: 'saas',
        name: 'SaaS Starter',
        description: 'SaaS application with authentication and billing',
        category: 'Business',
        icon: <Rocket className="w-8 h-8 text-purple-500" />,
        tags: ['React', 'Node.js', 'Auth', 'Billing'],
        popularity: 92,
        isFeatured: false
      },
      {
        id: 'mobile-app',
        name: 'Mobile App Template',
        description: 'Cross-platform mobile app template',
        category: 'Mobile',
        icon: <Smartphone className="w-8 h-8 text-orange-500" />,
        tags: ['React Native', 'Navigation', 'UI Kit'],
        popularity: 85,
        isFeatured: false
      }
    ];

    // Mock activities data
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'compile',
        project: 'E-commerce Platform',
        description: 'Compiled to 8 platforms successfully',
        timestamp: new Date('2024-01-15T10:30:00'),
        status: 'success'
      },
      {
        id: '2',
        type: 'deploy',
        project: 'Mobile Banking App',
        description: 'Deployed to production environment',
        timestamp: new Date('2024-01-15T09:45:00'),
        status: 'success'
      },
      {
        id: '3',
        type: 'compliance',
        project: 'Analytics Dashboard',
        description: 'GDPR compliance check completed',
        timestamp: new Date('2024-01-15T09:30:00'),
        status: 'success'
      },
      {
        id: '4',
        type: 'update',
        project: 'API Gateway',
        description: 'Specification updated with new endpoints',
        timestamp: new Date('2024-01-15T09:15:00'),
        status: 'success'
      }
    ];

    setProjects(mockProjects);
    setTemplates(mockTemplates);
    setActivities(mockActivities);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'building':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'deployed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'building':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'deployed':
        return <Rocket className="w-4 h-4 text-blue-500" />;
      case 'archived':
        return <FolderOpen className="w-4 h-4 text-gray-500" />;
      default:
        return <FolderOpen className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'compile':
        return <Code className="w-4 h-4 text-blue-500" />;
      case 'deploy':
        return <Rocket className="w-4 h-4 text-green-500" />;
      case 'compliance':
        return <Shield className="w-4 h-4 text-purple-500" />;
      case 'update':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'web':
        return <Globe className="w-4 h-4 text-blue-500" />;
      case 'mobile':
        return <Smartphone className="w-4 h-4 text-green-500" />;
      case 'api':
        return <Server className="w-4 h-4 text-purple-500" />;
      case 'fullstack':
        return <LayoutDashboard className="w-4 h-4 text-orange-500" />;
      default:
        return <Code className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleCreateProject = (templateId?: string) => {
    // Navigate to workspace with new project
    const projectId = `project_${Date.now()}`;
    router.push(`/workspace/${projectId}`);
  };

  const handleOpenProject = (projectId: string) => {
    router.push(`/workspace/${projectId}`);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-purple-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PAAM AI Studio</h1>
              </div>
              
              {/* Command Palette */}
              <div className="relative">
                <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 min-w-96">
                  <Command className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search projects, templates, or press ⌘K for commands..."
                    className="bg-transparent border-none outline-none text-sm flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="text-xs text-gray-500">⌘K</div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                Docs
              </Button>
              <Button variant="ghost" size="sm">
                <Key className="w-4 h-4 mr-2" />
                API Keys
              </Button>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Rail */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-4">
            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button 
                  onClick={() => handleCreateProject()}
                  className="w-full justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Import Spec
                </Button>
              </div>
            </div>

            {/* Onboarding Checklist */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Getting Started</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Create first project</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Write PAAM specification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Compile to platforms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Deploy to production</span>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">System Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Compilation</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Compliance</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI Agents</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Storage</span>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Projects</h2>
                <Button onClick={() => handleCreateProject()}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(project.type)}
                          <div>
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <CardDescription className="text-sm">{project.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Platforms</span>
                          <div className="flex items-center space-x-1">
                            {project.platforms.slice(0, 2).map((platform, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {platform}
                              </Badge>
                            ))}
                            {project.platforms.length > 2 && (
                              <span className="text-xs text-gray-500">+{project.platforms.length - 2}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Compliance</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${project.compliance}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{project.compliance}%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Quality</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${project.quality}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{project.quality}%</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Last modified</span>
                          <span className="text-xs">{formatTimeAgo(project.lastModified)}</span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs">{project.stars}</span>
                            </div>
                            {project.collaborators > 0 && (
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3 text-gray-500" />
                                <span className="text-xs">{project.collaborators}</span>
                              </div>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleOpenProject(project.id)}
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Project Templates</h2>
                <p className="text-gray-600 dark:text-gray-400">Start your project with a pre-built template</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        {template.icon}
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="text-sm">{template.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Category</span>
                          <Badge variant="outline" className="text-xs">
                            {template.category}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Popularity</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-purple-500 h-2 rounded-full" 
                                style={{ width: `${template.popularity}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{template.popularity}%</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{template.tags.length - 3}</span>
                          )}
                        </div>

                        <Button 
                          className="w-full mt-4"
                          onClick={() => handleCreateProject(template.id)}
                        >
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Recent Activity</h2>
                <p className="text-gray-600 dark:text-gray-400">Track your development workflow in real-time</p>
              </div>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <Card key={activity.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        {getActivityIcon(activity.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {activity.project}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(activity.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {activity.status === 'success' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {activity.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {activity.status === 'pending' && (
                            <Clock className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}