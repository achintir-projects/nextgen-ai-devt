/**
 * AI Agent Panel
 * Intelligent development assistant with patch proposal, command execution, and job management
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Code, 
  Terminal, 
  Play, 
  Pause,
  Settings,
  History,
  Zap,
  AlertCircle,
  FileText,
  GitBranch,
  Database,
  Lightbulb,
  TrendingUp,
  Shield,
  Copy,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';

interface AgentMessage {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  attachments?: AgentAttachment[];
}

interface AgentAttachment {
  type: 'diff' | 'command' | 'jobSpec' | 'code' | 'analysis';
  content: string;
  language?: string;
  status?: 'pending' | 'applied' | 'rejected' | 'failed';
}

interface AgentPatch {
  id: string;
  description: string;
  files: PatchFile[];
  confidence: number;
  testsPassed: boolean;
  status: 'pending' | 'applied' | 'rejected' | 'failed';
  createdAt: Date;
  appliedAt?: Date;
}

interface PatchFile {
  path: string;
  changes: string;
  type: 'add' | 'modify' | 'delete';
}

interface AgentJob {
  id: string;
  type: 'compile' | 'test' | 'deploy' | 'analyze';
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime: Date;
  endTime?: Date;
  output?: string;
}

interface AgentConfig {
  autoApply: boolean;
  requireConfirmation: boolean;
  model: 'gpt-4' | 'claude' | 'gemini';
  temperature: number;
  maxTokens: number;
}

interface AIAgentPanelProps {
  projectId: string;
  files?: any[];
  onPatchApply?: (patch: AgentPatch) => void;
  onJobExecute?: (job: AgentJob) => void;
}

export default function AIAgentPanel({
  projectId,
  files,
  onPatchApply,
  onJobExecute
}: AIAgentPanelProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [patches, setPatches] = useState<AgentPatch[]>([]);
  const [jobs, setJobs] = useState<AgentJob[]>([]);
  const [config, setConfig] = useState<AgentConfig>({
    autoApply: false,
    requireConfirmation: true,
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2000
  });
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: AgentMessage = {
      id: '1',
      type: 'agent',
      content: `Hello! I'm your PAAM AI Assistant. I can help you with:

• **Code Analysis**: Review your codebase and suggest improvements
• **Bug Fixes**: Identify and fix issues in your code
• **Feature Implementation**: Add new features and functionality
• **Optimization**: Improve performance and efficiency
• **Documentation**: Generate docs and comments

Try asking me to "analyze the codebase" or "add user authentication"!`,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: AgentMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate AI response based on user input
    const aiResponse = await generateAIResponse(inputMessage);
    
    const agentMessage: AgentMessage = {
      id: `msg_${Date.now() + 1}`,
      type: 'agent',
      content: aiResponse.content,
      timestamp: new Date(),
      attachments: aiResponse.attachments
    };

    setMessages(prev => [...prev, agentMessage]);
    setIsLoading(false);

    // If response contains patches, add them to patches list
    if (aiResponse.attachments?.some(att => att.type === 'diff')) {
      const newPatch: AgentPatch = {
        id: `patch_${Date.now()}`,
        description: aiResponse.content,
        files: [
          {
            path: '/src/main.ts',
            changes: '// Added new functionality\nconsole.log("Hello from AI!");',
            type: 'modify'
          }
        ],
        confidence: 0.85,
        testsPassed: true,
        status: 'pending',
        createdAt: new Date()
      };
      setPatches(prev => [newPatch, ...prev]);
    }
  };

  const generateAIResponse = async (userInput: string): Promise<{
    content: string;
    attachments?: AgentAttachment[];
  }> => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('analyze') || lowerInput.includes('review')) {
      return {
        content: `I've analyzed your codebase and found several areas for improvement:

**Code Quality Score**: 85/100

**Key Findings:**
• Good overall structure and organization
• Some functions could be more modular
• Missing error handling in API calls
• Opportunity for performance optimization

**Recommendations:**
1. Add comprehensive error handling
2. Break down large functions into smaller, focused units
3. Add input validation
4. Implement caching for frequently accessed data

Would you like me to implement any of these improvements?`,
        attachments: [
          {
            type: 'analysis',
            content: 'Code analysis completed with 85% quality score',
            status: 'completed'
          }
        ]
      };
    }

    if (lowerInput.includes('authentication') || lowerInput.includes('auth')) {
      return {
        content: `I can help you implement user authentication! Here's what I propose:

**Authentication System Features:**
• JWT-based authentication
• User registration and login
• Password reset functionality
• Role-based access control
• Session management

**Files to be modified:**
• \`/src/auth/auth.service.ts\` - New authentication service
• \`/src/middleware.ts\` - Route protection
• \`/src/components/auth/\` - Auth components
• \`/src/types/auth.ts\` - Type definitions

**Security Considerations:**
• Password hashing with bcrypt
• JWT token expiration
• Rate limiting for auth endpoints
• CSRF protection

Would you like me to proceed with implementing this authentication system?`,
        attachments: [
          {
            type: 'diff',
            content: `// Add authentication service
export class AuthService {
  async login(email: string, password: string): Promise<AuthResult> {
    // Implementation here
  }
}`,
            language: 'typescript',
            status: 'pending'
          }
        ]
      };
    }

    if (lowerInput.includes('bug') || lowerInput.includes('fix')) {
      return {
        content: `I found a potential bug in your codebase:

**Issue:** Memory leak in event listeners

**Location:** \`/src/components/dashboard.tsx\` line 45-52

**Problem:** Event listeners are not being properly cleaned up when components unmount, which can cause memory leaks.

**Fix:** Add proper cleanup in useEffect

**Proposed Solution:**
\`\`\`typescript
useEffect(() => {
  const handler = (event: Event) => {
    // Handle event
  };
  
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);
\`\`\`

This fix ensures proper cleanup and prevents memory leaks. Should I apply this patch?`,
        attachments: [
          {
            type: 'diff',
            content: `// Fix memory leak in event listeners
useEffect(() => {
  const handler = (event: Event) => {
    // Handle event
  };
  
  window.addEventListener('resize', handler);
  
  return () => {
    window.removeEventListener('resize', handler);
  };
}, []);`,
            language: 'typescript',
            status: 'pending'
          }
        ]
      };
    }

    // Default response
    return {
      content: `I understand you want help with your project. I can assist you with various tasks including:

• Code analysis and optimization
• Bug fixing and debugging
• Feature implementation
• Documentation generation
• Performance improvements
• Security enhancements

Could you please provide more specific details about what you'd like me to help you with? For example:
- "Analyze the codebase for issues"
- "Add user authentication"
- "Optimize database queries"
- "Fix the memory leak issue"`
    };
  };

  const handlePatchApply = (patch: AgentPatch) => {
    const updatedPatch = {
      ...patch,
      status: 'applied' as const,
      appliedAt: new Date()
    };
    
    setPatches(prev => 
      prev.map(p => p.id === patch.id ? updatedPatch : p)
    );
    
    onPatchApply?.(updatedPatch);
  };

  const handlePatchReject = (patch: AgentPatch) => {
    const updatedPatch = {
      ...patch,
      status: 'rejected' as const
    };
    
    setPatches(prev => 
      prev.map(p => p.id === patch.id ? updatedPatch : p)
    );
  };

  const handleJobExecute = (job: AgentJob) => {
    const updatedJob = {
      ...job,
      status: 'running' as const
    };
    
    setJobs(prev => 
      prev.map(j => j.id === job.id ? updatedJob : j)
    );
    
    onJobExecute?.(updatedJob);
    
    // Simulate job completion
    setTimeout(() => {
      const completedJob = {
        ...updatedJob,
        status: 'completed' as const,
        progress: 100,
        endTime: new Date(),
        output: 'Job completed successfully'
      };
      
      setJobs(prev => 
        prev.map(j => j.id === job.id ? completedJob : j)
      );
    }, 3000);
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

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'diff':
        return <Code className="w-4 h-4" />;
      case 'command':
        return <Terminal className="w-4 h-4" />;
      case 'jobSpec':
        return <Play className="w-4 h-4" />;
      case 'code':
        return <FileText className="w-4 h-4" />;
      case 'analysis':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied':
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'running':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                AI Agent Assistant
              </h3>
              <p className="text-xs text-gray-500">
                {config.model} • {config.autoApply ? 'Auto-apply' : 'Manual approval'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {patches.filter(p => p.status === 'pending').length} pending
            </Badge>
            <Badge variant="outline" className="text-xs">
              {jobs.filter(j => j.status === 'running').length} running
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSystemPrompt(!showSystemPrompt)}
          >
            <Settings className="w-4 h-4 mr-1" />
            Config
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      
                      {message.attachments && (
                        <div className="mt-3 space-y-2">
                          {message.attachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="bg-white dark:bg-gray-700 rounded p-2 border"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  {getAttachmentIcon(attachment.type)}
                                  <span className="text-xs font-medium capitalize">
                                    {attachment.type}
                                  </span>
                                  {attachment.status && (
                                    <Badge className={`text-xs ${getStatusColor(attachment.status)}`}>
                                      {attachment.status}
                                    </Badge>
                                  )}
                                </div>
                                {attachment.type === 'diff' && attachment.status === 'pending' && (
                                  <div className="flex items-center space-x-1">
                                    <Button
                                      size="sm"
                                      className="h-6 px-2 text-xs"
                                      onClick={() => {
                                        // Apply patch logic
                                        attachment.status = 'applied';
                                      }}
                                    >
                                      Apply
                                    </Button>
                                  </div>
                                )}
                              </div>
                              {attachment.content && (
                                <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-2 rounded overflow-x-auto">
                                  {attachment.content}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="text-xs opacity-70 mt-1">
                        {formatTimeAgo(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask the AI agent to help with your code..."
                  className="min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="h-[60px]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
          <Tabs defaultValue="patches" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="patches" className="text-xs">Patches</TabsTrigger>
              <TabsTrigger value="jobs" className="text-xs">Jobs</TabsTrigger>
            </TabsList>

            <TabsContent value="patches" className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Pending Patches</h4>
                  <Badge variant="outline" className="text-xs">
                    {patches.filter(p => p.status === 'pending').length}
                  </Badge>
                </div>

                {patches.filter(p => p.status === 'pending').map((patch) => (
                  <Card key={patch.id} className="cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs flex items-center justify-between">
                        <span className="truncate">{patch.description}</span>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {Math.round(patch.confidence * 100)}%
                          </Badge>
                          {patch.testsPassed && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="text-xs text-gray-500 mb-2">
                        {patch.files.length} file(s) affected
                      </div>
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          className="flex-1 text-xs h-7"
                          onClick={() => handlePatchApply(patch)}
                        >
                          Apply
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs h-7"
                          onClick={() => handlePatchReject(patch)}
                        >
                          Reject
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {patches.filter(p => p.status !== 'pending').length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                    {patches
                      .filter(p => p.status !== 'pending')
                      .slice(0, 3)
                      .map((patch) => (
                        <div key={patch.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                          <div className="flex items-center space-x-2">
                            {patch.status === 'applied' ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <XCircle className="w-3 h-3 text-red-500" />
                            )}
                            <span className="text-xs truncate">{patch.description}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(patch.appliedAt || patch.createdAt)}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="jobs" className="mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Active Jobs</h4>
                  <Badge variant="outline" className="text-xs">
                    {jobs.filter(j => j.status === 'running').length}
                  </Badge>
                </div>

                {jobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            job.status === 'running' ? 'bg-blue-500' :
                            job.status === 'completed' ? 'bg-green-500' :
                            job.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                          }`} />
                          <span className="text-xs font-medium capitalize">{job.type}</span>
                        </div>
                        <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                          {job.status}
                        </Badge>
                      </div>
                      
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {job.description}
                      </p>
                      
                      {job.status === 'running' && (
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 mb-2">
                          <div 
                            className="bg-blue-500 h-1 rounded-full" 
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                      )}
                      
                      {job.status === 'pending' && (
                        <Button
                          size="sm"
                          className="w-full text-xs h-7"
                          onClick={() => handleJobExecute(job)}
                        >
                          Execute
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Configuration Panel (Conditional) */}
      {showSystemPrompt && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-lg">AI Agent Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Model</label>
                  <select 
                    className="w-full mt-1 p-2 border rounded text-sm"
                    value={config.model}
                    onChange={(e) => setConfig(prev => ({ ...prev, model: e.target.value as any }))}
                  >
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude">Claude</option>
                    <option value="gemini">Gemini</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Temperature</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.1"
                    value={config.temperature}
                    onChange={(e) => setConfig(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="w-full mt-1"
                  />
                  <div className="text-xs text-gray-500">{config.temperature}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Auto-apply patches</label>
                  <input 
                    type="checkbox"
                    checked={config.autoApply}
                    onChange={(e) => setConfig(prev => ({ ...prev, autoApply: e.target.checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Require confirmation</label>
                  <input 
                    type="checkbox"
                    checked={config.requireConfirmation}
                    onChange={(e) => setConfig(prev => ({ ...prev, requireConfirmation: e.target.checked }))}
                  />
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button 
                    className="flex-1" 
                    onClick={() => setShowSystemPrompt(false)}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowSystemPrompt(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}