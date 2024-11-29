// @ts-check

"use strict";

/** @type {import("../../../lib/markdownlint.mjs").Rule} */
module.exports = {
  "names": [ "sample-rule" ],
  "description": "Sample rule",
  "tags": [ "sample" ],
  "parser": "markdownit",
  "function": function rule(params, onError) {
    for (const token of params.parsers.markdownit.tokens) {
      if (token.type === "hr") {
        onError({
          "lineNumber": token.lineNumber,
          "detail": "Sample error for hr"
        });
      }
    }
  }
};
