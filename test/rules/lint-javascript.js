// @ts-check

"use strict";

const js = require("@eslint/js");
const eslint = require("eslint");
const linter = new eslint.Linter();
const languageJavaScript = /js|javascript/i;

/** @type import("../../lib/markdownlint").Rule */
module.exports = {
  "names": [ "lint-javascript" ],
  "description": "Rule that lints JavaScript code",
  "tags": [ "test", "lint", "javascript" ],
  "parser": "markdownit",
  "function": (params, onError) => {
    const fences = params.parsers.markdownit.tokens.
      filter((token => token.type === "fence"));
    for (const fence of fences) {
      if (languageJavaScript.test(fence.info)) {
        const results = linter.verify(fence.content, js.configs.recommended);
        for (const result of results) {
          const lineNumber = fence.lineNumber + result.line;
          onError({
            "lineNumber": lineNumber,
            "detail": result.message,
            "context": params.lines[lineNumber - 1]
          });
        }
      }
    }
    // Unsupported by this sample:
    //   "code_block": language unknown
    //   "code_inline": too brief
  }
};
