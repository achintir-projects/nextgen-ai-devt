/**
 * PAAM Specification Designer
 * ReactFlow-based visual specification designer for PAAM entities, relationships, and workflows
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  MarkerType,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Save, 
  Play, 
  Settings, 
  Database, 
  GitBranch, 
  Shield, 
  Users,
  FileText,
  Trash2,
  Edit,
  Copy,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

interface PAAMEntity {
  id: string;
  name: string;
  fields: PAAMField[];
  description?: string;
}

interface PAAMField {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  validation?: string;
}

interface PAAMWorkflow {
  id: string;
  name: string;
  steps: PAAMStep[];
  description?: string;
}

interface PAAMStep {
  id: string;
  name: string;
  type: 'validation' | 'persistence' | 'payment' | 'notification' | 'integration';
  config: Record<string, any>;
}

interface PAAMCompliance {
  frameworks: string[];
  level: 'strict' | 'moderate' | 'basic';
}

interface PAAMSpec {
  name: string;
  version: string;
  entities: PAAMEntity[];
  workflows: PAAMWorkflow[];
  compliance: PAAMCompliance;
}

// Custom node types
const EntityNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-blue-500 rounded-lg p-4 min-w-[200px] shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-blue-500" />
          <h3 className="font-semibold text-sm">{data.name}</h3>
        </div>
        <Badge variant="outline" className="text-xs">Entity</Badge>
      </div>
      <div className="space-y-1">
        {data.fields?.slice(0, 3).map((field: any, index: number) => (
          <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
            <span className="font-medium">{field.name}</span>: {field.type}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </div>
        ))}
        {data.fields?.length > 3 && (
          <div className="text-xs text-gray-500">+{data.fields.length - 3} more fields</div>
        )}
      </div>
    </div>
  );
};

const WorkflowNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-green-500 rounded-lg p-4 min-w-[200px] shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <GitBranch className="w-4 h-4 text-green-500" />
          <h3 className="font-semibold text-sm">{data.name}</h3>
        </div>
        <Badge variant="outline" className="text-xs">Workflow</Badge>
      </div>
      <div className="space-y-1">
        {data.steps?.slice(0, 2).map((step: any, index: number) => (
          <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
            {index + 1}. {step.name} ({step.type})
          </div>
        ))}
        {data.steps?.length > 2 && (
          <div className="text-xs text-gray-500">+{data.steps.length - 2} more steps</div>
        )}
      </div>
    </div>
  );
};

const ComplianceNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-2 border-purple-500 rounded-lg p-4 min-w-[200px] shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-purple-500" />
          <h3 className="font-semibold text-sm">Compliance</h3>
        </div>
        <Badge variant="outline" className="text-xs">{data.level}</Badge>
      </div>
      <div className="space-y-1">
        {data.frameworks?.map((framework: string, index: number) => (
          <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
            • {framework}
          </div>
        ))}
      </div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  entity: EntityNode,
  workflow: WorkflowNode,
  compliance: ComplianceNode,
};

interface SpecDesignerProps {
  spec?: PAAMSpec;
  onSpecChange?: (spec: PAAMSpec) => void;
  onSave?: () => void;
  onRun?: () => void;
}

export default function SpecDesigner({ 
  spec, 
  onSpecChange, 
  onSave, 
  onRun 
}: SpecDesignerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSpec, setCurrentSpec] = useState<PAAMSpec>(spec || {
    name: 'New PAAM Specification',
    version: '1.0.0',
    entities: [],
    workflows: [],
    compliance: {
      frameworks: ['gdpr'],
      level: 'moderate'
    }
  });

  useEffect(() => {
    if (spec) {
      setCurrentSpec(spec);
      generateNodesFromSpec(spec);
    }
  }, [spec]);

  const generateNodesFromSpec = (specData: PAAMSpec) => {
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    let yPos = 50;
    
    // Add entity nodes
    specData.entities.forEach((entity, index) => {
      newNodes.push({
        id: `entity-${entity.id}`,
        type: 'entity',
        position: { x: 50, y: yPos },
        data: {
          name: entity.name,
          fields: entity.fields,
          description: entity.description
        }
      });
      yPos += 150;
    });
    
    // Add workflow nodes
    yPos = 50;
    specData.workflows.forEach((workflow, index) => {
      newNodes.push({
        id: `workflow-${workflow.id}`,
        type: 'workflow',
        position: { x: 400, y: yPos },
        data: {
          name: workflow.name,
          steps: workflow.steps,
          description: workflow.description
        }
      });
      yPos += 150;
    });
    
    // Add compliance node
    newNodes.push({
      id: 'compliance',
      type: 'compliance',
      position: { x: 750, y: 50 },
      data: {
        frameworks: specData.compliance.frameworks,
        level: specData.compliance.level
      }
    });
    
    // Add some example edges
    if (specData.entities.length > 0 && specData.workflows.length > 0) {
      newEdges.push({
        id: 'entity-workflow-1',
        source: `entity-${specData.entities[0].id}`,
        target: `workflow-${specData.workflows[0].id}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#3b82f6' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#3b82f6'
        }
      });
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addEntity = () => {
    const newEntity: PAAMEntity = {
      id: `entity_${Date.now()}`,
      name: 'New Entity',
      fields: [
        { name: 'id', type: 'UUID', required: true },
        { name: 'name', type: 'String', required: true }
      ]
    };
    
    const updatedSpec = {
      ...currentSpec,
      entities: [...currentSpec.entities, newEntity]
    };
    
    setCurrentSpec(updatedSpec);
    onSpecChange?.(updatedSpec);
    generateNodesFromSpec(updatedSpec);
  };

  const addWorkflow = () => {
    const newWorkflow: PAAMWorkflow = {
      id: `workflow_${Date.now()}`,
      name: 'New Workflow',
      steps: [
        { id: 'step1', name: 'Validation Step', type: 'validation', config: {} }
      ]
    };
    
    const updatedSpec = {
      ...currentSpec,
      workflows: [...currentSpec.workflows, newWorkflow]
    };
    
    setCurrentSpec(updatedSpec);
    onSpecChange?.(updatedSpec);
    generateNodesFromSpec(updatedSpec);
  };

  const handleSave = () => {
    onSave?.();
  };

  const handleRun = () => {
    onRun?.();
  };

  const exportSpec = () => {
    const specYAML = generateYAMLFromSpec(currentSpec);
    const blob = new Blob([specYAML], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentSpec.name.toLowerCase().replace(/\s+/g, '_')}.paam`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateYAMLFromSpec = (specData: PAAMSpec): string => {
    let yaml = `# PAAM Specification\nname: ${specData.name}\nversion: ${specData.version}\n\n`;
    
    if (specData.entities.length > 0) {
      yaml += 'entities:\n';
      specData.entities.forEach(entity => {
        yaml += `  - name: ${entity.name}\n`;
        yaml += '    fields:\n';
        entity.fields.forEach(field => {
          yaml += `      - name: ${field.name}\n`;
          yaml += `        type: ${field.type}\n`;
          yaml += `        required: ${field.required}\n`;
          if (field.defaultValue) {
            yaml += `        default: ${field.defaultValue}\n`;
          }
        });
      });
      yaml += '\n';
    }
    
    if (specData.workflows.length > 0) {
      yaml += 'workflows:\n';
      specData.workflows.forEach(workflow => {
        yaml += `  - name: ${workflow.name}\n`;
        yaml += '    steps:\n';
        workflow.steps.forEach(step => {
          yaml += `      - name: ${step.name}\n`;
          yaml += `        type: ${step.type}\n`;
        });
      });
      yaml += '\n';
    }
    
    yaml += 'compliance:\n';
    yaml += '  frameworks:\n';
    specData.compliance.frameworks.forEach(framework => {
      yaml += `    - ${framework}\n`;
    });
    yaml += `  level: ${specData.compliance.level}\n`;
    
    return yaml;
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-5 h-5 text-purple-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                PAAM Specification Designer
              </h3>
              <p className="text-xs text-gray-500">{currentSpec.name} v{currentSpec.version}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {currentSpec.entities.length} entities
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currentSpec.workflows.length} workflows
            </Badge>
            <Badge variant="outline" className="text-xs">
              {currentSpec.compliance.frameworks.length} frameworks
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Add Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={addEntity}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Entity
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={addWorkflow}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Workflow
          </Button>
          
          <div className="w-px h-6 bg-gray-300"></div>
          
          {/* Export Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={exportSpec}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          
          {/* Save & Run */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          
          <Button
            size="sm"
            onClick={handleRun}
          >
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            title="Settings"
            className="h-8 w-8 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Canvas Area */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="top-right"
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Properties
              </h4>
              
              {selectedNode ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center justify-between">
                      {selectedNode.data.name}
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500">Type</label>
                        <div className="text-sm">{selectedNode.type}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">ID</label>
                        <div className="text-sm font-mono">{selectedNode.id}</div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Position</label>
                        <div className="text-sm">
                          ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center text-gray-500">
                      <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Select a node to view properties</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Spec
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Validate
                </Button>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                Specification Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Entities:</span>
                  <span>{currentSpec.entities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Workflows:</span>
                  <span>{currentSpec.workflows.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Compliance:</span>
                  <span>{currentSpec.compliance.frameworks.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Level:</span>
                  <span className="capitalize">{currentSpec.compliance.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}