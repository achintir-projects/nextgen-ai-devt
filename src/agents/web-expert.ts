/**
 * Web Expert Agent - Generates React/Next.js applications from PAAM specifications
 * This agent handles deterministic scaffolding for web applications
 */
import { BaseAgentImpl, AgentConfig } from './base';
import { AgentRequest, AgentCapability } from './conductor';
import { PAAM } from '@/types/paam/schema';
import { PAAMUtils } from '@/lib/paam/utils';

export interface WebGenerationRequest {
  paam: PAAM;
  outputPath: string;
  options: WebGenerationOptions;
}

export interface WebGenerationOptions {
  framework: 'nextjs' | 'react' | 'vite';
  styling: 'tailwind' | 'styled-components' | 'css-modules';
  stateManagement: 'zustand' | 'redux' | 'context';
  database: 'prisma' | 'mongoose' | 'none';
  auth: 'nextauth' | 'custom' | 'none';
  testing: 'jest' | 'vitest' | 'none';
  deployment: 'vercel' | 'netlify' | 'docker';
}

export interface WebGenerationResult {
  success: boolean;
  outputPath: string;
  files: GeneratedFile[];
  warnings: string[];
  errors: string[];
  metadata: {
    generationTime: number;
    framework: string;
    components: number;
    pages: number;
    apis: number;
  };
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'component' | 'page' | 'api' | 'config' | 'utility' | 'type';
}

export class WebExpertAgent extends BaseAgentImpl {
  private templates: Map<string, string> = new Map();
  private generators: Map<string, Function> = new Map();

  constructor() {
    super({
      id: 'web-expert',
      name: 'Web Expert Agent',
      description: 'Generates React/Next.js applications from PAAM specifications',
      version: '1.0.0',
      author: 'AI Development Platform'
    });

    this.initializeTemplates();
    this.initializeGenerators();
  }

  protected async onInitialize(): Promise<void> {
    // Load templates and generators
    await this.loadTemplates();
    await this.loadGenerators();
  }

  protected async onShutdown(): Promise<void> {
    // Cleanup resources
    this.templates.clear();
    this.generators.clear();
  }

  public getCapabilities(): AgentCapability[] {
    return [
      {
        name: 'web_app_generation',
        description: 'Generate complete web applications from PAAM specifications',
        inputTypes: ['PAAM'],
        outputTypes: ['React/Next.js codebase'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('generate') && 
                 (message.toLowerCase().includes('web') || 
                  message.toLowerCase().includes('app') ||
                  message.toLowerCase().includes('nextjs') ||
                  message.toLowerCase().includes('react'));
        }
      },
      {
        name: 'component_generation',
        description: 'Generate individual React components from PAAM UI components',
        inputTypes: ['PAAM UI Component'],
        outputTypes: ['React Component'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('component') &&
                 (message.toLowerCase().includes('generate') ||
                  message.toLowerCase().includes('create'));
        }
      },
      {
        name: 'page_generation',
        description: 'Generate React pages from PAAM page definitions',
        inputTypes: ['PAAM Page'],
        outputTypes: ['React Page'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('page') &&
                 (message.toLowerCase().includes('generate') ||
                  message.toLowerCase().includes('create'));
        }
      },
      {
        name: 'api_generation',
        description: 'Generate API endpoints from PAAM API configuration',
        inputTypes: ['PAAM API'],
        outputTypes: ['API Routes'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('api') &&
                 (message.toLowerCase().includes('generate') ||
                  message.toLowerCase().includes('create') ||
                  message.toLowerCase().includes('endpoint'));
        }
      },
      {
        name: 'schema_generation',
        description: 'Generate database schemas from PAAM entities',
        inputTypes: ['PAAM Entities'],
        outputTypes: ['Database Schema'],
        canHandle: (message: string, context: ConversationContext) => {
          return message.toLowerCase().includes('schema') &&
                 (message.toLowerCase().includes('generate') ||
                  message.toLowerCase().includes('database'));
        }
      }
    ];
  }

  public async processRequest(request: AgentRequest): Promise<any> {
    switch (request.type) {
      case 'web_app_generation':
        return await this.generateWebApplication(request.payload as WebGenerationRequest);
      
      case 'component_generation':
        return await this.generateComponent(request.payload);
      
      case 'page_generation':
        return await this.generatePage(request.payload);
      
      case 'api_generation':
        return await this.generateAPI(request.payload);
      
      case 'schema_generation':
        return await this.generateSchema(request.payload);
      
      default:
        throw new Error(`Unknown request type: ${request.type}`);
    }
  }

