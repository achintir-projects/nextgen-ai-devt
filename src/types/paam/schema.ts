/**
 * PAAM v1 - Program Abstract Assembly Model
 * Machine-executable specification for platform-agnostic application development
 */

export interface PAAM {
  $schema: string;
  version: string;
  metadata: PAAMMetadata;
  requirements: Requirements;
  architecture: Architecture;
  components: Components;
  dataModels: DataModels;
  compliance: Compliance;
  deployment: Deployment;
  entities: Entity[];
  flows: Flow[];
  auth: AuthConfig;
  ui: UIConfig;
  api: APIConfig;
  data: DataConfig;
  performance: PerformanceMetrics;
}

export interface PAAMMetadata {
  name: string;
  description: string;
  version: string;
  author?: string;
  created: string;
  modified: string;
  tags: string[];
  platforms: Platform[];
}

export type Platform = 'web' | 'ios' | 'android';

export interface Entity {
  id: string;
  name: string;
  description: string;
  fields: Field[];
  relationships: Relationship[];
  constraints: Constraint[];
  indexes?: Index[];
}

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  required: boolean;
  unique?: boolean;
  defaultValue?: any;
  validation?: ValidationRule[];
  ui?: FieldUIConfig;
}

export type FieldType = 
  | 'string'
  | 'text'
  | 'integer'
  | 'float'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'email'
  | 'url'
  | 'file'
  | 'image'
  | 'json'
  | 'uuid'
  | 'enum'
  | 'reference';

export interface ValidationRule {
  type: 'min' | 'max' | 'pattern' | 'custom';
  value: any;
  message: string;
}

export interface FieldUIConfig {
  label?: string;
  placeholder?: string;
  helpText?: string;
  widget?: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'file' | 'autocomplete';
  options?: { value: any; label: string }[];
}

export interface Relationship {
  id: string;
  name: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  targetEntity: string;
  cascade?: boolean;
  onDelete?: 'cascade' | 'restrict' | 'set-null';
}

export interface Constraint {
  id: string;
  name: string;
  type: 'unique' | 'check' | 'foreign-key';
  fields: string[];
  expression?: string;
}

export interface Index {
  id: string;
  name: string;
  fields: string[];
  unique?: boolean;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  type: FlowType;
  steps: FlowStep[];
  triggers: Trigger[];
  auth?: AuthRequirement[];
}

export type FlowType = 'create' | 'read' | 'update' | 'delete' | 'custom' | 'auth';

export interface FlowStep {
  id: string;
  name: string;
  type: StepType;
  config: StepConfig;
  nextSteps?: string[];
  conditions?: Condition[];
}

export type StepType = 
  | 'form'
  | 'api-call'
  | 'data-transform'
  | 'validation'
  | 'auth-check'
  | 'notification'
  | 'redirect'
  | 'conditional'
  | 'loop';

export interface StepConfig {
  [key: string]: any;
}

export interface Condition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
  value: any;
}

export interface Trigger {
  id: string;
  type: 'http' | 'event' | 'schedule' | 'webhook';
  config: TriggerConfig;
}

export interface TriggerConfig {
  [key: string]: any;
}

export interface AuthRequirement {
  role: string;
  permissions: string[];
}

export interface AuthConfig {
  enabled: boolean;
  providers: AuthProvider[];
  roles: Role[];
  permissions: Permission[];
  policies: Policy[];
}

export interface AuthProvider {
  type: 'email' | 'oauth' | 'saml' | 'jwt';
  name: string;
  config: AuthProviderConfig;
}

export interface AuthProviderConfig {
  [key: string]: any;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'execute';
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  effect: 'allow' | 'deny';
  conditions: PolicyCondition[];
}

export interface PolicyCondition {
  field: string;
  operator: string;
  value: any;
}

export interface UIConfig {
  theme: ThemeConfig;
  layout: LayoutConfig;
  components: UIComponent[];
  pages: Page[];
}

