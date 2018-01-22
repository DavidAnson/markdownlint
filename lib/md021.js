// @ts-check

"use strict";

var shared = require("./shared");

var atxClosedHeaderSpaceRe = /(?:^#+\s\s+?\S)|(?:\S\s\s+?#+\s*$)/;

module.exports = {
  "names": [ "MD021", "no-multiple-space-closed-atx" ],
  "description": "Multiple spaces inside hashes on closed atx style header",
  "tags": [ "headers", "atx_closed", "spaces" ],
  "function": function MD021(params, onError) {
    shared.filterTokens(params, "heading_open", function forToken(token) {
      if (shared.headingStyleFor(token) === "atx_closed") {
        var left = /^#+\s\s/.test(token.line);
        var right = /\s\s#+$/.test(token.line);
        if (left || right) {
          shared.addErrorContext(onError, token.lineNumber, token.line.trim(),
            left, right,
            shared.rangeFromRegExp(token.line, atxClosedHeaderSpaceRe));
        }
      }
    });
  }
};