  /**
   * Generate a complete web application from PAAM
   */
  private async generateWebApplication(request: WebGenerationRequest): Promise<WebGenerationResult> {
    const startTime = Date.now();
    const result: WebGenerationResult = {
      success: false,
      outputPath: request.outputPath,
      files: [],
      warnings: [],
      errors: [],
      metadata: {
        generationTime: 0,
        framework: request.options.framework,
        components: 0,
        pages: 0,
        apis: 0
      }
    };

    try {
      // Validate PAAM
      const validation = PAAMUtils.validate(request.paam);
      if (!validation.valid) {
        result.errors.push(...validation.errors);
        return result;
      }

      // Check if PAAM is ready for generation
      const readiness = PAAMUtils.isReadyForGeneration(request.paam);
      if (!readiness.ready) {
        result.errors.push(...readiness.issues);
        return result;
      }

      // Generate project structure
      await this.generateProjectStructure(request);

      // Generate components
      const components = await this.generateComponents(request.paam, request.options);
      result.files.push(...components);
      result.metadata.components = components.length;

      // Generate pages
      const pages = await this.generatePages(request.paam, request.options);
      result.files.push(...pages);
      result.metadata.pages = pages.length;

      // Generate API endpoints
      const apis = await this.generateAPIs(request.paam, request.options);
      result.files.push(...apis);
      result.metadata.apis = apis.length;

      // Generate database schema
      const schema = await this.generateDatabaseSchema(request.paam, request.options);
      result.files.push(...schema);

      // Generate configuration files
      const configs = await this.generateConfigFiles(request.paam, request.options);
      result.files.push(...configs);

      // Generate utility files
      const utilities = await this.generateUtilities(request.paam, request.options);
      result.files.push(...utilities);

      result.success = true;
      result.metadata.generationTime = Date.now() - startTime;

    } catch (error) {
      result.errors.push(error instanceof Error ? error.message : 'Unknown error occurred');
    }

    return result;
  }

  /**
   * Generate project structure
   */
  private async generateProjectStructure(request: WebGenerationRequest): Promise<void> {
    // This would create the directory structure for the project
    // In a real implementation, this would use the filesystem
    console.log(`Generating project structure at: ${request.outputPath}`);
  }

  /**
   * Generate React components from PAAM UI components
   */
  private async generateComponents(paam: PAAM, options: WebGenerationOptions): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    for (const component of paam.ui.components) {
      try {
        const componentCode = await this.generateComponentCode(component, options);
        files.push({
          path: `src/components/${component.name.toLowerCase()}.tsx`,
          content: componentCode,
          type: 'component'
        });
      } catch (error) {
        console.error(`Error generating component ${component.name}:`, error);
      }
    }

