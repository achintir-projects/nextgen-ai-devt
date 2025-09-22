/**
 * CRM System Reference PAAM
 * A customer relationship management system for managing contacts, companies, and interactions
 */
import { PAAM } from '@/types/paam/schema';
import { PAAMUtils } from '../utils';

export const CRM_SYSTEM_PAAM: PAAM = PAAMUtils.createEmpty(
  "CRM System",
  "Customer relationship management system for managing contacts, companies, and interactions"
);

// Update metadata
CRM_SYSTEM_PAAM.metadata = {
  ...CRM_SYSTEM_PAAM.metadata,
  version: "1.0.0",
  tags: ["crm", "customer-management", "sales", "business"],
  platforms: ["web"]
};

// Define entities
CRM_SYSTEM_PAAM.entities = [
  {
    id: "company",
    name: "Company",
    description: "A company or organization",
    fields: [
      {
        id: "id",
        name: "ID",
        type: "uuid",
        required: true,
        unique: true
      },
      {
        id: "name",
        name: "Name",
        type: "string",
        required: true,
        validation: [
          {
            type: "min",
            value: 1,
            message: "Company name must be at least 1 character"
          },
          {
            type: "max",
            value: 255,
            message: "Company name must be less than 255 characters"
          }
        ],
        ui: {
          label: "Company Name",
          placeholder: "Enter company name...",
          widget: "input"
        }
      },
      {
        id: "website",
        name: "Website",
        type: "url",
        required: false,
        ui: {
          label: "Website",
          placeholder: "https://example.com",
          widget: "input"
        }
      },
      {
        id: "industry",
        name: "Industry",
        type: "enum",
        required: false,
        ui: {
          label: "Industry",
          widget: "select",
          options: [
            { value: "technology", label: "Technology" },
            { value: "healthcare", label: "Healthcare" },
            { value: "finance", label: "Finance" },
            { value: "education", label: "Education" },
            { value: "retail", label: "Retail" },
            { value: "manufacturing", label: "Manufacturing" },
            { value: "other", label: "Other" }
          ]
        }
      },
      {
        id: "size",
        name: "Company Size",
        type: "enum",
        required: false,
        ui: {
          label: "Company Size",
          widget: "select",
          options: [
            { value: "1-10", label: "1-10 employees" },
            { value: "11-50", label: "11-50 employees" },
            { value: "51-200", label: "51-200 employees" },
            { value: "201-1000", label: "201-1000 employees" },
            { value: "1000+", label: "1000+ employees" }
          ]
        }
      },
      {
        id: "phone",
        name: "Phone",
        type: "string",
        required: false,
        ui: {
          label: "Phone Number",
          placeholder: "+1 (555) 123-4567",
          widget: "input"
        }
      },
      {
        id: "email",
        name: "Email",
        type: "email",
        required: false,
        ui: {
          label: "Email",
          placeholder: "company@example.com",
          widget: "input"
        }
      },
      {
        id: "address",
        name: "Address",
        type: "text",
        required: false,
        ui: {
          label: "Address",
          placeholder: "Enter company address...",
          widget: "textarea"
        }
      },
      {
        id: "notes",
        name: "Notes",
        type: "text",
        required: false,
        ui: {
          label: "Notes",
          placeholder: "Enter company notes...",
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
        id: "company_contacts",
        name: "Contacts",
        type: "one-to-many",
        targetEntity: "contact",
        cascade: true,
        onDelete: "cascade"
      }
    ],
    constraints: [
      {
        id: "unique_company_name",
        name: "Unique Company Name",
        type: "unique",
        fields: ["name"]
      }
    ],
    indexes: [
      {
        id: "idx_company_name",
        name: "Company Name Index",
        fields: ["name"]
      },
      {
        id: "idx_company_industry",
        name: "Company Industry Index",
        fields: ["industry"]
      }
    ]
  },
  {
    id: "contact",
    name: "Contact",
    description: "A person associated with a company",
    fields: [
      {
        id: "id",
        name: "ID",
        type: "uuid",
        required: true,
        unique: true
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
        id: "email",
        name: "Email",
        type: "email",
        required: true,
        unique: true,
        ui: {
          label: "Email",
          placeholder: "contact@example.com",
          widget: "input"
        }
      },
      {
        id: "phone",
        name: "Phone",
        type: "string",
        required: false,
        ui: {
          label: "Phone Number",
          placeholder: "+1 (555) 123-4567",
          widget: "input"
        }
      },
      {
        id: "position",
        name: "Position",
        type: "string",
        required: false,
        ui: {
          label: "Position",
          placeholder: "Enter position...",
          widget: "input"
        }
      },
      {
        id: "department",
        name: "Department",
        type: "string",
        required: false,
        ui: {
          label: "Department",
          placeholder: "Enter department...",
          widget: "input"
        }
      },
      {
        id: "companyId",
        name: "Company",
        type: "reference",
        required: true,
        ui: {
          label: "Company",
          widget: "select"
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
            { value: "lead", label: "Lead" }
          ]
        }
      },
      {
        id: "notes",
        name: "Notes",
        type: "text",
        required: false,
        ui: {
          label: "Notes",
          placeholder: "Enter contact notes...",
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
        id: "contact_company",
        name: "Company",
        type: "many-to-one",
        targetEntity: "company"
      },
      {
        id: "contact_interactions",
        name: "Interactions",
        type: "one-to-many",
        targetEntity: "interaction",
        cascade: true,
        onDelete: "cascade"
      }
    ],
    constraints: [
      {
        id: "unique_contact_email",
        name: "Unique Contact Email",
        type: "unique",
        fields: ["email"]
      }
    ],
    indexes: [
      {
        id: "idx_contact_name",
        name: "Contact Name Index",
        fields: ["firstName", "lastName"]
      },
      {
        id: "idx_contact_email",
        name: "Contact Email Index",
        fields: ["email"]
      },
      {
        id: "idx_contact_company",
        name: "Contact Company Index",
        fields: ["companyId"]
      }
    ]
  },
  {
    id: "interaction",
    name: "Interaction",
    description: "An interaction or communication with a contact",
    fields: [
      {
        id: "id",
        name: "ID",
        type: "uuid",
        required: true,
        unique: true
      },
      {
        id: "contactId",
        name: "Contact",
        type: "reference",
        required: true,
        ui: {
          label: "Contact",
          widget: "select"
        }
      },
      {
        id: "type",
        name: "Type",
        type: "enum",
        required: true,
        ui: {
          label: "Interaction Type",
          widget: "select",
          options: [
            { value: "call", label: "Phone Call" },
            { value: "email", label: "Email" },
            { value: "meeting", label: "Meeting" },
            { value: "demo", label: "Demo" },
            { value: "conference", label: "Conference" },
            { value: "other", label: "Other" }
          ]
        }
      },
      {
        id: "subject",
        name: "Subject",
        type: "string",
        required: true,
        validation: [
          {
            type: "min",
            value: 1,
            message: "Subject must be at least 1 character"
          },
          {
            type: "max",
            value: 255,
            message: "Subject must be less than 255 characters"
          }
        ],
        ui: {
          label: "Subject",
          placeholder: "Enter interaction subject...",
          widget: "input"
        }
      },
      {
        id: "description",
        name: "Description",
        type: "text",
        required: false,
        ui: {
          label: "Description",
          placeholder: "Enter interaction description...",
          widget: "textarea"
        }
      },
      {
        id: "date",
        name: "Date",
        type: "datetime",
        required: true,
        defaultValue: new Date().toISOString(),
        ui: {
          label: "Date",
          widget: "datetime"
        }
      },
      {
        id: "duration",
        name: "Duration",
        type: "integer",
        required: false,
        ui: {
          label: "Duration (minutes)",
          placeholder: "Enter duration in minutes...",
          widget: "input"
        }
      },
      {
        id: "outcome",
        name: "Outcome",
        type: "enum",
        required: false,
        ui: {
          label: "Outcome",
          widget: "select",
          options: [
            { value: "positive", label: "Positive" },
            { value: "neutral", label: "Neutral" },
            { value: "negative", label: "Negative" }
          ]
        }
      },
      {
        id: "followUpRequired",
        name: "Follow Up Required",
        type: "boolean",
        required: true,
        defaultValue: false,
        ui: {
          label: "Follow Up Required",
          widget: "checkbox"
        }
      },
      {
        id: "followUpDate",
        name: "Follow Up Date",
        type: "datetime",
        required: false,
        ui: {
          label: "Follow Up Date",
          widget: "datetime"
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
        id: "interaction_contact",
        name: "Contact",
        type: "many-to-one",
        targetEntity: "contact"
      }
    ],
    constraints: [],
    indexes: [
      {
        id: "idx_interaction_contact",
        name: "Interaction Contact Index",
        fields: ["contactId"]
      },
      {
        id: "idx_interaction_date",
        name: "Interaction Date Index",
        fields: ["date"]
      },
      {
        id: "idx_interaction_type",
        name: "Interaction Type Index",
        fields: ["type"]
      }
    ]
  }
];

// Define flows (simplified for brevity)
CRM_SYSTEM_PAAM.flows = [
  {
    id: "create_company",
    name: "Create Company",
    description: "Create a new company",
    type: "create",
    steps: [
      {
        id: "show_form",
        name: "Show Company Form",
        type: "form",
        config: {
          entity: "company",
          fields: ["name", "website", "industry", "size", "phone", "email", "address", "notes"],
          submitLabel: "Create Company",
          cancelLabel: "Cancel"
        },
        nextSteps: ["validate_input"]
      },
      {
        id: "validate_input",
        name: "Validate Input",
        type: "validation",
        config: {
          entity: "company",
          rules: [
            { field: "name", required: true, minLength: 1, maxLength: 255 }
          ]
        },
        nextSteps: ["save_company"]
      },
      {
        id: "save_company",
        name: "Save Company",
        type: "api-call",
        config: {
          method: "POST",
          endpoint: "/api/companies",
          data: {
            name: "{{name}}",
            website: "{{website}}",
            industry: "{{industry}}",
            size: "{{size}}",
            phone: "{{phone}}",
            email: "{{email}}",
            address: "{{address}}",
            notes: "{{notes}}"
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
          message: "Company created successfully!",
          duration: 3000
        }
      }
    ],
    triggers: [
      {
        id: "http_trigger",
        type: "http",
        config: {
          path: "/companies/new",
          method: "GET"
        }
      }
    ]
  },
  {
    id: "create_contact",
    name: "Create Contact",
    description: "Create a new contact",
    type: "create",
    steps: [
      {
        id: "show_form",
        name: "Show Contact Form",
        type: "form",
        config: {
          entity: "contact",
          fields: ["firstName", "lastName", "email", "phone", "position", "department", "companyId", "status", "notes"],
          submitLabel: "Create Contact",
          cancelLabel: "Cancel"
        },
        nextSteps: ["validate_input"]
      },
      {
        id: "validate_input",
        name: "Validate Input",
        type: "validation",
        config: {
          entity: "contact",
          rules: [
            { field: "firstName", required: true, minLength: 1, maxLength: 100 },
            { field: "lastName", required: true, minLength: 1, maxLength: 100 },
            { field: "email", required: true, type: "email" }
          ]
        },
        nextSteps: ["save_contact"]
      },
      {
        id: "save_contact",
        name: "Save Contact",
        type: "api-call",
        config: {
          method: "POST",
          endpoint: "/api/contacts",
          data: {
            firstName: "{{firstName}}",
            lastName: "{{lastName}}",
            email: "{{email}}",
            phone: "{{phone}}",
            position: "{{position}}",
            department: "{{department}}",
            companyId: "{{companyId}}",
            status: "{{status}}",
            notes: "{{notes}}"
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
          message: "Contact created successfully!",
          duration: 3000
        }
      }
    ],
    triggers: [
      {
        id: "http_trigger",
        type: "http",
        config: {
          path: "/contacts/new",
          method: "GET"
        }
      }
    ]
  },
  {
    id: "create_interaction",
    name: "Create Interaction",
    description: "Create a new interaction",
    type: "create",
    steps: [
      {
        id: "show_form",
        name: "Show Interaction Form",
        type: "form",
        config: {
          entity: "interaction",
          fields: ["contactId", "type", "subject", "description", "date", "duration", "outcome", "followUpRequired", "followUpDate"],
          submitLabel: "Create Interaction",
          cancelLabel: "Cancel"
        },
        nextSteps: ["validate_input"]
      },
      {
        id: "validate_input",
        name: "Validate Input",
        type: "validation",
        config: {
          entity: "interaction",
          rules: [
            { field: "contactId", required: true },
            { field: "type", required: true },
            { field: "subject", required: true, minLength: 1, maxLength: 255 }
          ]
        },
        nextSteps: ["save_interaction"]
      },
      {
        id: "save_interaction",
        name: "Save Interaction",
        type: "api-call",
        config: {
          method: "POST",
          endpoint: "/api/interactions",
          data: {
            contactId: "{{contactId}}",
            type: "{{type}}",
            subject: "{{subject}}",
            description: "{{description}}",
            date: "{{date}}",
            duration: "{{duration}}",
            outcome: "{{outcome}}",
            followUpRequired: "{{followUpRequired}}",
            followUpDate: "{{followUpDate}}"
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
          message: "Interaction created successfully!",
          duration: 3000
        }
      }
    ],
    triggers: [
      {
        id: "http_trigger",
        type: "http",
        config: {
          path: "/interactions/new",
          method: "GET"
        }
      }
    ]
  }
];

// Update UI configuration
CRM_SYSTEM_PAAM.ui = {
  ...CRM_SYSTEM_PAAM.ui,
  components: [
    {
      id: "company_form",
      name: "Company Form",
      type: "form",
      config: {
        layout: "vertical",
        submitButton: "Save Company",
        cancelButton: "Cancel"
      },
      dataBinding: {
        entity: "company",
        fields: ["name", "website", "industry", "size", "phone", "email", "address", "notes"]
      }
    },
    {
      id: "contact_form",
      name: "Contact Form",
      type: "form",
      config: {
        layout: "vertical",
        submitButton: "Save Contact",
        cancelButton: "Cancel"
      },
      dataBinding: {
        entity: "contact",
        fields: ["firstName", "lastName", "email", "phone", "position", "department", "companyId", "status", "notes"]
      }
    },
    {
      id: "interaction_form",
      name: "Interaction Form",
      type: "form",
      config: {
        layout: "vertical",
        submitButton: "Save Interaction",
        cancelButton: "Cancel"
      },
      dataBinding: {
        entity: "interaction",
        fields: ["contactId", "type", "subject", "description", "date", "duration", "outcome", "followUpRequired", "followUpDate"]
      }
    },
    {
      id: "company_list",
      name: "Company List",
      type: "table",
      config: {
        columns: [
          { field: "name", label: "Name", sortable: true },
          { field: "industry", label: "Industry", sortable: true },
          { field: "size", label: "Size", sortable: true },
          { field: "website", label: "Website", sortable: false },
          { field: "phone", label: "Phone", sortable: false },
          { field: "email", label: "Email", sortable: false }
        ],
        actions: ["edit", "delete", "view_contacts"],
        filters: ["industry", "size"],
        search: ["name", "website", "email"],
        pagination: true
      },
      dataBinding: {
        entity: "company",
        fields: ["name", "industry", "size", "website", "phone", "email"],
        sort: [{ field: "name", direction: "asc" }],
        pagination: { enabled: true, pageSize: 20 }
      }
    },
    {
      id: "contact_list",
      name: "Contact List",
      type: "table",
      config: {
        columns: [
          { field: "firstName", label: "First Name", sortable: true },
          { field: "lastName", label: "Last Name", sortable: true },
          { field: "email", label: "Email", sortable: true },
          { field: "position", label: "Position", sortable: true },
          { field: "company", label: "Company", sortable: true },
          { field: "status", label: "Status", sortable: true }
        ],
        actions: ["edit", "delete", "view_interactions"],
        filters: ["status", "company"],
        search: ["firstName", "lastName", "email", "position"],
        pagination: true
      },
      dataBinding: {
        entity: "contact",
        fields: ["firstName", "lastName", "email", "position", "companyId", "status"],
        sort: [{ field: "lastName", direction: "asc" }],
        pagination: { enabled: true, pageSize: 20 }
      }
    },
    {
      id: "interaction_list",
      name: "Interaction List",
      type: "table",
      config: {
        columns: [
          { field: "contact", label: "Contact", sortable: true },
          { field: "type", label: "Type", sortable: true },
          { field: "subject", label: "Subject", sortable: true },
          { field: "date", label: "Date", sortable: true },
          { field: "outcome", label: "Outcome", sortable: true },
          { field: "followUpRequired", label: "Follow Up", sortable: true }
        ],
        actions: ["edit", "delete"],
        filters: ["type", "outcome", "followUpRequired"],
        search: ["subject", "description"],
        pagination: true
      },
      dataBinding: {
        entity: "interaction",
        fields: ["contactId", "type", "subject", "date", "outcome", "followUpRequired"],
        sort: [{ field: "date", direction: "desc" }],
        pagination: { enabled: true, pageSize: 20 }
      }
    }
  ],
  pages: [
    {
      id: "dashboard",
      name: "Dashboard",
      path: "/",
      title: "CRM Dashboard",
      components: ["company_stats", "contact_stats", "interaction_stats"],
      layout: "dashboard"
    },
    {
      id: "companies",
      name: "Companies",
      path: "/companies",
      title: "Companies",
      components: ["company_list"],
      layout: "default"
    },
    {
      id: "new_company",
      name: "New Company",
      path: "/companies/new",
      title: "Create Company",
      components: ["company_form"],
      layout: "default"
    },
    {
      id: "contacts",
      name: "Contacts",
      path: "/contacts",
      title: "Contacts",
      components: ["contact_list"],
      layout: "default"
    },
    {
      id: "new_contact",
      name: "New Contact",
      path: "/contacts/new",
      title: "Create Contact",
      components: ["contact_form"],
      layout: "default"
    },
    {
      id: "interactions",
      name: "Interactions",
      path: "/interactions",
      title: "Interactions",
      components: ["interaction_list"],
      layout: "default"
    },
    {
      id: "new_interaction",
      name: "New Interaction",
      path: "/interactions/new",
      title: "Create Interaction",
      components: ["interaction_form"],
      layout: "default"
    }
  ]
};

// Update navigation
CRM_SYSTEM_PAAM.ui.layout.navigation = {
  items: [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "Dashboard",
      href: "/"
    },
    {
      id: "companies",
      label: "Companies",
      icon: "Building",
      href: "/companies",
      children: [
        {
          id: "new_company",
          label: "New Company",
          href: "/companies/new"
        }
      ]
    },
    {
      id: "contacts",
      label: "Contacts",
      icon: "Users",
      href: "/contacts",
      children: [
        {
          id: "new_contact",
          label: "New Contact",
          href: "/contacts/new"
        }
      ]
    },
    {
      id: "interactions",
      label: "Interactions",
      icon: "MessageSquare",
      href: "/interactions",
      children: [
        {
          id: "new_interaction",
          label: "New Interaction",
          href: "/interactions/new"
        }
      ]
    }
  ],
  position: "side"
};