// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD025", "single-h1" ],
  "description": "Multiple top level headers in the same document",
  "tags": [ "headers" ],
  "function": function MD025(params, onError) {
    var level = params.config.level || 1;
    var tag = "h" + level;
    var hasTopLevelHeading = false;
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
