// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD025", "single-h1" ],
  "description": "Multiple top level headings in the same document",
  "tags": [ "headings", "headers" ],
  "function": function MD025(params, onError) {
    const level = params.config.level || 1;
    const tag = "h" + level;
    let hasTopLevelHeading = false;
    shared.filterTokens(params, "heading_open", function forToken(token) {
      if (token.tag === tag) {
        if (hasTopLevelHeading) {
          shared.addErrorContext(onError, token.lineNumber,
            token.line.trim());
        } else if (token.lineNumber === 1) {
          hasTopLevelHeading = true;
        }
      }
    });
  }
};
