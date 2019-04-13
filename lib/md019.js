// @ts-check

"use strict";

const { addErrorContext, atxHeadingSpaceRe, filterTokens, headingStyleFor,
  rangeFromRegExp } = require("../helpers");

module.exports = {
  "names": [ "MD019", "no-multiple-space-atx" ],
  "description": "Multiple spaces after hash on atx style heading",
  "tags": [ "headings", "headers", "atx", "spaces" ],
  "function": function MD019(params, onError) {
    filterTokens(params, "heading_open", function forToken(token) {
      if ((headingStyleFor(token) === "atx") &&
          /^#+\s\s/.test(token.line)) {
        addErrorContext(onError, token.lineNumber, token.line.trim(),
          null, null,
          rangeFromRegExp(token.line, atxHeadingSpaceRe));
      }
    });
  }
};
