// @ts-check

"use strict";

module.exports = {
  "names": [ "every-n-lines" ],
  "description": "Rule that reports an error every N lines",
  "tags": [ "test" ],
  "function": function rule(params, onError) {
    const n = params.config.n || 2;
    params.lines.forEach(function forLine(line, lineIndex) {
      const lineNumber = lineIndex + 1;
      if ((lineNumber % n) === 0) {
        onError({
          "lineNumber": lineNumber,
          "detail": "Line number " + lineNumber
        });
      }
    });
  }
};
