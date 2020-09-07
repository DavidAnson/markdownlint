// @ts-check

"use strict";

const { filterTokens } = require("markdownlint-rule-helpers");
const eslint = require("eslint");
const cliEngine = new eslint.CLIEngine({});
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
    if (/^(jsdoc|node)\//.test(rule)) {
      delete cleanedConfig.rules[rule];
    }
  }
  return cleanedConfig;
}

module.exports = {
  "names": [ "lint-javascript" ],
  "description": "Rule that lints JavaScript code",
  "tags": [ "test", "lint", "javascript" ],
  "function": (params, onError) => {
    filterTokens(params, "fence", (fence) => {
      if (languageJavaScript.test(fence.info)) {
        let config = cliEngine.getConfigForFile(params.name);
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
      }
    });
    // Unused:
    //   filterTokens("code_block"), language unknown
    //   filterTokens("code_inline"), too brief
  }
};
