import js from "@eslint/js";
import eslintPluginJsdoc from "eslint-plugin-jsdoc";
import eslintPluginNode from "eslint-plugin-n";
import eslintPluginRegexp from "eslint-plugin-regexp";
import eslintPluginStylistic from "@stylistic/eslint-plugin";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default [
  js.configs.all,
  eslintPluginJsdoc.configs["flat/recommended"],
  eslintPluginNode.configs["flat/recommended"],
  eslintPluginRegexp.configs["flat/recommended"],
  eslintPluginStylistic.configs.customize({
    "arrowParens": true,
    "braceStyle": "1tbs",
    "commaDangle": "never",
    "jsx": false,
    "quoteProps": "always",
    "quotes": "double",
    "semi": true
  }),
  eslintPluginUnicorn.configs["flat/all"],
  {
    "ignores": [
      "demo/markdown-it.min.js",
      "demo/markdownlint-browser.js",
      "demo/markdownlint-browser.min.js",
      "example/typescript/type-check-*",
      "test-repos/**"
    ]
  },
  {
    "linterOptions": {
      "reportUnusedDisableDirectives": true
    },
    "rules": {
      "@stylistic/array-bracket-spacing": [ "error", "always" ],
      "@stylistic/indent": [ "error", 2 ],
      "@stylistic/indent-binary-ops": [ "off" ],
      "@stylistic/operator-linebreak": [ "error", "after" ],
      "@stylistic/padded-blocks": "off",
      "@stylistic/space-before-function-paren": [ "error", "never" ],
      "capitalized-comments": "off",
      "complexity": "off",
      "func-style": "off",
      "id-length": "off",
      "jsdoc/tag-lines": [ "error", "never", { "startLines": 1 } ],
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
      "no-undef-init": "off",
      "no-undefined": "off",
      "no-useless-assignment": "off",
      "object-shorthand": "off",
      "one-var": "off",
      "prefer-arrow-callback": "off",
      "prefer-destructuring": "off",
      "prefer-named-capture-group": "off",
      "prefer-template": "off",
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
      "**/*.js",
      "**/*.cjs"
    ],
    "languageOptions": {
      "sourceType": "commonjs",
      "globals": {
        "module": "readonly",
        "require": "readonly"
      }
    }
  },
  {
    "files": [
      "demo/default.js"
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
      "unicorn/prefer-module": "off",
      "unicorn/prefer-query-selector": "off"
    }
  },
  {
    "files": [
      "example/*.cjs"
    ],
    "languageOptions": {
      "sourceType": "commonjs"
    },
    "rules": {
      "n/no-missing-require": "off",
      "no-console": "off",
      "no-invalid-this": "off"
    }
  },
  {
    "files": [
      "example/standalone.mjs"
    ],
    "rules": {
      "no-console": "off",
      "no-constant-condition": "off"
    }
  },
  {
    "files": [
      "test/rules/**/*.js",
      "test/rules/**/*.cjs"
    ],
    "languageOptions": {
      "sourceType": "commonjs"
    },
    "rules": {
      "unicorn/prefer-module": "off"
    }
  }
];
