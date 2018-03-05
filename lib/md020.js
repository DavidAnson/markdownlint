// @ts-check

"use strict";

var shared = require("./shared");

var atxClosedHeaderNoSpaceRe = /(?:^#+[^#\s])|(?:[^#\s]#+\s*$)/;

module.exports = {
  "names": [ "MD020", "no-missing-space-closed-atx" ],
  "description": "No space inside hashes on closed atx style header",
  "tags": [ "headers", "atx_closed", "spaces" ],
  "function": function MD020(params, onError) {
    shared.forEachLine(function forLine(line, lineIndex, inCode) {
      if (!inCode && /^#+[^#]*[^\\]#+$/.test(line)) {
        var left = /^#+[^#\s]/.test(line);
        var right = /[^#\s]#+$/.test(line);
        if (left || right) {
          shared.addErrorContext(onError, lineIndex + 1, line.trim(), left,
            right, shared.rangeFromRegExp(line, atxClosedHeaderNoSpaceRe));
        }
      }
    });
  }
};