export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  spacing: string;
}

export interface LayoutConfig {
  type: 'sidebar' | 'top-nav' | 'mobile-first' | 'responsive';
  header: boolean;
  footer: boolean;
  navigation: NavigationConfig;
}

export interface NavigationConfig {
  items: NavigationItem[];
  position: 'top' | 'side' | 'bottom';
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  href: string;
  children?: NavigationItem[];
  auth?: AuthRequirement[];
}

export interface UIComponent {
  id: string;
  name: string;
  type: 'form' | 'table' | 'chart' | 'card' | 'list' | 'detail' | 'wizard';
  config: UIComponentConfig;
  dataBinding?: DataBinding;
}

export interface UIComponentConfig {
  [key: string]: any;
}

export interface DataBinding {
  entity: string;
  fields: string[];
  filters?: Filter[];
  sort?: Sort[];
  pagination?: Pagination;
}

export interface Filter {
  field: string;
  operator: string;
  value: any;
}

export interface Sort {
  field: string;
  direction: 'asc' | 'desc';
}

export interface Pagination {
  enabled: boolean;
  pageSize: number;
}

export interface Page {
  id: string;
  name: string;
  path: string;
  title: string;
  components: string[];
  layout: string;
  auth?: AuthRequirement[];
}

export interface APIConfig {
  endpoints: APIEndpoint[];
  middleware: APIMiddleware[];
  versioning: APIVersioning;
}

export interface APIEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  handler: string;
  auth?: AuthRequirement[];
  validation?: ValidationConfig;
  response: ResponseConfig;
}

export interface ValidationConfig {
  schema: any;
  sanitize: boolean;
}

export interface ResponseConfig {
  format: 'json' | 'xml' | 'html';
  schema?: any;
  headers?: Record<string, string>;
}

export interface APIMiddleware {
  name: string;
  type: 'auth' | 'cors' | 'rate-limit' | 'logging' | 'cache';
  config: any;
}

export interface APIVersioning {
  enabled: boolean;
  strategy: 'url' | 'header' | 'query';
  current: string;
}

export interface DataConfig {
  database: DatabaseConfig;
  caching: CacheConfig;
  storage: StorageConfig;
}

export interface DatabaseConfig {
  type: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
  connection: DatabaseConnection;
  migrations: MigrationConfig;
}

export interface DatabaseConnection {
  host?: string;
  port?: number;
  database: string;
  username?: string;
  password?: string;
  ssl?: boolean;
}

export interface MigrationConfig {
  enabled: boolean;
  auto: boolean;
  path: string;
}

export interface CacheConfig {
  enabled: boolean;
  type: 'redis' | 'memory' | 'memcached';
  config: CacheConfigSettings;
}

export interface CacheConfigSettings {
  [key: string]: any;
}

export interface StorageConfig {
  enabled: boolean;
  type: 'local' | 's3' | 'azure' | 'gcs';
  config: StorageConfigSettings;
}

export interface StorageConfigSettings {
  [key: string]: any;
}

// PAAM v1 Complete Specification Interfaces

export interface Requirements {
  functional: FunctionalRequirement[];
  nonFunctional: NonFunctionalRequirement[];
  businessRules: BusinessRule[];
  userStories: UserStory[];
  constraints: RequirementConstraint[];
}

export interface FunctionalRequirement {
  id: string;
  name: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  acceptanceCriteria: string[];
  dependencies: string[];
  traceability: TraceabilityInfo;
}

export interface NonFunctionalRequirement {
  id: string;
  name: string;
  type: 'performance' | 'security' | 'scalability' | 'usability' | 'reliability' | 'maintainability';
  description: string;
  metric: string;
  targetValue: any;
  measurement: string;
  traceability: TraceabilityInfo;
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  exception?: string;
  priority: 'low' | 'medium' | 'high';
  traceability: TraceabilityInfo;
}

