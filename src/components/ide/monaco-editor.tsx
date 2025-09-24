/**
 * Monaco Editor Component
 * Advanced code editor with syntax highlighting, intellisense, and PAAM integration
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Play, 
  RefreshCw, 
  Settings, 
  Copy, 
  Download,
  Search,
  Replace,
  FileText,
  Code,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-gray-400" />
        <p className="text-gray-500">Loading editor...</p>
      </div>
    </div>
  )
});

interface EditorFile {
  id: string;
  name: string;
  path: string;
  language: string;
  content: string;
  type: 'source' | 'spec' | 'config' | 'test';
  readOnly?: boolean;
}

interface MonacoEditorComponentProps {
  file: EditorFile | null;
  onFileChange?: (fileId: string, content: string) => void;
  onSave?: (fileId: string) => void;
  onRun?: (fileId: string) => void;
  theme?: 'vs-dark' | 'light';
  readOnly?: boolean;
}

export default function MonacoEditorComponent({
  file,
  onFileChange,
  onSave,
  onRun,
  theme = 'vs-dark',
  readOnly = false
}: MonacoEditorComponentProps) {
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (file) {
      setContent(file.content);
      setIsDirty(false);
    }
  }, [file]);

  const handleEditorChange = (value: string | undefined) => {
    const newContent = value || '';
    setContent(newContent);
    setIsDirty(newContent !== file?.content);
    onFileChange?.(file?.id || '', newContent);
  };

  const handleSave = async () => {
    if (!file || !isDirty) return;

    setIsSaving(true);
    
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSave?.(file.id);
    setIsDirty(false);
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const handleRun = () => {
    if (file) {
      onRun?.(file.id);
    }
  };

  const handleCopyCode = () => {
    if (content) {
      navigator.clipboard.writeText(content);
    }
  };

  const handleDownloadCode = () => {
    if (content && file) {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const formatContent = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  };

  const getLanguageMonaco = (language: string): string => {
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'ts':
        return 'typescript';
      case 'javascript':
      case 'js':
        return 'javascript';
      case 'json':
        return 'json';
      case 'python':
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'sql':
        return 'sql';
      case 'markdown':
      case 'md':
        return 'markdown';
      case 'xml':
        return 'xml';
      case 'yaml':
      case 'yml':
        return 'yaml';
      case 'paam':
        return 'yaml'; // PAAM uses YAML-like syntax
      default:
        return 'plaintext';
    }
  };

  const editorOptions = {
    fontSize: 14,
    lineHeight: 1.6,
    fontFamily: 'JetBrains Mono, Fira Code, Monaco, Consolas, monospace',
    minimap: {
      enabled: showMiniMap
    },
    lineNumbers: showLineNumbers ? 'on' : 'off',
    wordWrap: wordWrap ? 'on' : 'off',
    scrollBeyondLastLine: false,
    automaticLayout: true,
    readOnly: readOnly || file?.readOnly,
    renderWhitespace: 'boundary',
    renderControlCharacters: false,
    renderIndentGuides: true,
    cursorBlinking: 'blink',
    cursorSmoothCaretAnimation: true,
    smoothScrolling: true,
    contextmenu: true,
    mouseWheelZoom: true,
    multiCursorModifier: 'ctrlCmd',
    accessibilitySupport: 'auto'
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {file?.type === 'spec' ? (
              <FileText className="w-4 h-4 text-purple-500" />
            ) : (
              <Code className="w-4 h-4 text-blue-500" />
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {file?.name || 'No file selected'}
              </h3>
              {file?.path && (
                <p className="text-xs text-gray-500">{file.path}</p>
              )}
            </div>
          </div>
          
          {file && (
            <Badge variant="outline" className="text-xs">
              {file.language}
            </Badge>
          )}

          {isDirty && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Unsaved</span>
            </div>
          )}

          {isSaving && (
            <div className="flex items-center space-x-1">
              <RefreshCw className="w-3 h-3 animate-spin text-blue-500" />
              <span className="text-xs text-blue-500">Saving...</span>
            </div>
          )}

          {lastSaved && !isSaving && (
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gray-500">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Editor Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={formatContent}
            title="Format Code"
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            title="Copy Code"
            className="h-8 w-8 p-0"
          >
            <Copy className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownloadCode}
            title="Download File"
            className="h-8 w-8 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300"></div>

          {/* File Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || isSaving || !file}
            className="h-8 px-3"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1" />
            )}
            Save
          </Button>

          {file?.type === 'source' && (
            <Button
              size="sm"
              onClick={handleRun}
              className="h-8 px-3"
            >
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            title="Editor Settings"
            className="h-8 w-8 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        {file ? (
          <MonacoEditor
            height="100%"
            language={getLanguageMonaco(file.language)}
            theme={theme}
            value={content}
            onChange={handleEditorChange}
            options={editorOptions}
            onMount={(editor) => {
              editorRef.current = editor;
              
              // Add custom commands
              editor.addCommand(
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                () => {
                  handleSave();
                }
              );

              // Add PAAM-specific intellisense for .paam files
              if (file.language === 'paam') {
                monaco.languages.registerCompletionItemProvider('yaml', {
                  provideCompletionItems: (model, position) => {
                    const wordUntil = model.getWordUntilPosition(position);
                    const range = {
                      startLineNumber: position.lineNumber,
                      endLineNumber: position.lineNumber,
                      startColumn: wordUntil.startColumn,
                      endColumn: wordUntil.endColumn
                    };

                    return {
                      suggestions: [
                        {
                          label: 'entities',
                          kind: monaco.languages.CompletionItemKind.Snippet,
                          insertText: 'entities:\\n  - name: ${1:EntityName}\\n    fields:\\n      - name: ${2:fieldName}\\n        type: ${3:String}\\n        required: ${4:true}',
                          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          documentation: 'Define entities with fields',
                          range: range
                        },
                        {
                          label: 'workflows',
                          kind: monaco.languages.CompletionItemKind.Snippet,
                          insertText: 'workflows:\\n  - name: ${1:WorkflowName}\\n    steps:\\n      - name: ${2:StepName}\\n        type: ${3:validation}',
                          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          documentation: 'Define workflows with steps',
                          range: range
                        },
                        {
                          label: 'compliance',
                          kind: monaco.languages.CompletionItemKind.Snippet,
                          insertText: 'compliance:\\n  frameworks:\\n    - gdpr\\n    - pci-dss\\n  level: ${1:strict}',
                          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                          documentation: 'Define compliance requirements',
                          range: range
                        }
                      ]
                    };
                  }
                });
              }
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No file selected
              </h3>
              <p className="text-gray-500">
                Select a file from the file explorer to start editing
              </p>
            </div>
          </div>
        )}

        {/* Status Bar */}
        {file && (
          <div className="absolute bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-3 py-1">
            <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Line 1, Column 1</span>
                <span>{content.split('\n').length} lines</span>
                <span>{content.length} characters</span>
                <span>{file.language}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span>UTF-8</span>
                <span>LF</span>
                <span>
                  {readOnly ? 'Read-only' : 'Editable'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}