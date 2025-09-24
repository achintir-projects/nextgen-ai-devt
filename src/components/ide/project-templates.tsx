/**
 * Project Templates System
 * Comprehensive template library for quickly starting new projects with predefined structures and configurations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Rocket, 
  Database, 
  Globe, 
  Smartphone, 
  Server, 
  ShoppingCart, 
  Users, 
  FileText,
  Code,
  Zap,
  Shield,
  Heart,
  Gamepad2,
  Music,
  GraduationCap,
  Briefcase,
  Filter,
  Search,
  Star,
  Download,
  Eye,
  Copy,
  Settings,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Layers,
  GitBranch,
  Cloud,
  Api
} from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  tags: string[];
  popularity: number;
  isFeatured: boolean;
  isOfficial: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  platforms: string[];
  frameworks: string[];
  dependencies: string[];
  features: string[];
  lastUpdated: Date;
  author: {
    name: string;
    avatar?: string;
    isVerified: boolean;
  };
  stats: {
    downloads: number;
    stars: number;
    forks: number;
    projects: number;
  };
  preview?: {
    image?: string;
    demoUrl?: string;
  };
  configuration?: {
    database?: string;
    auth?: string;
    deployment?: string;
    testing?: string;
  };
}

interface ProjectTemplatesProps {
  projectId?: string;
  onTemplateSelect?: (template: Template) => void;
  onTemplatePreview?: (template: Template) => void;
  onTemplateCreate?: (template: Template, config: any) => void;
}

export default function ProjectTemplates({
  projectId,
  onTemplateSelect,
  onTemplatePreview,
  onTemplateCreate
}: ProjectTemplatesProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'recent' | 'name'>('popularity');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showOfficialOnly, setShowOfficialOnly] = useState(false);

  useEffect(() => {
    initializeTemplates();
  }, []);

  useEffect(() => {
    filterAndSortTemplates();
  }, [templates, searchQuery, selectedCategory, selectedDifficulty, sortBy, showFeaturedOnly, showOfficialOnly]);

  const initializeTemplates = () => {
    const mockTemplates: Template[] = [
      {
        id: 'ecommerce-starter',
        name: 'E-commerce Starter',
        description: 'Complete e-commerce platform with shopping cart, payment integration, and inventory management',
        category: 'Business',
        icon: <ShoppingCart className="w-8 h-8 text-blue-500" />,
        tags: ['React', 'Node.js', 'Payment', 'Inventory', 'Authentication'],
        popularity: 95,
        isFeatured: true,
        isOfficial: true,
        difficulty: 'intermediate',
        estimatedTime: '2-3 hours',
        platforms: ['Web', 'Mobile', 'API'],
        frameworks: ['React', 'Next.js', 'Express', 'PostgreSQL'],
        dependencies: ['stripe', 'jsonwebtoken', 'bcrypt', 'prisma'],
        features: [
          'User authentication & authorization',
          'Product catalog with search & filters',
          'Shopping cart & checkout process',
          'Payment processing with Stripe',
          'Order management & tracking',
          'Inventory management',
          'Admin dashboard',
          'Email notifications'
        ],
        lastUpdated: new Date('2024-01-10'),
        author: {
          name: 'PAAM Team',
          isVerified: true
        },
        stats: {
          downloads: 15420,
          stars: 892,
          forks: 156,
          projects: 3420
        },
        configuration: {
          database: 'PostgreSQL',
          auth: 'JWT',
          deployment: 'Vercel',
          testing: 'Jest'
        }
      },
      {
        id: 'blog-platform',
        name: 'Blog Platform',
        description: 'Modern blog platform with CMS, SEO optimization, and markdown support',
        category: 'Content',
        icon: <FileText className="w-8 h-8 text-green-500" />,
        tags: ['React', 'Markdown', 'SEO', 'CMS', 'Analytics'],
        popularity: 88,
        isFeatured: true,
        isOfficial: true,
        difficulty: 'beginner',
        estimatedTime: '1-2 hours',
        platforms: ['Web'],
        frameworks: ['React', 'Next.js', 'Tailwind CSS'],
        dependencies: ['gray-matter', 'remark', 'next-seo'],
        features: [
          'Markdown-based content management',
          'SEO optimization & meta tags',
          'Category & tag organization',
          'Search functionality',
          'Comment system',
          'Newsletter subscription',
          'Analytics integration',
          'RSS feed generation'
        ],
        lastUpdated: new Date('2024-01-08'),
        author: {
          name: 'PAAM Team',
          isVerified: true
        },
        stats: {
          downloads: 12350,
          stars: 654,
          forks: 89,
          projects: 2890
        }
      },
      {
        id: 'saas-starter',
        name: 'SaaS Starter',
        description: 'Complete SaaS application with authentication, billing, and multi-tenancy',
        category: 'Business',
        icon: <Briefcase className="w-8 h-8 text-purple-500" />,
        tags: ['React', 'Node.js', 'SaaS', 'Billing', 'Multi-tenancy'],
        popularity: 92,
        isFeatured: true,
        isOfficial: true,
        difficulty: 'advanced',
        estimatedTime: '4-6 hours',
        platforms: ['Web', 'API'],
        frameworks: ['React', 'Next.js', 'Express', 'PostgreSQL'],
        dependencies: ['stripe', 'jsonwebtoken', 'prisma', 'nodemailer'],
        features: [
          'Multi-tenant architecture',
          'Subscription billing with Stripe',
          'User authentication & roles',
          'Team management',
          'Usage analytics & reporting',
          'API rate limiting',
          'Audit logging',
          'Data export & backup'
        ],
        lastUpdated: new Date('2024-01-12'),
        author: {
          name: 'PAAM Team',
          isVerified: true
        },
        stats: {
          downloads: 9870,
          stars: 756,
          forks: 134,
          projects: 2150
        },
        configuration: {
          database: 'PostgreSQL',
          auth: 'JWT',
          deployment: 'AWS',
          testing: 'Jest & Cypress'
        }
      },
      {
        id: 'mobile-app-template',
        name: 'Mobile App Template',
        description: 'Cross-platform mobile app template with navigation and UI components',
        category: 'Mobile',
        icon: <Smartphone className="w-8 h-8 text-orange-500" />,
        tags: ['React Native', 'Navigation', 'UI Kit', 'Mobile'],
        popularity: 85,
        isFeatured: false,
        isOfficial: true,
        difficulty: 'intermediate',
        estimatedTime: '2-3 hours',
        platforms: ['Mobile'],
        frameworks: ['React Native', 'Expo'],
        dependencies: ['react-navigation', 'react-native-paper'],
        features: [
          'Cross-platform compatibility',
          'Navigation & routing',
          'UI component library',
          'State management',
          'API integration',
          'Push notifications',
          'Offline support',
          'Device features integration'
        ],
        lastUpdated: new Date('2024-01-05'),
        author: {
          name: 'PAAM Team',
          isVerified: true
        },
        stats: {
          downloads: 8760,
          stars: 445,
          forks: 78,
          projects: 1920
        }
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        description: 'Microservices API gateway with rate limiting and authentication',
        category: 'Backend',
        icon: <Server className="w-8 h-8 text-red-500" />,
        tags: ['Node.js', 'API', 'Microservices', 'Authentication'],
        popularity: 78,
        isFeatured: false,
        isOfficial: false,
        difficulty: 'advanced',
        estimatedTime: '3-4 hours',
        platforms: ['API'],
        frameworks: ['Node.js', 'Express', 'Redis'],
        dependencies: ['express-rate-limit', 'jsonwebtoken', 'helmet'],
        features: [
          'API rate limiting',
          'Request authentication',
          'CORS configuration',
          'Request logging',
          'Error handling',
          'Service discovery',
          'Load balancing',
          'Health checks'
        ],
        lastUpdated: new Date('2024-01-03'),
        author: {
          name: 'John Doe',
          isVerified: false
        },
        stats: {
          downloads: 6540,
          stars: 234,
          forks: 45,
          projects: 890
        },
        configuration: {
          deployment: 'Docker',
          testing: 'Mocha'
        }
      },
      {
        id: 'social-media-app',
        name: 'Social Media App',
        description: 'Social media platform with real-time messaging and content sharing',
        category: 'Social',
        icon: <Users className="w-8 h-8 text-pink-500" />,
        tags: ['React', 'Socket.io', 'Real-time', 'Social'],
        popularity: 90,
        isFeatured: true,
        isOfficial: false,
        difficulty: 'advanced',
        estimatedTime: '5-7 hours',
        platforms: ['Web', 'Mobile'],
        frameworks: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
        dependencies: ['socket.io', 'multer', 'cloudinary'],
        features: [
          'User profiles & authentication',
          'Real-time messaging',
          'Post creation & sharing',
          'Like & comment system',
          'News feed algorithm',
          'File upload & storage',
          'Push notifications',
          'Privacy settings'
        ],
        lastUpdated: new Date('2024-01-11'),
        author: {
          name: 'Jane Smith',
          isVerified: true
        },
        stats: {
          downloads: 11200,
          stars: 567,
          forks: 123,
          projects: 2450
        }
      }
    ];

    setTemplates(mockTemplates);
  };

  const filterAndSortTemplates = () => {
    let filtered = templates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
      const matchesFeatured = !showFeaturedOnly || template.isFeatured;
      const matchesOfficial = !showOfficialOnly || template.isOfficial;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesFeatured && matchesOfficial;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

    setFilteredTemplates(filtered);
  };

  const categories = [
    'all', 'Business', 'Content', 'Mobile', 'Backend', 'Social', 'Education', 'E-commerce'
  ];

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Business': return <Briefcase className="w-4 h-4" />;
      case 'Content': return <FileText className="w-4 h-4" />;
      case 'Mobile': return <Smartphone className="w-4 h-4" />;
      case 'Backend': return <Server className="w-4 h-4" />;
      case 'Social': return <Users className="w-4 h-4" />;
      case 'Education': return <GraduationCap className="w-4 h-4" />;
      case 'E-commerce': return <ShoppingCart className="w-4 h-4" />;
      default: return <Code className="w-4 h-4" />;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                Project Templates
              </h3>
              <p className="text-xs text-gray-500">
                {filteredTemplates.length} templates available
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {templates.filter(t => t.isOfficial).length} official
            </Badge>
            <Badge variant="outline" className="text-xs">
              {templates.filter(t => t.isFeatured).length} featured
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Create custom template logic
              console.log('Create custom template');
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Custom
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-80"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Category:</label>
            <div className="flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-lg p-1">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="h-7 px-3 text-xs capitalize"
                >
                  {category === 'all' ? 'All' : category}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Difficulty:</label>
            <div className="flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-lg p-1">
              {difficulties.map((difficulty) => (
                <Button
                  key={difficulty}
                  variant={selectedDifficulty === difficulty ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className="h-7 px-3 text-xs capitalize"
                >
                  {difficulty === 'all' ? 'All' : difficulty}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <div className="flex items-center space-x-1 bg-white dark:bg-gray-700 rounded-lg p-1">
              <Button
                variant={sortBy === 'popularity' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('popularity')}
                className="h-7 px-3 text-xs"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Popular
              </Button>
              <Button
                variant={sortBy === 'recent' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('recent')}
                className="h-7 px-3 text-xs"
              >
                <Clock className="w-3 h-3 mr-1" />
                Recent
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSortBy('name')}
                className="h-7 px-3 text-xs"
              >
                A-Z
              </Button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={showFeaturedOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              className="h-7 px-3 text-xs"
            >
              <Star className="w-3 h-3 mr-1" />
              Featured
            </Button>
            <Button
              variant={showOfficialOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOfficialOnly(!showOfficialOnly)}
              className="h-7 px-3 text-xs"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Official
            </Button>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        {template.icon}
                        <div>
                          <CardTitle className="text-sm">{template.name}</CardTitle>
                          <div className="flex items-center space-x-1 mt-1">
                            <Badge className={`text-xs ${getDifficultyColor(template.difficulty)}`}>
                              {template.difficulty}
                            </Badge>
                            {template.isOfficial && (
                              <Badge variant="outline" className="text-xs">
                                Official
                              </Badge>
                            )}
                            {template.isFeatured && (
                              <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-500">{template.stats.stars}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {template.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Estimated time:</span>
                        <span>{template.estimatedTime}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">Platforms:</span>
                        <div className="flex items-center space-x-1">
                          {template.platforms.slice(0, 2).map((platform, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                          {template.platforms.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{template.platforms.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {template.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {template.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {template.author.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-xs font-medium">{template.author.name}</div>
                          {template.author.isVerified && (
                            <CheckCircle className="w-3 h-3 text-blue-500" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTemplatePreview?.(template);
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTemplateSelect?.(template);
                          }}
                          className="h-7 px-2 text-xs"
                        >
                          <Rocket className="w-3 h-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-8">
                <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">No templates found matching your criteria</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {selectedTemplate.icon}
                  <div>
                    <CardTitle>{selectedTemplate.name}</CardTitle>
                    <p className="text-sm text-gray-500">by {selectedTemplate.author.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{selectedTemplate.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Details</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Difficulty:</span>
                          <Badge className={`text-xs ${getDifficultyColor(selectedTemplate.difficulty)}`}>
                            {selectedTemplate.difficulty}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Estimated Time:</span>
                          <span>{selectedTemplate.estimatedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Last Updated:</span>
                          <span>{selectedTemplate.lastUpdated.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Statistics</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Downloads:</span>
                          <span>{formatNumber(selectedTemplate.stats.downloads)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Stars:</span>
                          <span>{formatNumber(selectedTemplate.stats.stars)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Projects:</span>
                          <span>{formatNumber(selectedTemplate.stats.projects)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {selectedTemplate.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.frameworks.map((framework, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {framework}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Dependencies</h4>
                    <div className="text-sm text-gray-600">
                      {selectedTemplate.dependencies.join(', ')}
                    </div>
                  </div>
                  
                  {selectedTemplate.configuration && (
                    <div>
                      <h4 className="font-medium mb-2">Configuration</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(selectedTemplate.configuration).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-500 capitalize">{key}:</span>
                            <span>{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTemplatePreview?.(selectedTemplate)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Preview Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(`Template: ${selectedTemplate.name}`);
                  }}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Link
                </Button>
              </div>
              
              <Button
                size="sm"
                onClick={() => {
                  onTemplateCreate?.(selectedTemplate, {});
                  setSelectedTemplate(null);
                }}
              >
                <Rocket className="w-4 h-4 mr-1" />
                Create Project
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}