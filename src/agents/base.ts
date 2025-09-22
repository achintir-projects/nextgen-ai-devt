/**
 * Base Agent Interface - All agents must implement this interface
 */
import { AgentRequest, AgentResponse, AgentCapability } from './conductor';

export interface BaseAgent {
  /**
   * Initialize the agent
   */
  initialize(): Promise<void>;

  /**
   * Process a request from the conductor
   */
  processRequest(request: AgentRequest): Promise<any>;

  /**
   * Get the agent's capabilities
   */
  getCapabilities(): AgentCapability[];

  /**
   * Handle agent shutdown
   */
  shutdown(): Promise<void>;

  /**
   * Get agent information
   */
  getInfo(): AgentInfo;
}

export interface AgentInfo {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  capabilities: string[];
}

/**
 * Base agent implementation that provides common functionality
 */
export abstract class BaseAgentImpl implements BaseAgent {
  protected id: string;
  protected name: string;
  protected description: string;
  protected version: string;
  protected author: string;
  protected initialized = false;

  constructor(config: AgentConfig) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.version = config.version;
    this.author = config.author;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    await this.onInitialize();
    this.initialized = true;
  }

  public abstract processRequest(request: AgentRequest): Promise<any>;

  public abstract getCapabilities(): AgentCapability[];

  public async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    await this.onShutdown();
    this.initialized = false;
  }

  public getInfo(): AgentInfo {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      author: this.author,
      capabilities: this.getCapabilities().map(cap => cap.name)
    };
  }

  /**
   * Override this method to implement agent-specific initialization
   */
  protected abstract onInitialize(): Promise<void>;

  /**
   * Override this method to implement agent-specific shutdown
   */
  protected abstract onShutdown(): Promise<void>;

  /**
   * Helper method to create a successful response
   */
  protected createSuccessResponse(requestId: string, data: any, metadata?: Record<string, any>): AgentResponse {
    return {
      id: this.generateId('response'),
      requestId,
      success: true,
      data,
      timestamp: new Date(),
      metadata
    };
  }

  /**
   * Helper method to create an error response
   */
  protected createErrorResponse(requestId: string, error: string, metadata?: Record<string, any>): AgentResponse {
    return {
      id: this.generateId('response'),
      requestId,
      success: false,
      error,
      timestamp: new Date(),
      metadata
    };
  }

  /**
   * Generate unique ID
   */
  protected generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if the agent is initialized
   */
  public isInitialized(): boolean {
    return this.initialized;
  }
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
}