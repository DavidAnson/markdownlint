// @ts-check

"use strict";

const shared = require("./shared");
const { isBlankLine } = shared;

module.exports = {
  "names": [ "MD047", "new-line-eof" ],
  "description": "New lines at the end of file",
  "tags": [ "blank_lines" ],
  "function": function rule(params, onError) {
    const lastLineNumber = params.lines.length;
    const lastLine = params.lines[lastLineNumber - 1];
    if (!isBlankLine(lastLine)) {
      onError({
        "lineNumber": lastLineNumber,
        "detail": "file does not end with new line"
      });
    }
  }
};
