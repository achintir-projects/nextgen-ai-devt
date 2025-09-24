'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Code, 
  Copy, 
  Download, 
  Eye, 
  FileText, 
  FolderOpen,
  File,
  Database,
  Server,
  Globe,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

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

interface CodeEditorProps {
  files: CodeFile[];
  selectedFile?: CodeFile;
  onFileSelect?: (file: CodeFile) => void;
  onFileChange?: (fileId: string, content: string) => void;
  readOnly?: boolean;
}

export default function CodeEditor({ 
  files, 
  selectedFile, 
  onFileSelect, 
  onFileChange, 
  readOnly = false 
}: CodeEditorProps) {
  const [activeTab, setActiveTab] = useState('editor');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save with debounce
  useEffect(() => {
    if (!selectedFile || readOnly) return;
    
    const timer = setTimeout(() => {
      if (editedContent !== selectedFile.content) {
        handleSaveContent();
      }
    }, 2000); // 2 second debounce

    return () => clearTimeout(timer);
  }, [editedContent, selectedFile, readOnly]);

  useEffect(() => {
    if (selectedFile) {
      setEditedContent(selectedFile.content);
    }
  }, [selectedFile]);

  const handleSaveContent = useCallback(() => {
    if (!selectedFile || readOnly || editedContent === selectedFile.content) return;
    
    setIsSaving(true);
    
    // Simulate save operation
    setTimeout(() => {
      onFileChange?.(selectedFile.id, editedContent);
      setIsSaving(false);
      setLastSaved(new Date());
    }, 500);
  }, [selectedFile, editedContent, readOnly, onFileChange]);

  const getLanguageIcon = (language: string) => {
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'javascript':
        return <Code className="w-4 h-4 text-yellow-500" />;
      case 'sql':
        return <Database className="w-4 h-4 text-blue-500" />;
      case 'json':
        return <Settings className="w-4 h-4 text-green-500" />;
      case 'css':
      case 'scss':
        return <Globe className="w-4 h-4 text-pink-500" />;
      case 'prisma':
        return <Database className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const applySyntaxHighlighting = (content: string, language: string) => {
    if (!content) return '';
    
    const escaped = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'javascript':
        return escaped
          .replace(/\b(import|export|from|const|let|var|function|return|async|await|class|interface|type|extends|implements)\b/g, '<span class="text-purple-600 font-medium">$1</span>')
          .replace(/\b(string|number|boolean|void|any|unknown|never)\b/g, '<span class="text-green-600">$1</span>')
          .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="text-orange-600">$1</span>')
          .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>')
          .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500">$1</span>');
      
      case 'prisma':
        return escaped
          .replace(/\b(model|generator|datasource)\b/g, '<span class="text-blue-600 font-medium">$1</span>')
          .replace(/\b(String|Int|Boolean|DateTime|Json)\b/g, '<span class="text-green-600">$1</span>')
          .replace(/\b(@id|@default|@unique|@updatedAt)\b/g, '<span class="text-purple-600">$1</span>')
          .replace(/(\/\/.*$)/gm, '<span class="text-gray-500">$1</span>');
      
      case 'json':
        return escaped
          .replace(/(".*?")\s*:/g, '<span class="text-blue-600">$1</span>:')
          .replace(/:\s*(".*?"|'.*?'|\d+)/g, ': <span class="text-green-600">$1</span>');
      
      default:
        return escaped;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'component':
        return <Eye className="w-4 h-4 text-purple-500" />;
      case 'page':
        return <Globe className="w-4 h-4 text-blue-500" />;
      case 'api':
        return <Server className="w-4 h-4 text-green-500" />;
      case 'model':
        return <Database className="w-4 h-4 text-orange-500" />;
      case 'config':
        return <Settings className="w-4 h-4 text-gray-500" />;
      case 'util':
        return <Code className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleCopyCode = () => {
    if (selectedFile) {
      navigator.clipboard.writeText(selectedFile.content);
    }
  };

  const handleDownloadCode = () => {
    if (selectedFile) {
      const blob = new Blob([selectedFile.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = selectedFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.type]) {
      acc[file.type] = [];
    }
    acc[file.type].push(file);
    return acc;
  }, {} as Record<string, CodeFile[]>);

  return (
    <div className={`h-full bg-white dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle className="text-sm">Code Editor</CardTitle>
              {selectedFile && (
                <div className="flex items-center space-x-2">
                  {getLanguageIcon(selectedFile.language)}
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedFile.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {selectedFile.language}
                  </Badge>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="h-8 w-8 p-0"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="explorer" className="text-xs">Explorer</TabsTrigger>
              <TabsTrigger value="editor" className="text-xs">Editor</TabsTrigger>
              <TabsTrigger value="preview" className="text-xs">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="explorer" className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-3">
                  {Object.entries(groupedFiles).map(([type, typeFiles]) => (
                    <div key={type}>
                      <div className="flex items-center space-x-2 mb-2">
                        {getTypeIcon(type)}
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                          {type}s
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {typeFiles.length}
                        </Badge>
                      </div>
                      <div className="space-y-1 ml-6">
                        {typeFiles.map((file) => (
                          <div
                            key={file.id}
                            className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                              selectedFile?.id === file.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                            }`}
                            onClick={() => onFileSelect?.(file)}
                          >
                            <div className="flex items-center space-x-2">
                              {getLanguageIcon(file.language)}
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="editor" className="flex-1 p-0">
              {selectedFile ? (
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-2 border-b">
                    <div className="flex items-center space-x-2">
                      {getLanguageIcon(selectedFile.language)}
                      <span className="text-sm font-medium">{selectedFile.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {selectedFile.language}
                      </Badge>
                      {isSaving && (
                        <Badge variant="outline" className="text-xs text-blue-600">
                          Saving...
                        </Badge>
                      )}
                      {lastSaved && !isSaving && (
                        <span className="text-xs text-gray-500">
                          Saved {lastSaved.toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyCode}
                        className="h-8 w-8 p-0"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDownloadCode}
                        className="h-8 w-8 p-0"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-4">
                      {readOnly ? (
                        <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                          <code 
                            dangerouslySetInnerHTML={{
                              __html: applySyntaxHighlighting(editedContent, selectedFile.language)
                            }}
                            className="font-mono text-sm leading-relaxed"
                          />
                        </pre>
                      ) : (
                        <div className="relative">
                          <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full h-96 p-4 font-mono text-sm bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            spellCheck="false"
                            placeholder="Start typing your code here..."
                          />
                          <div className="absolute top-2 right-2 text-xs text-gray-500">
                            {editedContent.split('\n').length} lines
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a file to view its code</p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="preview" className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {selectedFile ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">{selectedFile.name}</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Type:</span>
                            <span className="ml-2 capitalize">{selectedFile.type}</span>
                          </div>
                          <div>
                            <span className="font-medium">Language:</span>
                            <span className="ml-2">{selectedFile.language}</span>
                          </div>
                          <div>
                            <span className="font-medium">Size:</span>
                            <span className="ml-2">{formatFileSize(selectedFile.size)}</span>
                          </div>
                          <div>
                            <span className="font-medium">Modified:</span>
                            <span className="ml-2">{selectedFile.lastModified.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">File Information</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            This {selectedFile.type} file contains {selectedFile.content.split('\n').length} lines of code.
                            The file is written in {selectedFile.language} and follows standard coding practices.
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Dependencies</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">React</Badge>
                          <Badge variant="outline" className="text-xs">Next.js</Badge>
                          <Badge variant="outline" className="text-xs">TypeScript</Badge>
                          {selectedFile.language === 'css' && (
                            <Badge variant="outline" className="text-xs">Tailwind CSS</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Select a file to preview its information</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}