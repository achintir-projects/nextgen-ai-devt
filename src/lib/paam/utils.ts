/**
 * Utility functions for working with PAAM (Platform-Agnostic Application Model)
 */
import { PAAM, Entity, Flow, AuthConfig, UIConfig, APIConfig, DataConfig } from '@/types/paam/schema';
import { PAAM_JSON_SCHEMA } from './json-schema';

export class PAAMUtils {
  /**
   * Validate a PAAM object against the JSON schema
   */
  static validate(paam: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    try {
      // Basic structure validation
      if (!paam.$schema) {
        errors.push('Missing $schema property');
      }
      
      if (!paam.version) {
        errors.push('Missing version property');
      }
      
      if (!paam.metadata) {
        errors.push('Missing metadata property');
      }
      
      if (!Array.isArray(paam.entities)) {
        errors.push('entities must be an array');
      }
      
      if (!Array.isArray(paam.flows)) {
        errors.push('flows must be an array');
      }
      
      // Entity validation
      paam.entities?.forEach((entity: any, index: number) => {
        if (!entity.id) {
          errors.push(`Entity ${index}: Missing id`);
        }
        if (!entity.name) {
          errors.push(`Entity ${index}: Missing name`);
        }
        if (!Array.isArray(entity.fields)) {
          errors.push(`Entity ${index}: fields must be an array`);
        }
      });
      
      // Flow validation
      paam.flows?.forEach((flow: any, index: number) => {
        if (!flow.id) {
          errors.push(`Flow ${index}: Missing id`);
        }
        if (!flow.name) {
          errors.push(`Flow ${index}: Missing name`);
        }
        if (!Array.isArray(flow.steps)) {
          errors.push(`Flow ${index}: steps must be an array`);
        }
      });
      
      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`]
      };
    }
  }
  
  /**
   * Create a new empty PAAM object with default values
   */
  static createEmpty(name: string, description: string): PAAM {
    const now = new Date().toISOString();
    
    return {
      $schema: "https://paam.dev/schema/v0.json",
      version: "0.1.0",
      metadata: {
        name,
        description,
        version: "1.0.0",
        created: now,
        modified: now,
        tags: [],
        platforms: ["web"]
      },
      entities: [],
      flows: [],
      auth: {
        enabled: false,
        providers: [],
        roles: [],
        permissions: [],
        policies: []
      },
      ui: {
        theme: {
          primaryColor: "#3b82f6",
          secondaryColor: "#64748b",
          backgroundColor: "#ffffff",
          textColor: "#1f2937",
          fontFamily: "Inter, sans-serif",
          borderRadius: "0.5rem",
          spacing: "1rem"
        },
        layout: {
          type: "responsive",
          header: true,
          footer: false,
          navigation: {
            items: [],
            position: "top"
          }
        },
        components: [],
        pages: []
      },
      api: {
        endpoints: [],
        middleware: [],
        versioning: {
          enabled: false,
          strategy: "url",
          current: "v1"
        }
      },
      data: {
        database: {
          type: "sqlite",
          connection: {
            database: "app.db"
          },
          migrations: {
            enabled: true,
            auto: true,
            path: "./migrations"
          }
        },
        caching: {
          enabled: true,
          type: "memory",
          config: {
            ttl: 3600
          }
        },
        storage: {
          enabled: false,
          type: "local",
          config: {
            path: "./uploads"
          }
        }
      }
    };
  }
  
  /**
   * Find an entity by ID
   */
  static findEntity(paam: PAAM, entityId: string): Entity | undefined {
    return paam.entities.find(e => e.id === entityId);
  }
  
  /**
   * Find a flow by ID
   */
  static findFlow(paam: PAAM, flowId: string): Flow | undefined {
    return paam.flows.find(f => f.id === flowId);
  }
  
  /**
   * Add an entity to the PAAM
   */
  static addEntity(paam: PAAM, entity: Entity): void {
    paam.entities.push(entity);
    paam.metadata.modified = new Date().toISOString();
  }
  
  /**
   * Add a flow to the PAAM
   */
  static addFlow(paam: PAAM, flow: Flow): void {
    paam.flows.push(flow);
    paam.metadata.modified = new Date().toISOString();
  }
  
  /**
   * Generate a unique ID for PAAM elements
   */
  static generateId(prefix: string = 'elem'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Clone a PAAM object deeply
   */
  static clone(paam: PAAM): PAAM {
    return JSON.parse(JSON.stringify(paam));
  }
  
  /**
   * Export PAAM to JSON string
   */
  static toJSON(paam: PAAM): string {
    return JSON.stringify(paam, null, 2);
  }
  
  /**
   * Import PAAM from JSON string
   */
  static fromJSON(json: string): PAAM {
    try {
      const paam = JSON.parse(json);
      const validation = this.validate(paam);
      
      if (!validation.valid) {
        throw new Error(`Invalid PAAM: ${validation.errors.join(', ')}`);
      }
      
      return paam;
    } catch (error) {
      throw new Error(`Failed to parse PAAM JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Get all entities that reference a specific entity
   */
  static getReferencingEntities(paam: PAAM, entityId: string): Entity[] {
    return paam.entities.filter(entity => 
      entity.relationships.some(rel => rel.targetEntity === entityId)
    );
  }
  
  /**
   * Get all flows that use a specific entity
   */
  static getFlowsUsingEntity(paam: PAAM, entityId: string): Flow[] {
    return paam.flows.filter(flow => 
      flow.steps.some(step => 
        step.config.entity === entityId || 
        step.config.targetEntity === entityId
      )
    );
  }
  
  /**
   * Check if PAAM is ready for code generation
   */
  static isReadyForGeneration(paam: PAAM): { ready: boolean; issues: string[] } {
    const issues: string[] = [];
    
    if (paam.entities.length === 0) {
      issues.push('No entities defined');
    }
    
    if (paam.flows.length === 0) {
      issues.push('No flows defined');
    }
    
    // Check for required fields in entities
    paam.entities.forEach((entity, index) => {
      if (entity.fields.length === 0) {
        issues.push(`Entity "${entity.name}" has no fields`);
      }
      
      // Check for required fields without defaults
      entity.fields.forEach(field => {
        if (field.required && field.defaultValue === undefined && field.validation?.length === 0) {
          issues.push(`Field "${field.name}" in entity "${entity.name}" is required but has no default value or validation`);
        }
      });
    });
    
    return {
      ready: issues.length === 0,
      issues
    };
  }
}