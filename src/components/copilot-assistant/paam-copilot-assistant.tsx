/**
 * PAAM-Integrated Copilot Assistant
 * Professional AI assistant with PAAM requirements specification and deployment pipeline tracking
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { 
  Send, 
  Bot, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock,
  Zap,
  Code,
  Database,
  Layers,
  Brain,
  Sparkles,
  AlertCircle,
  ThumbsUp,
  RefreshCw,
  StopCircle,
  FileText,
  Link,
  Terminal,
  Filter,
  Search,
  Plus,
  Settings,
  History,
  FolderOpen,
  CheckSquare,
  AlertTriangle,
  Copy,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Minus,
  Maximize2,
  GitBranch,
  Rocket,
  Shield,
  Target,
  Workflow,
  Database as DatabaseIcon,
  Server,
  Cloud,
  Eye,
  Edit,
  Trash2,
  Archive
} from 'lucide-react';
import { Virtuoso } from 'react-virtuoso';
import { formatTime } from '@/lib/utils';
import { PAAM, Entity, Flow, PAAMMetadata } from '@/types/paam/schema';
import { projectStorage } from '@/lib/project-storage';
import CodeEditor from '@/components/code-editor';

interface ChatMessage {
  id: string;
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'error';
  metadata?: {
    type?: 'generation_start' | 'generation_progress' | 'generation_complete' | 'generation_error' | 'chat_response' | 'error' | 'paam_spec' | 'deployment_status';
    stage?: string;
    progress?: number;
    artifacts?: any[];
    errors?: string[];
    confidence?: number;
    outputs?: OutputItem[];
    run?: CommandItem[];
    next?: NextAction[];
    outputs_count?: number;
    files_count?: number;
    checks_count?: number;
    paamData?: PAAM;
    deploymentStatus?: DeploymentStatus;
    requirementsTrace?: RequirementsTrace[];
  };
}

interface OutputItem {
  type: 'file' | 'endpoint' | 'check' | 'link' | 'entity' | 'flow' | 'requirement';
  name: string;
  size?: string;
  method?: string;
  path?: string;
  status?: 'pass' | 'warn' | 'fail' | 'draft' | 'approved' | 'implemented';
  url?: string;
  hash?: string;
  description?: string;
  entityId?: string;
  flowId?: string;
}

interface CommandItem {
  command: string;
  description?: string;
  copyable?: boolean;
  runnable?: boolean;
}

interface NextAction {
  label: string;
  action: string;
  primary?: boolean;
}

interface Artifact {
  id: string;
  name: string;
  type: 'file' | 'endpoint' | 'check' | 'link' | 'entity' | 'flow' | 'requirement' | 'deployment';
  size?: string;
  status?: 'pass' | 'warn' | 'fail' | 'draft' | 'approved' | 'implemented' | 'deployed';
  path?: string;
  url?: string;
  timestamp: Date;
  messageId: string;
  entityId?: string;
  flowId?: string;
}

interface CodeFile {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  type: 'component' | 'page' | 'api' | 'model' | 'config' | 'util';
  size: number;
  lastModified: Date;
}

interface DeploymentStatus {
  stage: 'planning' | 'development' | 'testing' | 'staging' | 'production' | 'rolled_back';
  progress: number;
  environment: string;
  lastDeployed?: Date;
  commitHash?: string;
  pipelineStatus: 'pending' | 'running' | 'success' | 'failed';
}

interface RequirementsTrace {
  id: string;
  requirement: string;
  status: 'draft' | 'approved' | 'implemented' | 'tested' | 'deployed';
  entity?: string;
  flow?: string;
  testCases?: string[];
  deploymentStage?: string;
}

interface PAAMProject {
  id: string;
  name: string;
  description: string;
  paam: PAAM;
  status: 'draft' | 'in_development' | 'testing' | 'deployed' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  deploymentHistory: DeploymentStatus[];
}

export default function PAAMCopilotAssistant() {
  console.log('PAAMCopilotAssistant component mounted');
  
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "🚀 **Welcome to PAAM Copilot - Machine-Executable Specification Compilation Platform**\n\nI'm your AI-powered development assistant that transforms natural language descriptions into **machine-executable specifications** that can be compiled to multiple platforms while preserving business intent.\n\n**🎯 PAAM Differentiators:**\n\n**🔧 Machine-Executable Specifications**\n- Transform natural language → structured PAAM specifications\n- Generate complete, executable specifications from your ideas\n- Ensure 100% business intent preservation through compilation\n\n**🌐 True Framework Agnosticism**\n- Compile single specification to React, Vue, Angular, iOS, Android, Node.js, Python, Java\n- Maintain consistent business logic across all platforms\n- Apply platform-specific optimizations automatically\n\n**🛡️ Intent Preservation Algorithms**\n- Zero requirement drift from concept to code\n- Multi-phase validation ensures semantic integrity\n- Complete traceability from source to implementation\n\n**⚡ Performance Advantages**\n- **67% faster development** vs traditional methods\n- **85% improved code quality** through quality-by-construction\n- **50% smaller teams** with maintained productivity\n- **75% reduced maintenance** costs\n\n**🚀 Getting Started:**\n1. **Describe your app idea** in natural language (e.g., \"I want to build a todo app\")\n2. **Watch PAAM analyze** your requirements and generate specifications\n3. **View compiled code** for multiple platforms in the **Code** tab\n4. **Manage all projects** in **Project History** (app switcher above)\n\n**💡 Pro Tip:** Switch between **Layman** and **Developer** modes to customize technical detail level.\n\n**🔬 Try asking about:**\n- \"Generate a React app for inventory management\"\n- \"Create a mobile app for expense tracking\"\n- \"Build a backend API for user authentication\"\n- \"Compile to multiple platforms from one specification\"\n\nWhat would you like to build today?",
      timestamp: new Date(),
      status: 'delivered',
      metadata: {
        type: 'chat_response',
        confidence: 0.95
      }
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [activeTab, setActiveTab] = useState('artifacts');
  const [filter, setFilter] = useState<'all' | 'pass' | 'warn' | 'fail' | 'draft' | 'approved' | 'implemented'>('all');
  const [currentProject, setCurrentProject] = useState<PAAMProject | null>(null);
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [showArtifactDetails, setShowArtifactDetails] = useState(false);
  const [userMode, setUserMode] = useState<'layman' | 'developer'>('layman');
  const [codeFiles, setCodeFiles] = useState<CodeFile[]>([]);
  const [selectedCodeFile, setSelectedCodeFile] = useState<CodeFile | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize with empty project
  useEffect(() => {
    setCurrentProject(null);
  }, []);

  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const generateSampleCodeFiles = (projectName: string) => {
    const sampleFiles: CodeFile[] = [
      {
        id: '1',
        name: 'page.tsx',
        path: `src/app/${projectName.toLowerCase().replace(/\s+/g, '-')}/page.tsx`,
        language: 'typescript',
        content: `import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ${projectName.replace(/\s+/g, '')}Page() {
  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">${projectName}</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to your new application
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Start building your application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Get Started
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>
              Learn how to use this platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Docs
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>
              Get help when you need it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}`,
        type: 'page',
        size: 1024,
        lastModified: new Date()
      },
      {
        id: '2',
        name: 'layout.tsx',
        path: `src/app/${projectName.toLowerCase().replace(/\s+/g, '-')}/layout.tsx`,
        language: 'typescript',
        content: `import React from 'react';

export default function ${projectName.replace(/\s+/g, '')}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main>{children}</main>
    </div>
  );
}`,
        type: 'component',
        size: 256,
        lastModified: new Date()
      },
      {
        id: '3',
        name: 'schema.prisma',
        path: 'prisma/schema.prisma',
        language: 'prisma',
        content: `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  status      String   @default("active")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("projects")
}`,
        type: 'model',
        size: 512,
        lastModified: new Date()
      },
      {
        id: '4',
        name: 'route.ts',
        path: `src/app/api/${projectName.toLowerCase().replace(/\s+/g, '-')}/route.ts`,
        language: 'typescript',
        content: `import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const offset = (page - 1) * limit;
    
    // Get data from database
    const data = await db.project.findMany({
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
    
    const total = await db.project.count();
    
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, description } = body;
    
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Create new record
    const newProject = await db.project.create({
      data: {
        name,
        description: description || null,
        status: 'active'
      }
    });
    
    return NextResponse.json({
      success: true,
      data: newProject
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}`,
        type: 'api',
        size: 1536,
        lastModified: new Date()
      }
    ];
    
    setCodeFiles(sampleFiles);
    if (sampleFiles.length > 0) {
      setSelectedCodeFile(sampleFiles[0]);
    }
  };

  const handleQuickAction = async (action: string) => {
    if (!currentProject) return;

    try {
      const response = await fetch('/api/paam/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: action,
          data: {},
          projectId: currentProject.id
        })
      });

      const data = await response.json();
      if (data.success) {
        // Update current project with the result
        if (action === 'add_requirement' || action === 'add_entity' || action === 'add_flow') {
          setCurrentProject(prev => {
            if (!prev) return prev;
            
            if (action === 'add_requirement' && data.result.requirement) {
              if (!prev.paam.metadata.requirements) {
                prev.paam.metadata.requirements = [];
              }
              prev.paam.metadata.requirements.push(data.result.requirement);
            } else if (action === 'add_entity' && data.result.entity) {
              prev.paam.entities.push(data.result.entity);
            } else if (action === 'add_flow' && data.result.flow) {
              prev.paam.flows.push(data.result.flow);
            }
            
            prev.paam.metadata.modified = new Date().toISOString();
            return { ...prev };
          });
        }

        // Add success message to chat
        const successMessage: ChatMessage = {
          id: `quick_action_${Date.now()}`,
          role: 'assistant',
          content: `✅ ${data.result.message}`,
          timestamp: new Date(),
          status: 'delivered',
          metadata: {
            type: 'chat_response',
            confidence: 0.95
          }
        };

        setMessages(prev => [...prev, successMessage]);

        // If it's a deployment, add a deployment status message
        if (action === 'deploy' && data.result.deployment) {
          setTimeout(() => {
            const deploymentMessage: ChatMessage = {
              id: `deployment_${Date.now()}`,
              role: 'assistant',
              content: `🚀 **Deployment Started**\n\nDeployment initiated for "${currentProject.name}". You can monitor the progress in the Deployment Pipeline tab.`,
              timestamp: new Date(),
              status: 'delivered',
              metadata: {
                type: 'deployment_status',
                deploymentStatus: {
                  stage: data.result.deployment.stage,
                  progress: data.result.deployment.progress,
                  environment: data.result.deployment.environment,
                  pipelineStatus: data.result.deployment.status as any
                }
              }
            };

            setMessages(prev => [...prev, deploymentMessage]);
          }, 1000);
        }
      } else {
        throw new Error(data.error || 'Operation failed');
      }
    } catch (error) {
      console.error('Quick action error:', error);
      
      const errorMessage: ChatMessage = {
        id: `quick_action_error_${Date.now()}`,
        role: 'assistant',
        content: `❌ Failed to execute ${action}. Please try again.`,
        timestamp: new Date(),
        status: 'error',
        metadata: {
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleViewArtifact = (artifact: Artifact) => {
    setSelectedArtifact(artifact);
    setShowArtifactDetails(true);
  };

  const handleCloseArtifactDetails = () => {
    setShowArtifactDetails(false);
    setSelectedArtifact(null);
  };

  const handleCopyArtifact = (artifact: Artifact) => {
    const artifactText = `Artifact: ${artifact.name}
Type: ${artifact.type}
Status: ${artifact.status}
Description: ${artifact.description || 'N/A'}
Created: ${formatTime(artifact.timestamp)}`;

    navigator.clipboard.writeText(artifactText).then(() => {
      // Show success message
      const successMessage: ChatMessage = {
        id: `copy_${Date.now()}`,
        role: 'assistant',
        content: `✅ Copied "${artifact.name}" details to clipboard`,
        timestamp: new Date(),
        status: 'delivered',
        metadata: {
          type: 'chat_response',
          confidence: 0.95
        }
      };

      setMessages(prev => [...prev, successMessage]);
    }).catch(() => {
      // Show error message
      const errorMessage: ChatMessage = {
        id: `copy_error_${Date.now()}`,
        role: 'assistant',
        content: `❌ Failed to copy "${artifact.name}" details`,
        timestamp: new Date(),
        status: 'error',
        metadata: {
          type: 'error',
          error: 'Clipboard access denied'
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    });
  };

  const handleDownloadArtifact = (artifact: Artifact) => {
    // Create a simple JSON representation of the artifact
    const artifactData = {
      name: artifact.name,
      type: artifact.type,
      status: artifact.status,
      description: artifact.description,
      timestamp: artifact.timestamp.toISOString(),
      messageId: artifact.messageId
    };

    const blob = new Blob([JSON.stringify(artifactData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${artifact.name.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    const successMessage: ChatMessage = {
      id: `download_${Date.now()}`,
      role: 'assistant',
      content: `✅ Downloaded "${artifact.name}" as JSON file`,
      timestamp: new Date(),
      status: 'delivered',
      metadata: {
        type: 'chat_response',
        confidence: 0.95
      }
    };

    setMessages(prev => [...prev, successMessage]);
  };

  const handleArchiveProject = () => {
    if (!currentProject) return;

    const archived = projectStorage.archiveProject(currentProject.id);
    if (archived) {
      setCurrentProject(null);
      setArtifacts([]);
      
      const successMessage: ChatMessage = {
        id: `archive_${Date.now()}`,
        role: 'assistant',
        content: `📦 Project "${currentProject.name}" has been archived successfully.`,
        timestamp: new Date(),
        status: 'delivered',
        metadata: {
          type: 'chat_response',
          confidence: 0.95
        }
      };

      setMessages(prev => [...prev, successMessage]);
    } else {
      const errorMessage: ChatMessage = {
        id: `archive_error_${Date.now()}`,
        role: 'assistant',
        content: `❌ Failed to archive project "${currentProject.name}".`,
        timestamp: new Date(),
        status: 'error',
        metadata: {
          type: 'error',
          error: 'Archive operation failed'
        }
      };

      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    setError(null);

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsProcessing(true);
    setIsStreaming(true);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id 
            ? { ...msg, status: 'sent' }
            : msg
        )
      );
    }, 500);

    try {
      abortControllerRef.current = new AbortController();

      // If no project exists, create one from the user's idea
      if (!currentProject) {
        await createProjectFromIdea(inputMessage);
      } else {
        // Handle general chat for existing projects
        await handleGeneralRequest(inputMessage);
      }

    } catch (error: any) {
      console.error('Error processing message:', error);
      
      let errorMessage = 'I encountered an error while processing your request.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request was cancelled.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error occurred. Please check your connection and try again.';
      } else if (error.message.includes('HTTP error')) {
        errorMessage = 'Server error occurred. Please try again later.';
      }
      
      setError(errorMessage);
      
      const errorChatMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: `❌ ${errorMessage}`,
        timestamp: new Date(),
        status: 'error',
        metadata: {
          type: 'generation_error',
          error: error.message
        }
      };

      setMessages(prev => [...prev, errorChatMessage]);
    } finally {
      setIsProcessing(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const createProjectFromIdea = async (idea: string) => {
    try {
      // Add initial thinking message
      const thinkingMessage: ChatMessage = {
        id: `thinking_${Date.now()}`,
        role: 'assistant',
        content: `🤔 **Analyzing Your Idea**\n\nI'm analyzing "${idea}" to understand the requirements and determine the best approach...`,
        timestamp: new Date(),
        status: 'delivered',
        metadata: {
          type: 'generation_start',
          confidence: 0.95
        }
      };

      setMessages(prev => [...prev, thinkingMessage]);

      // Simulate thinking process with progress updates
      setTimeout(() => {
        const analysisMessage: ChatMessage = {
          id: `analysis_${Date.now()}`,
          role: 'assistant',
          content: `🔍 **Requirements Analysis**\n\nI'm identifying the key features, technical requirements, and architecture patterns needed for your application...`,
          timestamp: new Date(),
          status: 'delivered',
          metadata: {
            type: 'generation_progress',
            stage: 'analysis',
            progress: 25
          }
        };
        setMessages(prev => [...prev, analysisMessage]);
      }, 1500);

      setTimeout(() => {
        const designMessage: ChatMessage = {
          id: `design_${Date.now()}`,
          role: 'assistant',
          content: `🏗️ **Architecture Design**\n\nCreating the data models, user flows, and system architecture based on your requirements...`,
          timestamp: new Date(),
          status: 'delivered',
          metadata: {
            type: 'generation_progress',
            stage: 'design',
            progress: 50
          }
        };
        setMessages(prev => [...prev, designMessage]);
      }, 3000);

      setTimeout(() => {
        const specMessage: ChatMessage = {
          id: `spec_${Date.now()}`,
          role: 'assistant',
          content: `📋 **Specification Generation**\n\nGenerating detailed specifications, entities, flows, and technical requirements...`,
          timestamp: new Date(),
          status: 'delivered',
          metadata: {
            type: 'generation_progress',
            stage: 'specification',
            progress: 75
          }
        };
        setMessages(prev => [...prev, specMessage]);
      }, 4500);

      const response = await fetch('/api/paam/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: idea,
          options: {
            framework: 'nextjs',
            styling: 'tailwind',
            database: 'sqlite',
            auth: 'nextauth',
            deployment: 'vercel'
          }
        }),
        signal: abortControllerRef.current?.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Create new project from generated PAAM
        const newProject: PAAMProject = {
          id: `project_${Date.now()}`,
          name: data.paam.metadata.name,
          description: data.paam.metadata.description,
          status: 'in_development',
          createdAt: new Date(),
          updatedAt: new Date(),
          paam: data.paam,
          deploymentHistory: [
            {
              stage: 'planning',
              progress: 100,
              environment: 'local',
              pipelineStatus: 'success'
            }
          ]
        };

        setCurrentProject(newProject);

        // Generate sample code files for the project
        generateSampleCodeFiles(data.paam.metadata.name);
        
        // Switch to code tab to show the generated files
        setActiveTab('code');

        // Save project to storage
        projectStorage.saveProject(newProject);

        // Add completion message with detailed analysis
        setTimeout(() => {
          const completionMessage: ChatMessage = {
            id: `project_created_${Date.now()}`,
            role: 'assistant',
            content: `🎉 **Project Created Successfully!**\n\nI've analyzed your idea and created a comprehensive PAAM specification for **${data.paam.metadata.name}**.\n\n**📊 Analysis Results:**\n- **Type:** ${data.analysis.category}\n- **Complexity:** ${data.analysis.complexity}\n- **Risk Level:** ${data.analysis.riskLevel}\n- **Estimated Development Time:** ${data.analysis.estimatedDevelopmentTime}\n- **Team Size:** ${data.analysis.teamSize} developers\n- **Budget Range:** ${data.analysis.budgetRange}\n\n**🏗️ Architecture Overview:**\n- **Entities:** ${data.analysis.estimatedEntities} (${data.paam.entities.map(e => e.name).join(', ')})\n- **Flows:** ${data.analysis.estimatedFlows} (${data.paam.flows.map(f => f.name).join(', ')})\n- **Authentication:** ${data.paam.auth.enabled ? 'Enabled' : 'Disabled'}\n- **Database:** ${data.paam.data.database.type}\n- **UI Framework:** Next.js with Tailwind CSS\n\n**📋 Functional Requirements:**\n${data.analysis.functionalRequirements.slice(0, 5).map(req => `• ${req}`).join('\n')}${data.analysis.functionalRequirements.length > 5 ? `\n• ... and ${data.analysis.functionalRequirements.length - 5} more` : ''}\n\n**⚙️ Non-Functional Requirements:**\n${data.analysis.nonFunctionalRequirements.slice(0, 3).map(req => `• ${req}`).join('\n')}${data.analysis.nonFunctionalRequirements.length > 3 ? `\n• ... and ${data.analysis.nonFunctionalRequirements.length - 3} more` : ''}\n\n**🔧 Technical Stack:**\n${data.analysis.suggestedTechnologies.slice(0, 5).map(tech => `• ${tech}`).join('\n')}\n\n**🚀 Next Steps:**\n1. Review the detailed specifications in the right panel\n2. Use quick actions to add more requirements\n3. Refine entities and flows as needed\n4. Start deployment when ready\n\nYour comprehensive project specification is now ready for development!`,
            timestamp: new Date(),
            status: 'delivered',
            metadata: {
              type: 'paam_spec',
              paamData: data.paam,
              analysis: data.analysis,
              outputs: [
                {
                  type: 'requirement',
                  name: 'Project Specification',
                  description: 'Complete PAAM specification with detailed requirements analysis',
                  status: 'approved'
                },
                ...data.paam.entities.map((entity: any) => ({
                  type: 'entity' as const,
                  name: entity.name,
                  description: entity.description,
                  status: 'draft' as const
                })),
                ...data.paam.flows.map((flow: any) => ({
                  type: 'flow' as const,
                  name: flow.name,
                  description: flow.description,
                  status: 'draft' as const
                }))
              ]
            }
          };

          setMessages(prev => [...prev, completionMessage]);

          // Add artifacts
          const newArtifacts: Artifact[] = completionMessage.metadata.outputs?.map((output, index) => ({
            id: `${completionMessage.id}_${index}`,
            name: output.name,
            type: output.type,
            status: output.status,
            description: output.description,
            timestamp: new Date(),
            messageId: completionMessage.id
          })) || [];

          setArtifacts(prev => [...prev, ...newArtifacts]);

        }, 6000);

      } else {
        throw new Error(data.error || 'Failed to generate PAAM specification');
      }
    } catch (error) {
      throw error;
    }
  };

  const handlePAAMRequest = async (message: string) => {
    // Simulate PAAM processing
    const paamResponse: ChatMessage = {
      id: `paam_${Date.now()}`,
      role: 'assistant',
      content: `📋 **PAAM Requirements Analysis**\n\nI'll help you define the requirements and specifications for your application.`,
      timestamp: new Date(),
      status: 'delivered',
      metadata: {
        type: 'paam_spec',
        outputs: [
          {
            type: 'requirement',
            name: 'User Management',
            description: 'User authentication and profile management',
            status: 'draft'
          },
          {
            type: 'entity',
            name: 'User',
            description: 'User account entity',
            status: 'draft'
          },
          {
            type: 'flow',
            name: 'User Registration',
            description: 'User registration flow',
            status: 'draft'
          }
        ] as OutputItem[],
        requirementsTrace: [
          {
            id: 'req_1',
            requirement: 'User authentication system',
            status: 'draft',
            entity: 'User',
            flow: 'User Registration'
          }
        ]
      }
    };

    setMessages(prev => [...prev, paamResponse]);

    // Update artifacts
    const newArtifacts: Artifact[] = paamResponse.metadata.outputs?.map((output, index) => ({
      id: `${paamResponse.id}_${index}`,
      name: output.name,
      type: output.type,
      status: output.status,
      description: output.description,
      timestamp: new Date(),
      messageId: paamResponse.id
    })) || [];

    setArtifacts(prev => [...prev, ...newArtifacts]);

    // Simulate deployment pipeline update
    setTimeout(() => {
      const deploymentMessage: ChatMessage = {
        id: `deployment_${Date.now()}`,
        role: 'assistant',
        content: `🚀 **Deployment Pipeline Updated**\n\nRequirements specification stage completed. Ready for development.`,
        timestamp: new Date(),
        status: 'delivered',
        metadata: {
          type: 'deployment_status',
          deploymentStatus: {
            stage: 'development',
            progress: 25,
            environment: 'development',
            pipelineStatus: 'running'
          }
        }
      };

      setMessages(prev => [...prev, deploymentMessage]);
    }, 2000);
  };

  const handleGeneralRequest = async (message: string) => {
    try {
      const response = await fetch('/api/orchestrator-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          naturalLanguage: message,
          options: {
            framework: 'nextjs',
            styling: 'tailwind',
            database: 'sqlite',
            auth: 'nextauth',
            deployment: 'vercel'
          }
        }),
        signal: abortControllerRef.current?.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let buffer = '';
        let messageCount = 0;
        const maxMessages = 50;
        
        try {
          while (messageCount < maxMessages) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  handleGenerationProgress(data);
                  messageCount++;
                } catch (e) {
                  console.warn('Failed to parse SSE data:', e);
                }
              }
            }
          }
        } catch (error) {
          if (error.name === 'AbortError') {
            console.log('Request was aborted');
          } else {
            throw error;
          }
        }
      }

    } catch (error: any) {
      throw error;
    }
  };

  const handleGenerationProgress = (data: any) => {
    if (!data || !data.message) return;

    const progressMessage: ChatMessage = {
      id: `progress_${Date.now()}`,
      role: 'assistant',
      content: data.message,
      timestamp: new Date(),
      metadata: {
        type: 'generation_progress',
        stage: data.stage,
        progress: data.progress,
        artifacts: data.artifacts,
        errors: data.errors,
        outputs: data.outputs || [],
        run: data.run || [],
        next: data.next || [],
        outputs_count: data.outputs_count || 0,
        files_count: data.files_count || 0,
        checks_count: data.checks_count || 0
      }
    };

    setMessages(prev => [...prev, progressMessage]);

    if (data.outputs) {
      const newArtifacts: Artifact[] = data.outputs.map((output: any, index: number) => ({
        id: `${progressMessage.id}_${index}`,
        name: output.name,
        type: output.type,
        size: output.size,
        status: output.status,
        path: output.path,
        url: output.url,
        timestamp: new Date(),
        messageId: progressMessage.id
      }));
      setArtifacts(prev => [...prev, ...newArtifacts]);
    }

    if (data.stage === 'completed' && data.artifacts) {
      setTimeout(() => {
        const completionMessage: ChatMessage = {
          id: `completion_${Date.now()}`,
          role: 'assistant',
          content: "Application generation completed successfully!",
          timestamp: new Date(),
          metadata: {
            type: 'generation_complete',
            artifacts: data.artifacts,
            outputs_count: data.outputs_count || data.artifacts.length,
            files_count: data.files_count || data.artifacts.length,
            checks_count: data.checks_count || 0,
            deploymentStatus: {
              stage: 'testing',
              progress: 75,
              environment: 'staging',
              pipelineStatus: 'success'
            }
          }
        };
        setMessages(prev => [...prev, completionMessage]);
        setIsProcessing(false);
        setIsStreaming(false);
      }, 1000);
    }
  };

  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsProcessing(false);
    setIsStreaming(false);
    
    const stopMessage: ChatMessage = {
      id: `stop_${Date.now()}`,
      role: 'system',
      content: 'Generation stopped by user.',
      timestamp: new Date(),
      status: 'delivered'
    };
    
    setMessages(prev => [...prev, stopMessage]);
  };

  const handleRetry = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages
        .filter(msg => msg.role === 'user')
        .pop();
      
      if (lastUserMessage) {
        setInputMessage(lastUserMessage.content);
        setTimeout(() => handleSendMessage(), 100);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'delivered':
      case 'sent':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'error':
        return <XCircle className="w-3 h-3 text-red-500" />;
      case 'sending':
        return <Clock className="w-3 h-3 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  const renderOutputChip = (output: OutputItem) => {
    switch (output.type) {
      case 'file':
        return (
          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
            <FileText className="w-3 h-3 mr-1" />
            {output.name}
            {output.size && <span className="ml-1 text-blue-600">({output.size})</span>}
          </Badge>
        );
      case 'endpoint':
        return (
          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
            <Terminal className="w-3 h-3 mr-1" />
            {output.method} {output.path}
          </Badge>
        );
      case 'check':
        const statusIcon = output.status === 'pass' ? <CheckSquare className="w-3 h-3" /> : 
                         output.status === 'warn' ? <AlertTriangle className="w-3 h-3" /> : 
                         <XCircle className="w-3 h-3" />;
        const statusColor = output.status === 'pass' ? 'text-green-600' : 
                           output.status === 'warn' ? 'text-yellow-600' : 'text-red-600';
        return (
          <Badge variant="outline" className={`text-xs ${statusColor} border-current`}>
            {statusIcon}
            <span className="ml-1">{output.name}</span>
          </Badge>
        );
      case 'entity':
        return (
          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
            <DatabaseIcon className="w-3 h-3 mr-1" />
            {output.name}
          </Badge>
        );
      case 'flow':
        return (
          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
            <Workflow className="w-3 h-3 mr-1" />
            {output.name}
          </Badge>
        );
      case 'requirement':
        return (
          <Badge variant="outline" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
            <Target className="w-3 h-3 mr-1" />
            {output.name}
          </Badge>
        );
      case 'link':
        return (
          <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 border-gray-200">
            <Link className="w-3 h-3 mr-1" />
            {output.name}
          </Badge>
        );
      default:
        return null;
    }
  };

  const renderDeploymentPipeline = (deploymentStatus?: DeploymentStatus) => {
    if (!deploymentStatus) return null;

    const stages = [
      { key: 'planning', label: 'Planning', icon: Target },
      { key: 'development', label: 'Development', icon: Code },
      { key: 'testing', label: 'Testing', icon: CheckSquare },
      { key: 'staging', label: 'Staging', icon: Server },
      { key: 'production', label: 'Production', icon: Rocket }
    ];

    const currentStageIndex = stages.findIndex(stage => stage.key === deploymentStatus.stage);

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">Deployment Pipeline</span>
          <Badge variant="outline" className={`text-xs ${
            deploymentStatus.pipelineStatus === 'success' ? 'text-green-600' :
            deploymentStatus.pipelineStatus === 'running' ? 'text-blue-600' :
            'text-red-600'
          }`}>
            {deploymentStatus.pipelineStatus}
          </Badge>
        </div>
        <div className="flex items-center space-x-1">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            
            return (
              <div key={stage.key} className="flex items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isCurrent ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  <Icon className="w-3 h-3" />
                </div>
                {index < stages.length - 1 && (
                  <div className={`w-4 h-0.5 ${
                    index < currentStageIndex ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
        <Progress value={deploymentStatus.progress} className="h-2" />
        <div className="text-xs text-gray-500">
          {deploymentStatus.environment} • {deploymentStatus.progress}%
        </div>
      </div>
    );
  };

  const renderRequirementsTrace = (trace?: RequirementsTrace[]) => {
    if (!trace || trace.length === 0) return null;

    return (
      <div className="space-y-1">
        <div className="text-xs font-medium text-gray-600">Requirements Trace</div>
        {trace.map((req) => (
          <div key={req.id} className="flex items-center justify-between text-xs">
            <span className="truncate">{req.requirement}</span>
            <Badge variant="outline" className={`text-xs ${
              req.status === 'deployed' ? 'text-green-600' :
              req.status === 'implemented' ? 'text-blue-600' :
              req.status === 'tested' ? 'text-purple-600' :
              'text-gray-600'
            }`}>
              {req.status}
            </Badge>
          </div>
        ))}
      </div>
    );
  };

  const renderMessageCard = (message: ChatMessage) => {
    const isExpanded = expandedCards.has(message.id);
    const isSummary = message.metadata?.isSummary;
    const outputs = message.metadata?.outputs || [];
    const runs = message.metadata?.run || [];
    const nextActions = message.metadata?.next || [];
    const showDetails = isExpanded || (outputs.length <= 4 && runs.length <= 2 && nextActions.length <= 3);
    
    // Special rendering for summary messages
    if (isSummary) {
      return (
        <Card key={message.id} className="mb-2 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Summary
                </span>
                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                  {message.metadata?.summarizedCount} messages
                </Badge>
                {getStatusIcon(message.status)}
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCardExpansion(message.id)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm mb-2 text-blue-800 dark:text-blue-200">
              {message.content.split('\n')[0]}
              {message.content.split('\n').length > 1 && !isExpanded && (
                <span className="text-blue-600 ml-1">...</span>
              )}
            </div>
            
            {isExpanded && message.content.split('\n').length > 1 && (
              <div className="text-sm whitespace-pre-wrap text-blue-800 dark:text-blue-200">
                {message.content}
              </div>
            )}
          </CardContent>
        </Card>
      );
    }

    // Special rendering for PAAM specification messages
    if (message.metadata?.type === 'paam_spec') {
      return (
        <Card key={message.id} className="mb-2 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  PAAM Specification
                </span>
                {getStatusIcon(message.status)}
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCardExpansion(message.id)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm mb-2 text-green-800 dark:text-green-200">
              {message.content.split('\n')[0]}
              {message.content.split('\n').length > 1 && !isExpanded && (
                <span className="text-green-600 ml-1">...</span>
              )}
            </div>
            
            {/* Output chips */}
            {outputs.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {outputs.slice(0, isExpanded ? outputs.length : 4).map((output, index) => (
                  <div key={index}>
                    {renderOutputChip(output)}
                  </div>
                ))}
                {!isExpanded && outputs.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{outputs.length - 4} more
                  </Badge>
                )}
              </div>
            )}
            
            {/* Requirements trace */}
            {message.metadata.requirementsTrace && (
              <div className="mb-2">
                {renderRequirementsTrace(message.metadata.requirementsTrace)}
              </div>
            )}
            
            {/* Details section */}
            {showDetails && (
              <Accordion type="single" collapsible className="w-full">
                {(outputs.length > 4 || runs.length > 0 || nextActions.length > 0 || message.content.split('\n').length > 1) && (
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-xs">Details</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {/* Full content */}
                      {message.content.split('\n').length > 1 && (
                        <div className="text-sm whitespace-pre-wrap text-green-800 dark:text-green-200">
                          {message.content}
                        </div>
                      )}
                      
                      {/* All outputs */}
                      {outputs.length > 4 && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-600">Outputs</div>
                          <div className="flex flex-wrap gap-1">
                            {outputs.slice(4).map((output, index) => (
                              <div key={index}>
                                {renderOutputChip(output)}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            )}
          </CardContent>
        </Card>
      );
    }

    // Special rendering for deployment status messages
    if (message.metadata?.type === 'deployment_status') {
      return (
        <Card key={message.id} className="mb-2 bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Rocket className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Deployment Status
                </span>
                {getStatusIcon(message.status)}
                <span className="text-xs text-gray-500">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCardExpansion(message.id)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm mb-2 text-purple-800 dark:text-purple-200">
              {message.content.split('\n')[0]}
              {message.content.split('\n').length > 1 && !isExpanded && (
                <span className="text-purple-600 ml-1">...</span>
              )}
            </div>
            
            {/* Deployment pipeline */}
            {message.metadata.deploymentStatus && (
              <div className="mb-2">
                {renderDeploymentPipeline(message.metadata.deploymentStatus)}
              </div>
            )}
            
            {/* Details section */}
            {showDetails && (
              <Accordion type="single" collapsible className="w-full">
                {(message.content.split('\n').length > 1) && (
                  <AccordionItem value="details">
                    <AccordionTrigger className="text-xs">Details</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {/* Full content */}
                      {message.content.split('\n').length > 1 && (
                        <div className="text-sm whitespace-pre-wrap text-purple-800 dark:text-purple-200">
                          {message.content}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            )}
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card key={message.id} className="mb-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-blue-500" />
              ) : (
                <Bot className="w-4 h-4 text-purple-500" />
              )}
              <span className="text-sm font-medium">
                {message.role === 'user' ? 'You' : 'Assistant'}
              </span>
              {getStatusIcon(message.status)}
              <span className="text-xs text-gray-500">
                {formatTime(message.timestamp)}
              </span>
            </div>
            {outputs.length > 4 || runs.length > 2 || nextActions.length > 3 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleCardExpansion(message.id)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Status line - only show first line by default */}
          <div className="text-sm mb-2">
            {message.content.split('\n')[0]}
            {message.content.split('\n').length > 1 && !isExpanded && (
              <span className="text-gray-500 ml-1">...</span>
            )}
          </div>
          
          {/* Output chips - show max 4 by default */}
          {outputs.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {outputs.slice(0, isExpanded ? outputs.length : 4).map((output, index) => (
                <div key={index}>
                  {renderOutputChip(output)}
                </div>
              ))}
              {!isExpanded && outputs.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{outputs.length - 4} more
                </Badge>
              )}
            </div>
          )}
          
          {/* Deployment pipeline if present */}
          {message.metadata.deploymentStatus && (
            <div className="mb-2">
              {renderDeploymentPipeline(message.metadata.deploymentStatus)}
            </div>
          )}
          
          {/* Requirements trace if present */}
          {message.metadata.requirementsTrace && (
            <div className="mb-2">
              {renderRequirementsTrace(message.metadata.requirementsTrace)}
            </div>
          )}
          
          {/* Details section */}
          {showDetails && (
            <Accordion type="single" collapsible className="w-full">
              {(outputs.length > 4 || runs.length > 0 || nextActions.length > 0 || message.content.split('\n').length > 1) && (
                <AccordionItem value="details">
                  <AccordionTrigger className="text-xs">Details</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    {/* Full content */}
                    {message.content.split('\n').length > 1 && (
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    )}
                    
                    {/* All outputs */}
                    {outputs.length > 4 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Outputs</div>
                        <div className="flex flex-wrap gap-1">
                          {outputs.slice(4).map((output, index) => (
                            <div key={index}>
                              {renderOutputChip(output)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Commands */}
                    {runs.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Commands</div>
                        <div className="space-y-1">
                          {runs.map((run, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{run.command}</code>
                              {run.copyable && (
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Copy className="w-3 h-3" />
                                </Button>
                              )}
                              {run.runnable && (
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Terminal className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Next actions */}
                    {nextActions.length > 0 && (
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-gray-600">Next Actions</div>
                        <div className="flex flex-wrap gap-1">
                          {nextActions.map((action, index) => (
                            <Button
                              key={index}
                              variant={action.primary ? "default" : "outline"}
                              size="sm"
                              className="text-xs h-7"
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          )}
        </CardContent>
      </Card>
    );
  };

  const filteredArtifacts = artifacts.filter(artifact => {
    if (filter === 'all') return true;
    return artifact.status === filter;
  });

  return (
    <div className="h-full bg-white dark:bg-gray-900">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel - PAAM Project & Requirements */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full flex flex-col border-r border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">PAAM Project</h2>
              {currentProject ? (
                <div className="space-y-2">
                  <div>
                    <div className="text-xs font-medium text-gray-600">Project</div>
                    <div className="text-sm text-gray-900 dark:text-white">{currentProject.name}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600">Status</div>
                    <Badge variant="outline" className={`text-xs ${
                      currentProject.status === 'deployed' ? 'text-green-600' :
                      currentProject.status === 'testing' ? 'text-blue-600' :
                      currentProject.status === 'in_development' ? 'text-orange-600' :
                      'text-gray-600'
                    }`}>
                      {currentProject.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600">Entities</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {currentProject.paam.entities.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-600">Flows</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {currentProject.paam.flows.length}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-xs text-gray-500 mb-2">No project yet</div>
                  <div className="text-xs text-gray-400">Describe your app idea to get started</div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h3>
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs h-8"
                  onClick={() => handleQuickAction('add_requirement')}
                  disabled={!currentProject}
                >
                  <Target className="w-3 h-3 mr-2" />
                  Add Requirement
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs h-8"
                  onClick={() => handleQuickAction('add_entity')}
                  disabled={!currentProject}
                >
                  <DatabaseIcon className="w-3 h-3 mr-2" />
                  Add Entity
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs h-8"
                  onClick={() => handleQuickAction('add_flow')}
                  disabled={!currentProject}
                >
                  <Workflow className="w-3 h-3 mr-2" />
                  Add Flow
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-xs h-8"
                  onClick={() => handleQuickAction('deploy')}
                  disabled={!currentProject}
                >
                  <Rocket className="w-3 h-3 mr-2" />
                  Deploy
                </Button>
                {currentProject && (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-xs h-8"
                    onClick={handleArchiveProject}
                  >
                    <Archive className="w-3 h-3 mr-2" />
                    Archive
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Center Panel - Chat */}
        <ResizablePanel defaultSize={60}>
          <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <Plus className="w-3 h-3 mr-1" />
                  New Run
                </Button>
                {isProcessing ? (
                  <Button variant="outline" size="sm" className="text-xs h-8" onClick={handleStopGeneration}>
                    <StopCircle className="w-3 h-3 mr-1" />
                    Stop
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="text-xs h-8" onClick={handleRetry}>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                )}
                <Button variant="outline" size="sm" className="text-xs h-8">
                  <Settings className="w-3 h-3 mr-1" />
                  Settings
                </Button>
              </div>
              <div className="flex items-center space-x-1">
                {/* User Mode Toggle */}
                <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <Button
                    variant={userMode === 'layman' ? 'default' : 'ghost'}
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => setUserMode('layman')}
                  >
                    👤 Layman
                  </Button>
                  <Button
                    variant={userMode === 'developer' ? 'default' : 'ghost'}
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => setUserMode('developer')}
                  >
                    👨‍💻 Developer
                  </Button>
                </div>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1" />
                  Online
                </Badge>
                {isStreaming && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 animate-pulse">
                    Processing
                  </Badge>
                )}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <Virtuoso
                    data={messages}
                    itemContent={(index, message) => renderMessageCard(message)}
                    className="h-full"
                    followOutput="smooth"
                  />
                </div>
              </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => {
                    console.log('Input changed:', e.target.value);
                    setInputMessage(e.target.value);
                  }}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your application requirements..."
                  disabled={isProcessing}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button 
                  onClick={() => {
                    console.log('Send button clicked, inputMessage:', inputMessage);
                    console.log('isProcessing:', isProcessing);
                    handleSendMessage();
                  }} 
                  disabled={!inputMessage.trim() || isProcessing}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                <Badge variant="outline" className="text-xs">/help</Badge>
                <Badge variant="outline" className="text-xs">/entity</Badge>
                <Badge variant="outline" className="text-xs">/flow</Badge>
                <Badge variant="outline" className="text-xs">/requirement</Badge>
                <Badge variant="outline" className="text-xs">/deploy</Badge>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right Panel - Artifacts & Pipeline */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full flex flex-col border-l border-gray-200 dark:border-gray-700">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-5 h-8">
                <TabsTrigger value="artifacts" className="text-xs">Artifacts</TabsTrigger>
                <TabsTrigger value="code" className="text-xs relative">
                  Code
                  {codeFiles.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="pipeline" className="text-xs">Pipeline</TabsTrigger>
                <TabsTrigger value="trace" className="text-xs">Trace</TabsTrigger>
                <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="artifacts" className="flex-1 p-0">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-gray-900 dark:text-white">Artifacts</h3>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <Filter className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(['all', 'draft', 'approved', 'implemented', 'deployed'] as const).map((status) => (
                      <Button
                        key={status}
                        variant={filter === status ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(status)}
                        className="text-xs h-6"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-3 space-y-2">
                    {filteredArtifacts.map((artifact) => (
                      <Card key={artifact.id} className="p-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {artifact.type === 'file' && <FileText className="w-3 h-3 text-blue-500" />}
                            {artifact.type === 'entity' && <DatabaseIcon className="w-3 h-3 text-green-500" />}
                            {artifact.type === 'flow' && <Workflow className="w-3 h-3 text-orange-500" />}
                            {artifact.type === 'requirement' && <Target className="w-3 h-3 text-indigo-500" />}
                            {artifact.type === 'endpoint' && <Terminal className="w-3 h-3 text-purple-500" />}
                            {artifact.type === 'check' && <CheckSquare className="w-3 h-3 text-green-500" />}
                            {artifact.type === 'link' && <Link className="w-3 h-3 text-gray-500" />}
                            {artifact.type === 'deployment' && <Rocket className="w-3 h-3 text-red-500" />}
                            <span className="text-xs font-medium">{artifact.name}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {artifact.size && (
                              <span className="text-xs text-gray-500">{artifact.size}</span>
                            )}
                            <Badge variant="outline" className={`text-xs ${
                              artifact.status === 'deployed' ? 'text-green-600' :
                              artifact.status === 'implemented' ? 'text-blue-600' :
                              artifact.status === 'approved' ? 'text-purple-600' :
                              artifact.status === 'draft' ? 'text-gray-600' :
                              'text-orange-600'
                            }`}>
                              {artifact.status}
                            </Badge>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0"
                              onClick={() => handleViewArtifact(artifact)}
                              title="View artifact details"
                            >
                              <Eye className="w-2 h-2" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0"
                              onClick={() => handleCopyArtifact(artifact)}
                              title="Copy artifact details"
                            >
                              <Copy className="w-2 h-2" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-5 w-5 p-0"
                              onClick={() => handleDownloadArtifact(artifact)}
                              title="Download artifact"
                            >
                              <Download className="w-2 h-2" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="code" className="flex-1 p-0">
                <CodeEditor 
                  files={codeFiles}
                  selectedFile={selectedCodeFile}
                  onFileSelect={setSelectedCodeFile}
                  onFileChange={(fileId, content) => {
                    setCodeFiles(prev => prev.map(file => 
                      file.id === fileId ? { ...file, content } : file
                    ));
                  }}
                  readOnly={false}
                />
              </TabsContent>
              
              <TabsContent value="pipeline" className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="p-3">
                    {currentProject?.deploymentHistory.map((deployment, index) => (
                      <Card key={index} className="p-3 mb-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium capitalize">{deployment.stage}</span>
                            <Badge variant="outline" className={`text-xs ${
                              deployment.pipelineStatus === 'success' ? 'text-green-600' :
                              deployment.pipelineStatus === 'running' ? 'text-blue-600' :
                              'text-red-600'
                            }`}>
                              {deployment.pipelineStatus}
                            </Badge>
                          </div>
                          <Progress value={deployment.progress} className="h-2" />
                          <div className="text-xs text-gray-500">
                            {deployment.environment} • {deployment.progress}%
                          </div>
                          {deployment.lastDeployed && (
                            <div className="text-xs text-gray-500">
                              Last deployed: {formatTime(deployment.lastDeployed)}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="trace" className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="p-3">
                    <div className="text-xs font-mono space-y-2">
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                        <span className="text-green-700">User Authentication</span>
                        <Badge className="text-xs bg-green-100 text-green-700">Deployed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-blue-700">Todo Management</span>
                        <Badge className="text-xs bg-blue-100 text-blue-700">Implemented</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                        <span className="text-purple-700">Data Validation</span>
                        <Badge className="text-xs bg-purple-100 text-purple-700">Tested</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-gray-700">Email Notifications</span>
                        <Badge className="text-xs bg-gray-100 text-gray-700">Draft</Badge>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="logs" className="flex-1 p-0">
                <ScrollArea className="h-full">
                  <div className="p-3">
                    <div className="text-xs font-mono space-y-1">
                      <div className="text-green-600">[2024-01-15 10:30:15] PAAM specification created</div>
                      <div className="text-blue-600">[2024-01-15 10:30:16] Entity: User defined</div>
                      <div className="text-blue-600">[2024-01-15 10:30:17] Entity: Todo defined</div>
                      <div className="text-blue-600">[2024-01-15 10:30:18] Flow: User Registration created</div>
                      <div className="text-orange-600">[2024-01-15 10:30:19] Development started</div>
                      <div className="text-purple-600">[2024-01-15 10:30:20] API endpoints generated</div>
                      <div className="text-purple-600">[2024-01-15 10:30:21] UI components created</div>
                      <div className="text-green-600">[2024-01-15 10:30:22] Testing completed</div>
                      <div className="text-green-600">[2024-01-15 10:30:23] Ready for deployment</div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Artifact Details Modal */}
      {showArtifactDetails && selectedArtifact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                {selectedArtifact.type === 'file' && <FileText className="w-5 h-5 text-blue-500" />}
                {selectedArtifact.type === 'entity' && <DatabaseIcon className="w-5 h-5 text-green-500" />}
                {selectedArtifact.type === 'flow' && <Workflow className="w-5 h-5 text-orange-500" />}
                {selectedArtifact.type === 'requirement' && <Target className="w-5 h-5 text-indigo-500" />}
                {selectedArtifact.type === 'endpoint' && <Terminal className="w-5 h-5 text-purple-500" />}
                {selectedArtifact.type === 'check' && <CheckSquare className="w-5 h-5 text-green-500" />}
                {selectedArtifact.type === 'link' && <Link className="w-5 h-5 text-gray-500" />}
                {selectedArtifact.type === 'deployment' && <Rocket className="w-5 h-5 text-red-500" />}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedArtifact.name}
                </h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCloseArtifactDetails}
                className="h-8 w-8 p-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</div>
                    <div className="text-sm text-gray-900 dark:text-white capitalize">
                      {selectedArtifact.type}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</div>
                    <Badge variant="outline" className={`text-xs ${
                      selectedArtifact.status === 'deployed' ? 'text-green-600' :
                      selectedArtifact.status === 'implemented' ? 'text-blue-600' :
                      selectedArtifact.status === 'approved' ? 'text-purple-600' :
                      selectedArtifact.status === 'draft' ? 'text-gray-600' :
                      'text-orange-600'
                    }`}>
                      {selectedArtifact.status}
                    </Badge>
                  </div>
                  {selectedArtifact.size && (
                    <div>
                      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Size</div>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {selectedArtifact.size}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Created</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {formatTime(selectedArtifact.timestamp)}
                    </div>
                  </div>
                </div>
                
                {selectedArtifact.description && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Description</div>
                    <div className="text-sm text-gray-900 dark:text-white">
                      {selectedArtifact.description}
                    </div>
                  </div>
                )}
                
                {/* Show detailed information based on artifact type */}
                {selectedArtifact.type === 'entity' && currentProject && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Entity Details</div>
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                      {(() => {
                        const entity = currentProject.paam.entities.find(e => e.name === selectedArtifact.name);
                        if (!entity) return null;
                        
                        return (
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs font-medium text-gray-600">Fields</div>
                              <div className="mt-1 space-y-1">
                                {entity.fields.map((field, index) => (
                                  <div key={index} className="flex items-center justify-between text-xs">
                                    <span className="font-mono">{field.name}</span>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="outline" className="text-xs">
                                        {field.type}
                                      </Badge>
                                      {field.required && <Badge className="text-xs bg-red-100 text-red-700">Required</Badge>}
                                      {field.unique && <Badge className="text-xs bg-blue-100 text-blue-700">Unique</Badge>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
                
                {selectedArtifact.type === 'flow' && currentProject && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Flow Details</div>
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                      {(() => {
                        const flow = currentProject.paam.flows.find(f => f.name === selectedArtifact.name);
                        if (!flow) return null;
                        
                        return (
                          <div className="space-y-3">
                            <div>
                              <div className="text-xs font-medium text-gray-600">Steps</div>
                              <div className="mt-1 space-y-2">
                                {flow.steps.map((step, index) => (
                                  <div key={index} className="flex items-start space-x-2">
                                    <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                                        {index + 1}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                                        {step.name}
                                      </div>
                                      <div className="text-xs text-gray-600 dark:text-gray-400">
                                        {step.description}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
                
                {selectedArtifact.type === 'requirement' && currentProject && (
                  <div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Requirement Details</div>
                    <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                      {(() => {
                        const requirement = currentProject.paam.metadata.requirements?.find(r => r.title === selectedArtifact.name);
                        if (!requirement) return null;
                        
                        return (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-xs font-medium text-gray-600">Priority</div>
                                <div className="text-sm text-gray-900 dark:text-white capitalize">
                                  {requirement.priority}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs font-medium text-gray-600">Created</div>
                                <div className="text-sm text-gray-900 dark:text-white">
                                  {formatTime(new Date(requirement.createdAt))}
                                </div>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-gray-600">Description</div>
                              <div className="text-sm text-gray-900 dark:text-white">
                                {requirement.description}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 p-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                variant="outline" 
                onClick={handleCloseArtifactDetails}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}