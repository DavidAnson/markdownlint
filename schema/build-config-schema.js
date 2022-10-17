// @ts-check

"use strict";

const fs = require("node:fs");
const path = require("node:path");
const rules = require("../lib/rules");

// Schema scaffolding
const schema = {
  "title": "Markdownlint configuration schema",
  "type": "object",
  "properties": {
    "default": {
      "description": "Default state for all rules",
      "type": "boolean",
      "default": true
    },
    "extends": {
      "description": "Path to configuration file to extend",
      "type": [
        "string",
        "null"
      ],
      "default": null
    },
    "$schema": {
      "description": "JSON Schema URI (used by some editors)",
      "type": "string",
      "default": "https://raw.githubusercontent.com/DavidAnson/markdownlint" +
        "/main/schema/markdownlint-config-schema.json"
    }
  },
  "additionalProperties": {
    "type": [
      "boolean",
      "object"
    ]
  }
};
const tags = {};

// Add rules
for (const rule of rules) {
  for (const tag of rule.tags) {
    const tagRules = tags[tag] || [];
    tagRules.push(rule.names[0]);
    tags[tag] = tagRules;
  }
  const scheme = {
    "description": rule.names.join("/") + " - " + rule.description,
    "type": "boolean",
    "default": true
  };
  let custom = true;
  switch (rule.names[0]) {
    case "MD002":
      scheme.properties = {
        "level": {
          "description": "Heading level",
          "type": "integer",
          "minimum": 1,
          "maximum": 6,
          "default": 1
        }
      };
      break;
    case "MD003":
      scheme.properties = {
        "style": {
          "description": "Heading style",
          "type": "string",
          "enum": [
            "consistent",
            "atx",
            "atx_closed",
            "setext",
            "setext_with_atx",
            "setext_with_atx_closed"
          ],
          "default": "consistent"
        }
      };
      break;
    case "MD004":
      scheme.properties = {
        "style": {
          "description": "List style",
          "type": "string",
          "enum": [
            "consistent",
            "asterisk",
            "plus",
            "dash",
            "sublist"
          ],
          "default": "consistent"
        }
      };
      break;
    case "MD007":
      scheme.properties = {
        "indent": {
          "description": "Spaces for indent",
          "type": "integer",
          "minimum": 1,
          "default": 2
        },
        "start_indented": {
          "description": "Whether to indent the first level of the list",
          "type": "boolean",
          "default": false
        },
        "start_indent": {
          "description":
            "Spaces for first level indent (when start_indented is set)",
          "type": "integer",
          "minimum": 1,
          "default": 2
        }
      };
      break;
    case "MD009":
      scheme.properties = {
        "br_spaces": {
          "description": "Spaces for line break",
          "type": "integer",
          "minimum": 0,
          "default": 2
        },
        "list_item_empty_lines": {
          "description": "Allow spaces for empty lines in list items",
          "type": "boolean",
          "default": false
        },
        "strict": {
          "description": "Include unnecessary breaks",
          "type": "boolean",
          "default": false
        }
      };
      break;
    case "MD010":
      scheme.properties = {
        "code_blocks": {
          "description": "Include code blocks",
          "type": "boolean",
          "default": true
        },
        "ignore_code_languages": {
          "description": "Fenced code languages to ignore",
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": []
        },
        "spaces_per_tab": {
          "description": "Number of spaces for each hard tab",
          "type": "integer",
          "minimum": 0,
          "default": 1
        }
      };
      break;
    case "MD012":
      scheme.properties = {
        "maximum": {
          "description": "Consecutive blank lines",
          "type": "integer",
          "minimum": 1,
          "default": 1
        }
      };
      break;
    case "MD013":
      scheme.properties = {
        "line_length": {
          "description": "Number of characters",
          "type": "integer",
          "minimum": 1,
          "default": 80
        },
        "heading_line_length": {
          "description": "Number of characters for headings",
          "type": "integer",
          "minimum": 1,
          "default": 80
        },
        "code_block_line_length": {
          "description": "Number of characters for code blocks",
          "type": "integer",
          "minimum": 1,
          "default": 80
        },
        "code_blocks": {
          "description": "Include code blocks",
          "type": "boolean",
          "default": true
        },
        "tables": {
          "description": "Include tables",
          "type": "boolean",
          "default": true
        },
        "headings": {
          "description": "Include headings",
          "type": "boolean",
          "default": true
        },
        "headers": {
          "description": "Include headings",
          "type": "boolean",
          "default": true
        },
        "strict": {
          "description": "Strict length checking",
          "type": "boolean",
          "default": false
        },
        "stern": {
          "description": "Stern length checking",
          "type": "boolean",
          "default": false
        }
      };
      break;
    case "MD022":
      scheme.properties = {
        "lines_above": {
          "description": "Blank lines above heading",
          "type": "integer",
          "minimum": 0,
          "default": 1
        },
        "lines_below": {
          "description": "Blank lines below heading",
          "type": "integer",
          "minimum": 0,
          "default": 1
        }
      };
      break;
    case "MD024":
      scheme.properties = {
        "allow_different_nesting": {
          "description": "Only check sibling headings",
          "type": "boolean",
          "default": false
        },
        "siblings_only": {
          "description": "Only check sibling headings",
          "type": "boolean",
          "default": false
        }
      };
      break;
    case "MD026":
      scheme.properties = {
        "punctuation": {
          "description":
            "Punctuation characters not allowed at end of headings",
          "type": "string",
          "default": ".,;:!。，；：！"
        }
      };
      break;
    case "MD036":
      scheme.properties = {
        "punctuation": {
          "description": "Punctuation characters",
          "type": "string",
          "default": ".,;:!?。，；：！？"
        }
      };
      break;
    case "MD029":
      scheme.properties = {
        "style": {
          "description": "List style",
          "type": "string",
          "enum": [
            "one",
            "ordered",
            "one_or_ordered",
            "zero"
          ],
          "default": "one_or_ordered"
        }
      };
      break;
    case "MD030":
      scheme.properties = {
        "ul_single": {
          "description": "Spaces for single-line unordered list items",
          "type": "integer",
          "minimum": 1,
          "default": 1
        },
        "ol_single": {
          "description": "Spaces for single-line ordered list items",
          "type": "integer",
          "minimum": 1,
          "default": 1
        },
        "ul_multi": {
          "description": "Spaces for multi-line unordered list items",
          "type": "integer",
          "minimum": 1,
          "default": 1
        },
        "ol_multi": {
          "description": "Spaces for multi-line ordered list items",
          "type": "integer",
          "minimum": 1,
          "default": 1
        }
      };
      break;
    case "MD031":
      scheme.properties = {
        "list_items": {
          "description": "Include list items",
          "type": "boolean",
          "default": true
        }
      };
      break;
    case "MD033":
      scheme.properties = {
        "allowed_elements": {
          "description": "Allowed elements",
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": []
        }
      };
      break;
    case "MD035":
      scheme.properties = {
        "style": {
          "description": "Horizontal rule style",
          "type": "string",
          "default": "consistent"
        }
      };
      break;
    case "MD040":
      scheme.properties = {
        "allowed_languages": {
          "description": "List of languages",
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": []
        }
      };
      break;
    case "MD025":
    case "MD041":
      scheme.properties = {
        "level": {
          "description": "Heading level",
          "type": "integer",
          "minimum": 1,
          "maximum": 6,
          "default": 1
        },
        "front_matter_title": {
          "description": "RegExp for matching title in front matter",
          "type": "string",
          "default": "^\\s*title\\s*[:=]"
        }
      };
      break;
    case "MD043":
      scheme.properties = {
        "headings": {
          "description": "List of headings",
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^(\\*|\\+|#{1,6} .*)$"
          },
          "default": []
        },
        "headers": {
          "description": "List of headings",
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^(\\*|\\+|#{1,6} .*)$"
          },
          "default": []
        }
      };
      break;
    case "MD044":
      scheme.properties = {
        "names": {
          "description": "List of proper names",
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": []
        },
        "code_blocks": {
          "description": "Include code blocks",
          "type": "boolean",
          "default": true
        },
        "html_elements": {
          "description": "Include HTML elements",
          "type": "boolean",
          "default": true
        }
      };
      break;
    case "MD046":
      scheme.properties = {
        "style": {
          "description": "Block style",
          "type": "string",
          "enum": [
            "consistent",
            "fenced",
            "indented"
          ],
          "default": "consistent"
        }
      };
      break;
    case "MD048":
      scheme.properties = {
        "style": {
          "description": "Code fence style",
          "type": "string",
          "enum": [
            "consistent",
            "backtick",
            "tilde"
          ],
          "default": "consistent"
        }
      };
      break;
    case "MD049":
      scheme.properties = {
        "style": {
          "description": "Emphasis style should be consistent",
          "type": "string",
          "enum": [
            "consistent",
            "asterisk",
            "underscore"
          ],
          "default": "consistent"
        }
      };
      break;
    case "MD050":
      scheme.properties = {
        "style": {
          "description": "Strong style should be consistent",
          "type": "string",
          "enum": [
            "consistent",
            "asterisk",
            "underscore"
          ],
          "default": "consistent"
        }
      };
      break;
    case "MD053":
      scheme.properties = {
        "ignored_definitions": {
          "description": "Ignored definitions",
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": [ "//" ]
        }
      };
      break;
    default:
      custom = false;
      break;
  }
  if (custom) {
    // @ts-ignore
    scheme.type = [ "boolean", "object" ];
    scheme.additionalProperties = false;
  }
  for (const [ index, name ] of rule.names.entries()) {
    schema.properties[name] = (index === 0) ? scheme : {
      "$ref": `#/properties/${rule.names[0]}`
    };
  }
}

// Add tags
for (const [ tag, tagTags ] of Object.entries(tags)) {
  const scheme = {
    "description": tag + " - " + tagTags.join(", "),
    "type": "boolean",
    "default": true
  };
  schema.properties[tag] = scheme;
}

// Write schema
const schemaFile = path.join(__dirname, "markdownlint-config-schema.json");
fs.writeFileSync(schemaFile, JSON.stringify(schema, null, "  "));
