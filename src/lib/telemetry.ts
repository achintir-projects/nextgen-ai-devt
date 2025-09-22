/**
 * Structured Telemetry System
 * Implements the (Prompt, Plan, Artifact, Feedback, Delta, Outcome) schema for continuous learning
 */
export interface TelemetryEvent {
  id: string;
  timestamp: Date;
  sessionId: string;
  userId?: string;
  type: TelemetryEventType;
  data: TelemetryEventData;
  metadata?: Record<string, any>;
}

export type TelemetryEventType = 
  | 'prompt'
  | 'plan'
  | 'artifact'
  | 'feedback'
  | 'delta'
  | 'outcome'
  | 'system'
  | 'error';

export interface TelemetryEventData {
  prompt?: PromptData;
  plan?: PlanData;
  artifact?: ArtifactData;
  feedback?: FeedbackData;
  delta?: DeltaData;
  outcome?: OutcomeData;
  system?: SystemData;
  error?: ErrorData;
}

export interface PromptData {
  content: string;
  type: 'text' | 'voice' | 'image' | 'code';
  context: {
    conversationId: string;
    previousMessages: number;
    activeAgent?: string;
    currentPAAM?: string;
  };
  metadata?: {
    language?: string;
    complexity?: 'simple' | 'medium' | 'complex';
    category?: string;
    estimatedTime?: number;
  };
}

export interface PlanData {
  id: string;
  name: string;
  description: string;
  type: 'generation' | 'modification' | 'analysis' | 'deployment';
  steps: PlanStep[];
  estimatedDuration: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
  metadata?: {
    framework?: string;
    platform?: string;
    complexity?: 'simple' | 'medium' | 'complex';
  };
}

export interface PlanStep {
  id: string;
  name: string;
  type: 'validation' | 'generation' | 'analysis' | 'deployment' | 'testing';
  agent: string;
  estimatedDuration: number;
  inputs: Record<string, any>;
  expectedOutputs: string[];
  dependencies?: string[];
}

export interface ArtifactData {
  id: string;
  type: 'code' | 'schema' | 'config' | 'documentation' | 'test';
  name: string;
  content: string;
  language?: string;
  framework?: string;
  platform?: string;
  size: number;
  quality?: {
    score: number;
    issues: QualityIssue[];
    metrics: QualityMetrics;
  };
  metadata?: {
    generatedBy: string;
    generationTime: number;
    template?: string;
    version?: string;
  };
}

export interface QualityIssue {
  type: 'error' | 'warning' | 'info' | 'style';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location?: {
    file: string;
    line: number;
    column: number;
  };
  suggestion?: string;
}

export interface QualityMetrics {
  complexity: number;
  maintainability: number;
  testability: number;
  security: number;
  performance: number;
}

export interface FeedbackData {
  id: string;
  type: 'bug' | 'improvement' | 'question' | 'feature' | 'compliment';
  severity: 'low' | 'medium' | 'high' | 'critical';
  target: {
    type: 'artifact' | 'plan' | 'agent' | 'system';
    id: string;
    name?: string;
  };
  content: string;
  suggestedFix?: string;
  status: 'open' | 'in-progress' | 'resolved' | 'dismissed';
  metadata?: {
    userRole?: string;
    experience?: 'beginner' | 'intermediate' | 'expert';
    sentiment?: 'positive' | 'neutral' | 'negative';
  };
}

export interface DeltaData {
  id: string;
  type: 'improvement' | 'correction' | 'optimization' | 'refactor';
  description: string;
  changes: DeltaChange[];
  impact: {
    quality: number;
    performance: number;
    maintainability: number;
  };
  metadata?: {
    automated?: boolean;
    agent?: string;
    reason?: string;
  };
}

export interface DeltaChange {
  type: 'add' | 'remove' | 'modify';
  target: {
    type: 'code' | 'config' | 'schema' | 'test';
    id: string;
    path?: string;
  };
  content?: string;
  reason?: string;
}

export interface OutcomeData {
  id: string;
  type: 'success' | 'failure' | 'partial' | 'timeout';
  planId: string;
  duration: number;
  artifacts: string[];
  metrics: {
    success: boolean;
    quality: number;
    performance: number;
    userSatisfaction?: number;
    businessValue?: number;
  };
  summary: string;
  lessons?: string[];
  metadata?: {
    deployment?: boolean;
    testing?: {
      passed: number;
      failed: number;
      coverage: number;
    };
    userAdoption?: number;
  };
}

