// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD019", "no-multiple-space-atx" ],
  "description": "Multiple spaces after hash on atx style heading",
  "tags": [ "headings", "headers", "atx", "spaces" ],
  "function": function MD019(params, onError) {
    shared.filterTokens(params, "heading_open", function forToken(token) {
      if ((shared.headingStyleFor(token) === "atx") &&
          /^#+\s\s/.test(token.line)) {
        shared.addErrorContext(onError, token.lineNumber, token.line.trim(),
          null, null,
          shared.rangeFromRegExp(token.line, shared.atxHeadingSpaceRe));
      }
    });
  }
};
