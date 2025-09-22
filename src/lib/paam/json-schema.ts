/**
 * JSON Schema for PAAM v0 validation
 */
export const PAAM_JSON_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Platform-Agnostic Application Model",
  "description": "Schema for representing applications in a platform-agnostic way",
  "type": "object",
  "required": ["$schema", "version", "metadata", "entities", "flows", "auth", "ui", "api", "data"],
  "properties": {
    "$schema": {
      "type": "string",
      "format": "uri"
    },
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+\\.\\d+$"
    },
    "metadata": {
      "type": "object",
      "required": ["name", "description", "version", "created", "modified", "tags", "platforms"],
      "properties": {
        "name": {
          "type": "string",
          "minLength": 1
        },
        "description": {
          "type": "string",
          "minLength": 1
        },
        "version": {
          "type": "string",
          "pattern": "^\\d+\\.\\d+\\.\\d+$"
        },
        "author": {
          "type": "string"
        },
        "created": {
          "type": "string",
          "format": "date-time"
        },
        "modified": {
          "type": "string",
          "format": "date-time"
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "platforms": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": ["web", "ios", "android"]
          }
        }
      }
    },
    "entities": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "description", "fields", "relationships", "constraints"],
        "properties": {
          "id": {
            "type": "string",
            "minLength": 1
          },
          "name": {
            "type": "string",
            "minLength": 1
          },
          "description": {
            "type": "string",
            "minLength": 1
          },
          "fields": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "name", "type", "required"],
              "properties": {
                "id": {
                  "type": "string",
                  "minLength": 1
                },
                "name": {
                  "type": "string",
                  "minLength": 1
                },
                "type": {
                  "type": "string",
                  "enum": ["string", "text", "integer", "float", "boolean", "date", "datetime", "time", "email", "url", "file", "image", "json", "uuid", "enum", "reference"]
                },
                "required": {
                  "type": "boolean"
                },
                "unique": {
                  "type": "boolean"
                },
                "defaultValue": {
                  "type": ["string", "number", "boolean", "null"]
                },
                "validation": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": ["type", "value", "message"],
                    "properties": {
                      "type": {
                        "type": "string",
                        "enum": ["min", "max", "pattern", "custom"]
                      },
                      "value": {
                        "type": ["string", "number"]
                      },
                      "message": {
                        "type": "string",
                        "minLength": 1
                      }
                    }
                  }
                },
                "ui": {
                  "type": "object",
                  "properties": {
                    "label": {"type": "string"},
                    "placeholder": {"type": "string"},
                    "helpText": {"type": "string"},
                    "widget": {
                      "type": "string",
                      "enum": ["input", "textarea", "select", "checkbox", "radio", "date", "file", "autocomplete"]
                    },
                    "options": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "required": ["value", "label"],
                        "properties": {
                          "value": {"type": ["string", "number"]},
                          "label": {"type": "string"}
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "relationships": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "name", "type", "targetEntity"],
              "properties": {
                "id": {"type": "string"},
                "name": {"type": "string"},
                "type": {
                  "type": "string",
                  "enum": ["one-to-one", "one-to-many", "many-to-many"]
                },
                "targetEntity": {"type": "string"},
                "cascade": {"type": "boolean"},
                "onDelete": {
                  "type": "string",
                  "enum": ["cascade", "restrict", "set-null"]
                }
              }
            }
          },
          "constraints": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "name", "type", "fields"],
              "properties": {
                "id": {"type": "string"},
                "name": {"type": "string"},
                "type": {
                  "type": "string",
                  "enum": ["unique", "check", "foreign-key"]
                },
                "fields": {
                  "type": "array",
                  "items": {"type": "string"}
                },
                "expression": {"type": "string"}
              }
            }
          },
          "indexes": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "name", "fields"],
              "properties": {
                "id": {"type": "string"},
                "name": {"type": "string"},
                "fields": {
                  "type": "array",
                  "items": {"type": "string"}
                },
                "unique": {"type": "boolean"}
              }
            }
          }
        }
      }
    },
    "flows": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "description", "type", "steps", "triggers"],
        "properties": {
          "id": {"type": "string"},
          "name": {"type": "string"},
          "description": {"type": "string"},
          "type": {
            "type": "string",
            "enum": ["create", "read", "update", "delete", "custom", "auth"]
          },
          "steps": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "name", "type", "config"],
              "properties": {
                "id": {"type": "string"},
                "name": {"type": "string"},
                "type": {
                  "type": "string",
                  "enum": ["form", "api-call", "data-transform", "validation", "auth-check", "notification", "redirect", "conditional", "loop"]
                },
                "config": {"type": "object"},
                "nextSteps": {
                  "type": "array",
                  "items": {"type": "string"}
                },
                "conditions": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": ["field", "operator", "value"],
                    "properties": {
                      "field": {"type": "string"},
                      "operator": {
                        "type": "string",
                        "enum": ["eq", "ne", "gt", "lt", "gte", "lte", "in", "contains"]
                      },
                      "value": {"type": ["string", "number", "boolean"]}
                    }
                  }
                }
              }
            }
          },
          "triggers": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "type", "config"],
              "properties": {
                "id": {"type": "string"},
                "type": {
                  "type": "string",
                  "enum": ["http", "event", "schedule", "webhook"]
                },
                "config": {"type": "object"}
              }
            }
          },
          "auth": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["role", "permissions"],
              "properties": {
                "role": {"type": "string"},
                "permissions": {
                  "type": "array",
                  "items": {"type": "string"}
                }
              }
            }
          }
        }
      }
    },
    "auth": {
      "type": "object",
      "required": ["enabled", "providers", "roles", "permissions", "policies"],
      "properties": {
        "enabled": {"type": "boolean"},
        "providers": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["type", "name", "config"],
            "properties": {
              "type": {
                "type": "string",
                "enum": ["email", "oauth", "saml", "jwt"]
              },
              "name": {"type": "string"},
              "config": {"type": "object"}
            }
          }
        },
        "roles": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "name", "description", "permissions"],
            "properties": {
              "id": {"type": "string"},
              "name": {"type": "string"},
              "description": {"type": "string"},
              "permissions": {
                "type": "array",
                "items": {"type": "string"}
              }
            }
          }
        },
        "permissions": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "name", "description", "resource", "action"],
            "properties": {
              "id": {"type": "string"},
              "name": {"type": "string"},
              "description": {"type": "string"},
              "resource": {"type": "string"},
              "action": {
                "type": "string",
                "enum": ["create", "read", "update", "delete", "execute"]
              }
            }
          }
        },
        "policies": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "name", "description", "effect", "conditions"],
            "properties": {
              "id": {"type": "string"},
              "name": {"type": "string"},
              "description": {"type": "string"},
              "effect": {
                "type": "string",
                "enum": ["allow", "deny"]
              },
              "conditions": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["field", "operator", "value"],
                  "properties": {
                    "field": {"type": "string"},
                    "operator": {"type": "string"},
                    "value": {"type": ["string", "number", "boolean"]}
                  }
                }
              }
            }
          }
        }
      }
    },
    "ui": {
      "type": "object",
      "required": ["theme", "layout", "components", "pages"],
      "properties": {
        "theme": {
          "type": "object",
          "required": ["primaryColor", "secondaryColor", "backgroundColor", "textColor", "fontFamily", "borderRadius", "spacing"],
          "properties": {
            "primaryColor": {"type": "string"},
            "secondaryColor": {"type": "string"},
            "backgroundColor": {"type": "string"},
            "textColor": {"type": "string"},
            "fontFamily": {"type": "string"},
            "borderRadius": {"type": "string"},
            "spacing": {"type": "string"}
          }
        },
        "layout": {
          "type": "object",
          "required": ["type", "header", "footer", "navigation"],
          "properties": {
            "type": {
              "type": "string",
              "enum": ["sidebar", "top-nav", "mobile-first", "responsive"]
            },
            "header": {"type": "boolean"},
            "footer": {"type": "boolean"},
            "navigation": {
              "type": "object",
              "required": ["items", "position"],
              "properties": {
                "items": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": ["id", "label", "href"],
                    "properties": {
                      "id": {"type": "string"},
                      "label": {"type": "string"},
                      "icon": {"type": "string"},
                      "href": {"type": "string"},
                      "children": {
                        "type": "array",
                        "items": {"$ref": "#/definitions/navigationItem"}
                      },
                      "auth": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "required": ["role", "permissions"],
                          "properties": {
                            "role": {"type": "string"},
                            "permissions": {
                              "type": "array",
                              "items": {"type": "string"}
                            }
                          }
                        }
                      }
                    }
                  }
                },
                "position": {
                  "type": "string",
                  "enum": ["top", "side", "bottom"]
                }
              }
            }
          }
        },
        "components": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "name", "type", "config"],
            "properties": {
              "id": {"type": "string"},
              "name": {"type": "string"},
              "type": {
                "type": "string",
                "enum": ["form", "table", "chart", "card", "list", "detail", "wizard"]
              },
              "config": {"type": "object"},
              "dataBinding": {
                "type": "object",
                "required": ["entity", "fields"],
                "properties": {
                  "entity": {"type": "string"},
                  "fields": {
                    "type": "array",
                    "items": {"type": "string"}
                  },
                  "filters": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["field", "operator", "value"],
                      "properties": {
                        "field": {"type": "string"},
                        "operator": {"type": "string"},
                        "value": {"type": ["string", "number", "boolean"]}
                      }
                    }
                  },
                  "sort": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["field", "direction"],
                      "properties": {
                        "field": {"type": "string"},
                        "direction": {
                          "type": "string",
                          "enum": ["asc", "desc"]
                        }
                      }
                    }
                  },
                  "pagination": {
                    "type": "object",
                    "required": ["enabled", "pageSize"],
                    "properties": {
                      "enabled": {"type": "boolean"},
                      "pageSize": {"type": "number"}
                    }
                  }
                }
              }
            }
          }
        },
        "pages": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "name", "path", "title", "components", "layout"],
            "properties": {
              "id": {"type": "string"},
              "name": {"type": "string"},
              "path": {"type": "string"},
              "title": {"type": "string"},
              "components": {
                "type": "array",
                "items": {"type": "string"}
              },
              "layout": {"type": "string"},
              "auth": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["role", "permissions"],
                  "properties": {
                    "role": {"type": "string"},
                    "permissions": {
                      "type": "array",
                      "items": {"type": "string"}
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "api": {
      "type": "object",
      "required": ["endpoints", "middleware", "versioning"],
      "properties": {
        "endpoints": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["id", "path", "method", "handler", "response"],
            "properties": {
              "id": {"type": "string"},
              "path": {"type": "string"},
              "method": {
                "type": "string",
                "enum": ["GET", "POST", "PUT", "DELETE", "PATCH"]
              },
              "handler": {"type": "string"},
              "auth": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["role", "permissions"],
                  "properties": {
                    "role": {"type": "string"},
                    "permissions": {
                      "type": "array",
                      "items": {"type": "string"}
                    }
                  }
                }
              },
              "validation": {
                "type": "object",
                "required": ["schema", "sanitize"],
                "properties": {
                  "schema": {"type": "object"},
                  "sanitize": {"type": "boolean"}
                }
              },
              "response": {
                "type": "object",
                "required": ["format"],
                "properties": {
                  "format": {
                    "type": "string",
                    "enum": ["json", "xml", "html"]
                  },
                  "schema": {"type": "object"},
                  "headers": {
                    "type": "object",
                    "additionalProperties": {"type": "string"}
                  }
                }
              }
            }
          }
        },
        "middleware": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["name", "type", "config"],
            "properties": {
              "name": {"type": "string"},
              "type": {
                "type": "string",
                "enum": ["auth", "cors", "rate-limit", "logging", "cache"]
              },
              "config": {"type": "object"}
            }
          }
        },
        "versioning": {
          "type": "object",
          "required": ["enabled", "strategy", "current"],
          "properties": {
            "enabled": {"type": "boolean"},
            "strategy": {
              "type": "string",
              "enum": ["url", "header", "query"]
            },
            "current": {"type": "string"}
          }
        }
      }
    },
    "data": {
      "type": "object",
      "required": ["database", "caching", "storage"],
      "properties": {
        "database": {
          "type": "object",
          "required": ["type", "connection", "migrations"],
          "properties": {
            "type": {
              "type": "string",
              "enum": ["postgresql", "mysql", "sqlite", "mongodb"]
            },
            "connection": {
              "type": "object",
              "required": ["database"],
              "properties": {
                "host": {"type": "string"},
                "port": {"type": "number"},
                "database": {"type": "string"},
                "username": {"type": "string"},
                "password": {"type": "string"},
                "ssl": {"type": "boolean"}
              }
            },
            "migrations": {
              "type": "object",
              "required": ["enabled", "auto", "path"],
              "properties": {
                "enabled": {"type": "boolean"},
                "auto": {"type": "boolean"},
                "path": {"type": "string"}
              }
            }
          }
        },
        "caching": {
          "type": "object",
          "required": ["enabled", "type", "config"],
          "properties": {
            "enabled": {"type": "boolean"},
            "type": {
              "type": "string",
              "enum": ["redis", "memory", "memcached"]
            },
            "config": {"type": "object"}
          }
        },
        "storage": {
          "type": "object",
          "required": ["enabled", "type", "config"],
          "properties": {
            "enabled": {"type": "boolean"},
            "type": {
              "type": "string",
              "enum": ["local", "s3", "azure", "gcs"]
            },
            "config": {"type": "object"}
          }
        }
      }
    }
  }
};