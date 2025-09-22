/**
 * SaaS Admin Panel Reference PAAM
 * A comprehensive SaaS administration panel with user management, billing, and analytics
 */
import { PAAM } from '@/types/paam/schema';
import { PAAMUtils } from '../utils';

export const SAAS_ADMIN_PAAM: PAAM = PAAMUtils.createEmpty(
  "SaaS Admin Panel",
  "Comprehensive SaaS administration panel with user management, billing, and analytics"
);

// Update metadata
SAAS_ADMIN_PAAM.metadata = {
  ...SAAS_ADMIN_PAAM.metadata,
  version: "1.0.0",
  tags: ["saas", "admin", "user-management", "billing", "analytics"],
  platforms: ["web"]
};

// Define entities
SAAS_ADMIN_PAAM.entities = [
  {
    id: "user",
    name: "User",
    description: "Application user with authentication and authorization",
    fields: [
      {
        id: "id",
        name: "ID",
        type: "uuid",
        required: true,
        unique: true
      },
      {
        id: "email",
        name: "Email",
        type: "email",
        required: true,
        unique: true,
        ui: {
          label: "Email Address",
          placeholder: "user@example.com",
          widget: "input"
        }
      },
      {
        id: "password",
        name: "Password",
        type: "string",
        required: true,
        ui: {
          label: "Password",
          placeholder: "Enter password...",
          widget: "password"
        }
      },
      {
        id: "firstName",
        name: "First Name",
        type: "string",
        required: true,
        validation: [
          {
            type: "min",
            value: 1,
            message: "First name must be at least 1 character"
          },
          {
            type: "max",
            value: 100,
            message: "First name must be less than 100 characters"
          }
        ],
        ui: {
          label: "First Name",
          placeholder: "Enter first name...",
          widget: "input"
        }
      },
      {
        id: "lastName",
        name: "Last Name",
        type: "string",
        required: true,
        validation: [
          {
            type: "min",
            value: 1,
            message: "Last name must be at least 1 character"
          },
          {
            type: "max",
            value: 100,
            message: "Last name must be less than 100 characters"
          }
        ],
        ui: {
          label: "Last Name",
          placeholder: "Enter last name...",
          widget: "input"
        }
      },
      {
        id: "role",
        name: "Role",
        type: "enum",
        required: true,
        defaultValue: "user",
        ui: {
          label: "Role",
          widget: "select",
          options: [
            { value: "admin", label: "Administrator" },
            { value: "manager", label: "Manager" },
            { value: "user", label: "User" },
            { value: "guest", label: "Guest" }
          ]
        }
      },
      {
        id: "status",
        name: "Status",
        type: "enum",
        required: true,
        defaultValue: "active",
        ui: {
          label: "Status",
          widget: "select",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "suspended", label: "Suspended" },
            { value: "pending", label: "Pending" }
          ]
        }
      },
      {
        id: "emailVerified",
        name: "Email Verified",
        type: "boolean",
        required: true,
        defaultValue: false,
        ui: {
          label: "Email Verified",
          widget: "checkbox"
        }
      },
      {
        id: "lastLoginAt",
        name: "Last Login At",
        type: "datetime",
        required: false,
        ui: {
          label: "Last Login",
          widget: "datetime"
        }
      },
      {
        id: "avatar",
        name: "Avatar",
        type: "image",
        required: false,
        ui: {
          label: "Profile Picture",
          widget: "file"
        }
      },
      {
        id: "preferences",
        name: "Preferences",
        type: "json",
        required: false,
        defaultValue: {},
        ui: {
          label: "User Preferences",
          widget: "json"
        }
      },
      {
        id: "createdAt",
        name: "Created At",
        type: "datetime",
        required: true,
        defaultValue: new Date().toISOString()
      },
      {
        id: "updatedAt",
        name: "Updated At",
        type: "datetime",
        required: true,
        defaultValue: new Date().toISOString()
      }
    ],
    relationships: [
      {
        id: "user_subscriptions",
        name: "Subscriptions",
        type: "one-to-many",
        targetEntity: "subscription",
        cascade: true,
        onDelete: "cascade"
      },
      {
        id: "user_invoices",
        name: "Invoices",
        type: "one-to-many",
        targetEntity: "invoice",
        cascade: true,
        onDelete: "cascade"
      }
    ],
    constraints: [
      {
        id: "unique_user_email",
        name: "Unique User Email",
        type: "unique",
        fields: ["email"]
      }
    ],
    indexes: [
      {
        id: "idx_user_email",
        name: "User Email Index",
        fields: ["email"]
      },
      {
        id: "idx_user_status",
        name: "User Status Index",
        fields: ["status"]
      },
      {
        id: "idx_user_role",
        name: "User Role Index",
        fields: ["role"]
      }
    ]
  },
  {
    id: "subscription",
    name: "Subscription",
    description: "User subscription plan and billing information",
    fields: [
      {
        id: "id",
        name: "ID",
        type: "uuid",
        required: true,
        unique: true
      },
      {
        id: "userId",
        name: "User",
        type: "reference",
        required: true,
        ui: {
          label: "User",
          widget: "select"
        }
      },
      {
        id: "plan",
        name: "Plan",
        type: "enum",
        required: true,
        ui: {
          label: "Subscription Plan",
          widget: "select",
          options: [
            { value: "free", label: "Free Plan" },
            { value: "basic", label: "Basic Plan" },
            { value: "pro", label: "Professional Plan" },
            { value: "enterprise", label: "Enterprise Plan" }
          ]
        }
      },
      {
        id: "status",
        name: "Status",
        type: "enum",
        required: true,
        defaultValue: "active",
        ui: {
          label: "Subscription Status",
          widget: "select",
          options: [
            { value: "active", label: "Active" },
            { value: "cancelled", label: "Cancelled" },
            { value: "expired", label: "Expired" },
            { value: "pending", label: "Pending" }
          ]
        }
      },
      {
        id: "billingCycle",
        name: "Billing Cycle",
        type: "enum",
        required: true,
        defaultValue: "monthly",
        ui: {
          label: "Billing Cycle",
          widget: "select",
          options: [
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" }
          ]
        }
      },
      {
        id: "price",
        name: "Price",
        type: "float",
        required: true,
        validation: [
          {
            type: "min",
            value: 0,
            message: "Price must be greater than or equal to 0"
          }
        ],
        ui: {
          label: "Price",
          placeholder: "0.00",
          widget: "input"
        }
      },
      {
        id: "currency",
        name: "Currency",
        type: "string",
        required: true,
        defaultValue: "USD",
        ui: {
          label: "Currency",
          placeholder: "USD",
          widget: "input"
        }
      },
      {
        id: "startDate",
        name: "Start Date",
        type: "date",
        required: true,
        ui: {
          label: "Subscription Start Date",
          widget: "date"
        }
      },
      {
        id: "endDate",
        name: "End Date",
        type: "date",
        required: false,
        ui: {
          label: "Subscription End Date",
          widget: "date"
        }
      },
      {
        id: "nextBillingDate",
        name: "Next Billing Date",
        type: "date",
        required: false,
        ui: {
          label: "Next Billing Date",
          widget: "date"
        }
      },
      {
        id: "autoRenew",
        name: "Auto Renew",
        type: "boolean",
        required: true,
        defaultValue: true,
        ui: {
          label: "Auto Renew",
          widget: "checkbox"
        }
      },
      {
        id: "paymentMethodId",
        name: "Payment Method",
        type: "string",
        required: false,
        ui: {
          label: "Payment Method ID",
          placeholder: "pm_123456789",
          widget: "input"
        }
      },
      {
        id: "features",
        name: "Features",
        type: "json",
        required: false,
        defaultValue: {},
        ui: {
          label: "Plan Features",
          widget: "json"
        }
      },
      {
        id: "createdAt",
        name: "Created At",
        type: "datetime",
        required: true,
        defaultValue: new Date().toISOString()
      },
      {
        id: "updatedAt",
        name: "Updated At",
        type: "datetime",
        required: true,
        defaultValue: new Date().toISOString()
      }
    ],
    relationships: [
      {
        id: "subscription_user",
        name: "User",
        type: "many-to-one",
        targetEntity: "user"
      },
      {
        id: "subscription_invoices",
        name: "Invoices",
        type: "one-to-many",
        targetEntity: "invoice",
        cascade: true,
        onDelete: "cascade"
      }
    ],
    constraints: [],
    indexes: [
      {
        id: "idx_subscription_user",
        name: "Subscription User Index",
        fields: ["userId"]
      },
      {
        id: "idx_subscription_status",
        name: "Subscription Status Index",
        fields: ["status"]
      },
      {
        id: "idx_subscription_plan",
        name: "Subscription Plan Index",
        fields: ["plan"]
      }
    ]
  },
  {
    id: "invoice",
    name: "Invoice",
    description: "Billing invoice for subscription payments",
    fields: [
      {
        id: "id",
        name: "ID",
        type: "uuid",
        required: true,
        unique: true
      },
      {
        id: "userId",
        name: "User",
        type: "reference",
        required: true,
        ui: {
          label: "User",
          widget: "select"
        }
      },
      {
        id: "subscriptionId",
        name: "Subscription",
        type: "reference",
        required: true,
        ui: {
          label: "Subscription",
          widget: "select"
        }
      },
      {
        id: "invoiceNumber",
        name: "Invoice Number",
        type: "string",
        required: true,
        unique: true,
        ui: {
          label: "Invoice Number",
          placeholder: "INV-2024-001",
          widget: "input"
        }
      },
      {
        id: "amount",
        name: "Amount",
        type: "float",
        required: true,
        validation: [
          {
            type: "min",
            value: 0,
            message: "Amount must be greater than or equal to 0"
          }
        ],
        ui: {
          label: "Amount",
          placeholder: "0.00",
          widget: "input"
        }
      },
      {
        id: "currency",
        name: "Currency",
        type: "string",
        required: true,
        defaultValue: "USD",
        ui: {
          label: "Currency",
          placeholder: "USD",
          widget: "input"
        }
      },
      {
        id: "status",
        name: "Status",
        type: "enum",
        required: true,
        defaultValue: "pending",
        ui: {
          label: "Invoice Status",
          widget: "select",
          options: [
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "overdue", label: "Overdue" },
            { value: "cancelled", label: "Cancelled" },
            { value: "refunded", label: "Refunded" }
          ]
        }
      },
      {
        id: "dueDate",
        name: "Due Date",
        type: "date",
        required: true,
        ui: {
          label: "Due Date",
          widget: "date"
        }
      },
      {
        id: "paidDate",
        name: "Paid Date",
        type: "datetime",
        required: false,
        ui: {
          label: "Paid Date",
          widget: "datetime"
        }
      },
      {
        id: "items",
        name: "Items",
        type: "json",
        required: true,
        defaultValue: [],
        ui: {
          label: "Invoice Items",
          widget: "json"
        }
      },
      {
        id: "notes",
        name: "Notes",
        type: "text",
        required: false,
        ui: {
          label: "Notes",
          placeholder: "Enter invoice notes...",
          widget: "textarea"
        }
      },
      {
        id: "createdAt",
        name: "Created At",
        type: "datetime",
        required: true,
        defaultValue: new Date().toISOString()
      },
      {
        id: "updatedAt",
        name: "Updated At",
        type: "datetime",
        required: true,
        defaultValue: new Date().toISOString()
      }
    ],
    relationships: [
      {
        id: "invoice_user",
        name: "User",
        type: "many-to-one",
        targetEntity: "user"
      },
      {
        id: "invoice_subscription",
        name: "Subscription",
        type: "many-to-one",
        targetEntity: "subscription"
      }
    ],
    constraints: [
      {
        id: "unique_invoice_number",
        name: "Unique Invoice Number",
        type: "unique",
        fields: ["invoiceNumber"]
      }
    ],
    indexes: [
      {
        id: "idx_invoice_user",
        name: "Invoice User Index",
        fields: ["userId"]
      },
      {
        id: "idx_invoice_subscription",
        name: "Invoice Subscription Index",
        fields: ["subscriptionId"]
      },
      {
        id: "idx_invoice_status",
        name: "Invoice Status Index",
        fields: ["status"]
      },
      {
        id: "idx_invoice_due_date",
        name: "Invoice Due Date Index",
        fields: ["dueDate"]
      }
    ]
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Application analytics and metrics",
    fields: [
      {
        id: "id",
        name: "ID",
        type: "uuid",
        required: true,
        unique: true
      },
      {
        id: "date",
        name: "Date",
        type: "date",
        required: true,
        ui: {
          label: "Date",
          widget: "date"
        }
      },
      {
        id: "metric",
        name: "Metric",
        type: "enum",
        required: true,
        ui: {
          label: "Metric Type",
          widget: "select",
          options: [
            { value: "users", label: "Users" },
            { value: "subscriptions", label: "Subscriptions" },
            { value: "revenue", label: "Revenue" },
            { value: "active_users", label: "Active Users" },
            { value: "new_users", label: "New Users" },
            { value: "churn", label: "Churn" }
          ]
        }
      },
      {
        id: "value",
        name: "Value",
        type: "float",
        required: true,
        ui: {
          label: "Metric Value",
          placeholder: "0.00",
          widget: "input"
        }
      },
      {
        id: "dimensions",
        name: "Dimensions",
        type: "json",
        required: false,
        defaultValue: {},
        ui: {
          label: "Dimensions",
          widget: "json"
        }
      },
      {
        id: "createdAt",
        name: "Created At",
        type: "datetime",
        required: true,
        defaultValue: new Date().toISOString()
      }
    ],
    relationships: [],
    constraints: [],
    indexes: [
      {
        id: "idx_analytics_date",
        name: "Analytics Date Index",
        fields: ["date"]
      },
      {
        id: "idx_analytics_metric",
        name: "Analytics Metric Index",
        fields: ["metric"]
      }
    ]
  }
];

