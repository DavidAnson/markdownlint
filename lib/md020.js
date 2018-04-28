// @ts-check

"use strict";

const shared = require("./shared");

const atxClosedHeadingNoSpaceRe = /(?:^#+[^#\s])|(?:[^#\s]#+\s*$)/;

module.exports = {
  "names": [ "MD020", "no-missing-space-closed-atx" ],
  "description": "No space inside hashes on closed atx style heading",
  "tags": [ "headings", "headers", "atx_closed", "spaces" ],
  "function": function MD020(params, onError) {
    shared.forEachLine(function forLine(line, lineIndex, inCode) {
      if (!inCode && /^#+[^#]*[^\\]#+$/.test(line)) {
        const left = /^#+[^#\s]/.test(line);
        const right = /[^#\s]#+$/.test(line);
        if (left || right) {
          shared.addErrorContext(onError, lineIndex + 1, line.trim(), left,
            right, shared.rangeFromRegExp(line, atxClosedHeadingNoSpaceRe));
        }
      }
    });
  }
};
