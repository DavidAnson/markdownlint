// @ts-check

"use strict";

const shared = require("./shared");

const atxClosedHeadingSpaceRe = /(?:^#+\s\s+?\S)|(?:\S\s\s+?#+\s*$)/;

module.exports = {
  "names": [ "MD021", "no-multiple-space-closed-atx" ],
  "description": "Multiple spaces inside hashes on closed atx style heading",
  "tags": [ "headings", "headers", "atx_closed", "spaces" ],
  "function": function MD021(params, onError) {
    shared.filterTokens(params, "heading_open", function forToken(token) {
      if (shared.headingStyleFor(token) === "atx_closed") {
        const left = /^#+\s\s/.test(token.line);
        const right = /\s\s#+$/.test(token.line);
        if (left || right) {
          shared.addErrorContext(onError, token.lineNumber, token.line.trim(),
            left, right,
            shared.rangeFromRegExp(token.line, atxClosedHeadingSpaceRe));
        }
      }
    });
  }
};
