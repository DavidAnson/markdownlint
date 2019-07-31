// @ts-check

"use strict";

const { filterTokens } = require("markdownlint-rule-helpers");
const eslint = require("eslint");
const cliEngine = new eslint.CLIEngine({});
const linter = new eslint.Linter();
const languageJavaScript = /js|javascript/i;

module.exports = {
  "names": [ "lint-javascript" ],
  "description": "Rule that lints JavaScript code",
  "tags": [ "test", "lint", "javascript" ],
  "function": (params, onError) => {
    filterTokens(params, "fence", (fence) => {
      if (languageJavaScript.test(fence.info)) {
        const config = cliEngine.getConfigForFile(params.name);
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
