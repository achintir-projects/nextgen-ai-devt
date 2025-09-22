/**
 * Critique-and-Correct Loop Router with Plan Graph UI
 * This component handles user feedback routing and provides visual plan representation
 */
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  GitBranch, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RefreshCw,
  Eye,
  Edit,
  Save,
  Play,
  Pause,
  Zap
} from 'lucide-react';

interface PlanNode {
  id: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'agent';
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error' | 'feedback';
  agent?: string;
  position: { x: number; y: number };
  connections: string[];
  metadata?: Record<string, any>;
}

interface FeedbackItem {
  id: string;
  nodeId: string;
  type: 'bug' | 'improvement' | 'question' | 'feature';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestedFix?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface ExecutionPlan {
  id: string;
  name: string;
  description: string;
  nodes: PlanNode[];
  feedback: FeedbackItem[];
  status: 'draft' | 'running' | 'completed' | 'paused' | 'error';
  createdAt: Date;
  updatedAt: Date;
  metrics: {
    totalNodes: number;
    completedNodes: number;
    errorNodes: number;
    feedbackItems: number;
    executionTime: number;
  };
}

export default function CritiqueCorrectRouter() {
  const [plans, setPlans] = useState<ExecutionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [feedbackType, setFeedbackType] = useState<FeedbackItem['type']>('improvement');
  const [feedbackSeverity, setFeedbackSeverity] = useState<FeedbackItem['severity']>('medium');
  const [isExecuting, setIsExecuting] = useState(false);

  // Sample execution plan
  useEffect(() => {
    const samplePlan: ExecutionPlan = {
      id: '1',
      name: 'Todo App Generation',
      description: 'Generate a complete Todo application from PAAM specification',
      status: 'running',
      createdAt: new Date('2024-01-17T10:00:00'),
      updatedAt: new Date('2024-01-17T10:15:00'),
      nodes: [
        {
          id: 'start',
          type: 'start',
          title: 'Start',
          description: 'Begin application generation',
          status: 'completed',
          position: { x: 400, y: 50 },
          connections: ['validate_paam']
        },
        {
          id: 'validate_paam',
          type: 'process',
          title: 'Validate PAAM',
          description: 'Validate PAAM specification against schema',
          status: 'completed',
          position: { x: 400, y: 150 },
          connections: ['generate_schema'],
          agent: 'conductor'
        },
        {
          id: 'generate_schema',
          type: 'process',
          title: 'Generate Database Schema',
          description: 'Generate Prisma schema from PAAM entities',
          status: 'completed',
          position: { x: 400, y: 250 },
          connections: ['generate_components'],
          agent: 'backend-agent'
        },
        {
          id: 'generate_components',
          type: 'process',
          title: 'Generate Components',
          description: 'Generate React components from PAAM UI config',
          status: 'running',
          position: { x: 400, y: 350 },
          connections: ['generate_pages'],
          agent: 'web-expert'
        },
        {
          id: 'generate_pages',
          type: 'process',
          title: 'Generate Pages',
          description: 'Generate Next.js pages from PAAM pages',
          status: 'pending',
          position: { x: 400, y: 450 },
          connections: ['generate_apis'],
          agent: 'web-expert'
        },
        {
          id: 'generate_apis',
          type: 'process',
          title: 'Generate APIs',
          description: 'Generate API endpoints from PAAM API config',
          status: 'pending',
          position: { x: 400, y: 550 },
          connections: ['end'],
          agent: 'backend-agent'
        },
        {
          id: 'end',
          type: 'end',
          title: 'Complete',
          description: 'Application generation complete',
          status: 'pending',
          position: { x: 400, y: 650 },
          connections: []
        }
      ],
      feedback: [
        {
          id: '1',
          nodeId: 'generate_components',
          type: 'improvement',
          severity: 'medium',
          description: 'Add TypeScript types for better type safety',
          suggestedFix: 'Generate comprehensive TypeScript types from PAAM field definitions',
          status: 'open',
          createdAt: new Date('2024-01-17T10:12:00'),
          updatedAt: new Date('2024-01-17T10:12:00'),
          userId: 'user1'
        },
        {
          id: '2',
          nodeId: 'validate_paam',
          type: 'bug',
          severity: 'high',
          description: 'Missing validation for required fields',
          suggestedFix: 'Add client-side validation for all required PAAM fields',
          status: 'in-progress',
          createdAt: new Date('2024-01-17T10:05:00'),
          updatedAt: new Date('2024-01-17T10:10:00'),
          userId: 'user1'
        }
      ],
      metrics: {
        totalNodes: 7,
        completedNodes: 3,
        errorNodes: 0,
        feedbackItems: 2,
        executionTime: 900000 // 15 minutes
      }
    };

    setPlans([samplePlan]);
    setSelectedPlan('1');
  }, []);

  const handleAddFeedback = () => {
    if (!selectedNode || !feedbackInput.trim()) return;

    const plan = plans.find(p => p.id === selectedPlan);
    if (!plan) return;

    const newFeedback: FeedbackItem = {
      id: Date.now().toString(),
      nodeId: selectedNode,
      type: feedbackType,
      severity: feedbackSeverity,
      description: feedbackInput,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'current-user'
    };

    setPlans(prev => prev.map(p => 
      p.id === selectedPlan 
        ? {
            ...p,
            feedback: [...p.feedback, newFeedback],
            updatedAt: new Date(),
            metrics: { ...p.metrics, feedbackItems: p.metrics.feedbackItems + 1 }
          }
        : p
    ));

    setFeedbackInput('');
  };

  const handleResolveFeedback = (feedbackId: string) => {
    setPlans(prev => prev.map(p => 
      p.id === selectedPlan 
        ? {
            ...p,
            feedback: p.feedback.map(f => 
              f.id === feedbackId 
                ? { ...f, status: 'resolved' as const, updatedAt: new Date() }
                : f
            )
          }
        : p
    ));
  };

  const handleExecutePlan = () => {
    setIsExecuting(true);
    
    // Simulate plan execution
    setTimeout(() => {
      setPlans(prev => prev.map(p => 
        p.id === selectedPlan 
          ? {
              ...p,
              status: 'completed' as const,
              nodes: p.nodes.map(n => ({
                ...n,
                status: 'completed' as const
              })),
              updatedAt: new Date(),
              metrics: {
                ...p.metrics,
                completedNodes: p.metrics.totalNodes,
                executionTime: p.metrics.executionTime + 300000
              }
            }
          : p
      ));
      setIsExecuting(false);
    }, 3000);
  };

  const getNodeColor = (status: PlanNode['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'error': return 'bg-red-500';
      case 'feedback': return 'bg-yellow-500';
      default: return 'bg-gray-300';
    }
  };

  const getNodeIcon = (type: PlanNode['type']) => {
    switch (type) {
      case 'start': return <Play className="h-4 w-4" />;
      case 'end': return <CheckCircle className="h-4 w-4" />;
      case 'decision': return <AlertTriangle className="h-4 w-4" />;
      default: return <GitBranch className="h-4 w-4" />;
    }
  };

  const getFeedbackColor = (type: FeedbackItem['type']) => {
    switch (type) {
      case 'bug': return 'destructive';
      case 'improvement': return 'default';
      case 'question': return 'secondary';
      case 'feature': return 'outline';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity: FeedbackItem['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const selectedPlanData = plans.find(p => p.id === selectedPlan);
  const selectedNodeData = selectedPlanData?.nodes.find(n => n.id === selectedNode);
  const nodeFeedback = selectedPlanData?.feedback.filter(f => f.nodeId === selectedNode);

  return (
    <div className="space-y-6">
      {/* Plan Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <GitBranch className="h-5 w-5 mr-2" />
              Execution Plans
            </span>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExecutePlan}
                disabled={isExecuting || !selectedPlan}
              >
                {isExecuting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                Execute Plan
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Manage and monitor execution plans with real-time feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Select value={selectedPlan || ''} onValueChange={setSelectedPlan}>
              <SelectTrigger className="w-80">
                <SelectValue placeholder="Select an execution plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} - {plan.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPlanData && (
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <span>Nodes: {selectedPlanData.metrics.completedNodes}/{selectedPlanData.metrics.totalNodes}</span>
                <span>Feedback: {selectedPlanData.metrics.feedbackItems}</span>
                <span>Time: {Math.round(selectedPlanData.metrics.executionTime / 60000)}min</span>
                <Badge variant={selectedPlanData.status === 'completed' ? 'default' : 'secondary'}>
                  {selectedPlanData.status}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Plan Visualization and Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plan Graph */}
        <div className="lg:col-span-2">
          <Card className="h-[600px]">
            <CardHeader>
              <CardTitle>Plan Graph</CardTitle>
              <CardDescription>
                Visual representation of the execution plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-full border rounded-lg bg-muted/20 overflow-hidden">
                {selectedPlanData && (
                  <svg className="w-full h-full">
                    {/* Connections */}
                    {selectedPlanData.nodes.map((node) => {
                      return node.connections.map((targetId) => {
                        const targetNode = selectedPlanData.nodes.find(n => n.id === targetId);
                        if (!targetNode) return null;
                        
                        return (
                          <line
                            key={`${node.id}-${targetId}`}
                            x1={node.position.x}
                            y1={node.position.y}
                            x2={targetNode.position.x}
                            y2={targetNode.position.y}
                            stroke="#e2e8f0"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                          />
                        );
                      });
                    })}
                    
                    {/* Arrow marker definition */}
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="9"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon
                          points="0 0, 10 3.5, 0 7"
                          fill="#e2e8f0"
                        />
                      </marker>
                    </defs>
                    
                    {/* Nodes */}
                    {selectedPlanData.nodes.map((node) => (
                      <g key={node.id}>
                        <circle
                          cx={node.position.x}
                          cy={node.position.y}
                          r="30"
                          className={`cursor-pointer ${getNodeColor(node.status)} ${
                            selectedNode === node.id ? 'ring-4 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedNode(node.id)}
                        />
                        <text
                          x={node.position.x}
                          y={node.position.y + 50}
                          textAnchor="middle"
                          className="text-xs font-medium fill-current"
                        >
                          {node.title}
                        </text>
                        {node.agent && (
                          <text
                            x={node.position.x}
                            y={node.position.y + 65}
                            textAnchor="middle"
                            className="text-xs fill-muted-foreground"
                          >
                            {node.agent}
                          </text>
                        )}
                      </g>
                    ))}
                  </svg>
                )}
                
                {!selectedPlanData && (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Select a plan to view the execution graph</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Panel */}
        <div className="space-y-6">
          {/* Node Details */}
          {selectedNodeData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <span>{selectedNodeData.title}</span>
                  <Badge variant={selectedNodeData.status === 'completed' ? 'default' : 'secondary'}>
                    {selectedNodeData.status}
                  </Badge>
                </CardTitle>
                <CardDescription>{selectedNodeData.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {selectedNodeData.agent && (
                    <div>
                      <span className="font-medium">Agent:</span> {selectedNodeData.agent}
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Type:</span> {selectedNodeData.type}
                  </div>
                  <div>
                    <span className="font-medium">Connections:</span> {selectedNodeData.connections.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feedback Input */}
          <Card>
            <CardHeader>
              <CardTitle>Add Feedback</CardTitle>
              <CardDescription>
                Provide feedback on the selected node
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={feedbackType} onValueChange={(value: FeedbackItem['type']) => setFeedbackType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="improvement">Improvement</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Severity</label>
                <Select value={feedbackSeverity} onValueChange={(value: FeedbackItem['severity']) => setFeedbackSeverity(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe your feedback..."
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleAddFeedback}
                disabled={!selectedNode || !feedbackInput.trim()}
                className="w-full"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Feedback
              </Button>
            </CardContent>
          </Card>

          {/* Node Feedback */}
          {nodeFeedback && nodeFeedback.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Node Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {nodeFeedback.map((feedback) => (
                      <div key={feedback.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getFeedbackColor(feedback.type)}>
                              {feedback.type}
                            </Badge>
                            <div className={`w-2 h-2 rounded-full ${getSeverityColor(feedback.severity)}`} />
                          </div>
                          <Badge variant={feedback.status === 'resolved' ? 'default' : 'secondary'}>
                            {feedback.status}
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{feedback.description}</p>
                        {feedback.suggestedFix && (
                          <div className="text-xs text-muted-foreground mb-2">
                            <strong>Suggested fix:</strong> {feedback.suggestedFix}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{feedback.createdAt.toLocaleString()}</span>
                          {feedback.status === 'open' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleResolveFeedback(feedback.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}