// Define authentication configuration
SAAS_ADMIN_PAAM.auth = {
  enabled: true,
  providers: [
    {
      type: "email",
      name: "Email/Password",
      config: {
        requireVerification: true,
        passwordMinLength: 8,
        allowSignUp: true
      }
    },
    {
      type: "oauth",
      name: "Google",
      config: {
        clientId: "your-google-client-id",
        clientSecret: "your-google-client-secret",
        scopes: ["email", "profile"]
      }
    },
    {
      type: "oauth",
      name: "GitHub",
      config: {
        clientId: "your-github-client-id",
        clientSecret: "your-github-client-secret",
        scopes: ["user:email"]
      }
    }
  ],
  roles: [
    {
      id: "admin",
      name: "Administrator",
      description: "Full system access",
      permissions: ["users.*", "subscriptions.*", "invoices.*", "analytics.*", "system.*"]
    },
    {
      id: "manager",
      name: "Manager",
      description: "Manage users and view analytics",
      permissions: ["users.read", "users.update", "subscriptions.read", "invoices.read", "analytics.read"]
    },
    {
      id: "user",
      name: "User",
      description: "Basic user access",
      permissions: ["users.read.own", "subscriptions.read.own", "invoices.read.own"]
    },
    {
      id: "guest",
      name: "Guest",
      description: "Limited access",
      permissions: ["users.read.public"]
    }
  ],
  permissions: [
    {
      id: "users.create",
      name: "Create Users",
      description: "Create new user accounts",
      resource: "users",
      action: "create"
    },
    {
      id: "users.read",
      name: "Read Users",
      description: "Read user information",
      resource: "users",
      action: "read"
    },
    {
      id: "users.update",
      name: "Update Users",
      description: "Update user information",
      resource: "users",
      action: "update"
    },
    {
      id: "users.delete",
      name: "Delete Users",
      description: "Delete user accounts",
      resource: "users",
      action: "delete"
    },
    {
      id: "subscriptions.create",
      name: "Create Subscriptions",
      description: "Create new subscriptions",
      resource: "subscriptions",
      action: "create"
    },
    {
      id: "subscriptions.read",
      name: "Read Subscriptions",
      description: "Read subscription information",
      resource: "subscriptions",
      action: "read"
    },
    {
      id: "subscriptions.update",
      name: "Update Subscriptions",
      description: "Update subscription information",
      resource: "subscriptions",
      action: "update"
    },
    {
      id: "subscriptions.delete",
      name: "Delete Subscriptions",
      description: "Delete subscriptions",
      resource: "subscriptions",
      action: "delete"
    },
    {
      id: "invoices.create",
      name: "Create Invoices",
      description: "Create new invoices",
      resource: "invoices",
      action: "create"
    },
    {
      id: "invoices.read",
      name: "Read Invoices",
      description: "Read invoice information",
      resource: "invoices",
      action: "read"
    },
    {
      id: "invoices.update",
      name: "Update Invoices",
      description: "Update invoice information",
      resource: "invoices",
      action: "update"
    },
    {
      id: "invoices.delete",
      name: "Delete Invoices",
      description: "Delete invoices",
      resource: "invoices",
      action: "delete"
    },
    {
      id: "analytics.read",
      name: "Read Analytics",
      description: "Read analytics data",
      resource: "analytics",
      action: "read"
    }
  ],
  policies: [
    {
      id: "admin_full_access",
      name: "Admin Full Access",
      description: "Grant administrators full access to all resources",
      effect: "allow",
      conditions: [
        {
          field: "user.role",
          operator: "eq",
          value: "admin"
        }
      ]
    },
    {
      id: "user_own_data",
      name: "User Own Data",
      description: "Allow users to access their own data",
      effect: "allow",
      conditions: [
        {
          field: "user.id",
          operator: "eq",
          value: "resource.userId"
        }
      ]
    }
  ]
};

