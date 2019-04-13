// @ts-check

"use strict";

const { addErrorContext, filterTokens } = require("../helpers");

module.exports = {
  "names": [ "MD040", "fenced-code-language" ],
  "description": "Fenced code blocks should have a language specified",
  "tags": [ "code", "language" ],
  "function": function MD040(params, onError) {
    filterTokens(params, "fence", function forToken(token) {
      if (!token.info.trim()) {
        addErrorContext(onError, token.lineNumber, token.line);
      }
    });
  }
};
