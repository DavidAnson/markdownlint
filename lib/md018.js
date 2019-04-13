// @ts-check

"use strict";

const { addErrorContext, atxHeadingSpaceRe, forEachLine,
  rangeFromRegExp } = require("../helpers");
const { lineMetadata } = require("./cache");

module.exports = {
  "names": [ "MD018", "no-missing-space-atx" ],
  "description": "No space after hash on atx style heading",
  "tags": [ "headings", "headers", "atx", "spaces" ],
  "function": function MD018(params, onError) {
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      if (!inCode && /^#+[^#\s]/.test(line) && !/#$/.test(line)) {
        addErrorContext(onError, lineIndex + 1, line.trim(), null,
          null, rangeFromRegExp(line, atxHeadingSpaceRe));
      }
    });
  }
};
