/**
 * Todo App Reference PAAM
 * A simple task management application
 */
import { PAAM } from '@/types/paam/schema';
import { PAAMUtils } from '../utils';

export const TODO_APP_PAAM: PAAM = PAAMUtils.createEmpty(
  "Todo App",
  "A simple task management application for tracking todos"
);

// Update metadata
TODO_APP_PAAM.metadata = {
  ...TODO_APP_PAAM.metadata,
  version: "1.0.0",
  tags: ["todo", "task-management", "productivity"],
  platforms: ["web"]
};

// Define entities
TODO_APP_PAAM.entities = [
  {
    id: "todo",
    name: "Todo",
    description: "A task or todo item",
    fields: [
      {
        id: "id",
        name: "ID",
        type: "uuid",
        required: true,
        unique: true
      },
      {
        id: "title",
        name: "Title",
        type: "string",
        required: true,
        validation: [
          {
            type: "min",
            value: 1,
            message: "Title must be at least 1 character"
          },
          {
            type: "max",
            value: 255,
            message: "Title must be less than 255 characters"
          }
        ],
        ui: {
          label: "Task Title",
          placeholder: "Enter task title...",
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
          placeholder: "Enter task description...",
          widget: "textarea"
        }
      },
      {
        id: "completed",
        name: "Completed",
        type: "boolean",
        required: true,
        defaultValue: false,
        ui: {
          label: "Completed",
          widget: "checkbox"
        }
      },
      {
        id: "priority",
        name: "Priority",
        type: "enum",
        required: true,
        defaultValue: "medium",
        ui: {
          label: "Priority",
          widget: "select",
          options: [
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" }
          ]
        }
      },
      {
        id: "dueDate",
        name: "Due Date",
        type: "date",
        required: false,
        ui: {
          label: "Due Date",
          widget: "date"
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
    relationships: [],
    constraints: [
      {
        id: "unique_title_completed",
        name: "Unique title for active todos",
        type: "unique",
        fields: ["title"],
        expression: "completed = false"
      }
    ],
    indexes: [
      {
        id: "idx_completed",
        name: "Completed Index",
        fields: ["completed"]
      },
      {
        id: "idx_priority",
        name: "Priority Index",
        fields: ["priority"]
      },
      {
        id: "idx_due_date",
        name: "Due Date Index",
        fields: ["dueDate"]
      }
    ]
  }
];

// Define flows
TODO_APP_PAAM.flows = [
  {
    id: "create_todo",
    name: "Create Todo",
    description: "Create a new todo item",
    type: "create",
    steps: [
      {
        id: "show_form",
        name: "Show Todo Form",
        type: "form",
        config: {
          entity: "todo",
          fields: ["title", "description", "priority", "dueDate"],
          submitLabel: "Create Todo",
          cancelLabel: "Cancel"
        },
        nextSteps: ["validate_input"]
      },
      {
        id: "validate_input",
        name: "Validate Input",
        type: "validation",
        config: {
          entity: "todo",
          rules: [
            { field: "title", required: true, minLength: 1, maxLength: 255 }
          ]
        },
        nextSteps: ["save_todo"]
      },
      {
        id: "save_todo",
        name: "Save Todo",
        type: "api-call",
        config: {
          method: "POST",
          endpoint: "/api/todos",
          data: {
            title: "{{title}}",
            description: "{{description}}",
            priority: "{{priority}}",
            dueDate: "{{dueDate}}"
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
          message: "Todo created successfully!",
          duration: 3000
        }
      }
    ],
    triggers: [
      {
        id: "http_trigger",
        type: "http",
        config: {
          path: "/todos/new",
          method: "GET"
        }
      }
    ]
  },
  {
    id: "list_todos",
    name: "List Todos",
    description: "Display a list of todos with filtering and sorting",
    type: "read",
    steps: [
      {
        id: "fetch_todos",
        name: "Fetch Todos",
        type: "api-call",
        config: {
          method: "GET",
          endpoint: "/api/todos",
          params: {
            filter: "{{filter}}",
            sort: "{{sort}}",
            page: "{{page}}",
            limit: "{{limit}}"
          }
        },
        nextSteps: ["display_list"]
      },
      {
        id: "display_list",
        name: "Display Todo List",
        type: "form",
        config: {
          entity: "todo",
          view: "list",
          fields: ["title", "description", "priority", "dueDate", "completed"],
          actions: ["edit", "delete", "toggle_complete"],
          filters: ["completed", "priority"],
          sort: ["createdAt", "priority", "dueDate"],
          pagination: true
        }
      }
    ],
    triggers: [
      {
        id: "http_trigger",
        type: "http",
        config: {
          path: "/todos",
          method: "GET"
        }
      }
    ]
  },
  {
    id: "update_todo",
    name: "Update Todo",
    description: "Update an existing todo item",
    type: "update",
    steps: [
      {
        id: "fetch_todo",
        name: "Fetch Todo",
        type: "api-call",
        config: {
          method: "GET",
          endpoint: "/api/todos/{{id}}"
        },
        nextSteps: ["show_form"]
      },
      {
        id: "show_form",
        name: "Show Edit Form",
        type: "form",
        config: {
          entity: "todo",
          fields: ["title", "description", "priority", "dueDate", "completed"],
          submitLabel: "Update Todo",
          cancelLabel: "Cancel"
        },
        nextSteps: ["validate_input"]
      },
      {
        id: "validate_input",
        name: "Validate Input",
        type: "validation",
        config: {
          entity: "todo",
          rules: [
            { field: "title", required: true, minLength: 1, maxLength: 255 }
          ]
        },
        nextSteps: ["save_todo"]
      },
      {
        id: "save_todo",
        name: "Save Todo",
        type: "api-call",
        config: {
          method: "PUT",
          endpoint: "/api/todos/{{id}}",
          data: {
            title: "{{title}}",
            description: "{{description}}",
            priority: "{{priority}}",
            dueDate: "{{dueDate}}",
            completed: "{{completed}}"
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
          message: "Todo updated successfully!",
          duration: 3000
        }
      }
    ],
    triggers: [
      {
        id: "http_trigger",
        type: "http",
        config: {
          path: "/todos/{{id}}/edit",
          method: "GET"
        }
      }
    ]
  },
  {
    id: "delete_todo",
    name: "Delete Todo",
    description: "Delete a todo item",
    type: "delete",
    steps: [
      {
        id: "confirm_delete",
        name: "Confirm Delete",
        type: "form",
        config: {
          type: "confirm",
          message: "Are you sure you want to delete this todo?",
          confirmLabel: "Delete",
          cancelLabel: "Cancel"
        },
        nextSteps: ["delete_todo"]
      },
      {
        id: "delete_todo",
        name: "Delete Todo",
        type: "api-call",
        config: {
          method: "DELETE",
          endpoint: "/api/todos/{{id}}"
        },
        nextSteps: ["show_success"]
      },
      {
        id: "show_success",
        name: "Show Success",
        type: "notification",
        config: {
          type: "success",
          message: "Todo deleted successfully!",
          duration: 3000
        }
      }
    ],
    triggers: [
      {
        id: "http_trigger",
        type: "http",
        config: {
          path: "/todos/{{id}}/delete",
          method: "POST"
        }
      }
    ]
  },
  {
    id: "toggle_complete",
    name: "Toggle Complete",
    description: "Toggle todo completion status",
    type: "update",
    steps: [
      {
        id: "toggle_status",
        name: "Toggle Status",
        type: "api-call",
        config: {
          method: "PATCH",
          endpoint: "/api/todos/{{id}}/toggle",
          data: {
            completed: "{{!completed}}"
          }
        },
        nextSteps: ["show_feedback"]
      },
      {
        id: "show_feedback",
        name: "Show Feedback",
        type: "notification",
        config: {
          type: "info",
          message: "Todo status updated!",
          duration: 2000
        }
      }
    ],
    triggers: [
      {
        id: "http_trigger",
        type: "http",
        config: {
          path: "/todos/{{id}}/toggle",
          method: "POST"
        }
      }
    ]
  }
];

// Update UI configuration
TODO_APP_PAAM.ui = {
  ...TODO_APP_PAAM.ui,
  components: [
    {
      id: "todo_form",
      name: "Todo Form",
      type: "form",
      config: {
        layout: "vertical",
        submitButton: "Save Todo",
        cancelButton: "Cancel"
      },
      dataBinding: {
        entity: "todo",
        fields: ["title", "description", "priority", "dueDate", "completed"]
      }
    },
    {
      id: "todo_list",
      name: "Todo List",
      type: "table",
      config: {
        columns: [
          { field: "title", label: "Title", sortable: true },
          { field: "description", label: "Description", sortable: false },
          { field: "priority", label: "Priority", sortable: true },
          { field: "dueDate", label: "Due Date", sortable: true },
          { field: "completed", label: "Completed", sortable: true }
        ],
        actions: ["edit", "delete", "toggle_complete"],
        filters: ["completed", "priority"],
        pagination: true
      },
      dataBinding: {
        entity: "todo",
        fields: ["title", "description", "priority", "dueDate", "completed"],
        sort: [{ field: "createdAt", direction: "desc" }],
        pagination: { enabled: true, pageSize: 20 }
      }
    },
    {
      id: "todo_stats",
      name: "Todo Statistics",
      type: "chart",
      config: {
        type: "pie",
        title: "Todo Statistics",
        dataField: "priority",
        groupBy: "completed"
      },
      dataBinding: {
        entity: "todo",
        fields: ["priority", "completed"]
      }
    }
  ],
  pages: [
    {
      id: "home",
      name: "Home",
      path: "/",
      title: "Todo App",
      components: ["todo_list", "todo_stats"],
      layout: "default"
    },
    {
      id: "new_todo",
      name: "New Todo",
      path: "/todos/new",
      title: "Create New Todo",
      components: ["todo_form"],
      layout: "default"
    },
    {
      id: "edit_todo",
      name: "Edit Todo",
      path: "/todos/[id]/edit",
      title: "Edit Todo",
      components: ["todo_form"],
      layout: "default"
    }
  ]
};

// Update API configuration
TODO_APP_PAAM.api = {
  ...TODO_APP_PAAM.api,
  endpoints: [
    {
      id: "list_todos",
      path: "/api/todos",
      method: "GET",
      handler: "todoController.list",
      response: {
        format: "json",
        headers: {
          "Content-Type": "application/json"
        }
      }
    },
    {
      id: "create_todo",
      path: "/api/todos",
      method: "POST",
      handler: "todoController.create",
      validation: {
        schema: {
          title: { type: "string", minLength: 1, maxLength: 255 },
          description: { type: "string", optional: true },
          priority: { type: "enum", values: ["low", "medium", "high"] },
          dueDate: { type: "date", optional: true }
        },
        sanitize: true
      },
      response: {
        format: "json",
        headers: {
          "Content-Type": "application/json"
        }
      }
    },
    {
      id: "get_todo",
      path: "/api/todos/:id",
      method: "GET",
      handler: "todoController.get",
      response: {
        format: "json",
        headers: {
          "Content-Type": "application/json"
        }
      }
    },
    {
      id: "update_todo",
      path: "/api/todos/:id",
      method: "PUT",
      handler: "todoController.update",
      validation: {
        schema: {
          title: { type: "string", minLength: 1, maxLength: 255 },
          description: { type: "string", optional: true },
          priority: { type: "enum", values: ["low", "medium", "high"] },
          dueDate: { type: "date", optional: true },
          completed: { type: "boolean" }
        },
        sanitize: true
      },
      response: {
        format: "json",
        headers: {
          "Content-Type": "application/json"
        }
      }
    },
    {
      id: "delete_todo",
      path: "/api/todos/:id",
      method: "DELETE",
      handler: "todoController.delete",
      response: {
        format: "json",
        headers: {
          "Content-Type": "application/json"
        }
      }
    },
    {
      id: "toggle_todo",
      path: "/api/todos/:id/toggle",
      method: "PATCH",
      handler: "todoController.toggle",
      response: {
        format: "json",
        headers: {
          "Content-Type": "application/json"
        }
      }
    }
  ]
};

// Update navigation
TODO_APP_PAAM.ui.layout.navigation = {
  items: [
    {
      id: "home",
      label: "Home",
      icon: "Home",
      href: "/"
    },
    {
      id: "new_todo",
      label: "New Todo",
      icon: "Plus",
      href: "/todos/new"
    }
  ],
  position: "top"
};