export interface SystemData {
  component: string;
  action: string;
  status: 'started' | 'completed' | 'failed' | 'paused';
  metrics?: Record<string, any>;
  metadata?: {
    version?: string;
    environment?: string;
    load?: number;
  };
}

export interface ErrorData {
  type: 'system' | 'user' | 'agent' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  metadata?: {
    component?: string;
    action?: string;
    userId?: string;
    sessionId?: string;
  };
}

export interface TelemetrySession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  events: TelemetryEvent[];
  metadata?: {
    userAgent?: string;
    platform?: string;
    version?: string;
    referrer?: string;
  };
}

export interface TelemetryAnalytics {
  totalSessions: number;
  totalEvents: number;
  averageSessionDuration: number;
  successRate: number;
  averageQuality: number;
  userSatisfaction: number;
  topPrompts: Array<{
    prompt: string;
    count: number;
    successRate: number;
  }>;
  agentPerformance: Array<{
    agent: string;
    usage: number;
    successRate: number;
    averageResponseTime: number;
  }>;
  commonIssues: Array<{
    issue: string;
    count: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  improvementOpportunities: Array<{
    area: string;
    impact: 'low' | 'medium' | 'high';
    description: string;
  }>;
}

export class TelemetryManager {
  private events: TelemetryEvent[] = [];
  private sessions: Map<string, TelemetrySession> = new Map();
  private analytics: TelemetryAnalytics | null = null;
  private isAnalyticsDirty = false;

  constructor() {
    this.initializeAnalytics();
  }

  /**
   * Record a telemetry event
   */
  public recordEvent(event: Omit<TelemetryEvent, 'id' | 'timestamp'>): string {
    const telemetryEvent: TelemetryEvent = {
      id: this.generateId('event'),
      timestamp: new Date(),
      ...event
    };

    this.events.push(telemetryEvent);
    this.addToSession(telemetryEvent);
    this.isAnalyticsDirty = true;

    // Send to analytics service (in production)
    this.sendToAnalyticsService(telemetryEvent);

    return telemetryEvent.id;
  }

  /**
   * Record a prompt event
   */
  public recordPrompt(data: PromptData, sessionId: string, userId?: string): string {
    return this.recordEvent({
      sessionId,
      userId,
      type: 'prompt',
      data: { prompt: data }
    });
  }

  /**
   * Record a plan event
   */
  public recordPlan(data: PlanData, sessionId: string, userId?: string): string {
    return this.recordEvent({
      sessionId,
      userId,
      type: 'plan',
      data: { plan: data }
    });
  }

  /**
   * Record an artifact event
   */
  public recordArtifact(data: ArtifactData, sessionId: string, userId?: string): string {
    return this.recordEvent({
      sessionId,
      userId,
      type: 'artifact',
      data: { artifact: data }
    });
  }

  /**
   * Record a feedback event
   */
  public recordFeedback(data: FeedbackData, sessionId: string, userId?: string): string {
    return this.recordEvent({
      sessionId,
      userId,
      type: 'feedback',
      data: { feedback: data }
    });
  }

  /**
   * Record a delta event
   */
  public recordDelta(data: DeltaData, sessionId: string, userId?: string): string {
    return this.recordEvent({
      sessionId,
      userId,
      type: 'delta',
      data: { delta: data }
    });
  }

  /**
   * Record an outcome event
   */
  public recordOutcome(data: OutcomeData, sessionId: string, userId?: string): string {
    return this.recordEvent({
      sessionId,
      userId,
      type: 'outcome',
      data: { outcome: data }
    });
  }

  /**
   * Record a system event
   */
  public recordSystem(data: SystemData, sessionId: string, userId?: string): string {
    return this.recordEvent({
      sessionId,
      userId,
      type: 'system',
      data: { system: data }
    });
  }

  /**
   * Record an error event
   */
  public recordError(data: ErrorData, sessionId: string, userId?: string): string {
    return this.recordEvent({
      sessionId,
      userId,
      type: 'error',
      data: { error: data }
    });
  }

  /**
   * Start a new session
   */
  public startSession(userId?: string, metadata?: Record<string, any>): string {
    const sessionId = this.generateId('session');
    const session: TelemetrySession = {
      id: sessionId,
      userId,
      startTime: new Date(),
      events: [],
      metadata
    };

    this.sessions.set(sessionId, session);
    this.isAnalyticsDirty = true;

    return sessionId;
  }

