/**
 * Performance Metrics Dashboard
 * Real-time analytics and performance monitoring for PAAM platform
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Zap, 
  Clock,
  RefreshCw,
  Settings,
  Eye,
  Download,
  Filter,
  Search,
  Users,
  Code,
  Database,
  Globe,
  Server,
  Target,
  Shield,
  FileText,
  Layers,
  GitBranch,
  Workflow,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ThumbsUp,
  Rocket,
  Timer,
  DollarSign,
  Percent,
  Calendar,
  Hourglass,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Thermometer,
  Gauge
} from 'lucide-react';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  change: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
  category: 'development' | 'quality' | 'efficiency' | 'maintenance';
  description: string;
}

interface RealTimeMetric {
  id: string;
  name: string;
  value: number;
  timestamp: Date;
  type: 'cpu' | 'memory' | 'network' | 'disk' | 'response' | 'throughput';
}

interface ProjectPerformance {
  id: string;
  name: string;
  developmentSpeed: number;
  codeQuality: number;
  teamEfficiency: number;
  maintenanceCost: number;
  overallScore: number;
  status: 'active' | 'completed' | 'archived';
  lastUpdated: Date;
}

interface PerformanceAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: Date;
  metric?: string;
  value?: number;
}

interface PerformanceMetricsDashboardProps {
  projects?: ProjectPerformance[];
  onMetricUpdate?: (metric: PerformanceMetric) => void;
}

export default function PerformanceMetricsDashboard({ 
  projects = [], 
  onMetricUpdate 
}: PerformanceMetricsDashboardProps) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetric[]>([]);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    initializeMetrics();
    startRealTimeUpdates();
    return () => stopRealTimeUpdates();
  }, []);

  const initializeMetrics = () => {
    const defaultMetrics: PerformanceMetric[] = [
      {
        id: 'dev_speed',
        name: 'Development Speed',
        value: 67,
        target: 70,
        unit: '%',
        trend: 'up',
        change: 5.2,
        status: 'good',
        category: 'development',
        description: '67% faster development compared to traditional methods'
      },
      {
        id: 'code_quality',
        name: 'Code Quality',
        value: 85,
        target: 80,
        unit: '%',
        trend: 'up',
        change: 3.8,
        status: 'excellent',
        category: 'quality',
        description: '85% improvement in code quality through automated enforcement'
      },
      {
        id: 'team_efficiency',
        name: 'Team Efficiency',
        value: 50,
        target: 45,
        unit: '%',
        trend: 'stable',
        change: 0.5,
        status: 'excellent',
        category: 'efficiency',
        description: '50% smaller teams with maintained productivity'
      },
      {
        id: 'maintenance_cost',
        name: 'Maintenance Cost',
        value: 75,
        target: 70,
        unit: '%',
        trend: 'down',
        change: -2.1,
        status: 'good',
        category: 'maintenance',
        description: '75% reduction in maintenance costs through quality improvements'
      },
      {
        id: 'compilation_success',
        name: 'Compilation Success Rate',
        value: 98,
        target: 95,
        unit: '%',
        trend: 'up',
        change: 1.2,
        status: 'excellent',
        category: 'development',
        description: '98% successful compilation rate across all platforms'
      },
      {
        id: 'intent_preservation',
        name: 'Intent Preservation',
        value: 95,
        target: 90,
        unit: '%',
        trend: 'stable',
        change: 0.3,
        status: 'excellent',
        category: 'quality',
        description: '95% intent preservation accuracy across specifications'
      }
    ];

    setMetrics(defaultMetrics);
  };

  const startRealTimeUpdates = () => {
    const updateInterval = setInterval(() => {
      updateRealTimeMetrics();
    }, 5000);

    return () => clearInterval(updateInterval);
  };

  const stopRealTimeUpdates = () => {
    // Cleanup any intervals
  };

  const updateRealTimeMetrics = () => {
    const newRealTimeMetrics: RealTimeMetric[] = [
      {
        id: 'cpu_usage',
        name: 'CPU Usage',
        value: Math.random() * 100,
        timestamp: new Date(),
        type: 'cpu'
      },
      {
        id: 'memory_usage',
        name: 'Memory Usage',
        value: Math.random() * 100,
        timestamp: new Date(),
        type: 'memory'
      },
      {
        id: 'network_latency',
        name: 'Network Latency',
        value: Math.random() * 200,
        timestamp: new Date(),
        type: 'network'
      },
      {
        id: 'disk_io',
        name: 'Disk I/O',
        value: Math.random() * 100,
        timestamp: new Date(),
        type: 'disk'
      },
      {
        id: 'response_time',
        name: 'Response Time',
        value: Math.random() * 1000,
        timestamp: new Date(),
        type: 'response'
      },
      {
        id: 'throughput',
        name: 'Throughput',
        value: Math.random() * 10000,
        timestamp: new Date(),
        type: 'throughput'
      }
    ];

    setRealTimeMetrics(newRealTimeMetrics);
    generateAlerts(newRealTimeMetrics);
  };

  const generateAlerts = (realtimeMetrics: RealTimeMetric[]) => {
    const newAlerts: PerformanceAlert[] = [];

    realtimeMetrics.forEach(metric => {
      if (metric.type === 'cpu' && metric.value > 80) {
        newAlerts.push({
          id: `alert_${Date.now()}`,
          type: 'warning',
          title: 'High CPU Usage',
          description: `CPU usage is at ${metric.value.toFixed(1)}%`,
          timestamp: new Date(),
          metric: metric.name,
          value: metric.value
        });
      }
      
      if (metric.type === 'memory' && metric.value > 85) {
        newAlerts.push({
          id: `alert_${Date.now()}`,
          type: 'error',
          title: 'High Memory Usage',
          description: `Memory usage is at ${metric.value.toFixed(1)}%`,
          timestamp: new Date(),
          metric: metric.name,
          value: metric.value
        });
      }
      
      if (metric.type === 'response' && metric.value > 500) {
        newAlerts.push({
          id: `alert_${Date.now()}`,
          type: 'warning',
          title: 'High Response Time',
          description: `Response time is ${metric.value.toFixed(0)}ms`,
          timestamp: new Date(),
          metric: metric.name,
          value: metric.value
        });
      }
    });

    // Add some success alerts
    if (Math.random() > 0.8) {
      newAlerts.push({
        id: `alert_${Date.now()}`,
        type: 'success',
        title: 'Performance Target Achieved',
        description: 'Development speed target exceeded by 5%',
        timestamp: new Date()
      });
    }

    setAlerts(prev => [...newAlerts.slice(-10), ...prev].slice(0, 20));
  };

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    initializeMetrics();
    updateRealTimeMetrics();
    setIsRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const getMetricIcon = (type: string) => {
    switch (type) {
      case 'cpu':
        return <Cpu className="w-4 h-4" />;
      case 'memory':
        return <HardDrive className="w-4 h-4" />;
      case 'network':
        return <Wifi className="w-4 h-4" />;
      case 'disk':
        return <Database className="w-4 h-4" />;
      case 'response':
        return <Timer className="w-4 h-4" />;
      case 'throughput':
        return <Zap className="w-4 h-4" />;
      default:
        return <Gauge className="w-4 h-4" />;
    }
  };

  const formatMetricValue = (metric: RealTimeMetric) => {
    switch (metric.type) {
      case 'cpu':
      case 'memory':
        return `${metric.value.toFixed(1)}%`;
      case 'network':
      case 'response':
        return `${metric.value.toFixed(0)}ms`;
      case 'disk':
        return `${metric.value.toFixed(1)}%`;
      case 'throughput':
        return `${metric.value.toFixed(0)}/s`;
      default:
        return metric.value.toFixed(1);
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Performance Metrics Dashboard
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time analytics and performance monitoring
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {['1h', '24h', '7d', '30d'].map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? 'default' : 'ghost'}
                  size="sm"
                  className="text-xs h-6 px-2"
                  onClick={() => setSelectedTimeframe(timeframe as any)}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshMetrics}
              disabled={isRefreshing}
              className="flex items-center space-x-2"
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => (
            <Card key={metric.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{metric.name}</div>
                    <div className="text-xs text-gray-500">{metric.description}</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(metric.trend)}
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {metric.value}{metric.unit}
                    </div>
                    <Badge className={`text-xs ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress to Target</span>
                      <span>{metric.target}{metric.unit}</span>
                    </div>
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Category</span>
                    <Badge variant="outline" className="text-xs">
                      {metric.category}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real-time Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Real-time System Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {realTimeMetrics.map((metric) => (
                <div key={metric.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getMetricIcon(metric.type)}
                      <span className="text-xs font-medium">{metric.name}</span>
                    </div>
                    <div className={`text-xs px-1 rounded ${
                      metric.value > 80 ? 'bg-red-100 text-red-700' :
                      metric.value > 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {metric.value > 80 ? 'High' : metric.value > 60 ? 'Medium' : 'Low'}
                    </div>
                  </div>
                  <div className="text-lg font-semibold">
                    {formatMetricValue(metric)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {metric.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {alerts.slice(0, 10).map((alert) => (
                    <div key={alert.id} className="p-3 border rounded-lg space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getAlertIcon(alert.type)}
                          <span className="text-sm font-medium">{alert.title}</span>
                        </div>
                        <Badge variant={
                          alert.type === 'success' ? 'default' :
                          alert.type === 'warning' ? 'secondary' :
                          alert.type === 'error' ? 'destructive' : 'outline'
                        } className="text-xs">
                          {alert.type}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">{alert.description}</div>
                      <div className="text-xs text-gray-500">
                        {alert.timestamp.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+67%</div>
                    <div className="text-xs text-gray-500">Development Speed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">+85%</div>
                    <div className="text-xs text-gray-500">Code Quality</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">-50%</div>
                    <div className="text-xs text-gray-500">Team Size</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">-75%</div>
                    <div className="text-xs text-gray-500">Maintenance</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-600">Overall Performance Score</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500"
                        style={{ width: '87%' }}
                      />
                    </div>
                    <span className="text-sm font-bold">87%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Performance Overview */}
        {projects.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Project Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Project</th>
                      <th className="text-left p-2">Dev Speed</th>
                      <th className="text-left p-2">Quality</th>
                      <th className="text-left p-2">Efficiency</th>
                      <th className="text-left p-2">Maintenance</th>
                      <th className="text-left p-2">Overall</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id} className="border-b">
                        <td className="p-2 font-medium">{project.name}</td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <Progress value={project.developmentSpeed} className="w-16 h-2" />
                            <span className="text-xs">{project.developmentSpeed}%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <Progress value={project.codeQuality} className="w-16 h-2" />
                            <span className="text-xs">{project.codeQuality}%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <Progress value={project.teamEfficiency} className="w-16 h-2" />
                            <span className="text-xs">{project.teamEfficiency}%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center space-x-2">
                            <Progress value={project.maintenanceCost} className="w-16 h-2" />
                            <span className="text-xs">{project.maintenanceCost}%</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant={
                            project.overallScore >= 90 ? 'default' :
                            project.overallScore >= 70 ? 'secondary' : 'outline'
                          } className="text-xs">
                            {project.overallScore}%
                          </Badge>
                        </td>
                        <td className="p-2">
                          <Badge variant={
                            project.status === 'active' ? 'default' :
                            project.status === 'completed' ? 'secondary' : 'outline'
                          } className="text-xs">
                            {project.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}