// @ts-check

"use strict";

var shared = require("./shared");

var spaceBeforeHeaderRe = /^\s+\S/;

module.exports = {
  "names": [ "MD023", "header-start-left" ],
  "description": "Headers must start at the beginning of the line",
  "tags": [ "headers", "spaces" ],
  "function": function MD023(params, onError) {
    shared.filterTokens(params, "heading_open", function forToken(token) {
      if (spaceBeforeHeaderRe.test(token.line)) {
        shared.addErrorContext(onError, token.lineNumber, token.line, null,
          null, shared.rangeFromRegExp(token.line, spaceBeforeHeaderRe));
      }
    });
  }
};