    return files;
  }

  /**
   * Generate React pages from PAAM pages
   */
  private async generatePages(paam: PAAM, options: WebGenerationOptions): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    for (const page of paam.ui.pages) {
      try {
        const pageCode = await this.generatePageCode(page, paam, options);
        files.push({
          path: `src/app${page.path}/page.tsx`,
          content: pageCode,
          type: 'page'
        });
      } catch (error) {
        console.error(`Error generating page ${page.name}:`, error);
      }
    }

    return files;
  }

  /**
   * Generate API endpoints from PAAM API configuration
   */
  private async generateAPIs(paam: PAAM, options: WebGenerationOptions): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    for (const endpoint of paam.api.endpoints) {
      try {
        const apiCode = await this.generateAPICode(endpoint, options);
        files.push({
          path: `src/app/api${endpoint.path}/route.ts`,
          content: apiCode,
          type: 'api'
        });
      } catch (error) {
        console.error(`Error generating API ${endpoint.path}:`, error);
      }
    }

    return files;
  }

  /**
   * Generate database schema from PAAM entities
   */
  private async generateDatabaseSchema(paam: PAAM, options: WebGenerationOptions): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    if (options.database === 'prisma') {
      const schemaCode = await this.generatePrismaSchema(paam);
      files.push({
        path: 'prisma/schema.prisma',
        content: schemaCode,
        type: 'config'
      });
    }

    return files;
  }

  /**
   * Generate configuration files
   */
  private async generateConfigFiles(paam: PAAM, options: WebGenerationOptions): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate package.json
    const packageJson = this.generatePackageJson(options);
    files.push({
      path: 'package.json',
      content: JSON.stringify(packageJson, null, 2),
      type: 'config'
    });

    // Generate tailwind.config.js
    if (options.styling === 'tailwind') {
      const tailwindConfig = this.generateTailwindConfig(paam);
      files.push({
        path: 'tailwind.config.js',
        content: tailwindConfig,
        type: 'config'
      });
    }

    // Generate tsconfig.json
    const tsConfig = this.generateTSConfig();
    files.push({
      path: 'tsconfig.json',
      content: JSON.stringify(tsConfig, null, 2),
      type: 'config'
    });

    return files;
  }

  /**
   * Generate utility files
   */
  private async generateUtilities(paam: PAAM, options: WebGenerationOptions): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    // Generate types
    const typesCode = await this.generateTypes(paam);
    files.push({
      path: 'src/types/index.ts',
      content: typesCode,
      type: 'type'
    });

    // Generate utilities
    const utilsCode = this.generateUtilities();
    files.push({
      path: 'src/lib/utils.ts',
      content: utilsCode,
      type: 'utility'
    });

    return files;
  }

  /**
   * Generate individual component code
   */
  private async generateComponentCode(component: any, options: WebGenerationOptions): Promise<string> {
    // This is a simplified example - in reality, this would be much more sophisticated
    const template = this.templates.get('component') || '';
    
    return template
      .replace(/{{name}}/g, component.name)
      .replace(/{{type}}/g, component.type)
      .replace(/{{config}}/g, JSON.stringify(component.config, null, 2));
  }

  /**
   * Generate page code
   */
  private async generatePageCode(page: any, paam: PAAM, options: WebGenerationOptions): Promise<string> {
    const template = this.templates.get('page') || '';
    
    return template
      .replace(/{{name}}/g, page.name)
      .replace(/{{title}}/g, page.title)
      .replace(/{{components}}/g, page.components.join(', '));
  }

  /**
   * Generate API code
   */
  private async generateAPICode(endpoint: any, options: WebGenerationOptions): Promise<string> {
    const template = this.templates.get('api') || '';
    
    return template
      .replace(/{{method}}/g, endpoint.method)
      .replace(/{{path}}/g, endpoint.path)
      .replace(/{{handler}}/g, endpoint.handler);
  }

  /**
   * Generate Prisma schema
   */
  private async generatePrismaSchema(paam: PAAM): Promise<string> {
    let schema = 'generator client {\n  provider = "prisma-client-js"\n}\n\n';
    schema += 'datasource db {\n  provider = "sqlite"\n  url      = "file:./dev.db"\n}\n\n';

    for (const entity of paam.entities) {
      schema += `model ${entity.name} {\n`;
      
      for (const field of entity.fields) {
        let fieldType = this.mapPAAMTypeToPrisma(field.type);
        schema += `  ${field.name} ${fieldType}`;
        
        if (field.required) {
          schema += ' @required';
        }
        
        if (field.unique) {
          schema += ' @unique';
        }
        
        if (field.defaultValue !== undefined) {
          schema += ` @default(${this.formatDefaultValue(field.defaultValue)})`;
        }
        
        schema += '\n';
      }
      
      schema += '}\n\n';
    }

    return schema;
  }

  /**
   * Map PAAM field types to Prisma types
   */
  private mapPAAMTypeToPrisma(paamType: string): string {
    const typeMap: Record<string, string> = {
      'string': 'String',
      'text': 'String',
      'integer': 'Int',
      'float': 'Float',
      'boolean': 'Boolean',
      'date': 'DateTime',
      'datetime': 'DateTime',
      'time': 'DateTime',
      'email': 'String',
      'url': 'String',
      'file': 'String',
      'image': 'String',
      'json': 'Json',
      'uuid': 'String',
      'enum': 'String',
      'reference': 'String'
    };

    return typeMap[paamType] || 'String';
  }

  /**
   * Format default value for Prisma schema
   */
  private formatDefaultValue(value: any): string {
    if (typeof value === 'string') {
      return `"${value}"`;
    }
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    if (typeof value === 'number') {
      return value.toString();
    }
    return '""';
  }

  /**
   * Generate package.json
   */
  private generatePackageJson(options: WebGenerationOptions): any {
    const dependencies: Record<string, string> = {
      'react': '^18.0.0',
      'react-dom': '^18.0.0',
      'next': '14.0.0',
      'typescript': '^5.0.0',
      '@types/node': '^20.0.0',
      '@types/react': '^18.0.0',
      '@types/react-dom': '^18.0.0'
    };

    if (options.styling === 'tailwind') {
      dependencies['tailwindcss'] = '^3.0.0';
      dependencies['autoprefixer'] = '^10.0.0';
      dependencies['postcss'] = '^8.0.0';
    }

    if (options.stateManagement === 'zustand') {
      dependencies['zustand'] = '^4.0.0';
    }

    if (options.database === 'prisma') {
      dependencies['@prisma/client'] = '^5.0.0';
      dependencies['prisma'] = '^5.0.0';
    }

    return {
      name: 'generated-web-app',
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint'
      },
      dependencies,
      devDependencies: {
        'eslint': '^8.0.0',
        'eslint-config-next': '14.0.0'
      }
    };
  }

  /**
   * Generate Tailwind config
   */
  private generateTailwindConfig(paam: PAAM): string {
    return `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '${paam.ui.theme.primaryColor}',
        secondary: '${paam.ui.theme.secondaryColor}',
        background: '${paam.ui.theme.backgroundColor}',
        foreground: '${paam.ui.theme.textColor}',
      },
      fontFamily: {
        sans: ['${paam.ui.theme.fontFamily}', 'sans-serif'],
      },
      borderRadius: {
        lg: '${paam.ui.theme.borderRadius}',
        md: 'calc(${paam.ui.theme.borderRadius} - 2px)',
        sm: 'calc(${paam.ui.theme.borderRadius} - 4px)',
      },
    },
  },
  plugins: [],
}`;
  }

  /**
   * Generate TypeScript config
   */
  private generateTSConfig(): any {
    return {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'es6'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
       esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [
          {
            name: 'next'
          }
        ],
        paths: {
          '@/*': ['./src/*']
        }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
    };
  }

  /**
   * Generate TypeScript types
   */
  private async generateTypes(paam: PAAM): Promise<string> {
    let types = 'export interface PAAMGeneratedTypes {\n';

    for (const entity of paam.entities) {
      types += `  ${entity.name}: {\n`;
      
      for (const field of entity.fields) {
        let tsType = this.mapPAAMTypeToTypeScript(field.type);
        types += `    ${field.name}${field.required ? '' : '?'}: ${tsType};\n`;
      }
      
      types += '  };\n';
    }

    types += '}\n';
    return types;
  }

  /**
   * Map PAAM field types to TypeScript types
   */
  private mapPAAMTypeToTypeScript(paamType: string): string {
    const typeMap: Record<string, string> = {
      'string': 'string',
      'text': 'string',
      'integer': 'number',
      'float': 'number',
      'boolean': 'boolean',
      'date': 'Date',
      'datetime': 'Date',
      'time': 'Date',
      'email': 'string',
      'url': 'string',
      'file': 'string',
      'image': 'string',
      'json': 'any',
      'uuid': 'string',
      'enum': 'string',
      'reference': 'string'
    };

    return typeMap[paamType] || 'any';
  }

  /**
   * Generate utilities
   */
  private generateUtilities(): string {
    return `import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}`;
  }

  /**
   * Initialize templates
   */
  private initializeTemplates(): void {
    this.templates.set('component', `
import React from 'react';
import { cn } from '@/lib/utils';

interface {{name}}Props {
  className?: string;
  [key: string]: any;
}

export function {{name}}({ className, ...props }: {{name}}Props) {
  return (
    <div className={cn('{{name.toLowerCase()}}', className)} {...props}>
      {/* Component content based on config: {{config}} */}
    </div>
  );
}`);

    this.templates.set('page', `
import React from 'react';
import { {{components}} } from '@/components';

export default function {{name}}() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{{title}}</h1>
      <div className="space-y-6">
        {/* Page components will be rendered here */}
      </div>
    </div>
  );
}`);

    this.templates.set('api', `
import { NextRequest, NextResponse } from 'next/server';

export async function {{method.toLowerCase()}}(request: NextRequest) {
  try {
    // API implementation for {{method}} {{path}}
    const data = await request.json();
    
    // Process the request
    const result = await {{handler}}(data);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in {{path}}:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`);
  }

  /**
   * Initialize generators
   */
  private initializeGenerators(): void {
    // Initialize specialized generators for different component types
    this.generators.set('form', this.generateFormComponent.bind(this));
    this.generators.set('table', this.generateTableComponent.bind(this));
    this.generators.set('chart', this.generateChartComponent.bind(this));
  }

  /**
   * Load templates from files or database
   */
  private async loadTemplates(): Promise<void> {
    // In a real implementation, this would load templates from files or a database
    console.log('Loading templates...');
  }

  /**
   * Load generators from plugins or modules
   */
  private async loadGenerators(): Promise<void> {
    // In a real implementation, this would load generators from plugins or modules
    console.log('Loading generators...');
  }

  /**
   * Generate form component
   */
  private async generateFormComponent(config: any): Promise<string> {
    // Specialized form component generation
    return `// Form component generation`;
  }

  /**
   * Generate table component
   */
  private async generateTableComponent(config: any): Promise<string> {
    // Specialized table component generation
    return `// Table component generation`;
  }

  /**
   * Generate chart component
   */
  private async generateChartComponent(config: any): Promise<string> {
    // Specialized chart component generation
    return `// Chart component generation`;
  }
}