// Define flows (simplified for brevity)
SAAS_ADMIN_PAAM.flows = [
  {
    id: "user_registration",
    name: "User Registration",
    description: "Register a new user account",
    type: "auth",
    steps: [
      {
        id: "show_registration_form",
        name: "Show Registration Form",
        type: "form",
        config: {
          entity: "user",
          fields: ["email", "password", "firstName", "lastName"],
          submitLabel: "Register",
          cancelLabel: "Cancel"
        },
        nextSteps: ["validate_input"]
      },
      {
        id: "validate_input",
        name: "Validate Input",
        type: "validation",
        config: {
          entity: "user",
          rules: [
            { field: "email", required: true, type: "email" },
            { field: "password", required: true, minLength: 8 },
            { field: "firstName", required: true, minLength: 1, maxLength: 100 },
            { field: "lastName", required: true, minLength: 1, maxLength: 100 }
          ]
        },
        nextSteps: ["check_email_exists"]
      },
      {
        id: "check_email_exists",
        name: "Check Email Exists",
        type: "api-call",
        config: {
          method: "POST",
          endpoint: "/api/auth/check-email",
          data: {
            email: "{{email}}"
          }
        },
        nextSteps: ["create_user"]
      },
      {
        id: "create_user",
        name: "Create User",
        type: "api-call",
        config: {
          method: "POST",
          endpoint: "/api/auth/register",
          data: {
            email: "{{email}}",
            password: "{{password}}",
            firstName: "{{firstName}}",
            lastName: "{{lastName}}"
          }
        },
        nextSteps: ["send_verification_email"]
      },
      {
        id: "send_verification_email",
        name: "Send Verification Email",
        type: "notification",
        config: {
          type: "email",
          template: "email-verification",
          to: "{{email}}",
          data: {
            verificationLink: "{{verificationLink}}"
          }
        },
        nextSteps: ["show_success"]
      },
      {
        id: "show_success",
        name: "Show Success",
        type: "notification",
        config: {
          type: "success",
          message: "Registration successful! Please check your email to verify your account.",
          duration: 5000
        }
      }
    ],
    triggers: [
      {
        id: "http_trigger",
        type: "http",
        config: {
          path: "/auth/register",
          method: "GET"
        }
      }
    ]
  },
  {
    id: "user_login",
    name: "User Login",
    description: "User authentication and login",
    type: "auth",
    steps: [
      {
        id: "show_login_form",
        name: "Show Login Form",
        type: "form",
        config: {
          entity: "user",
          fields: ["email", "password"],
          submitLabel: "Login",
          cancelLabel: "Cancel"
        },
        nextSteps: ["validate_input"]
      },
      {
        id: "validate_input",
        name: "Validate Input",
        type: "validation",
        config: {
          entity: "user",
          rules: [
            { field: "email", required: true, type: "email" },
            { field: "password", required: true }
          ]
        },
        nextSteps: ["authenticate_user"]
      },
      {
        id: "authenticate_user",
        name: "Authenticate User",
        type: "api-call",
        config: {
          method: "POST",
          endpoint: "/api/auth/login",
          data: {
            email: "{{email}}",
            password: "{{password}}"
          }
        },
        nextSteps: ["check_user_status"]
      },
      {
        id: "check_user_status",
        name: "Check User Status",
        type: "conditional",
        config: {
          condition: {
            field: "user.status",
            operator: "eq",
            value: "active"
          },
          truePath: "redirect_to_dashboard",
          falsePath: "show_error"
        }
      },
      {
        id: "redirect_to_dashboard",
        name: "Redirect to Dashboard",
        type: "redirect",
        config: {
          url: "/dashboard"
        }
      },
      {
        id: "show_error",
        name: "Show Error",
        type: "notification",
        config: {
          type: "error",
          message: "Account is not active. Please contact support.",
          duration: 5000
        }
      }
    ],
    triggers: [
      {
        id: "http_trigger",
        type: "http",
        config: {
          path: "/auth/login",
          method: "GET"
        }
      }
    ]
  }
];

