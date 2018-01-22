// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD040", "fenced-code-language" ],
  "description": "Fenced code blocks should have a language specified",
  "tags": [ "code", "language" ],
  "function": function MD040(params, onError) {
    shared.filterTokens(params, "fence", function forToken(token) {
      if (!token.info.trim()) {
        shared.addErrorContext(onError, token.lineNumber, token.line);
      }
    });
  }
};