export interface UserStory {
  id: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  priority: 'low' | 'medium' | 'high';
  estimate: number;
  traceability: TraceabilityInfo;
}

export interface RequirementConstraint {
  id: string;
  name: string;
  type: 'technical' | 'business' | 'regulatory' | 'environmental';
  description: string;
  impact: string;
  mitigation: string;
  traceability: TraceabilityInfo;
}

export interface TraceabilityInfo {
  source: string;
  confidence: number;
  validation: ValidationStatus;
  links: TraceabilityLink[];
}

export interface TraceabilityLink {
  type: 'derives' | 'implements' | 'validates' | 'depends' | 'conflicts';
  target: string;
  strength: 'weak' | 'medium' | 'strong';
}

export type ValidationStatus = 'draft' | 'validated' | 'verified' | 'approved';

export interface Architecture {
  pattern: ArchitecturePattern;
  layers: ArchitectureLayer[];
  components: ArchitectureComponent[];
  integrations: Integration[];
  qualityAttributes: QualityAttribute[];
}

export type ArchitecturePattern = 
  | 'layered' 
  | 'microservices' 
  | 'event-driven' 
  | 'serverless' 
  | 'monolithic' 
  | 'hexagonal' 
  | 'clean-architecture';

export interface ArchitectureLayer {
  id: string;
  name: string;
  type: 'presentation' | 'application' | 'business' | 'persistence' | 'infrastructure';
  responsibility: string;
  technologies: string[];
  components: string[];
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: 'service' | 'repository' | 'controller' | 'gateway' | 'queue' | 'cache';
  layer: string;
  responsibilities: string[];
  interfaces: ComponentInterface[];
  dependencies: string[];
  technologies: string[];
}

export interface ComponentInterface {
  name: string;
  type: 'rest' | 'graphql' | 'grpc' | 'websocket' | 'message';
  endpoints: InterfaceEndpoint[];
  protocol: string;
}

export interface InterfaceEndpoint {
  path: string;
  method: string;
  input: any;
  output: any;
  description: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'api' | 'database' | 'message-queue' | 'file' | 'event';
  source: string;
  target: string;
  protocol: string;
  mapping: IntegrationMapping;
}

export interface IntegrationMapping {
  transformation: string;
  validation: string;
  errorHandling: string;
}

export interface QualityAttribute {
  name: string;
  description: string;
  priority: number;
  metrics: QualityMetric[];
  tactics: string[];
}

export interface QualityMetric {
  name: string;
  target: any;
  unit: string;
  measurement: string;
}

export interface Components {
  reusable: ReusableComponent[];
  custom: CustomComponent[];
  thirdParty: ThirdPartyComponent[];
}

export interface ReusableComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  interface: ComponentInterface;
  dependencies: string[];
  usage: string[];
  quality: QualityInfo;
}

export interface CustomComponent {
  id: string;
  name: string;
  purpose: string;
  specification: ComponentSpecification;
  implementation: ImplementationInfo;
  testing: TestingInfo;
}

export interface ComponentSpecification {
  functional: string[];
  nonFunctional: string[];
  interfaces: ComponentInterface[];
  constraints: string[];
}

export interface ImplementationInfo {
  language: string;
  framework: string;
  patterns: string[];
  dependencies: string[];
}

export interface TestingInfo {
  unit: TestSuite[];
  integration: TestSuite[];
  e2e: TestSuite[];
}

export interface TestSuite {
  name: string;
  description: string;
  coverage: number;
  cases: TestCase[];
}

export interface TestCase {
  name: string;
  description: string;
  input: any;
  expected: any;
  priority: 'low' | 'medium' | 'high';
}

export interface ThirdPartyComponent {
  id: string;
  name: string;
  vendor: string;
  version: string;
  license: string;
  purpose: string;
  integration: IntegrationInfo;
  risk: RiskAssessment;
}

export interface IntegrationInfo {
  type: 'api' | 'library' | 'service' | 'sdk';
  interface: ComponentInterface;
  configuration: any;
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high';
  factors: string[];
  mitigation: string[];
}