// Update UI configuration
SAAS_ADMIN_PAAM.ui = {
  ...SAAS_ADMIN_PAAM.ui,
  components: [
    {
      id: "user_form",
      name: "User Form",
      type: "form",
      config: {
        layout: "vertical",
        submitButton: "Save User",
        cancelButton: "Cancel"
      },
      dataBinding: {
        entity: "user",
        fields: ["email", "firstName", "lastName", "role", "status", "emailVerified"]
      }
    },
    {
      id: "subscription_form",
      name: "Subscription Form",
      type: "form",
      config: {
        layout: "vertical",
        submitButton: "Save Subscription",
        cancelButton: "Cancel"
      },
      dataBinding: {
        entity: "subscription",
        fields: ["userId", "plan", "status", "billingCycle", "price", "currency", "startDate", "endDate", "autoRenew"]
      }
    },
    {
      id: "invoice_form",
      name: "Invoice Form",
      type: "form",
      config: {
        layout: "vertical",
        submitButton: "Save Invoice",
        cancelButton: "Cancel"
      },
      dataBinding: {
        entity: "invoice",
        fields: ["userId", "subscriptionId", "amount", "currency", "status", "dueDate", "items", "notes"]
      }
    },
    {
      id: "user_list",
      name: "User List",
      type: "table",
      config: {
        columns: [
          { field: "email", label: "Email", sortable: true },
          { field: "firstName", label: "First Name", sortable: true },
          { field: "lastName", label: "Last Name", sortable: true },
          { field: "role", label: "Role", sortable: true },
          { field: "status", label: "Status", sortable: true },
          { field: "emailVerified", label: "Email Verified", sortable: true },
          { field: "lastLoginAt", label: "Last Login", sortable: true },
          { field: "createdAt", label: "Created At", sortable: true }
        ],
        actions: ["edit", "delete", "view_subscriptions", "view_invoices"],
        filters: ["role", "status", "emailVerified"],
        search: ["email", "firstName", "lastName"],
        pagination: true
      },
      dataBinding: {
        entity: "user",
        fields: ["email", "firstName", "lastName", "role", "status", "emailVerified", "lastLoginAt", "createdAt"],
        sort: [{ field: "createdAt", direction: "desc" }],
        pagination: { enabled: true, pageSize: 20 }
      }
    },
    {
      id: "subscription_list",
      name: "Subscription List",
      type: "table",
      config: {
        columns: [
          { field: "user", label: "User", sortable: true },
          { field: "plan", label: "Plan", sortable: true },
          { field: "status", label: "Status", sortable: true },
          { field: "billingCycle", label: "Billing Cycle", sortable: true },
          { field: "price", label: "Price", sortable: true },
          { field: "currency", label: "Currency", sortable: true },
          { field: "startDate", label: "Start Date", sortable: true },
          { field: "nextBillingDate", label: "Next Billing", sortable: true }
        ],
        actions: ["edit", "delete", "view_invoices"],
        filters: ["plan", "status", "billingCycle"],
        search: ["user"],
        pagination: true
      },
      dataBinding: {
        entity: "subscription",
        fields: ["userId", "plan", "status", "billingCycle", "price", "currency", "startDate", "nextBillingDate"],
        sort: [{ field: "createdAt", direction: "desc" }],
        pagination: { enabled: true, pageSize: 20 }
      }
    },
    {
      id: "invoice_list",
      name: "Invoice List",
      type: "table",
      config: {
        columns: [
          { field: "invoiceNumber", label: "Invoice #", sortable: true },
          { field: "user", label: "User", sortable: true },
          { field: "subscription", label: "Subscription", sortable: true },
          { field: "amount", label: "Amount", sortable: true },
          { field: "currency", label: "Currency", sortable: true },
          { field: "status", label: "Status", sortable: true },
          { field: "dueDate", label: "Due Date", sortable: true },
          { field: "paidDate", label: "Paid Date", sortable: true }
        ],
        actions: ["edit", "delete", "view_pdf"],
        filters: ["status", "currency"],
        search: ["invoiceNumber", "user"],
        pagination: true
      },
      dataBinding: {
        entity: "invoice",
        fields: ["invoiceNumber", "userId", "subscriptionId", "amount", "currency", "status", "dueDate", "paidDate"],
        sort: [{ field: "createdAt", direction: "desc" }],
        pagination: { enabled: true, pageSize: 20 }
      }
    },
    {
      id: "dashboard_stats",
      name: "Dashboard Statistics",
      type: "chart",
      config: {
        type: "mixed",
        title: "Dashboard Overview",
        charts: [
          {
            type: "line",
            title: "Revenue Trend",
            dataField: "revenue",
            timeField: "date"
          },
          {
            type: "bar",
            title: "User Growth",
            dataField: "users",
            timeField: "date"
          },
          {
            type: "pie",
            title: "Subscription Distribution",
            dataField: "plan"
          }
        ]
      },
      dataBinding: {
        entity: "analytics",
        fields: ["date", "metric", "value"]
      }
    }
  ],
  pages: [
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/dashboard",
      title: "Dashboard",
      components: ["dashboard_stats"],
      layout: "dashboard",
      auth: [
        {
          role: "admin",
          permissions: ["analytics.read"]
        }
      ]
    },
    {
      id: "users",
      name: "Users",
      path: "/users",
      title: "Users",
      components: ["user_list"],
      layout: "default",
      auth: [
        {
          role: "admin",
          permissions: ["users.read"]
        }
      ]
    },
    {
      id: "new_user",
      name: "New User",
      path: "/users/new",
      title: "Create User",
      components: ["user_form"],
      layout: "default",
      auth: [
        {
          role: "admin",
          permissions: ["users.create"]
        }
      ]
    },
    {
      id: "subscriptions",
      name: "Subscriptions",
      path: "/subscriptions",
      title: "Subscriptions",
      components: ["subscription_list"],
      layout: "default",
      auth: [
        {
          role: "admin",
          permissions: ["subscriptions.read"]
        }
      ]
    },
    {
      id: "new_subscription",
      name: "New Subscription",
      path: "/subscriptions/new",
      title: "Create Subscription",
      components: ["subscription_form"],
      layout: "default",
      auth: [
        {
          role: "admin",
          permissions: ["subscriptions.create"]
        }
      ]
    },
    {
      id: "invoices",
      name: "Invoices",
      path: "/invoices",
      title: "Invoices",
      components: ["invoice_list"],
      layout: "default",
      auth: [
        {
          role: "admin",
          permissions: ["invoices.read"]
        }
      ]
    },
    {
      id: "new_invoice",
      name: "New Invoice",
      path: "/invoices/new",
      title: "Create Invoice",
      components: ["invoice_form"],
      layout: "default",
      auth: [
        {
          role: "admin",
          permissions: ["invoices.create"]
        }
      ]
    },
    {
      id: "analytics",
      name: "Analytics",
      path: "/analytics",
      title: "Analytics",
      components: ["analytics_dashboard"],
      layout: "default",
      auth: [
        {
          role: "admin",
          permissions: ["analytics.read"]
        }
      ]
    }
  ]
};

