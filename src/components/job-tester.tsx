/**
 * Job API Tester Component
 * Allows testing of various job APIs and endpoints
 */

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Stop, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  Settings,
  Terminal,
  Database,
  Server,
  Network
} from 'lucide-react';

interface JobResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  output?: string;
  error?: string;
  metadata?: {
    type: string;
    endpoint: string;
    parameters: Record<string, any>;
  };
}

export default function JobTester() {
  const [jobs, setJobs] = useState<JobResult[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runJob = async (jobType: string, endpoint: string, parameters: Record<string, any> = {}) => {
    const jobId = `job_${Date.now()}`;
    const newJob: JobResult = {
      id: jobId,
      name: `${jobType} Test`,
      status: 'pending',
      startTime: new Date(),
      metadata: {
        type: jobType,
        endpoint,
        parameters
      }
    };

    setJobs(prev => [newJob, ...prev]);
    setSelectedJob(newJob);
    setIsRunning(true);

    // Update job status to running
    setTimeout(() => {
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, status: 'running' } : job
      ));
    }, 100);

    try {
      // Simulate API call
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters)
      });

      const result = await response.json();
      const endTime = new Date();
      const duration = endTime.getTime() - newJob.startTime.getTime();

      setJobs(prev => prev.map(job => 
        job.id === jobId ? {
          ...job,
          status: response.ok ? 'completed' : 'failed',
          endTime,
          duration,
          output: JSON.stringify(result, null, 2),
          error: response.ok ? undefined : result.error || 'Request failed'
        } : job
      ));
    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - newJob.startTime.getTime();

      setJobs(prev => prev.map(job => 
        job.id === jobId ? {
          ...job,
          status: 'failed',
          endTime,
          duration,
          error: error instanceof Error ? error.message : 'Unknown error'
        } : job
      ));
    } finally {
      setIsRunning(false);
    }
  };

  const clearJobs = () => {
    setJobs([]);
    setSelectedJob(null);
  };

  const getStatusIcon = (status: JobResult['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: JobResult['status']) => {
    const variants = {
      pending: 'secondary',
      running: 'default',
      completed: 'default',
      failed: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]} className="flex items-center gap-1">
        {getStatusIcon(status)}
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job API Tester</h1>
          <p className="text-muted-foreground">Test various job endpoints and APIs</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={clearJobs} variant="outline">
            Clear History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Job Controls */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Test Jobs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">API Endpoints</h4>
                <div className="space-y-2">
                  <Button
                    onClick={() => runJob('Health Check', '/api/health')}
                    disabled={isRunning}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Server className="h-4 w-4 mr-2" />
                    Health Check
                  </Button>
                  
                  <Button
                    onClick={() => runJob('PAAM Operation', '/api/paam/operations', {
                      type: 'compile',
                      data: { target: 'react' }
                    })}
                    disabled={isRunning}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    PAAM Compile
                  </Button>
                  
                  <Button
                    onClick={() => runJob('Database Query', '/api/projects', {})}
                    disabled={isRunning}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    List Projects
                  </Button>
                  
                  <Button
                    onClick={() => runJob('Network Test', '/api/test/network', {})}
                    disabled={isRunning}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Network className="h-4 w-4 mr-2" />
                    Network Test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Results */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Job Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="list" className="w-full">
                <TabsList>
                  <TabsTrigger value="list">Job List</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="list" className="space-y-4">
                  <ScrollArea className="h-96">
                    {jobs.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No jobs executed yet. Run a test job to see results.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {jobs.map((job) => (
                          <div
                            key={job.id}
                            className={`p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                              selectedJob?.id === job.id ? 'border-primary' : ''
                            }`}
                            onClick={() => setSelectedJob(job)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(job.status)}
                                <span className="font-medium">{job.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(job.status)}
                                {job.duration && (
                                  <span className="text-sm text-muted-foreground">
                                    {job.duration}ms
                                  </span>
                                )}
                              </div>
                            </div>
                            {job.metadata && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {job.metadata.type} - {job.metadata.endpoint}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  {selectedJob ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Job ID</label>
                          <p className="text-sm text-muted-foreground">{selectedJob.id}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Status</label>
                          <div>{getStatusBadge(selectedJob.status)}</div>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Start Time</label>
                          <p className="text-sm text-muted-foreground">
                            {selectedJob.startTime.toLocaleString()}
                          </p>
                        </div>
                        {selectedJob.endTime && (
                          <div>
                            <label className="text-sm font-medium">End Time</label>
                            <p className="text-sm text-muted-foreground">
                              {selectedJob.endTime.toLocaleString()}
                            </p>
                          </div>
                        )}
                        {selectedJob.duration && (
                          <div>
                            <label className="text-sm font-medium">Duration</label>
                            <p className="text-sm text-muted-foreground">
                              {selectedJob.duration}ms
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {selectedJob.metadata && (
                        <div>
                          <label className="text-sm font-medium">Metadata</label>
                          <pre className="text-sm bg-muted p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(selectedJob.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {selectedJob.error && (
                        <div>
                          <label className="text-sm font-medium text-red-500">Error</label>
                          <pre className="text-sm bg-red-50 border border-red-200 p-2 rounded mt-1 overflow-x-auto">
                            {selectedJob.error}
                          </pre>
                        </div>
                      )}
                      
                      {selectedJob.output && (
                        <div>
                          <label className="text-sm font-medium">Output</label>
                          <ScrollArea className="h-64">
                            <pre className="text-sm bg-muted p-2 rounded mt-1 overflow-x-auto">
                              {selectedJob.output}
                            </pre>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Select a job to view details
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}