/**
 * Activity Feed and Notifications System
 * Real-time activity tracking and notification management for the development environment
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bell, 
  Activity, 
  Users, 
  GitBranch, 
  Code, 
  Rocket, 
  Shield, 
  Bug,
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Settings,
  Mail,
  MessageSquare,
  Calendar,
  TrendingUp,
  Zap,
  Database,
  FileText,
  Download,
  Upload,
  Eye,
  EyeOff,
  MoreHorizontal,
  Trash2,
  MarkAsRead
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'collaboration' | 'build' | 'security' | 'compliance';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isImportant: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
  metadata?: Record<string, any>;
}

interface ActivityItem {
  id: string;
  type: 'compile' | 'deploy' | 'test' | 'commit' | 'collaboration' | 'security' | 'compliance';
  action: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  target: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning' | 'info';
  details?: string;
  metadata?: Record<string, any>;
}

interface ActivityFeedProps {
  projectId: string;
  onNotificationRead?: (notificationId: string) => void;
  onActivityFilter?: (filters: any) => void;
  onNotificationAction?: (notificationId: string, action: string) => void;
}

export default function ActivityFeed({
  projectId,
  onNotificationRead,
  onActivityFilter,
  onNotificationAction
}: ActivityFeedProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeTab, setActiveTab] = useState('feed');
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showNotificationsOnly, setShowNotificationsOnly] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      addRandomActivity();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activities]);

  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length;
    setUnreadCount(unread);
  }, [notifications]);

  const initializeData = () => {
    // Initialize notifications
    const mockNotifications: Notification[] = [
      {
        id: 'notif1',
        type: 'success',
        category: 'build',
        title: 'Build Completed Successfully',
        message: 'Your application has been built and deployed to staging',
        timestamp: new Date(Date.now() - 300000),
        isRead: false,
        isImportant: true,
        action: {
          label: 'View Deployment',
          callback: () => console.log('View deployment')
        }
      },
      {
        id: 'notif2',
        type: 'warning',
        category: 'security',
        title: 'Security Scan Results',
        message: '3 potential vulnerabilities found in your codebase',
        timestamp: new Date(Date.now() - 600000),
        isRead: false,
        isImportant: true,
        action: {
          label: 'Review Issues',
          callback: () => console.log('Review security issues')
        }
      },
      {
        id: 'notif3',
        type: 'info',
        category: 'collaboration',
        title: 'New Collaborator Joined',
        message: 'Alex Chen has joined your project',
        timestamp: new Date(Date.now() - 900000),
        isRead: true,
        isImportant: false
      },
      {
        id: 'notif4',
        type: 'error',
        category: 'build',
        title: 'Build Failed',
        message: 'Compilation error in src/components/Header.tsx',
        timestamp: new Date(Date.now() - 1200000),
        isRead: false,
        isImportant: true,
        action: {
          label: 'View Logs',
          callback: () => console.log('View build logs')
        }
      },
      {
        id: 'notif5',
        type: 'success',
        category: 'compliance',
        title: 'Compliance Check Passed',
        message: 'All compliance checks have passed successfully',
        timestamp: new Date(Date.now() - 1800000),
        isRead: true,
        isImportant: false
      }
    ];

    // Initialize activities
    const mockActivities: ActivityItem[] = [
      {
        id: 'act1',
        type: 'deploy',
        action: 'deployed',
        user: { name: 'You', email: 'you@example.com' },
        target: 'application to production',
        timestamp: new Date(Date.now() - 120000),
        status: 'success',
        details: 'Deployment completed successfully on all platforms'
      },
      {
        id: 'act2',
        type: 'collaboration',
        action: 'joined',
        user: { name: 'Alex Chen', email: 'alex@example.com' },
        target: 'the project',
        timestamp: new Date(Date.now() - 900000),
        status: 'info',
        details: 'Invited via email link'
      },
      {
        id: 'act3',
        type: 'compile',
        action: 'compiled',
        user: { name: 'System', email: 'system@paam.studio' },
        target: 'PAAM specification',
        timestamp: new Date(Date.now() - 600000),
        status: 'success',
        details: 'Generated code for 8 platforms'
      },
      {
        id: 'act4',
        type: 'test',
        action: 'ran tests',
        user: { name: 'You', email: 'you@example.com' },
        target: 'test suite',
        timestamp: new Date(Date.now() - 300000),
        status: 'success',
        details: '156 tests passed, 0 failed'
      },
      {
        id: 'act5',
        type: 'security',
        action: 'detected vulnerability',
        user: { name: 'Security Scanner', email: 'security@paam.studio' },
        target: 'payment processing module',
        timestamp: new Date(Date.now() - 180000),
        status: 'warning',
        details: 'Potential SQL injection vulnerability detected'
      }
    ];

    setNotifications(mockNotifications);
    setActivities(mockActivities);
  };

  const addRandomActivity = () => {
    const users = [
      { name: 'You', email: 'you@example.com' },
      { name: 'Alex Chen', email: 'alex@example.com' },
      { name: 'Sarah Johnson', email: 'sarah@example.com' },
      { name: 'System', email: 'system@paam.studio' }
    ];

    const actions = [
      { type: 'commit', action: 'committed changes', target: 'src/components/', status: 'success' as const },
      { type: 'deploy', action: 'deployed', target: 'staging environment', status: 'success' as const },
      { type: 'test', action: 'ran tests', target: 'integration tests', status: 'success' as const },
      { type: 'collaboration', action: 'commented on', target: 'specification file', status: 'info' as const },
      { type: 'compliance', action: 'updated', target: 'compliance documentation', status: 'success' as const }
    ];

    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];

    const newActivity: ActivityItem = {
      id: `act_${Date.now()}`,
      ...randomAction,
      user: randomUser,
      timestamp: new Date(),
      details: `Action completed successfully`
    };

    setActivities(prev => [newActivity, ...prev.slice(0, 49)]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    onNotificationRead?.(notificationId);
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const handleNotificationAction = (notificationId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.action) {
      notification.action.callback();
      onNotificationAction?.(notificationId, 'action_clicked');
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notif.isRead) ||
                         (filter === 'important' && notif.isImportant);
    const matchesSearch = notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || notif.category === categoryFilter;
    
    return matchesFilter && matchesSearch && matchesCategory;
  });

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || activity.type === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'compile': return <Code className="w-4 h-4 text-blue-500" />;
      case 'deploy': return <Rocket className="w-4 h-4 text-green-500" />;
      case 'test': return <Bug className="w-4 h-4 text-purple-500" />;
      case 'commit': return <GitBranch className="w-4 h-4 text-orange-500" />;
      case 'collaboration': return <Users className="w-4 h-4 text-pink-500" />;
      case 'security': return <Shield className="w-4 h-4 text-red-500" />;
      case 'compliance': return <FileText className="w-4 h-4 text-indigo-500" />;
      default: return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Activity Feed
              </h3>
              <p className="text-xs text-gray-500">
                Real-time updates and notifications
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                {unreadCount} unread
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {activities.length} activities
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotificationsOnly(!showNotificationsOnly)}
            className={showNotificationsOnly ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
          >
            <Bell className="w-4 h-4 mr-1" />
            Notifications
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <MarkAsRead className="w-4 h-4 mr-1" />
            Mark All Read
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64 text-sm"
            />
          </div>

          <div className="flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-lg p-1">
            <Button
              variant={categoryFilter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCategoryFilter('all')}
              className="h-7 px-2 text-xs"
            >
              All
            </Button>
            <Button
              variant={categoryFilter === 'build' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCategoryFilter('build')}
              className="h-7 px-2 text-xs"
            >
              Build
            </Button>
            <Button
              variant={categoryFilter === 'security' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCategoryFilter('security')}
              className="h-7 px-2 text-xs"
            >
              Security
            </Button>
            <Button
              variant={categoryFilter === 'collaboration' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setCategoryFilter('collaboration')}
              className="h-7 px-2 text-xs"
            >
              Team
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-lg p-1">
            <Button
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
              className="h-7 px-2 text-xs"
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
              className="h-7 px-2 text-xs"
            >
              Unread
            </Button>
            <Button
              variant={filter === 'important' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setFilter('important')}
              className="h-7 px-2 text-xs"
            >
              Important
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="feed">Activity Feed</TabsTrigger>
            <TabsTrigger value="notifications">Notifications ({unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {filteredActivities.map((activity) => (
                  <Card key={activity.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {activity.user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  <span className="font-medium">{activity.user.name}</span> {activity.action} {activity.target}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {formatTimeAgo(activity.timestamp)}
                                </p>
                              </div>
                            </div>
                            
                            <Badge className={`text-xs ${getStatusColor(activity.status)}`}>
                              {activity.status}
                            </Badge>
                          </div>
                          
                          {activity.details && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {activity.details}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="notifications" className="h-full mt-0">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`hover:shadow-md transition-shadow ${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {notification.title}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              {notification.isImportant && (
                                <Badge variant="outline" className="text-xs">Important</Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs capitalize">
                                {notification.category}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {!notification.isRead && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => markAsRead(notification.id)}
                                  className="h-7 px-2 text-xs"
                                >
                                  Mark as read
                                </Button>
                              )}
                              
                              {notification.action && (
                                <Button
                                  size="sm"
                                  onClick={() => handleNotificationAction(notification.id)}
                                  className="h-7 px-2 text-xs"
                                >
                                  {notification.action.label}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {filteredNotifications.length === 0 && (
                  <div className="text-center py-8">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500">No notifications found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}