// Update navigation
SAAS_ADMIN_PAAM.ui.layout.navigation = {
  items: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "Dashboard",
      href: "/dashboard",
      auth: [
        {
          role: "admin",
          permissions: ["analytics.read"]
        }
      ]
    },
    {
      id: "users",
      label: "Users",
      icon: "Users",
      href: "/users",
      children: [
        {
          id: "new_user",
          label: "New User",
          href: "/users/new",
          auth: [
            {
              role: "admin",
              permissions: ["users.create"]
            }
          ]
        }
      ],
      auth: [
        {
          role: "admin",
          permissions: ["users.read"]
        }
      ]
    },
    {
      id: "subscriptions",
      label: "Subscriptions",
      icon: "CreditCard",
      href: "/subscriptions",
      children: [
        {
          id: "new_subscription",
          label: "New Subscription",
          href: "/subscriptions/new",
          auth: [
            {
              role: "admin",
              permissions: ["subscriptions.create"]
            }
          ]
        }
      ],
      auth: [
        {
          role: "admin",
          permissions: ["subscriptions.read"]
        }
      ]
    },
    {
      id: "invoices",
      label: "Invoices",
      icon: "FileText",
      href: "/invoices",
      children: [
        {
          id: "new_invoice",
          label: "New Invoice",
          href: "/invoices/new",
          auth: [
            {
              role: "admin",
              permissions: ["invoices.create"]
            }
          ]
        }
      ],
      auth: [
        {
          role: "admin",
          permissions: ["invoices.read"]
        }
      ]
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "BarChart3",
      href: "/analytics",
      auth: [
        {
          role: "admin",
          permissions: ["analytics.read"]
        }
      ]
    }
  ],
  position: "side"
};