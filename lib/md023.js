// @ts-check

"use strict";

const shared = require("./shared");

const spaceBeforeHeadingRe = /^\s+\S/;

module.exports = {
  "names": [ "MD023", "heading-start-left", "header-start-left" ],
  "description": "Headings must start at the beginning of the line",
  "tags": [ "headings", "headers", "spaces" ],
  "function": function MD023(params, onError) {
    shared.filterTokens(params, "heading_open", function forToken(token) {
      if (spaceBeforeHeadingRe.test(token.line)) {
        shared.addErrorContext(onError, token.lineNumber, token.line, null,
          null, shared.rangeFromRegExp(token.line, spaceBeforeHeadingRe));
      }
    });
  }
};