export interface QualityInfo {
  reliability: number;
  performance: number;
  security: number;
  maintainability: number;
  usability: number;
}

export interface DataModels {
  conceptual: ConceptualModel[];
  logical: LogicalModel[];
  physical: PhysicalModel[];
  mappings: ModelMapping[];
}

export interface ConceptualModel {
  id: string;
  name: string;
  entities: ConceptualEntity[];
  relationships: ConceptualRelationship[];
  constraints: ConceptualConstraint[];
}

export interface ConceptualEntity {
  id: string;
  name: string;
  attributes: ConceptualAttribute[];
  description: string;
}

export interface ConceptualAttribute {
  name: string;
  type: string;
  description: string;
  constraints: string[];
}

export interface ConceptualRelationship {
  id: string;
  name: string;
  source: string;
  target: string;
  cardinality: string;
  description: string;
}

export interface ConceptualConstraint {
  id: string;
  name: string;
  type: string;
  description: string;
  entities: string[];
}

export interface LogicalModel {
  id: string;
  name: string;
  entities: LogicalEntity[];
  relationships: LogicalRelationship[];
  normalization: number;
}

export interface LogicalEntity {
  id: string;
  name: string;
  attributes: LogicalAttribute[];
  keys: Key[];
  constraints: LogicalConstraint[];
}

export interface LogicalAttribute {
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  unique: boolean;
  defaultValue?: any;
  description: string;
}

export interface Key {
  name: string;
  type: 'primary' | 'foreign' | 'candidate';
  attributes: string[];
  references?: string;
}

export interface LogicalConstraint {
  name: string;
  type: 'check' | 'unique' | 'not-null';
  condition: string;
  description: string;
}

export interface LogicalRelationship {
  id: string;
  name: string;
  source: string;
  target: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  cardinality: string;
  participation: 'optional' | 'mandatory';
  description: string;
}

export interface PhysicalModel {
  id: string;
  name: string;
  database: DatabaseInfo;
  tables: Table[];
  indexes: Index[];
  procedures: Procedure[];
  triggers: Trigger[];
}

export interface DatabaseInfo {
  type: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb' | 'cassandra';
  version: string;
  charset: string;
  collation: string;
}

export interface Table {
  name: string;
  columns: Column[];
  constraints: TableConstraint[];
  engine?: string;
  charset?: string;
}

export interface Column {
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  default?: any;
  autoIncrement?: boolean;
  unsigned?: boolean;
  comment?: string;
}

export interface TableConstraint {
  name: string;
  type: 'primary' | 'foreign' | 'unique' | 'check';
  columns: string[];
  references?: string;
  condition?: string;
}

export interface Procedure {
  name: string;
  parameters: Parameter[];
  returnType: string;
  body: string;
  language: string;
}

export interface Parameter {
  name: string;
  type: string;
  mode: 'in' | 'out' | 'inout';
  default?: any;
}

export interface Trigger {
  name: string;
  table: string;
  timing: 'before' | 'after';
  event: 'insert' | 'update' | 'delete';
  body: string;
}

export interface ModelMapping {
  conceptual: string;
  logical: string;
  physical: string;
  transformation: string;
  validation: string;
}

export interface Compliance {
  frameworks: ComplianceFramework[];
  rules: ComplianceRule[];
  validations: ComplianceValidation[];
  audit: AuditTrail;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  version: string;
  type: 'hipaa' | 'gdpr' | 'pci-dss' | 'soc2' | 'iso27001' | 'custom';
  requirements: ComplianceRequirement[];
  mapping: ComplianceMapping;
}

export interface ComplianceRequirement {
  id: string;
  name: string;
  description: string;
  category: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  implementation: string;
  validation: string;
  evidence: string[];
}

export interface ComplianceMapping {
  requirements: string[];
  components: string[];
  data: string[];
  processes: string[];
}

