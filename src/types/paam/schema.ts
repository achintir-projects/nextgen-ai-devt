/**
 * PAAM v0 - Platform-Agnostic Application Model
 * Core schema for representing applications in a platform-agnostic way
 */

export interface PAAM {
  $schema: string;
  version: string;
  metadata: PAAMMetadata;
  entities: Entity[];
  flows: Flow[];
  auth: AuthConfig;
  ui: UIConfig;
  api: APIConfig;
  data: DataConfig;
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