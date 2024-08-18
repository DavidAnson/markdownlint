// @ts-check

"use strict";

/** @type import("../../lib/markdownlint").Rule */
module.exports = {
  "names": [ "every-n-lines" ],
  "description": "Rule that reports an error every N lines",
  "tags": [ "test" ],
  "parser": "none",
  "function": (params, onError) => {
    const n = params.config.n || 2;
    for (let lineNumber = n; lineNumber <= params.lines.length; lineNumber += n) {
      onError({
        "lineNumber": lineNumber,
        "detail": "Line number " + lineNumber
      });
    }
  }
};