export interface ComplianceRule {
  id: string;
  name: string;
  framework: string;
  description: string;
  condition: string;
  action: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  automated: boolean;
  implementation: RuleImplementation;
}

export interface RuleImplementation {
  type: 'validation' | 'transformation' | 'encryption' | 'access-control';
  location: string;
  code: string;
  testing: string;
}

export interface ComplianceValidation {
  id: string;
  name: string;
  type: 'automated' | 'manual' | 'hybrid';
  frequency: 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly';
  scope: string;
  criteria: string[];
  results: ValidationResult[];
}

export interface ValidationResult {
  timestamp: string;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  evidence: string;
  actions: string[];
}

export interface AuditTrail {
  enabled: boolean;
  scope: string[];
  retention: string;
  format: 'json' | 'xml' | 'csv';
  encryption: boolean;
  integrity: boolean;
  events: AuditEvent[];
}

export interface AuditEvent {
  id: string;
  type: 'create' | 'read' | 'update' | 'delete' | 'access' | 'system';
  timestamp: string;
  user: string;
  resource: string;
  action: string;
  result: string;
  metadata: any;
}

export interface Deployment {
  environments: Environment[];
  pipelines: Pipeline[];
  configurations: DeploymentConfig[];
  monitoring: MonitoringConfig;
}

export interface Environment {
  id: string;
  name: string;
  type: 'development' | 'testing' | 'staging' | 'production';
  infrastructure: Infrastructure;
  configuration: EnvironmentConfig;
  variables: EnvironmentVariable[];
}

export interface Infrastructure {
  provider: 'aws' | 'azure' | 'gcp' | 'on-premise' | 'hybrid';
  services: Service[];
  networking: Networking;
  security: SecurityConfig;
}

export interface Service {
  name: string;
  type: 'compute' | 'database' | 'storage' | 'network' | 'security';
  configuration: any;
  dependencies: string[];
}

export interface Networking {
  vpc: string;
  subnets: string[];
  securityGroups: string[];
  loadBalancers: string[];
  cdn?: string;
}

export interface SecurityConfig {
  encryption: EncryptionConfig;
  accessControl: AccessControlConfig;
  monitoring: SecurityMonitoring;
}

export interface EncryptionConfig {
  atRest: boolean;
  inTransit: boolean;
  algorithm: string;
  keyManagement: string;
}

export interface AccessControlConfig {
  authentication: string;
  authorization: string;
  mfa: boolean;
  iam: string;
}

export interface SecurityMonitoring {
  enabled: boolean;
  logging: boolean;
  alerting: boolean;
  tools: string[];
}

export interface EnvironmentConfig {
  scaling: ScalingConfig;
  availability: AvailabilityConfig;
  performance: PerformanceConfig;
}

export interface ScalingConfig {
  enabled: boolean;
  minInstances: number;
  maxInstances: number;
  targetCPU: number;
  targetMemory: number;
}

export interface AvailabilityConfig {
  sla: number;
  redundancy: boolean;
  backup: BackupConfig;
  disasterRecovery: DisasterRecoveryConfig;
}

export interface BackupConfig {
  enabled: boolean;
  frequency: string;
  retention: string;
  encryption: boolean;
}

export interface DisasterRecoveryConfig {
  enabled: boolean;
  rto: string;
  rpo: string;
  location: string;
}

export interface PerformanceConfig {
  caching: boolean;
  cdn: boolean;
  optimization: string[];
}

export interface EnvironmentVariable {
  name: string;
  value: string;
  sensitive: boolean;
  description: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  triggers: PipelineTrigger[];
  artifacts: Artifact[];
  notifications: Notification[];
}

export interface PipelineStage {
  id: string;
  name: string;
  type: 'build' | 'test' | 'deploy' | 'validate' | 'security';
  configuration: StageConfig;
  dependencies: string[];
  conditions: Condition[];
}

