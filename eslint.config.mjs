import js from "@eslint/js";
import eslintPluginJsdoc from "eslint-plugin-jsdoc";
import eslintPluginNode from "eslint-plugin-n";
import eslintPluginRegexp from "eslint-plugin-regexp"
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default [
  js.configs.all,
  eslintPluginJsdoc.configs['flat/recommended'],
  eslintPluginNode.configs["flat/recommended"],
  eslintPluginRegexp.configs["flat/recommended"],
  eslintPluginUnicorn.configs["flat/all"],
  {
    "ignores": [
      "demo/markdown-it.min.js",
      "demo/markdownlint-browser.js",
      "demo/markdownlint-browser.min.js",
      "demo/micromark-browser.js",
      "demo/micromark-html-browser.js",
      "example/typescript/type-check.js",
      "micromark/micromark.cjs",
      "micromark/micromark.dev.cjs",
      "micromark/micromark-browser.js",
      "micromark/micromark-browser.dev.js",
      "test-repos/**"
    ]
  },
  {
    "languageOptions": {
      "sourceType": "commonjs",
    },
    "linterOptions": {
      "reportUnusedDisableDirectives": true
    },
    "rules": {
      "capitalized-comments": "off",
      "complexity": "off",
      "func-style": "off",
      "id-length": "off",
      "jsdoc/tag-lines": [ "error", "never", { "startLines":1 } ],
      "logical-assignment-operators": "off",
      "max-depth": "off",
      "max-lines-per-function": "off",
      "max-lines": "off",
      "max-params": "off",
      "max-statements": "off",
      "multiline-comment-style": [ "error", "separate-lines" ],
      "no-empty-function": "off",
      "no-implicit-coercion": "off",
      "no-magic-numbers": "off",
      "no-param-reassign": "off",
      "no-plusplus": "off",
      "no-ternary": "off",
      "no-undefined": "off",
      "no-useless-assignment": "off",
      "object-shorthand": "off",
      "one-var": "off",
      "prefer-arrow-callback": "off",
      "prefer-destructuring": "off",
      "prefer-named-capture-group": "off",
      "prefer-template": "off",
      "regexp/no-super-linear-backtracking": "off",
      "require-unicode-regexp": "off",
      "sort-imports": "off",
      "sort-keys": "off",
      "unicorn/better-regex": "off",
      "unicorn/consistent-function-scoping": "off",
      "unicorn/filename-case": "off",
      "unicorn/no-array-callback-reference": "off",
      "unicorn/no-keyword-prefix": "off",
      "unicorn/no-new-array": "off",
      "unicorn/no-null": "off",
      "unicorn/no-useless-undefined": "off",
      "unicorn/prefer-at": "off",
      "unicorn/prefer-module": "off",
      "unicorn/prefer-string-raw": "off",
      "unicorn/prefer-string-replace-all": "off",
      "unicorn/prefer-string-slice": "off",
      "unicorn/prefer-switch": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/switch-case-braces": [ "error", "avoid" ],
      "vars-on-top": "off"
    },
    "settings": {
      "jsdoc": {
        "preferredTypes": {
          "object": "Object"
        }
      }
    }
  },
  {
    "files": [
      "**/*.mjs"
    ],
    "languageOptions": {
      "sourceType": "module"
    }
  },
  {
    "files": [
      "demo/*.js"
    ],
    "languageOptions": {
      "globals": {
        "alert": "readonly",
        "document": "readonly",
        "navigator": "readonly",
        "window": "readonly"
      }
    },
    "rules": {
      "jsdoc/require-jsdoc": "off",
      "n/no-unsupported-features/node-builtins": "off",
      "no-invalid-this": "off",
      "no-shadow": "off",
      "no-var": "off",
      "unicorn/prefer-query-selector": "off"
    }
  },
  {
    "files": [
      "example/*.js"
    ],
    "rules": {
      "n/no-missing-require": "off",
      "no-console": "off",
      "no-invalid-this": "off",
      "no-shadow": "off"
    }
  },
  {
    "files": [
      "test/rules/**/*.js"
    ],
    "rules": {
      "jsdoc/valid-types": "off"
    }
  }
];
