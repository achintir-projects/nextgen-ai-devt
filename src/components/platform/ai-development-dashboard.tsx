/**
 * Main Dashboard UI for the AI Development Platform
 * This is the primary interface for interacting with the platform
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Palette, 
  Code, 
  Users, 
  BarChart3, 
  Settings, 
  Play, 
  Save, 
  Download,
  Plus,
  MessageSquare,
  Database,
  Layers,
  Zap
} from 'lucide-react';

interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

interface PAAMProject {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'generating' | 'completed' | 'error';
  createdAt: Date;
  updatedAt: Date;
  entities: number;
  flows: number;
}

export default function AIDevelopmentDashboard() {
  const [conversations, setConversations] = useState<ConversationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [projects, setProjects] = useState<PAAMProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');

  // Sample projects
  useEffect(() => {
    setProjects([
      {
        id: '1',
        name: 'Todo App',
        description: 'Simple task management application',
        status: 'completed',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        entities: 1,
        flows: 5
      },
      {
        id: '2',
        name: 'CRM System',
        description: 'Customer relationship management system',
        status: 'draft',
        createdAt: new Date('2024-01-16'),
        updatedAt: new Date('2024-01-16'),
        entities: 3,
        flows: 3
      },
      {
        id: '3',
        name: 'SaaS Admin Panel',
        description: 'Comprehensive SaaS administration panel',
        status: 'generating',
        createdAt: new Date('2024-01-17'),
        updatedAt: new Date('2024-01-17'),
        entities: 4,
        flows: 2
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setConversations(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsGenerating(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        metadata: {
          type: 'response',
          confidence: 0.85
        }
      };

      setConversations(prev => [...prev, aiMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const generateAIResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('create') && lowerMessage.includes('app')) {
      return "I can help you create a new application! Let me understand what kind of app you'd like to build. Please tell me:\n\n1. What type of application? (e.g., Todo app, CRM, blog, etc.)\n2. What are the main features you need?\n3. Do you need user authentication?\n4. Any specific technology preferences?";
    }
    
    if (lowerMessage.includes('generate') && lowerMessage.includes('code')) {
      return "I'll generate the code for your application. Based on your PAAM specification, I'll create:\n\n• React/Next.js components\n• API endpoints\n• Database schema\n• Configuration files\n• Utility functions\n\nThis will take a few moments. Please wait...";
    }
    
    if (lowerMessage.includes('help')) {
      return "I'm your AI development assistant! I can help you:\n\n• Create application specifications using PAAM\n• Generate React/Next.js code\n• Design database schemas\n• Create API endpoints\n• Set up authentication\n• Deploy applications\n\nWhat would you like to work on today?";
    }
    
    return "I understand you're working on something interesting. Could you please provide more details about what you'd like to build or modify? I'm here to help you create amazing applications!";
  };

  const handleCreateProject = () => {
    const newProject: PAAMProject = {
      id: Date.now().toString(),
      name: 'New Project',
      description: 'Describe your project here...',
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      entities: 0,
      flows: 0
    };
    
    setProjects(prev => [newProject, ...prev]);
    setSelectedProject(newProject.id);
  };

  const handleGenerateCode = () => {
    if (!selectedProject) return;
    
    setProjects(prev => prev.map(p => 
      p.id === selectedProject 
        ? { ...p, status: 'generating' as const, updatedAt: new Date() }
        : p
    ));
    
    // Simulate code generation
    setTimeout(() => {
      setProjects(prev => prev.map(p => 
        p.id === selectedProject 
          ? { ...p, status: 'completed' as const, updatedAt: new Date() }
          : p
      ));
    }, 3000);
  };

  const getStatusColor = (status: PAAMProject['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'generating': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">AI Development Platform</h1>
              </div>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Projects Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Projects
                  </span>
                  <Button size="sm" onClick={handleCreateProject}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>Your PAAM projects</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedProject === project.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedProject(project.id)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{project.name}</h4>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{project.entities} entities</span>
                          <span>{project.flows} flows</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  disabled={!selectedProject}
                  onClick={handleGenerateCode}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Generate Code
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  View Schema
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Layers className="h-4 w-4 mr-2" />
                  Edit PAAM
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="chat" className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="designer" className="flex items-center">
                  <Palette className="h-4 w-4 mr-2" />
                  Designer
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center">
                  <Code className="h-4 w-4 mr-2" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat" className="space-y-4">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle>AI Assistant</CardTitle>
                    <CardDescription>
                      Chat with your AI development assistant to create and modify applications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <ScrollArea className="flex-1 mb-4 border rounded-lg p-4">
                      <div className="space-y-4">
                        {conversations.length === 0 && (
                          <div className="text-center text-muted-foreground py-8">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Start a conversation with your AI assistant</p>
                            <p className="text-sm">Try asking: "Create a todo app" or "Generate code for my project"</p>
                          </div>
                        )}
                        {conversations.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-3 ${
                                message.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p className="text-xs opacity-70 mt-1">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {isGenerating && (
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                <p className="text-sm">AI is thinking...</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask me to create, modify, or generate applications..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        disabled={isGenerating}
                      />
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={!inputMessage.trim() || isGenerating}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Designer Tab */}
              <TabsContent value="designer" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>PAAM Designer</CardTitle>
                    <CardDescription>
                      Design your application using the Platform-Agnostic Application Model
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Application Name</label>
                          <Input placeholder="My Awesome App" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Description</label>
                          <Textarea 
                            placeholder="Describe what your application does..." 
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Template</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a template" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="todo">Todo App</SelectItem>
                              <SelectItem value="crm">CRM System</SelectItem>
                              <SelectItem value="saas">SaaS Admin</SelectItem>
                              <SelectItem value="blank">Blank Project</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Features</label>
                          <div className="space-y-2">
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked />
                              <span className="text-sm">User Authentication</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked />
                              <span className="text-sm">Database</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" />
                              <span className="text-sm">API Endpoints</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" />
                              <span className="text-sm">File Upload</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input type="checkbox" />
                              <span className="text-sm">Real-time Updates</span>
                            </label>
                          </div>
                        </div>
                        <Button className="w-full">
                          <Save className="h-4 w-4 mr-2" />
                          Save PAAM
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Code Tab */}
              <TabsContent value="code" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Code</CardTitle>
                    <CardDescription>
                      View and manage your generated application code
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Select defaultValue="components">
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="components">Components</SelectItem>
                              <SelectItem value="pages">Pages</SelectItem>
                              <SelectItem value="api">API Routes</SelectItem>
                              <SelectItem value="types">Types</SelectItem>
                              <SelectItem value="utils">Utilities</SelectItem>
                            </SelectContent>
                          </Select>
                          <Badge variant="outline">React/Next.js</Badge>
                          <Badge variant="outline">TypeScript</Badge>
                        </div>
                        <Button>
                          <Download className="h-4 w-4 mr-2" />
                          Download Project
                        </Button>
                      </div>
                      <div className="border rounded-lg p-4 bg-muted/50">
                        <div className="text-center text-muted-foreground py-8">
                          <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No code generated yet</p>
                          <p className="text-sm">Create a PAAM and click "Generate Code" to get started</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{projects.length}</div>
                      <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Generated Apps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {projects.filter(p => p.status === 'completed').length}
                      </div>
                      <p className="text-xs text-muted-foreground">Ready for deployment</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">98.5%</div>
                      <p className="text-xs text-muted-foreground">Generation success</p>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {projects.slice(0, 5).map((project) => (
                        <div key={project.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                            <div>
                              <p className="font-medium">{project.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {project.updatedAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline">{project.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}