export interface StageConfig {
  steps: PipelineStep[];
  timeout: number;
  retry: RetryConfig;
  rollback: RollbackConfig;
}

export interface PipelineStep {
  name: string;
  type: 'script' | 'task' | 'approval' | 'scan';
  command: string;
  timeout: number;
  onFailure: string;
}

export interface RetryConfig {
  enabled: boolean;
  maxAttempts: number;
  delay: number;
  backoff: string;
}

export interface RollbackConfig {
  enabled: boolean;
  automatic: boolean;
  triggers: string[];
}

export interface PipelineTrigger {
  type: 'manual' | 'schedule' | 'event' | 'webhook';
  configuration: any;
}

export interface Artifact {
  name: string;
  type: 'binary' | 'docker' | 'config' | 'documentation';
  path: string;
  retention: string;
}

export interface Notification {
  type: 'email' | 'slack' | 'teams' | 'webhook';
  recipients: string[];
  events: string[];
  template: string;
}

export interface DeploymentConfig {
  strategy: 'blue-green' | 'canary' | 'rolling' | 'big-bang';
  healthChecks: HealthCheck[];
  traffic: TrafficConfig;
}

export interface HealthCheck {
  path: string;
  interval: number;
  timeout: number;
  successThreshold: number;
  failureThreshold: number;
}

export interface TrafficConfig {
  enabled: boolean;
  method: 'header' | 'cookie' | 'percentage';
  configuration: any;
}

export interface MonitoringConfig {
  enabled: boolean;
  metrics: Metric[];
  logs: LogConfig;
  alerts: Alert[];
  dashboards: Dashboard[];
}

export interface Metric {
  name: string;
  type: 'counter' | 'gauge' | 'histogram' | 'summary';
  description: string;
  tags: string[];
  aggregation: string;
}

export interface LogConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'text';
  retention: string;
  shipping: LogShipping;
}

export interface LogShipping {
  enabled: boolean;
  destination: string;
  format: string;
  filters: string[];
}

export interface Alert {
  name: string;
  condition: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
  message: string;
}

export interface Dashboard {
  name: string;
  description: string;
  widgets: Widget[];
  refresh: number;
}

export interface Widget {
  type: 'chart' | 'gauge' | 'table' | 'text';
  title: string;
  query: string;
  configuration: any;
}

export interface PerformanceMetrics {
  development: DevelopmentMetrics;
  quality: QualityMetrics;
  efficiency: EfficiencyMetrics;
  maintenance: MaintenanceMetrics;
}

export interface DevelopmentMetrics {
  speed: {
    baseline: number;
    current: number;
    improvement: number;
    unit: string;
  };
  automation: {
    percentage: number;
    areas: string[];
  };
  productivity: {
    baseline: number;
    current: number;
    improvement: number;
    unit: string;
  };
}

export interface QualityMetrics {
  reliability: {
    baseline: number;
    current: number;
    improvement: number;
    unit: string;
  };
  security: {
    baseline: number;
    current: number;
    improvement: number;
    unit: string;
  };
  maintainability: {
    baseline: number;
    current: number;
    improvement: number;
    unit: string;
  };
  performance: {
    baseline: number;
    current: number;
    improvement: number;
    unit: string;
  };
}

export interface EfficiencyMetrics {
  teamSize: {
    baseline: number;
    current: number;
    reduction: number;
    unit: string;
  };
  resourceUtilization: {
    baseline: number;
    current: number;
    improvement: number;
    unit: string;
  };
  costEfficiency: {
    baseline: number;
    current: number;
    improvement: number;
    unit: string;
  };
}

export interface MaintenanceMetrics {
  bugRate: {
    baseline: number;
    current: number;
    reduction: number;
    unit: string;
  };
  technicalDebt: {
    baseline: number;
    current: number;
    reduction: number;
    unit: string;
  };
  uptime: {
    baseline: number;
    current: number;
    improvement: number;
    unit: string;
  };
}