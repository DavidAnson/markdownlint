// @ts-check

"use strict";

const { addErrorContext, filterTokens, rangeFromRegExp } =
  require("../helpers");

const spaceBeforeHeadingRe = /^((?:\s+)|(?:[>\s]+\s\s))[^>\s]/;

module.exports = {
  "names": [ "MD023", "heading-start-left", "header-start-left" ],
  "description": "Headings must start at the beginning of the line",
  "tags": [ "headings", "headers", "spaces" ],
  "function": function MD023(params, onError) {
    filterTokens(params, "heading_open", function forToken(token) {
      if (spaceBeforeHeadingRe.test(token.line)) {
        addErrorContext(onError, token.lineNumber, token.line, null,
          null, rangeFromRegExp(token.line, spaceBeforeHeadingRe));
      }
    });
  }
};
