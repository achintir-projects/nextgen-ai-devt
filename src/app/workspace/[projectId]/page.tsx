/**
 * PAAM AI IDE Workspace
 * Replit-style IDE workspace with integrated PAAM specification design, code editing, and multi-platform preview
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import MonacoEditorComponent from '@/components/ide/monaco-editor';
import SpecDesigner from '@/components/ide/spec-designer';
import MultiPlatformPreview from '@/components/ide/multi-platform-preview';
import TerminalComponent from '@/components/ide/terminal';
import { 
  Code, 
  GitBranch, 
  Play, 
  Square, 
  RefreshCw, 
  Settings, 
  Save,
  FileText,
  Globe,
  Smartphone,
  Server,
  Bug,
  Shield,
  Terminal,
  Users,
  Bell,
  Plus,
  X,
  Minimize2,
  Maximize2,
  Activity,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  BarChart3
} from 'lucide-react';

interface WorkspaceTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

interface File {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  type: 'source' | 'spec' | 'config' | 'test';
}

interface Job {
  id: string;
  type: 'compile' | 'test' | 'deploy' | 'validate';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  output?: string;
}

interface ActivityItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  description: string;
  timestamp: Date;
}

export default function IDEWorkspace() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [activeTab, setActiveTab] = useState('editor');
  const [files, setFiles] = useState<File[]>([]);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    initializeWorkspace();
  }, [projectId]);

  const initializeWorkspace = () => {
    // Mock files data
    const mockFiles: File[] = [
      {
        id: '1',
        name: 'app.paam',
        path: '/spec/app.paam',
        language: 'paam',
        content: `# PAAM Specification
name: E-commerce Platform
version: 1.0.0

entities:
  - name: User
    fields:
      - name: id
        type: UUID
        required: true
      - name: email
        type: Email
        required: true
      - name: name
        type: String
        required: true

  - name: Product
    fields:
      - name: id
        type: UUID
        required: true
      - name: name
        type: String
        required: true
      - name: price
        type: Decimal
        required: true

workflows:
  - name: Checkout
    steps:
      - name: ValidateCart
        type: validation
      - name: ProcessPayment
        type: payment
      - name: CreateOrder
        type: persistence

compliance:
  frameworks:
    - gdpr
    - pci-dss
  level: strict`,
        type: 'spec'
      },
      {
        id: '2',
        name: 'main.ts',
        path: '/src/main.ts',
        language: 'typescript',
        content: `import { PAAMRuntime } from '@paam/runtime';
import { eCommerceSpec } from './spec/app.paam';

const runtime = new PAAMRuntime(eCommerceSpec);

async function main() {
  try {
    await runtime.initialize();
    console.log('PAAM Application started successfully');
    
    // Start the application
    await runtime.start();
  } catch (error) {
    console.error('Failed to start PAAM application:', error);
  }
}

main();`,
        type: 'source'
      },
      {
        id: '3',
        name: 'config.json',
        path: '/config.json',
        language: 'json',
        content: `{
  "app": {
    "name": "E-commerce Platform",
    "version": "1.0.0"
  },
  "database": {
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "name": "ecommerce"
  },
  "server": {
    "port": 3000,
    "host": "0.0.0.0"
  },
  "compliance": {
    "enabled": true,
    "frameworks": ["gdpr", "pci-dss"]
  }
}`,
        type: 'config'
      }
    ];

    // Mock jobs data
    const mockJobs: Job[] = [
      {
        id: '1',
        type: 'compile',
        status: 'completed',
        progress: 100,
        startTime: new Date('2024-01-15T10:30:00'),
        endTime: new Date('2024-01-15T10:32:00'),
        output: 'Compilation completed successfully for all 8 platforms'
      },
      {
        id: '2',
        type: 'test',
        status: 'running',
        progress: 65,
        startTime: new Date('2024-01-15T10:35:00'),
        output: 'Running tests... 65% complete'
      }
    ];

    // Mock activities data
    const mockActivities: ActivityItem[] = [
      {
        id: '1',
        type: 'success',
        title: 'Compilation Complete',
        description: 'Successfully compiled to 8 platforms',
        timestamp: new Date('2024-01-15T10:32:00')
      },
      {
        id: '2',
        type: 'info',
        title: 'Tests Running',
        description: 'Running automated test suite',
        timestamp: new Date('2024-01-15T10:35:00')
      },
      {
        id: '3',
        type: 'warning',
        title: 'Compliance Check',
        description: 'GDPR compliance score: 92%',
        timestamp: new Date('2024-01-15T10:28:00')
      }
    ];

    setFiles(mockFiles);
    setActiveFile(mockFiles[0]);
    setJobs(mockJobs);
    setActivities(mockActivities);
  };

  const handleCompile = async () => {
    setIsCompiling(true);
    
    // Simulate compilation process
    const newJob: Job = {
      id: `job_${Date.now()}`,
      type: 'compile',
      status: 'running',
      progress: 0,
      startTime: new Date()
    };

    setJobs(prev => [newJob, ...prev]);

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setJobs(prev => 
        prev.map(job => 
          job.id === newJob.id 
            ? { ...job, progress }
            : job
        )
      );
    }

    // Mark as completed
    setJobs(prev => 
      prev.map(job => 
        job.id === newJob.id 
          ? { 
              ...job, 
              status: 'completed',
              progress: 100,
              endTime: new Date(),
              output: 'Compilation completed successfully for all 8 platforms'
            }
          : job
      )
    );

    setIsCompiling(false);
  };

  const handleRun = async () => {
    setIsRunning(true);
    
    // Simulate running the application
    const newJob: Job = {
      id: `job_${Date.now()}`,
      type: 'deploy',
      status: 'running',
      progress: 0,
      startTime: new Date()
    };

    setJobs(prev => [newJob, ...prev]);

    // Simulate progress
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise(resolve => setTimeout(resolve, 300));
      setJobs(prev => 
        prev.map(job => 
          job.id === newJob.id 
            ? { ...job, progress }
            : job
        )
      );
    }

    // Mark as completed
    setJobs(prev => 
      prev.map(job => 
        job.id === newJob.id 
          ? { 
              ...job, 
              status: 'completed',
              progress: 100,
              endTime: new Date(),
              output: 'Application deployed successfully and is running'
            }
          : job
      )
    );

    setIsRunning(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    // Add stop logic here
  };

  const handleFileChange = (fileId: string, content: string) => {
    setFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, content }
          : file
      )
    );
  };

  const handleFileSave = (fileId: string) => {
    // Add file save logic here
    console.log('Saving file:', fileId);
  };

  const handleFileRun = (fileId: string) => {
    // Add file run logic here
    console.log('Running file:', fileId);
  };

  const getJobIcon = (type: string) => {
    switch (type) {
      case 'compile':
        return <Code className="w-4 h-4" />;
      case 'test':
        return <Bug className="w-4 h-4" />;
      case 'deploy':
        return <Play className="w-4 h-4" />;
      case 'validate':
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'running':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-blue-500" />;
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

  const tabs: WorkspaceTab[] = [
    {
      id: 'editor',
      name: 'Editor',
      icon: <Code className="w-4 h-4" />,
      content: (
        <MonacoEditorComponent
          file={activeFile}
          onFileChange={handleFileChange}
          onSave={handleFileSave}
          onRun={handleFileRun}
          theme="vs-dark"
          readOnly={false}
        />
      )
    },
    {
      id: 'spec',
      name: 'Spec Designer',
      icon: <GitBranch className="w-4 h-4" />,
      content: (
        <SpecDesigner
          onSave={() => console.log('Saving spec')}
          onRun={() => console.log('Running spec')}
        />
      )
    },
    {
      id: 'preview',
      name: 'Preview',
      icon: <Globe className="w-4 h-4" />,
      content: (
        <MultiPlatformPreview
          projectId={projectId}
          onRefresh={() => console.log('Refreshing preview')}
          onOpenInNewTab={(platform) => console.log('Opening in new tab:', platform)}
        />
      )
    },
    {
      id: 'debug',
      name: 'Debug',
      icon: <Bug className="w-4 h-4" />,
      content: (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">Intent Preservation Workbench</h3>
              <Badge variant="outline" className="text-xs">
                Analysis
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-1" />
                Analyze
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              {/* Requirement Tracing */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Requirement Tracing
                    <Badge variant="outline" className="text-xs">
                      {Math.floor(Math.random() * 20 + 80)}% Complete
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">User Authentication</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Implemented</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Payment Processing</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Implemented</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Order Management</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Partial</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Inventory System</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Planned</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Reporting</span>
                      </div>
                      <Badge variant="outline" className="text-xs">Planned</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Analysis */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-sm font-medium">User Entity Changes</div>
                      <div className="text-xs text-gray-600">Affects: Authentication, Orders, Profile</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">High Impact</Badge>
                        <Badge variant="outline" className="text-xs">3 Modules</Badge>
                      </div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-sm font-medium">Payment Gateway Update</div>
                      <div className="text-xs text-gray-600">Affects: Checkout, Orders, Refunds</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">Medium Impact</Badge>
                        <Badge variant="outline" className="text-xs">2 Modules</Badge>
                      </div>
                    </div>
                    <div className="p-2 bg-yellow-50 rounded">
                      <div className="text-sm font-medium">API Endpoint Changes</div>
                      <div className="text-xs text-gray-600">Affects: Frontend integration</div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">Low Impact</Badge>
                        <Badge variant="outline" className="text-xs">1 Module</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Intent Validation */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Intent Validation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">Overall Intent Score</span>
                        <span className="text-sm font-bold text-green-600">94%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Business Logic</span>
                        <span className="text-green-600">98%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>User Experience</span>
                        <span className="text-green-600">92%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Performance</span>
                        <span className="text-yellow-600">87%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Security</span>
                        <span className="text-green-600">96%</span>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-green-50 rounded">
                      <div className="text-xs font-medium text-green-800">Intent Preserved</div>
                      <div className="text-xs text-green-600">All core requirements met</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dependency Graph */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Dependency Graph</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                    <div className="text-center">
                      <GitBranch className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Interactive dependency visualization</p>
                      <p className="text-xs text-gray-400">Shows relationships between components</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Code Quality Metrics */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Code Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">Maintainability</span>
                        <span className="text-sm font-bold text-green-600">A</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">Reliability</span>
                        <span className="text-sm font-bold text-green-600">A</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs">Security</span>
                        <span className="text-sm font-bold text-yellow-600">B</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Coverage</span>
                        <span>84%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Technical Debt</span>
                        <span>2.5%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Duplication</span>
                        <span>1.2%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Real-time Monitoring */}
              <Card className="lg:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Real-time Monitoring</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-lg font-bold text-green-600">0</div>
                      <div className="text-xs text-green-600">Critical Issues</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-lg font-bold text-yellow-600">3</div>
                      <div className="text-xs text-yellow-600">Warnings</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-lg font-bold text-blue-600">12</div>
                      <div className="text-xs text-blue-600">Active Sessions</div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-xs text-gray-500 mb-2">Recent Activity</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>User authentication flow updated</span>
                        <span className="text-gray-400">2m ago</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Payment processing optimized</span>
                        <span className="text-gray-400">5m ago</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>New test cases added</span>
                        <span className="text-gray-400">8m ago</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'compliance',
      name: 'Compliance',
      icon: <Shield className="w-4 h-4" />,
      content: (
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">Compliance Visualization</h3>
              <Badge variant="outline" className="text-xs">
                GDPR, PCI-DSS, SOC2, HIPAA
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-1" />
                Generate Report
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Configure
              </Button>
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
              {/* Overall Compliance Score */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Overall Compliance Score
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Excellent
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600">92%</div>
                      <div className="text-xs text-gray-500">Overall Score</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">GDPR</span>
                          <span className="text-xs font-medium">95%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">PCI-DSS</span>
                          <span className="text-xs font-medium">89%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">SOC2</span>
                          <span className="text-xs font-medium">94%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">HIPAA</span>
                          <span className="text-xs font-medium">88%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Status by Category */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Status by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="text-sm font-medium">Data Protection</div>
                          <div className="text-xs text-gray-600">12/12 requirements met</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">100%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <div>
                          <div className="text-sm font-medium">Access Control</div>
                          <div className="text-xs text-gray-600">8/8 requirements met</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">100%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <div>
                          <div className="text-sm font-medium">Audit Trail</div>
                          <div className="text-xs text-gray-600">5/6 requirements met</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">83%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <div>
                          <div className="text-sm font-medium">Encryption</div>
                          <div className="text-xs text-gray-600">4/5 requirements met</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">80%</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-500" />
                        <div>
                          <div className="text-sm font-medium">Data Retention</div>
                          <div className="text-xs text-gray-600">2/4 requirements met</div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">50%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Violations */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Recent Violations
                    <Badge variant="outline" className="text-xs">3 Active</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="p-2 bg-red-50 rounded border-l-4 border-red-400">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-red-800">Payment Data Storage</div>
                        <Badge variant="outline" className="text-xs">High</Badge>
                      </div>
                      <div className="text-xs text-red-600">PCI-DSS 3.2.1 - Unencrypted cardholder data</div>
                      <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
                    </div>
                    
                    <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-yellow-800">Consent Records</div>
                        <Badge variant="outline" className="text-xs">Medium</Badge>
                      </div>
                      <div className="text-xs text-yellow-600">GDPR Article 7 - Missing consent documentation</div>
                      <div className="text-xs text-gray-500 mt-1">5 hours ago</div>
                    </div>
                    
                    <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-yellow-800">Log Retention</div>
                        <Badge variant="outline" className="text-xs">Medium</Badge>
                      </div>
                      <div className="text-xs text-yellow-600">SOC2 CC6.1 - Insufficient log retention period</div>
                      <div className="text-xs text-gray-500 mt-1">1 day ago</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance Timeline */}
              <Card className="lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Compliance Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-50 rounded flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Compliance score over time</p>
                      <p className="text-xs text-gray-400">Interactive timeline visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">Medium</div>
                      <div className="text-xs text-gray-500">Overall Risk Level</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Financial Risk</span>
                        <Badge variant="outline" className="text-xs">Low</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Operational Risk</span>
                        <Badge variant="outline" className="text-xs">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Reputational Risk</span>
                        <Badge variant="outline" className="text-xs">Low</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span>Legal Risk</span>
                        <Badge variant="outline" className="text-xs">Medium</Badge>
                      </div>
                    </div>
                    
                    <div className="p-2 bg-blue-50 rounded">
                      <div className="text-xs font-medium text-blue-800">Next Audit</div>
                      <div className="text-xs text-blue-600">March 15, 2024</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Items */}
              <Card className="lg:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Action Items
                    <Badge variant="outline" className="text-xs">5 Pending</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="p-3 bg-red-50 rounded border border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-red-800">Encrypt Payment Data</div>
                        <Badge variant="outline" className="text-xs">Critical</Badge>
                      </div>
                      <div className="text-xs text-red-600 mb-2">Implement encryption for cardholder data</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Due: Jan 20</span>
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                          Start
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-yellow-800">Update Consent Forms</div>
                        <Badge variant="outline" className="text-xs">High</Badge>
                      </div>
                      <div className="text-xs text-yellow-600 mb-2">Add GDPR-compliant consent documentation</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Due: Jan 25</span>
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                          Start
                        </Button>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-sm font-medium text-yellow-800">Extend Log Retention</div>
                        <Badge variant="outline" className="text-xs">Medium</Badge>
                      </div>
                      <div className="text-xs text-yellow-600 mb-2">Configure 12-month log retention policy</div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Due: Feb 1</span>
                        <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                          Start
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: <Terminal className="w-4 h-4" />,
      content: (
        <TerminalComponent
          projectId={projectId}
          onCommandExecute={(command) => console.log('Command executed:', command)}
          onTerminalOutput={(output) => console.log('Terminal output:', output)}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/studio')}
                >
                  ← Studio
                </Button>
                <div className="w-px h-6 bg-gray-300"></div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    E-commerce Platform
                  </h1>
                  <p className="text-xs text-gray-500">Project ID: {projectId}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCompile}
                  disabled={isCompiling}
                >
                  {isCompiling ? (
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <Code className="w-4 h-4 mr-1" />
                  )}
                  Compile
                </Button>
                {isRunning ? (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={handleStop}
                  >
                    <Square className="w-4 h-4 mr-1" />
                    Stop
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={handleRun}
                    disabled={isRunning}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Run
                  </Button>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Users className="w-4 h-4" />
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

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Sidebar - File Explorer */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Files</h3>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    activeFile?.id === file.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                  }`}
                  onClick={() => setActiveFile(file)}
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{file.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Jobs Queue */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Jobs</h3>
              <Badge variant="outline" className="text-xs">
                {jobs.filter(j => j.status === 'running').length} running
              </Badge>
            </div>
            
            <div className="space-y-2">
              {jobs.slice(0, 3).map((job) => (
                <div key={job.id} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      {getJobIcon(job.type)}
                      <span className="text-xs font-medium">{job.type}</span>
                    </div>
                    <Badge className={`text-xs ${getJobStatusColor(job.status)}`}>
                      {job.status}
                    </Badge>
                  </div>
                  {job.status === 'running' && (
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                      <div 
                        className="bg-blue-500 h-1 rounded-full" 
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">Activity</h3>
            </div>
            
            <div className="space-y-2">
              {activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-start space-x-2">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {activity.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6 h-10">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex items-center space-x-2 text-xs"
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-hidden">
            {tabs.find(tab => tab.id === activeTab)?.content}
          </div>
        </div>
      </div>
    </div>
  );
}