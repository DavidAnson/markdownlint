// @ts-check

"use strict";

const { filterTokens } = require("markdownlint-rule-helpers");
const eslint = require("eslint");
const eslintInstance = new eslint.ESLint();
const linter = new eslint.Linter();
const languageJavaScript = /js|javascript/i;

/**
 * Remove references to rules from eslint-plugin-jsdoc.
 *
 * @param {Object} config ESLint configuration object.
 * @returns {Object} ESLint configuration object.
 */
function cleanJsdocRulesFromEslintConfig(config) {
  const cleanedConfig = { ...config };
  for (const rule in config.rules) {
    if (/^(jsdoc|node|unicorn)\//.test(rule)) {
      delete cleanedConfig.rules[rule];
    }
  }
  return cleanedConfig;
}

module.exports = {
  "names": [ "lint-javascript" ],
  "description": "Rule that lints JavaScript code",
  "tags": [ "test", "lint", "javascript" ],
  "asynchronous": true,
  "function": (params, onError) => {
    filterTokens(params, "fence", (fence) => {
      if (languageJavaScript.test(fence.info)) {
        return eslintInstance.calculateConfigForFile(params.name)
          .then((config) => {
            config = cleanJsdocRulesFromEslintConfig(config);
            const results = linter.verify(fence.content, config);
            results.forEach((result) => {
              const lineNumber = fence.lineNumber + result.line;
              onError({
                "lineNumber": lineNumber,
                "detail": result.message,
                "context": params.lines[lineNumber - 1]
              });
            });
          });
      }
      return Promise.resolve();
    });
    // Unsupported:
    //   filterTokens("code_block"), language unknown
    //   filterTokens("code_inline"), too brief
  }
};
