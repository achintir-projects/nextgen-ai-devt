/**
 * Jobs Queue System
 * Comprehensive job management system for compilation, testing, deployment, and other background tasks
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Pause, 
  Square, 
  RefreshCw, 
  Settings, 
  Trash2, 
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Zap,
  Database,
  Code,
  Rocket,
  Shield,
  Bug,
  FileText,
  Download,
  Upload,
  Filter,
  Search,
  Calendar,
  Activity,
  BarChart3,
  Users,
  GitBranch,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  X
} from 'lucide-react';

interface Job {
  id: string;
  name: string;
  type: 'compile' | 'test' | 'deploy' | 'analyze' | 'validate' | 'build' | 'sync';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startTime: Date;
  endTime?: Date;
  estimatedDuration?: number;
  output?: string;
  error?: string;
  logs: JobLog[];
  dependencies?: string[];
  metadata?: Record<string, any>;
  createdBy: string;
  tags: string[];
}

interface JobLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  source: string;
}

interface JobQueue {
  id: string;
  name: string;
  description: string;
  jobs: Job[];
  status: 'active' | 'paused' | 'stopped';
  settings: {
    maxConcurrentJobs: number;
    retryAttempts: number;
    timeout: number;
    autoCleanup: boolean;
  };
  statistics: {
    totalJobs: number;
    completedJobs: number;
    failedJobs: number;
    averageExecutionTime: number;
    throughput: number;
  };
}

interface JobsQueueProps {
  projectId: string;
  onJobCreate?: (job: Omit<Job, 'id' | 'startTime' | 'logs'>) => void;
  onJobExecute?: (jobId: string) => void;
  onJobCancel?: (jobId: string) => void;
  onJobComplete?: (job: Job) => void;
}

export default function JobsQueue({
  projectId,
  onJobCreate,
  onJobExecute,
  onJobCancel,
  onJobComplete
}: JobsQueueProps) {
  const [queues, setQueues] = useState<JobQueue[]>([]);
  const [activeQueue, setActiveQueue] = useState<JobQueue | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [filter, setFilter] = useState<'all' | 'running' | 'completed' | 'failed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'created' | 'priority' | 'status'>('created');
  const [showLogs, setShowLogs] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    initializeQueues();
    
    if (autoRefresh) {
      refreshInterval.current = setInterval(refreshQueues, 5000);
    }
    
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [autoRefresh]);

  useEffect(() => {
    if (queues.length > 0 && !activeQueue) {
      setActiveQueue(queues[0]);
    }
  }, [queues, activeQueue]);

  const initializeQueues = () => {
    const mockQueues: JobQueue[] = [
      {
        id: 'default',
        name: 'Default Queue',
        description: 'General purpose job queue for development tasks',
        status: 'active',
        settings: {
          maxConcurrentJobs: 3,
          retryAttempts: 3,
          timeout: 300000,
          autoCleanup: true
        },
        statistics: {
          totalJobs: 156,
          completedJobs: 142,
          failedJobs: 8,
          averageExecutionTime: 45000,
          throughput: 12.5
        },
        jobs: generateMockJobs('default')
      },
      {
        id: 'ci-cd',
        name: 'CI/CD Pipeline',
        description: 'Continuous integration and deployment jobs',
        status: 'active',
        settings: {
          maxConcurrentJobs: 2,
          retryAttempts: 2,
          timeout: 600000,
          autoCleanup: false
        },
        statistics: {
          totalJobs: 89,
          completedJobs: 85,
          failedJobs: 2,
          averageExecutionTime: 120000,
          throughput: 8.2
        },
        jobs: generateMockJobs('ci-cd')
      }
    ];

    setQueues(mockQueues);
    setActiveQueue(mockQueues[0]);
  };

  const generateMockJobs = (queueId: string): Job[] => {
    const now = new Date();
    const jobs: Job[] = [];

    // Running jobs
    jobs.push({
      id: 'job1',
      name: 'Compile PAAM Specification',
      type: 'compile',
      status: 'running',
      priority: 'high',
      progress: 65,
      startTime: new Date(now.getTime() - 120000),
      estimatedDuration: 180000,
      logs: [
        { id: 'log1', timestamp: new Date(now.getTime() - 120000), level: 'info', message: 'Starting compilation...', source: 'compiler' },
        { id: 'log2', timestamp: new Date(now.getTime() - 90000), level: 'info', message: 'Parsing specification file...', source: 'parser' },
        { id: 'log3', timestamp: new Date(now.getTime() - 60000), level: 'info', message: 'Validating entities...', source: 'validator' },
        { id: 'log4', timestamp: new Date(now.getTime() - 30000), level: 'info', message: 'Generating code for platforms...', source: 'generator' }
      ],
      createdBy: 'system',
      tags: ['compilation', 'paam']
    });

    jobs.push({
      id: 'job2',
      name: 'Run Test Suite',
      type: 'test',
      status: 'running',
      priority: 'medium',
      progress: 30,
      startTime: new Date(now.getTime() - 180000),
      estimatedDuration: 300000,
      logs: [
        { id: 'log5', timestamp: new Date(now.getTime() - 180000), level: 'info', message: 'Starting test execution...', source: 'test-runner' },
        { id: 'log6', timestamp: new Date(now.getTime() - 150000), level: 'info', message: 'Running unit tests...', source: 'test-runner' },
        { id: 'log7', timestamp: new Date(now.getTime() - 120000), level: 'info', message: '45/150 tests completed', source: 'test-runner' }
      ],
      createdBy: 'system',
      tags: ['testing', 'unit-tests']
    });

    // Pending jobs
    jobs.push({
      id: 'job3',
      name: 'Deploy to Production',
      type: 'deploy',
      status: 'pending',
      priority: 'critical',
      progress: 0,
      startTime: new Date(now.getTime() + 60000),
      estimatedDuration: 240000,
      dependencies: ['job1', 'job2'],
      createdBy: 'user1',
      tags: ['deployment', 'production']
    });

    jobs.push({
      id: 'job4',
      name: 'Security Analysis',
      type: 'analyze',
      status: 'pending',
      priority: 'high',
      progress: 0,
      startTime: new Date(now.getTime() + 120000),
      estimatedDuration: 180000,
      createdBy: 'system',
      tags: ['security', 'analysis']
    });

    // Completed jobs
    jobs.push({
      id: 'job5',
      name: 'Build Docker Image',
      type: 'build',
      status: 'completed',
      priority: 'medium',
      progress: 100,
      startTime: new Date(now.getTime() - 600000),
      endTime: new Date(now.getTime() - 480000),
      output: 'Docker image built successfully: paam-app:latest',
      logs: [
        { id: 'log8', timestamp: new Date(now.getTime() - 600000), level: 'info', message: 'Building Docker image...', source: 'docker' },
        { id: 'log9', timestamp: new Date(now.getTime() - 540000), level: 'info', message: 'Copying application files...', source: 'docker' },
        { id: 'log10', timestamp: new Date(now.getTime() - 480000), level: 'info', message: 'Image built successfully', source: 'docker' }
      ],
      createdBy: 'system',
      tags: ['docker', 'build']
    });

    // Failed jobs
    jobs.push({
      id: 'job6',
      name: 'Database Migration',
      type: 'sync',
      status: 'failed',
      priority: 'high',
      progress: 45,
      startTime: new Date(now.getTime() - 900000),
      endTime: new Date(now.getTime() - 720000),
      error: 'Database connection timeout: Unable to connect to migration server',
      logs: [
        { id: 'log11', timestamp: new Date(now.getTime() - 900000), level: 'info', message: 'Starting database migration...', source: 'migrator' },
        { id: 'log12', timestamp: new Date(now.getTime() - 840000), level: 'info', message: 'Connecting to database...', source: 'migrator' },
        { id: 'log13', timestamp: new Date(now.getTime() - 780000), level: 'warning', message: 'Connection slow, retrying...', source: 'migrator' },
        { id: 'log14', timestamp: new Date(now.getTime() - 720000), level: 'error', message: 'Connection timeout after 3 attempts', source: 'migrator' }
      ],
      createdBy: 'system',
      tags: ['database', 'migration']
    });

    return jobs;
  };

  const refreshQueues = () => {
    // Simulate refreshing queues
    if (activeQueue) {
      const updatedQueue = { ...activeQueue };
      
      // Update running jobs progress
      updatedQueue.jobs = updatedQueue.jobs.map(job => {
        if (job.status === 'running' && job.progress < 100) {
          const progressIncrement = Math.random() * 10;
          const newProgress = Math.min(100, job.progress + progressIncrement);
          
          if (newProgress >= 100) {
            return {
              ...job,
              status: 'completed' as const,
              progress: 100,
              endTime: new Date(),
              logs: [
                ...job.logs,
                {
                  id: `log_${Date.now()}`,
                  timestamp: new Date(),
                  level: 'info',
                  message: 'Job completed successfully',
                  source: 'system'
                }
              ]
            };
          }
          
          return {
            ...job,
            progress: newProgress,
            logs: [
              ...job.logs,
              {
                id: `log_${Date.now()}`,
                timestamp: new Date(),
                level: 'info',
                message: `Progress: ${Math.round(newProgress)}%`,
                source: 'system'
              }
            ]
          };
        }
        return job;
      });

      // Update statistics
      const completedJobs = updatedQueue.jobs.filter(j => j.status === 'completed').length;
      const failedJobs = updatedQueue.jobs.filter(j => j.status === 'failed').length;
      const runningJobs = updatedQueue.jobs.filter(j => j.status === 'running').length;
      
      updatedQueue.statistics = {
        ...updatedQueue.statistics,
        completedJobs,
        failedJobs,
        totalJobs: updatedQueue.jobs.length
      };

      setActiveQueue(updatedQueue);
      setQueues(prev => 
        prev.map(q => q.id === updatedQueue.id ? updatedQueue : q)
      );
    }
  };

  const executeJob = (jobId: string) => {
    if (!activeQueue) return;

    const updatedJobs = activeQueue.jobs.map(job => {
      if (job.id === jobId && job.status === 'pending') {
        const runningJob = {
          ...job,
          status: 'running' as const,
          startTime: new Date(),
          logs: [
            ...job.logs,
            {
              id: `log_${Date.now()}`,
              timestamp: new Date(),
              level: 'info',
              message: 'Job started',
              source: 'system'
            }
          ]
        };
        onJobExecute?.(jobId);
        return runningJob;
      }
      return job;
    });

    setActiveQueue(prev => prev ? { ...prev, jobs: updatedJobs } : null);
  };

  const cancelJob = (jobId: string) => {
    if (!activeQueue) return;

    const updatedJobs = activeQueue.jobs.map(job => {
      if (job.id === jobId && (job.status === 'running' || job.status === 'pending')) {
        const cancelledJob = {
          ...job,
          status: 'cancelled' as const,
          endTime: new Date(),
          logs: [
            ...job.logs,
            {
              id: `log_${Date.now()}`,
              timestamp: new Date(),
              level: 'warning',
              message: 'Job cancelled by user',
              source: 'system'
            }
          ]
        };
        onJobCancel?.(jobId);
        return cancelledJob;
      }
      return job;
    });

    setActiveQueue(prev => prev ? { ...prev, jobs: updatedJobs } : null);
  };

  const retryJob = (jobId: string) => {
    if (!activeQueue) return;

    const updatedJobs = activeQueue.jobs.map(job => {
      if (job.id === jobId && job.status === 'failed') {
        const retriedJob = {
          ...job,
          status: 'pending' as const,
          progress: 0,
          startTime: new Date(),
          endTime: undefined,
          error: undefined,
          logs: [
            ...job.logs,
            {
              id: `log_${Date.now()}`,
              timestamp: new Date(),
              level: 'info',
              message: 'Job queued for retry',
              source: 'system'
            }
          ]
        };
        return retriedJob;
      }
      return job;
    });

    setActiveQueue(prev => prev ? { ...prev, jobs: updatedJobs } : null);
  };

  const deleteJob = (jobId: string) => {
    if (!activeQueue) return;

    const updatedJobs = activeQueue.jobs.filter(job => job.id !== jobId);
    setActiveQueue(prev => prev ? { ...prev, jobs: updatedJobs } : null);
  };

  const getJobIcon = (type: string) => {
    switch (type) {
      case 'compile': return <Code className="w-4 h-4" />;
      case 'test': return <Bug className="w-4 h-4" />;
      case 'deploy': return <Rocket className="w-4 h-4" />;
      case 'analyze': return <BarChart3 className="w-4 h-4" />;
      case 'validate': return <Shield className="w-4 h-4" />;
      case 'build': return <Database className="w-4 h-4" />;
      case 'sync': return <RefreshCw className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <XCircle className="w-3 h-3 text-red-500" />;
      case 'warning': return <AlertCircle className="w-3 h-3 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-3 h-3 text-blue-500" />;
      case 'debug': return <Activity className="w-3 h-3 text-gray-500" />;
      default: return <Activity className="w-3 h-3 text-gray-500" />;
    }
  };

  const filteredJobs = activeQueue?.jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  }) || [];

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return b.startTime.getTime() - a.startTime.getTime();
    }
  });

  if (!activeQueue) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-gray-400" />
          <p className="text-gray-500">Loading jobs queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Jobs Queue
              </h3>
              <p className="text-xs text-gray-500">
                {activeQueue.name} • {activeQueue.jobs.length} jobs
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {activeQueue.jobs.filter(j => j.status === 'running').length} running
            </Badge>
            <Badge variant="outline" className="text-xs">
              {activeQueue.jobs.filter(j => j.status === 'pending').length} pending
            </Badge>
            <Badge variant="outline" className="text-xs">
              {activeQueue.statistics.completedJobs} completed
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-blue-50 text-blue-600 border-blue-200' : ''}
          >
            <RefreshCw className={`w-4 h-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
            Auto-refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshQueues}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setIsCreatingJob(true)}
          >
            <Play className="w-4 h-4 mr-1" />
            New Job
          </Button>
        </div>
      </div>

      {/* Queue Selector */}
      <div className="flex items-center space-x-2 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-1">
          {queues.map((queue) => (
            <Button
              key={queue.id}
              variant={activeQueue.id === queue.id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveQueue(queue)}
              className="h-8 px-3"
            >
              {queue.name}
              <Badge variant="secondary" className="ml-2 text-xs">
                {queue.jobs.length}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Jobs List */}
        <div className="flex-1 flex flex-col">
          {/* Filters and Search */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <Button
                  variant={filter === 'all' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className="h-7 px-2 text-xs"
                >
                  All
                </Button>
                <Button
                  variant={filter === 'running' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('running')}
                  className="h-7 px-2 text-xs"
                >
                  Running
                </Button>
                <Button
                  variant={filter === 'completed' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('completed')}
                  className="h-7 px-2 text-xs"
                >
                  Completed
                </Button>
                <Button
                  variant={filter === 'failed' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setFilter('failed')}
                  className="h-7 px-2 text-xs"
                >
                  Failed
                </Button>
              </div>

              <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <Button
                  variant={sortBy === 'created' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('created')}
                  className="h-7 px-2 text-xs"
                >
                  Created
                </Button>
                <Button
                  variant={sortBy === 'priority' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('priority')}
                  className="h-7 px-2 text-xs"
                >
                  Priority
                </Button>
                <Button
                  variant={sortBy === 'status' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSortBy('status')}
                  className="h-7 px-2 text-xs"
                >
                  Status
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {sortedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <div className="flex items-center space-x-2">
                            {getJobIcon(job.type)}
                            <div>
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                {job.name}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                                  {job.status}
                                </Badge>
                                <Badge className={`text-xs ${getPriorityColor(job.priority)}`}>
                                  {job.priority}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {job.type}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1">
                            {job.status === 'running' && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span>Progress</span>
                                  <span>{Math.round(job.progress)}%</span>
                                </div>
                                <Progress value={job.progress} className="h-2" />
                              </div>
                            )}
                            
                            {job.error && (
                              <div className="text-xs text-red-600 bg-red-50 p-2 rounded mt-2">
                                {job.error}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {job.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => executeJob(job.id)}
                              className="h-7 px-2"
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          )}
                          
                          {(job.status === 'running' || job.status === 'pending') && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => cancelJob(job.id)}
                              className="h-7 px-2"
                            >
                              <Square className="w-3 h-3" />
                            </Button>
                          )}
                          
                          {job.status === 'failed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => retryJob(job.id)}
                              className="h-7 px-2"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedJob(job)}
                            className="h-7 px-2"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>Created: {job.startTime.toLocaleTimeString()}</span>
                          {job.endTime && (
                            <span>Duration: {Math.round((job.endTime.getTime() - job.startTime.getTime()) / 1000)}s</span>
                          )}
                          <div className="flex items-center space-x-1">
                            {job.tags.map((tag, index) => (
                              <span key={index} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <span>{job.logs.length} logs</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowLogs(!showLogs)}
                            className="h-5 w-5 p-0"
                          >
                            <ChevronDown className={`w-3 h-3 transform ${showLogs ? 'rotate-180' : ''}`} />
                          </Button>
                        </div>
                      </div>

                      {showLogs && job.logs.length > 0 && (
                        <div className="mt-3 border-t pt-3">
                          <ScrollArea className="h-32">
                            <div className="space-y-1">
                              {job.logs.map((log) => (
                                <div key={log.id} className="flex items-start space-x-2 text-xs">
                                  {getLogIcon(log.level)}
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <span className="text-gray-500">[{log.timestamp.toLocaleTimeString()}]</span>
                                      <span className="text-gray-400">{log.source}</span>
                                    </div>
                                    <div className="text-gray-700 dark:text-gray-300">{log.message}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Job Details Sidebar */}
        {selectedJob && (
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Job Details
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedJob(null)}
                  className="h-6 w-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>

              <Card>
                <CardContent className="p-3 space-y-3">
                  <div>
                    <label className="text-xs text-gray-500">Name</label>
                    <div className="text-sm font-medium">{selectedJob.name}</div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500">Type</label>
                    <div className="text-sm flex items-center space-x-1">
                      {getJobIcon(selectedJob.type)}
                      <span className="capitalize">{selectedJob.type}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500">Status</label>
                    <Badge className={`text-xs ${getStatusColor(selectedJob.status)}`}>
                      {selectedJob.status}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500">Priority</label>
                    <Badge className={`text-xs ${getPriorityColor(selectedJob.priority)}`}>
                      {selectedJob.priority}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500">Created By</label>
                    <div className="text-sm">{selectedJob.createdBy}</div>
                  </div>
                  
                  <div>
                    <label className="text-xs text-gray-500">Started</label>
                    <div className="text-sm">{selectedJob.startTime.toLocaleString()}</div>
                  </div>
                  
                  {selectedJob.endTime && (
                    <div>
                      <label className="text-xs text-gray-500">Ended</label>
                      <div className="text-sm">{selectedJob.endTime.toLocaleString()}</div>
                    </div>
                  )}
                  
                  {selectedJob.estimatedDuration && (
                    <div>
                      <label className="text-xs text-gray-500">Estimated Duration</label>
                      <div className="text-sm">{Math.round(selectedJob.estimatedDuration / 1000)}s</div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedJob.tags.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500">Tags</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedJob.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.dependencies && selectedJob.dependencies.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500">Dependencies</label>
                  <div className="mt-1 space-y-1">
                    {selectedJob.dependencies.map((dep, index) => (
                      <div key={index} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {dep}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.output && (
                <div>
                  <label className="text-xs text-gray-500">Output</label>
                  <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">
                    {selectedJob.output}
                  </div>
                </div>
              )}

              {selectedJob.error && (
                <div>
                  <label className="text-xs text-gray-500">Error</label>
                  <div className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-600 dark:text-red-400">
                    {selectedJob.error}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}