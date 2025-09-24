/**
 * Unified Dashboard Component
 * Central dashboard for all applications and services
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Activity, 
  Users, 
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Zap,
  Database,
  Server,
  Smartphone,
  Globe,
  BarChart3,
  Target,
  Calendar,
  GitBranch,
  Star,
  Plus,
  Download,
  Filter
} from 'lucide-react';

interface SystemMetric {
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
}

interface Application {
  id: string;
  name: string;
  type: 'web' | 'mobile' | 'backend' | 'ai' | 'fullstack';
  status: 'healthy' | 'warning' | 'error';
  users: number;
  revenue: number;
  lastUpdated: Date;
}

interface RecentActivity {
  id: string;
  app: string;
  action: string;
  user: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
}

export default function UnifiedDashboard() {
  const [systemMetrics] = useState<SystemMetric[]>([
    {
      name: 'Total Users',
      value: '24,523',
      change: '+12.5%',
      trend: 'up',
      icon: <Users className="h-4 w-4" />
    },
    {
      name: 'Revenue',
      value: '$124,563',
      change: '+8.2%',
      trend: 'up',
      icon: <DollarSign className="h-4 w-4" />
    },
    {
      name: 'Active Apps',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: <LayoutDashboard className="h-4 w-4" />
    },
    {
      name: 'System Health',
      value: '98.2%',
      change: '-0.3%',
      trend: 'stable',
      icon: <Activity className="h-4 w-4" />
    }
  ]);

  const [applications] = useState<Application[]>([
    {
      id: '1',
      name: 'E-commerce Platform',
      type: 'fullstack',
      status: 'healthy',
      users: 15420,
      revenue: 45230,
      lastUpdated: new Date()
    },
    {
      id: '2',
      name: 'Mobile Banking',
      type: 'mobile',
      status: 'healthy',
      users: 8750,
      revenue: 32150,
      lastUpdated: new Date()
    },
    {
      id: '3',
      name: 'AI Content Generator',
      type: 'ai',
      status: 'warning',
      users: 3200,
      revenue: 15600,
      lastUpdated: new Date()
    },
    {
      id: '4',
      name: 'P2P Lending',
      type: 'web',
      status: 'healthy',
      users: 2100,
      revenue: 28900,
      lastUpdated: new Date()
    }
  ]);

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      app: 'E-commerce Platform',
      action: 'New deployment completed',
      user: 'John Doe',
      timestamp: new Date(),
      status: 'success'
    },
    {
      id: '2',
      app: 'Mobile Banking',
      action: 'High traffic detected',
      user: 'System',
      timestamp: new Date(Date.now() - 1800000),
      status: 'warning'
    },
    {
      id: '3',
      app: 'AI Content Generator',
      action: 'API rate limit exceeded',
      user: 'System',
      timestamp: new Date(Date.now() - 3600000),
      status: 'error'
    },
    {
      id: '4',
      app: 'P2P Lending',
      action: 'New loan request processed',
      user: 'Jane Smith',
      timestamp: new Date(Date.now() - 7200000),
      status: 'success'
    }
  ]);

  const getStatusBadge = (status: Application['status'] | RecentActivity['status']) => {
    const variants = {
      healthy: 'default',
      warning: 'secondary',
      error: 'destructive',
      success: 'default'
    } as const;

    const labels = {
      healthy: 'Healthy',
      warning: 'Warning',
      error: 'Error',
      success: 'Success'
    } as const;

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getTypeIcon = (type: Application['type']) => {
    switch (type) {
      case 'web':
        return <Globe className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'backend':
        return <Server className="h-4 w-4" />;
      case 'ai':
        return <Zap className="h-4 w-4" />;
      case 'fullstack':
        return <LayoutDashboard className="h-4 w-4" />;
      default:
        return <LayoutDashboard className="h-4 w-4" />;
    }
  };

  const getActivityIcon = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unified Dashboard</h1>
          <p className="text-muted-foreground">Central overview of all applications and services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {systemMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className={`text-xs ${
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Applications Status */}
            <Card>
              <CardHeader>
                <CardTitle>Applications Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(app.type)}
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatNumber(app.users)} users
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(app.status)}
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatCurrency(app.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        {getActivityIcon(activity.status)}
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {activity.app} • {activity.user}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(activity.status)}
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app) => (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(app.type)}
                      <CardTitle className="text-lg">{app.name}</CardTitle>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Users:</span>
                      <span className="font-medium">{formatNumber(app.users)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">{formatCurrency(app.revenue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{app.type}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">
                        {app.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
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
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      {getActivityIcon(activity.status)}
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.app} • {activity.user} • {activity.timestamp.toLocaleString()}
                        </p>
                      </div>
                      {getStatusBadge(activity.status)}
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
                <CardTitle>Revenue by Application</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="flex justify-between">
                      <span>{app.name}</span>
                      <span className="font-medium">{formatCurrency(app.revenue)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="flex justify-between">
                      <span>{app.name}</span>
                      <span className="font-medium">{formatNumber(app.users)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Healthy</span>
                    <span className="font-medium text-green-600">
                      {applications.filter(a => a.status === 'healthy').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warning</span>
                    <span className="font-medium text-yellow-600">
                      {applications.filter(a => a.status === 'warning').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Error</span>
                    <span className="font-medium text-red-600">
                      {applications.filter(a => a.status === 'error').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Web</span>
                    <span className="font-medium">
                      {applications.filter(a => a.type === 'web').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile</span>
                    <span className="font-medium">
                      {applications.filter(a => a.type === 'mobile').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Backend</span>
                    <span className="font-medium">
                      {applications.filter(a => a.type === 'backend').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI</span>
                    <span className="font-medium">
                      {applications.filter(a => a.type === 'ai').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Full Stack</span>
                    <span className="font-medium">
                      {applications.filter(a => a.type === 'fullstack').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}