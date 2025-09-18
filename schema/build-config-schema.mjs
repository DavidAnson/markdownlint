// @ts-check

import fs from "node:fs/promises";
import path from "node:path";
/** @type {import("markdownlint").Rule[]} */
import rules from "../lib/rules.mjs";
import jsonSchemaToTypeScript from "json-schema-to-typescript";
import { version } from "../lib/constants.mjs";
import { __dirname } from "../test/esm-helpers.mjs";

const schemaName = "markdownlint-config-schema.json";
const schemaUri = `https://raw.githubusercontent.com/DavidAnson/markdownlint/v${version}/schema/${schemaName}`;
const schemaStrictName = "markdownlint-config-schema-strict.json";
const schemaStrictUri = `https://raw.githubusercontent.com/DavidAnson/markdownlint/v${version}/schema/${schemaStrictName}`;

// Schema scaffolding
const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": schemaUri,
  "title": "markdownlint configuration schema",
  "type": "object",
  "properties": {
    "$schema": {
      "description": "JSON Schema URI (expected by some editors)",
      "type": "string",
      "default": schemaUri
    },
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
  const ruleName = rule.names[0];
  for (const tag of rule.tags) {
    const tagRules = tags[tag] || [];
    tagRules.push(ruleName);
    tags[tag] = tagRules;
  }
  const scheme = {
    "description":
      `${rule.names.join("/")} : ${rule.description} : ${rule.information}`,
    "type": "boolean",
    "default": true
  };
  let custom = true;
  switch (ruleName) {
    case "MD001":
      scheme.properties = {
        "front_matter_title": {
          "description": "RegExp for matching title in front matter",
          "type": "string",
          "default": "^\\s*title\\s*[:=]"
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
          "type": [
            "integer",
            "array"
          ],
          "items": {
            "type": "integer"
          },
          "minimum": -1,
          "default": 1
        },
        "lines_below": {
          "description": "Blank lines below heading",
          "type": [
            "integer",
            "array"
          ],
          "items": {
            "type": "integer"
          },
          "minimum": -1,
          "default": 1
        }
      };
      break;
    case "MD024":
      scheme.properties = {
        "siblings_only": {
          "description": "Only check sibling headings",
          "type": "boolean",
          "default": false
        }
      };
      break;
    case "MD026":
    case "MD036":
      scheme.properties = {
        "punctuation": {
          "description": "Punctuation characters",
          "type": "string",
          "default": (ruleName === "MD026") ? ".,;:!。，；：！" : ".,;:!?。，；：！？"
        }
      };
      break;
    case "MD027":
      scheme.properties = {
        "list_items": {
          "description": "Include list items",
          "type": "boolean",
          "default": true
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
        },
        "table_allowed_elements": {
          "description": "Allowed elements in tables",
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
        },
        "language_only": {
          "description": "Require language only",
          "type": "boolean",
          "default": false
        }
      };
      break;
    case "MD025":
    case "MD041":
      {
        const md041Properties = (ruleName === "MD041") ?
          {
            "allow_preamble": {
              "description": "Allow content before first heading",
              "type": "boolean",
              "default": false
            }
          } :
          {};
        scheme.properties = {
          ...md041Properties,
          "front_matter_title": {
            "description": "RegExp for matching title in front matter",
            "type": "string",
            "default": "^\\s*title\\s*[:=]"
          },
          "level": {
            "description": "Heading level",
            "type": "integer",
            "minimum": 1,
            "maximum": 6,
            "default": 1
          }
        };
      }
      break;
    case "MD043":
      scheme.properties = {
        "headings": {
          "description": "List of headings",
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^(\\*|\\+|\\?|#{1,6}\\s+\\S.*)$"
          },
          "default": []
        },
        "match_case": {
          "description": "Match case of headings",
          "type": "boolean",
          "default": false
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
    case "MD050":
      scheme.properties = {
        "style": {
          "description": (ruleName === "MD049") ? "Emphasis style" : "Strong style",
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
    case "MD051":
      scheme.properties = {
        "ignore_case": {
          "description": "Ignore case of fragments",
          "type": "boolean",
          "default": false
        },
        "ignored_pattern": {
          "description": "Pattern for ignoring additional fragments",
          "type": "string",
          "default": ""
        }
      };
      break;
    case "MD052":
      scheme.properties = {
        "ignored_labels": {
          "description": "Ignored link labels",
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": [ "x" ]
        },
        "shortcut_syntax": {
          "description": "Include shortcut syntax",
          "type": "boolean",
          "default": false
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
    case "MD054":
      scheme.properties = {
        "autolink": {
          "description": "Allow autolinks",
          "type": "boolean",
          "default": true
        },
        "inline": {
          "description": "Allow inline links and images",
          "type": "boolean",
          "default": true
        },
        "full": {
          "description": "Allow full reference links and images",
          "type": "boolean",
          "default": true
        },
        "collapsed": {
          "description": "Allow collapsed reference links and images",
          "type": "boolean",
          "default": true
        },
        "shortcut": {
          "description": "Allow shortcut reference links and images",
          "type": "boolean",
          "default": true
        },
        "url_inline": {
          "description": "Allow URLs as inline links",
          "type": "boolean",
          "default": true
        }
      };
      break;
    case "MD055":
      scheme.properties = {
        "style": {
          "description": "Table pipe style",
          "type": "string",
          "enum": [
            "consistent",
            "leading_only",
            "trailing_only",
            "leading_and_trailing",
            "no_leading_or_trailing"
          ],
          "default": "consistent"
        }
      };
      break;
    case "MD059":
      scheme.properties = {
        "prohibited_texts": {
          "description": "Prohibited link texts",
          "type": "array",
          "items": {
            "type": "string"
          },
          "default": [
            "click here",
            "here",
            "link",
            "more"
          ]
        }
      };
      break;
    case "MD060":
      scheme.properties = {
        "style": {
          "description": "Table column style",
          "type": "string",
          "enum": [
            "any",
            "aligned",
            "compact",
            "tight"
          ],
          "default": "any"
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
  for (const name of rule.names) {
    schema.properties[name] = scheme;
    // Using $ref causes rule aliases not to get JSDoc comments
    // schema.properties[name] = (index === 0) ? scheme : {
    //   "$ref": `#/properties/${firstName}`
    // };
  }
}

// Add tags
for (const [ tag, tagTags ] of Object.entries(tags)) {
  const scheme = {
    "description": `${tag} : ${tagTags.join(", ")}`,
    "type": "boolean",
    "default": true
  };
  schema.properties[tag] = scheme;
}

// Write schema
const schemaFile = path.join(__dirname(import.meta), schemaName);
await fs.writeFile(schemaFile, JSON.stringify(schema, null, "  "));

// Create and write strict schema
const schemaStrict = {
  ...schema,
  "$id": schemaStrictUri,
  "additionalProperties": false
};
const schemaFileStrict = path.join(__dirname(import.meta), schemaStrictName);
await fs.writeFile(schemaFileStrict, JSON.stringify(schemaStrict, null, "  "));

// Write TypeScript declaration file
const declarationStrictName = path.join(__dirname(import.meta), "..", "lib", "configuration-strict.d.ts");
schemaStrict.title = "ConfigurationStrict";
const declaration = await jsonSchemaToTypeScript.compile(
  // @ts-ignore
  schemaStrict,
  "UNUSED"
);
await fs.writeFile(declarationStrictName, declaration);
