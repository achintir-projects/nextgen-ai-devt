/**
 * App History Dashboard Component
 * Dashboard for project management and history
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Plus, 
  Download,
  FolderOpen,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  BarChart3,
  Users,
  Calendar,
  GitBranch,
  Star,
  Archive,
  Trash2,
  Edit
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'archived' | 'draft';
  type: 'web' | 'mobile' | 'backend' | 'ai' | 'fullstack';
  createdAt: Date;
  updatedAt: Date;
  lastDeployed?: Date;
  teamSize: number;
  progress: number;
  tags: string[];
  metrics?: {
    commits: number;
    deployments: number;
    issues: number;
    stars?: number;
  };
}

interface Activity {
  id: string;
  projectId: string;
  projectName: string;
  action: string;
  user: string;
  timestamp: Date;
  type: 'create' | 'update' | 'deploy' | 'archive' | 'team_change';
}

export default function AppHistoryDashboard() {
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution with React and Node.js',
      status: 'active',
      type: 'fullstack',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date(),
      lastDeployed: new Date('2024-03-01'),
      teamSize: 5,
      progress: 75,
      tags: ['react', 'nodejs', 'mongodb', 'stripe'],
      metrics: {
        commits: 142,
        deployments: 23,
        issues: 8,
        stars: 12
      }
    },
    {
      id: '2',
      name: 'Mobile Banking App',
      description: 'iOS and Android banking application',
      status: 'active',
      type: 'mobile',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date(),
      lastDeployed: new Date('2024-03-05'),
      teamSize: 8,
      progress: 60,
      tags: ['react-native', 'typescript', 'firebase'],
      metrics: {
        commits: 89,
        deployments: 15,
        issues: 12
      }
    },
    {
      id: '3',
      name: 'AI Content Generator',
      description: 'Machine learning powered content generation tool',
      status: 'completed',
      type: 'ai',
      createdAt: new Date('2023-11-10'),
      updatedAt: new Date('2024-01-20'),
      lastDeployed: new Date('2024-01-20'),
      teamSize: 3,
      progress: 100,
      tags: ['python', 'tensorflow', 'openai'],
      metrics: {
        commits: 67,
        deployments: 8,
        issues: 3,
        stars: 45
      }
    },
    {
      id: '4',
      name: 'Task Management API',
      description: 'RESTful API for task management system',
      status: 'archived',
      type: 'backend',
      createdAt: new Date('2023-08-15'),
      updatedAt: new Date('2023-12-01'),
      lastDeployed: new Date('2023-11-30'),
      teamSize: 2,
      progress: 100,
      tags: ['nodejs', 'express', 'postgresql'],
      metrics: {
        commits: 34,
        deployments: 6,
        issues: 2
      }
    }
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      projectId: '1',
      projectName: 'E-commerce Platform',
      action: 'Deployed to production',
      user: 'John Doe',
      timestamp: new Date(),
      type: 'deploy'
    },
    {
      id: '2',
      projectId: '2',
      projectName: 'Mobile Banking App',
      action: 'Updated payment processing module',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 3600000),
      type: 'update'
    },
    {
      id: '3',
      projectId: '3',
      projectName: 'AI Content Generator',
      action: 'Project completed and archived',
      user: 'Mike Johnson',
      timestamp: new Date(Date.now() - 7200000),
      type: 'archive'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Project['status']>('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Project['status']) => {
    const variants = {
      active: 'default',
      completed: 'default',
      archived: 'secondary',
      draft: 'outline'
    } as const;

    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getTypeIcon = (type: Project['type']) => {
    switch (type) {
      case 'web':
        return <div className="h-4 w-4 rounded-full bg-blue-500" />;
      case 'mobile':
        return <div className="h-4 w-4 rounded-full bg-green-500" />;
      case 'backend':
        return <div className="h-4 w-4 rounded-full bg-yellow-500" />;
      case 'ai':
        return <div className="h-4 w-4 rounded-full bg-purple-500" />;
      case 'fullstack':
        return <div className="h-4 w-4 rounded-full bg-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-500" />;
    }
  };

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'create':
        return <Plus className="h-4 w-4 text-green-500" />;
      case 'update':
        return <Edit className="h-4 w-4 text-blue-500" />;
      case 'deploy':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'archive':
        return <Archive className="h-4 w-4 text-gray-500" />;
      case 'team_change':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">Manage your application portfolio and history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter(p => p.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce((sum, p) => sum + p.teamSize, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commits</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce((sum, p) => sum + (p.metrics?.commits || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce((sum, p) => sum + (p.metrics?.deployments || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful deployments
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('completed')}
              >
                Completed
              </Button>
              <Button
                variant={statusFilter === 'archived' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('archived')}
              >
                Archived
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(project.type)}
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Team:</span>
                      <span className="font-medium">{project.teamSize} members</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">{formatDate(project.updatedAt)}</span>
                    </div>
                    
                    {project.metrics && (
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <GitBranch className="h-3 w-3" />
                          <span>{project.metrics.commits}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>{project.metrics.deployments}</span>
                        </div>
                        {project.metrics.stars && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{project.metrics.stars}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.projectName} • {activity.user}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Projects by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Active</span>
                    <span className="font-medium">{projects.filter(p => p.status === 'active').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed</span>
                    <span className="font-medium">{projects.filter(p => p.status === 'completed').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Archived</span>
                    <span className="font-medium">{projects.filter(p => p.status === 'archived').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Draft</span>
                    <span className="font-medium">{projects.filter(p => p.status === 'draft').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Web</span>
                    <span className="font-medium">{projects.filter(p => p.type === 'web').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile</span>
                    <span className="font-medium">{projects.filter(p => p.type === 'mobile').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backend</span>
                    <span className="font-medium">{projects.filter(p => p.type === 'backend').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI</span>
                    <span className="font-medium">{projects.filter(p => p.type === 'ai').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Full Stack</span>
                    <span className="font-medium">{projects.filter(p => p.type === 'fullstack').length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{project.name}</h3>
                      <Badge variant="outline">{project.teamSize} members</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}