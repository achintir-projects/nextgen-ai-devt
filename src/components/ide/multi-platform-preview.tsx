/**
 * Multi-Platform Preview System
 * Advanced preview system for Web, Mobile, and API platforms with live updates
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Smartphone, 
  Server, 
  RefreshCw, 
  Play, 
  Square, 
  Settings,
  Maximize2,
  Minimize2,
  Monitor,
  Tablet,
  ExternalLink,
  Copy,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react';

interface PreviewConfig {
  platform: 'web' | 'mobile' | 'api';
  device?: 'desktop' | 'tablet' | 'phone';
  orientation?: 'portrait' | 'landscape';
  theme?: 'light' | 'dark';
  url?: string;
}

interface PreviewData {
  html: string;
  css: string;
  js: string;
  apiEndpoints: ApiEndpoint[];
  assets: string[];
}

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  response?: any;
  status: 'active' | 'inactive' | 'error';
}

interface MultiPlatformPreviewProps {
  projectId: string;
  compilationResult?: any;
  onRefresh?: () => void;
  onOpenInNewTab?: (platform: string) => void;
}

export default function MultiPlatformPreview({
  projectId,
  compilationResult,
  onRefresh,
  onOpenInNewTab
}: MultiPlatformPreviewProps) {
  const [activePlatform, setActivePlatform] = useState<'web' | 'mobile' | 'api'>('web');
  const [previewConfig, setPreviewConfig] = useState<PreviewConfig>({
    platform: 'web',
    device: 'desktop',
    orientation: 'landscape',
    theme: 'light'
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<'desktop' | 'tablet' | 'phone'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadPreviewData();
  }, [projectId, compilationResult]);

  const loadPreviewData = async () => {
    // Simulate loading preview data
    setIsRefreshing(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockPreviewData: PreviewData = {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PAAM E-commerce Platform</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 2rem; border-radius: 10px; margin-bottom: 2rem; }
        .products { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
        .product { background: white; border-radius: 10px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .product h3 { color: #333; margin-bottom: 1rem; }
        .product .price { color: #667eea; font-size: 1.5rem; font-weight: bold; }
        .btn { background: #667eea; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 5px; cursor: pointer; }
        .btn:hover { background: #5a6fd8; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>PAAM E-commerce Platform</h1>
            <p>Welcome to your AI-generated application</p>
        </div>
        
        <div class="products">
            <div class="product">
                <h3>Premium Widget</h3>
                <p>High-quality widget with advanced features</p>
                <div class="price">$29.99</div>
                <button class="btn">Add to Cart</button>
            </div>
            
            <div class="product">
                <h3>Standard Widget</h3>
                <p>Reliable widget for everyday use</p>
                <div class="price">$19.99</div>
                <button class="btn">Add to Cart</button>
            </div>
            
            <div class="product">
                <h3>Basic Widget</h3>
                <p>Simple and affordable widget</p>
                <div class="price">$9.99</div>
                <button class="btn">Add to Cart</button>
            </div>
        </div>
    </div>
    
    <script>
        console.log('PAAM Application loaded successfully');
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    alert('Product added to cart!');
                });
            });
        });
    </script>
</body>
</html>`,
      css: '',
      js: '',
      apiEndpoints: [
        {
          method: 'GET',
          path: '/api/products',
          description: 'Get all products',
          response: { products: [] },
          status: 'active'
        },
        {
          method: 'POST',
          path: '/api/orders',
          description: 'Create new order',
          response: { orderId: '123' },
          status: 'active'
        },
        {
          method: 'GET',
          path: '/api/users',
          description: 'Get user information',
          response: { user: {} },
          status: 'active'
        }
      ],
      assets: []
    };

    setPreviewData(mockPreviewData);
    setIsRefreshing(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadPreviewData();
    onRefresh?.();
  };

  const handleRun = () => {
    setIsRunning(true);
    // Simulate running the application
    setTimeout(() => {
      setIsRunning(false);
    }, 2000);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleDeviceChange = (device: 'desktop' | 'tablet' | 'phone') => {
    setSelectedDevice(device);
    setPreviewConfig(prev => ({ ...prev, device }));
  };

  const getDeviceDimensions = () => {
    switch (selectedDevice) {
      case 'desktop':
        return { width: '100%', height: '600px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      case 'phone':
        return { width: '375px', height: '667px' };
      default:
        return { width: '100%', height: '600px' };
    }
  };

  const getApiMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-600 bg-green-100';
      case 'POST': return 'text-blue-600 bg-blue-100';
      case 'PUT': return 'text-yellow-600 bg-yellow-100';
      case 'DELETE': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'inactive':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Multi-Platform Preview
              </h3>
              <p className="text-xs text-gray-500">Live preview across all platforms</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {previewData?.apiEndpoints.length || 0} APIs
            </Badge>
            <Badge variant="outline" className="text-xs">
              {isRunning ? 'Running' : 'Stopped'}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Platform Controls */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <Button
              variant={activePlatform === 'web' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePlatform('web')}
              className="h-8 px-3"
            >
              <Globe className="w-4 h-4 mr-1" />
              Web
            </Button>
            <Button
              variant={activePlatform === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePlatform('mobile')}
              className="h-8 px-3"
            >
              <Smartphone className="w-4 h-4 mr-1" />
              Mobile
            </Button>
            <Button
              variant={activePlatform === 'api' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActivePlatform('api')}
              className="h-8 px-3"
            >
              <Server className="w-4 h-4 mr-1" />
              API
            </Button>
          </div>

          {/* Device Selection (for mobile) */}
          {activePlatform === 'mobile' && (
            <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <Button
                variant={selectedDevice === 'phone' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleDeviceChange('phone')}
                className="h-8 w-8 p-0"
              >
                <Smartphone className="w-4 h-4" />
              </Button>
              <Button
                variant={selectedDevice === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleDeviceChange('tablet')}
                className="h-8 w-8 p-0"
              >
                <Tablet className="w-4 h-4" />
              </Button>
            </div>
          )}

          <div className="w-px h-6 bg-gray-300"></div>

          {/* Action Buttons */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-1" />
            )}
            Refresh
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
            >
              <Play className="w-4 h-4 mr-1" />
              Run
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenInNewTab?.(activePlatform)}
            className="h-8 w-8 p-0"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            title="Preview Settings"
            className="h-8 w-8 p-0"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4">
        {activePlatform === 'web' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">Web Preview</span>
                <Badge variant="outline" className="text-xs">
                  Desktop
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  Copy URL
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="flex-1 border rounded-lg overflow-hidden bg-white">
              {previewData ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={previewData.html}
                  className="w-full h-full border-0"
                  title="Web Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-gray-400" />
                    <p className="text-gray-500">Loading preview...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activePlatform === 'mobile' && (
          <div className="h-full flex items-center justify-center">
            <div className="relative">
              {/* Device Frame */}
              <div className="bg-black rounded-3xl p-2 shadow-2xl">
                <div className="relative overflow-hidden rounded-2xl" style={getDeviceDimensions()}>
                  {/* Status Bar */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-gray-900 flex items-center justify-between px-4 text-white text-xs z-10">
                    <span>9:41</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-3 bg-white rounded-sm"></div>
                      <div className="w-1 h-3 bg-white rounded-sm"></div>
                      <div className="w-6 h-3 bg-white rounded-sm"></div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="pt-6 h-full bg-white overflow-hidden">
                    {previewData ? (
                      <iframe
                        ref={iframeRef}
                        srcDoc={previewData.html}
                        className="w-full h-full border-0"
                        title="Mobile Preview"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin text-gray-400" />
                          <p className="text-gray-500">Loading preview...</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Device Label */}
              <div className="absolute -bottom-8 left-0 right-0 text-center">
                <span className="text-sm text-gray-500 capitalize">{selectedDevice}</span>
              </div>
            </div>
          </div>
        )}

        {activePlatform === 'api' && (
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">API Explorer</span>
                <Badge variant="outline" className="text-xs">
                  {previewData?.apiEndpoints.length || 0} endpoints
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Base URL
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export Spec
                </Button>
              </div>
            </div>
            
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* API Endpoints List */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Available Endpoints
                </h4>
                
                {previewData?.apiEndpoints.map((endpoint, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getApiMethodColor(endpoint.method)}`}>
                            {endpoint.method}
                          </Badge>
                          <span className="text-sm font-mono">{endpoint.path}</span>
                        </div>
                        {getStatusIcon(endpoint.status)}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {endpoint.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* API Testing Console */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  API Console
                </h4>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500">Method</label>
                        <select className="w-full mt-1 p-2 border rounded text-sm">
                          <option>GET</option>
                          <option>POST</option>
                          <option>PUT</option>
                          <option>DELETE</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Endpoint</label>
                        <input
                          type="text"
                          placeholder="/api/products"
                          className="w-full mt-1 p-2 border rounded text-sm font-mono"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Headers</label>
                        <textarea
                          placeholder="Content-Type: application/json"
                          className="w-full mt-1 p-2 border rounded text-sm font-mono h-16"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-500">Body</label>
                        <textarea
                          placeholder='{"key": "value"}'
                          className="w-full mt-1 p-2 border rounded text-sm font-mono h-24"
                        />
                      </div>
                      
                      <Button className="w-full">
                        <Play className="w-4 h-4 mr-1" />
                        Send Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}