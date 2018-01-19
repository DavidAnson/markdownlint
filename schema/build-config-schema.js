"use strict";

var fs = require("fs");
var path = require("path");
var rules = require("../lib/rules");

// Schema scaffolding
var schema = {
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
      "type": "string",
      "default": null
    }
  },
  "additionalProperties": false
};
var tags = {};

// Add rules
rules.forEach(function forRule(rule) {
  rule.tags.forEach(function forTag(tag) {
    var tagRules = tags[tag] || [];
    tagRules.push(rule.names[0]);
    tags[tag] = tagRules;
  });
  var scheme = {
    "description": rule.names.join("/") + " - " + rule.description,
    "type": "boolean",
    "default": true
  };
  var custom = true;
  switch (rule.names[0]) {
    case "MD002":
    case "MD025":
      scheme.properties = {
        "level": {
          "description": "Header level",
          "type": "integer",
          "default": 1
        }
      };
      break;
    case "MD003":
      scheme.properties = {
        "style": {
          "description": "Header style",
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
          "default": 2
        }
      };
      break;
    case "MD009":
      scheme.properties = {
        "br_spaces": {
          "description": "Spaces for line break",
          "type": "integer",
          "default": 0
        },
        "list_item_empty_lines": {
          "description": "Allow spaces for empty lines in list items",
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
        }
      };
      break;
    case "MD012":
      scheme.properties = {
        "maximum": {
          "description": "Consecutive blank lines",
          "type": "integer",
          "default": 1
        }
      };
      break;
    case "MD013":
      scheme.properties = {
        "line_length": {
          "description": "Number of characters",
          "type": "integer",
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
        "headers": {
          "description": "Include headers",
          "type": "boolean",
          "default": true
        }
      };
      break;
    case "MD026":
    case "MD036":
      scheme.properties = {
        "punctuation": {
          "description": "Punctuation characters",
          "type": "string",
          "default": ".,;:!?"
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
            "one_or_ordered"
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
          "default": 1
        },
        "ol_single": {
          "description": "Spaces for single-line ordered list items",
          "type": "integer",
          "default": 1
        },
        "ul_multi": {
          "description": "Spaces for multi-line unordered list items",
          "type": "integer",
          "default": 1
        },
        "ol_multi": {
          "description": "Spaces for multi-line ordered list items",
          "type": "integer",
          "default": 1
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
    case "MD041":
      scheme.properties = {
        "level": {
          "description": "Header level",
          "type": "integer",
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
        "headers": {
          "description": "List of headers",
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": null
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
          "default": null
        },
        "code_blocks": {
          "description": "Include code blocks",
          "type": "boolean",
          "default": true
        }
      };
      break;
    default:
      custom = false;
      break;
  }
  if (custom) {
    scheme.type = [ "boolean", "object" ];
    scheme.additionalProperties = false;
  }
  rule.names.forEach(function forName(name) {
    schema.properties[name] = scheme;
  });
});

// Add tags
Object.keys(tags).forEach(function forTag(tag) {
  var scheme = {
    "description": tag + " - " + tags[tag].join(", "),
    "type": "boolean",
    "default": true
  };
  schema.properties[tag] = scheme;
});

// Write schema
var schemaFile = path.join(__dirname, "markdownlint-config-schema.json");
fs.writeFileSync(schemaFile, JSON.stringify(schema, null, "  "));
