// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD018", "no-missing-space-atx" ],
  "description": "No space after hash on atx style header",
  "tags": [ "headers", "atx", "spaces" ],
  "function": function MD018(params, onError) {
    shared.forEachLine(function forLine(line, lineIndex, inCode) {
      if (!inCode && /^#+[^#\s]/.test(line) && !/#$/.test(line)) {
        shared.addErrorContext(onError, lineIndex + 1, line.trim(), null,
          null, shared.rangeFromRegExp(line, shared.atxHeaderSpaceRe));
      }
    });
  }
};
