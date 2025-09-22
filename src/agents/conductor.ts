/**
 * Core Conductor Agent - Manages conversation, context, and feedback routing
 * This is the central orchestrator for the AI-powered development platform
 */
import { PAAM } from '@/types/paam/schema';
import { PAAMUtils } from '@/lib/paam/utils';

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ConversationContext {
  id: string;
  messages: AgentMessage[];
  currentPAAM?: PAAM;
  activeAgent?: string;
  sessionData: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentCapability {
  name: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  canHandle: (message: string, context: ConversationContext) => boolean;
}

export interface AgentRequest {
  id: string;
  type: string;
  payload: any;
  sourceAgent: string;
  targetAgent: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface AgentResponse {
  id: string;
  requestId: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class ConductorAgent {
  private conversations: Map<string, ConversationContext> = new Map();
  private agents: Map<string, any> = new Map();
  private capabilities: Map<string, AgentCapability[]> = new Map();
  private eventHandlers: Map<string, ((data: any) => void)[]> = new Map();
  private requestQueue: AgentRequest[] = [];
  private isProcessing = false;

  constructor() {
    this.initializeEventHandlers();
    this.startRequestProcessor();
  }

  /**
   * Initialize default event handlers
   */
  private initializeEventHandlers(): void {
    this.on('conversation_created', this.handleConversationCreated.bind(this));
    this.on('message_received', this.handleMessageReceived.bind(this));
    this.on('agent_response', this.handleAgentResponse.bind(this));
    this.on('error_occurred', this.handleErrorOccurred.bind(this));
  }

  /**
   * Create a new conversation
   */
  public createConversation(id?: string): ConversationContext {
    const conversationId = id || this.generateId('conversation');
    const context: ConversationContext = {
      id: conversationId,
      messages: [],
      sessionData: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.conversations.set(conversationId, context);
    this.emit('conversation_created', { conversationId, context });
    
    return context;
  }

  /**
   * Get conversation by ID
   */
  public getConversation(id: string): ConversationContext | undefined {
    return this.conversations.get(id);
  }

  /**
   * Add a message to a conversation
   */
  public addMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Record<string, any>
  ): AgentMessage {
    const context = this.getConversation(conversationId);
    if (!context) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    const message: AgentMessage = {
      id: this.generateId('message'),
      role,
      content,
      timestamp: new Date(),
      metadata
    };

    context.messages.push(message);
    context.updatedAt = new Date();

    this.emit('message_received', { conversationId, message, context });
    
    // Process the message
    this.processMessage(conversationId, message);

    return message;
  }

  /**
   * Process a message and determine which agent should handle it
   */
  private async processMessage(conversationId: string, message: AgentMessage): Promise<void> {
    const context = this.getConversation(conversationId);
    if (!context) return;

    try {
      // Determine the best agent for this message
      const targetAgent = this.determineTargetAgent(message, context);
      
      if (targetAgent) {
        // Route the message to the appropriate agent
        await this.routeToAgent(conversationId, message, targetAgent);
      } else {
        // Handle with default response
        await this.handleDefaultResponse(conversationId, message);
      }
    } catch (error) {
      this.emit('error_occurred', { 
        conversationId, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message 
      });
    }
  }

  /**
   * Determine which agent should handle the message
   */
  private determineTargetAgent(message: AgentMessage, context: ConversationContext): string | null {
    // Check each agent's capabilities
    for (const [agentId, capabilities] of this.capabilities) {
      for (const capability of capabilities) {
        if (capability.canHandle(message.content, context)) {
          return agentId;
        }
      }
    }

    // If no specific agent can handle, try the active agent
    if (context.activeAgent) {
      return context.activeAgent;
    }

    return null;
  }

  /**
   * Route message to a specific agent
   */
  private async routeToAgent(conversationId: string, message: AgentMessage, agentId: string): Promise<void> {
    const request: AgentRequest = {
      id: this.generateId('request'),
      type: 'message_processing',
      payload: {
        conversationId,
        message,
        context: this.getConversation(conversationId)
      },
      sourceAgent: 'conductor',
      targetAgent: agentId,
      timestamp: new Date(),
      priority: 'medium'
    };

    this.queueRequest(request);
  }

  /**
   * Handle default response when no agent can process the message
   */
  private async handleDefaultResponse(conversationId: string, message: AgentMessage): Promise<void> {
    const response = `I understand you're saying: "${message.content}". However, I'm not sure how to help with that specifically. Could you please clarify what you'd like me to do?`;
    
    this.addMessage(conversationId, 'assistant', response, {
      type: 'default_response',
      originalMessageId: message.id
    });
  }

  /**
   * Register an agent with the conductor
   */
  public registerAgent(agentId: string, agent: any, capabilities: AgentCapability[]): void {
    this.agents.set(agentId, agent);
    this.capabilities.set(agentId, capabilities);
    
    this.emit('agent_registered', { agentId, agent, capabilities });
  }

  /**
   * Unregister an agent
   */
  public unregisterAgent(agentId: string): void {
    this.agents.delete(agentId);
    this.capabilities.delete(agentId);
    
    this.emit('agent_unregistered', { agentId });
  }

  /**
   * Queue a request for processing
   */
  private queueRequest(request: AgentRequest): void {
    this.requestQueue.push(request);
    this.processRequests();
  }

  /**
   * Start the request processor
   */
  private startRequestProcessor(): void {
    setInterval(() => {
      this.processRequests();
    }, 100); // Process every 100ms
  }

  /**
   * Process queued requests
   */
  private async processRequests(): Promise<void> {
    if (this.isProcessing || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Sort by priority
      this.requestQueue.sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      // Process requests
      while (this.requestQueue.length > 0) {
        const request = this.requestQueue.shift()!;
        await this.processRequest(request);
      }
    } catch (error) {
      console.error('Error processing requests:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a single request
   */
  private async processRequest(request: AgentRequest): Promise<void> {
    const agent = this.agents.get(request.targetAgent);
    if (!agent) {
      this.emit('error_occurred', { 
        error: `Agent ${request.targetAgent} not found`,
        request 
      });
      return;
    }

    try {
      // Process the request with the agent
      const response = await agent.processRequest(request);
      
      // Handle the response
      this.handleAgentResponse({
        id: this.generateId('response'),
        requestId: request.id,
        success: true,
        data: response,
        timestamp: new Date()
      });
    } catch (error) {
      this.handleAgentResponse({
        id: this.generateId('response'),
        requestId: request.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  }

  /**
   * Handle agent response
   */
  private handleAgentResponse(response: AgentResponse): void {
    this.emit('agent_response', response);

    if (!response.success) {
      this.emit('error_occurred', { 
        error: response.error,
        requestId: response.requestId
      });
      return;
    }

    // Process successful response
    const request = this.requestQueue.find(r => r.id === response.requestId);
    if (request) {
      // Update conversation context if needed
      if (response.data?.conversationId) {
        const context = this.getConversation(response.data.conversationId);
        if (context && response.data?.message) {
          this.addMessage(
            response.data.conversationId,
            'assistant',
            response.data.message,
            response.data.metadata
          );
        }
      }
    }
  }

  /**
   * Event handling system
   */
  public on(event: string, handler: (data: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  public emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Event handlers
   */
  private handleConversationCreated(data: any): void {
    console.log(`Conversation created: ${data.conversationId}`);
  }

  private handleMessageReceived(data: any): void {
    console.log(`Message received in conversation ${data.conversationId}: ${data.message.content}`);
  }

  private handleAgentResponse(response: AgentResponse): void {
    console.log(`Agent response received for request ${response.requestId}: ${response.success ? 'Success' : 'Failed'}`);
  }

  private handleErrorOccurred(data: any): void {
    console.error(`Error occurred: ${data.error}`, data);
  }

  /**
   * Set the active PAAM for a conversation
   */
  public setActivePAAM(conversationId: string, paam: PAAM): void {
    const context = this.getConversation(conversationId);
    if (!context) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    context.currentPAAM = paam;
    context.updatedAt = new Date();

    this.emit('paam_updated', { conversationId, paam });
  }

  /**
   * Get the active PAAM for a conversation
   */
  public getActivePAAM(conversationId: string): PAAM | undefined {
    const context = this.getConversation(conversationId);
    return context?.currentPAAM;
  }

  /**
   * Set the active agent for a conversation
   */
  public setActiveAgent(conversationId: string, agentId: string): void {
    const context = this.getConversation(conversationId);
    if (!context) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    context.activeAgent = agentId;
    context.updatedAt = new Date();

    this.emit('agent_changed', { conversationId, agentId });
  }

  /**
   * Get conversation history
   */
  public getConversationHistory(conversationId: string, limit?: number): AgentMessage[] {
    const context = this.getConversation(conversationId);
    if (!context) {
      return [];
    }

    const messages = context.messages;
    if (limit) {
      return messages.slice(-limit);
    }
    return messages;
  }

  /**
   * Clear conversation history
   */
  public clearConversation(conversationId: string): void {
    const context = this.getConversation(conversationId);
    if (!context) {
      throw new Error(`Conversation ${conversationId} not found`);
    }

    context.messages = [];
    context.updatedAt = new Date();

    this.emit('conversation_cleared', { conversationId });
  }

  /**
   * Generate unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get system status
   */
  public getStatus(): {
    conversations: number;
    agents: number;
    pendingRequests: number;
    isProcessing: boolean;
  } {
    return {
      conversations: this.conversations.size,
      agents: this.agents.size,
      pendingRequests: this.requestQueue.length,
      isProcessing: this.isProcessing
    };
  }

  /**
   * Shutdown the conductor
   */
  public shutdown(): void {
    this.conversations.clear();
    this.agents.clear();
    this.capabilities.clear();
    this.eventHandlers.clear();
    this.requestQueue = [];
    this.isProcessing = false;
    
    console.log('Conductor agent shutdown complete');
  }
}