  /**
   * End a session
   */
  public endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = new Date();
      this.isAnalyticsDirty = true;
    }
  }

  /**
   * Get session by ID
   */
  public getSession(sessionId: string): TelemetrySession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * Get events for a session
   */
  public getSessionEvents(sessionId: string): TelemetryEvent[] {
    return this.events.filter(event => event.sessionId === sessionId);
  }

  /**
   * Get analytics
   */
  public getAnalytics(): TelemetryAnalytics {
    if (this.isAnalyticsDirty || !this.analytics) {
      this.analytics = this.calculateAnalytics();
      this.isAnalyticsDirty = false;
    }
    return this.analytics;
  }

  /**
   * Calculate analytics from collected data
   */
  private calculateAnalytics(): TelemetryAnalytics {
    const totalSessions = this.sessions.size;
    const totalEvents = this.events.length;
    
    // Calculate average session duration
    let totalDuration = 0;
    let completedSessions = 0;
    
    this.sessions.forEach(session => {
      if (session.endTime) {
        totalDuration += session.endTime.getTime() - session.startTime.getTime();
        completedSessions++;
      }
    });
    
    const averageSessionDuration = completedSessions > 0 ? totalDuration / completedSessions : 0;

    // Calculate success rate
    const outcomes = this.events.filter(e => e.type === 'outcome');
    const successfulOutcomes = outcomes.filter(e => e.data.outcome?.type === 'success');
    const successRate = outcomes.length > 0 ? successfulOutcomes.length / outcomes.length : 0;

    // Calculate average quality
    const artifacts = this.events.filter(e => e.type === 'artifact');
    const totalQuality = artifacts.reduce((sum, e) => sum + (e.data.artifact?.quality?.score || 0), 0);
    const averageQuality = artifacts.length > 0 ? totalQuality / artifacts.length : 0;

    // Calculate user satisfaction (from feedback)
    const feedback = this.events.filter(e => e.type === 'feedback');
    const positiveFeedback = feedback.filter(e => e.data.feedback?.metadata?.sentiment === 'positive');
    const userSatisfaction = feedback.length > 0 ? positiveFeedback.length / feedback.length : 0;

    // Get top prompts
    const promptCounts = new Map<string, { count: number; successes: number }>();
    this.events.filter(e => e.type === 'prompt').forEach(event => {
      const prompt = event.data.prompt?.content || '';
      if (prompt) {
        const current = promptCounts.get(prompt) || { count: 0, successes: 0 };
        current.count++;
        promptCounts.set(prompt, current);
      }
    });

    const topPrompts = Array.from(promptCounts.entries())
      .map(([prompt, data]) => ({
        prompt,
        count: data.count,
        successRate: data.count > 0 ? data.successes / data.count : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get agent performance
    const agentStats = new Map<string, { usage: number; successes: number; totalTime: number }>();
    this.events.forEach(event => {
      if (event.type === 'system' && event.data.system?.agent) {
        const agent = event.data.system.agent;
        const current = agentStats.get(agent) || { usage: 0, successes: 0, totalTime: 0 };
        current.usage++;
        if (event.data.system.status === 'completed') {
          current.successes++;
        }
        agentStats.set(agent, current);
      }
    });

    const agentPerformance = Array.from(agentStats.entries())
      .map(([agent, stats]) => ({
        agent,
        usage: stats.usage,
        successRate: stats.usage > 0 ? stats.successes / stats.usage : 0,
        averageResponseTime: stats.usage > 0 ? stats.totalTime / stats.usage : 0
      }));

    // Get common issues
    const issueCounts = new Map<string, { count: number; severity: ErrorData['severity'] }>();
    this.events.filter(e => e.type === 'error').forEach(event => {
      const message = event.data.error?.message || '';
      const severity = event.data.error?.severity || 'medium';
      if (message) {
        const current = issueCounts.get(message) || { count: 0, severity };
        current.count++;
        issueCounts.set(message, current);
      }
    });

    const commonIssues = Array.from(issueCounts.entries())
      .map(([issue, data]) => ({
        issue,
        count: data.count,
        severity: data.severity
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Get improvement opportunities
    const improvementOpportunities = this.identifyImprovementOpportunities();

    return {
      totalSessions,
      totalEvents,
      averageSessionDuration,
      successRate,
      averageQuality,
      userSatisfaction,
      topPrompts,
      agentPerformance,
      commonIssues,
      improvementOpportunities
    };
  }

  /**
   * Identify improvement opportunities based on telemetry data
   */
  private identifyImprovementOpportunities(): Array<{
    area: string;
    impact: 'low' | 'medium' | 'high';
    description: string;
  }> {
    const opportunities: Array<{
      area: string;
      impact: 'low' | 'medium' | 'high';
      description: string;
    }> = [];

    // Analyze error rates
    const errorRate = this.events.filter(e => e.type === 'error').length / this.events.length;
    if (errorRate > 0.1) {
      opportunities.push({
        area: 'Error Reduction',
        impact: 'high',
        description: 'High error rate detected. Implement better error handling and validation.'
      });
    }

    // Analyze response times
    const slowEvents = this.events.filter(e => {
      const duration = this.calculateEventDuration(e);
      return duration > 5000; // 5 seconds
    });
    
    if (slowEvents.length > this.events.length * 0.2) {
      opportunities.push({
        area: 'Performance',
        impact: 'medium',
        description: 'Many events taking longer than 5 seconds. Optimize performance.'
      });
    }

    // Analyze user satisfaction
    const feedback = this.events.filter(e => e.type === 'feedback');
    const negativeFeedback = feedback.filter(e => e.data.feedback?.metadata?.sentiment === 'negative');
    
    if (negativeFeedback.length > feedback.length * 0.3) {
      opportunities.push({
        area: 'User Experience',
        impact: 'high',
        description: 'High negative feedback rate. Improve user experience and interface.'
      });
    }

    return opportunities;
  }

  /**
   * Calculate event duration
   */
  private calculateEventDuration(event: TelemetryEvent): number {
    // This is a simplified calculation - in reality, you'd track start/end times
    return Math.random() * 10000; // Random duration for demo
  }

  /**
   * Add event to session
   */
  private addToSession(event: TelemetryEvent): void {
    const session = this.sessions.get(event.sessionId);
    if (session) {
      session.events.push(event);
    }
  }

  /**
   * Send event to analytics service
   */
  private sendToAnalyticsService(event: TelemetryEvent): void {
    // In production, this would send to your analytics service
    console.log('Telemetry event:', event);
  }

  /**
   * Initialize analytics
   */
  private initializeAnalytics(): void {
    this.analytics = {
      totalSessions: 0,
      totalEvents: 0,
      averageSessionDuration: 0,
      successRate: 0,
      averageQuality: 0,
      userSatisfaction: 0,
      topPrompts: [],
      agentPerformance: [],
      commonIssues: [],
      improvementOpportunities: []
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Export telemetry data
   */
  public exportData(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify({
        events: this.events,
        sessions: Array.from(this.sessions.values()),
        analytics: this.getAnalytics()
      }, null, 2);
    } else {
      // CSV export would be implemented here
      return 'CSV export not implemented';
    }
  }

  /**
   * Clear old data (for privacy/storage management)
   */
  public clearOldData(olderThan: Date): void {
    const cutoffTime = olderThan.getTime();
    
    // Remove old events
    this.events = this.events.filter(event => event.timestamp.getTime() > cutoffTime);
    
    // Remove old sessions
    this.sessions.forEach((session, sessionId) => {
      if (session.startTime.getTime() < cutoffTime) {
        this.sessions.delete(sessionId);
      }
    });
    
    this.isAnalyticsDirty = true;
  }

  /**
   * Get system health metrics
   */
  public getSystemHealth(): {
    uptime: number;
    eventRate: number;
    errorRate: number;
    sessionCount: number;
  } {
    const now = Date.now();
    const oneHourAgo = now - 3600000;
    
    const recentEvents = this.events.filter(e => e.timestamp.getTime() > oneHourAgo);
    const recentErrors = recentEvents.filter(e => e.type === 'error');
    
    return {
      uptime: now - this.events[0]?.timestamp.getTime() || 0,
      eventRate: recentEvents.length,
      errorRate: recentEvents.length > 0 ? recentErrors.length / recentEvents.length : 0,
      sessionCount: this.sessions.size
    };
  }
}

// Global telemetry manager instance
export const telemetryManager = new TelemetryManager();