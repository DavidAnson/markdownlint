// @ts-check

"use strict";

const { addError, isBlankLine } = require("../helpers");

module.exports = {
  "names": [ "MD047", "single-trailing-newline" ],
  "description": "Files should end with a single newline character",
  "tags": [ "blank_lines" ],
  "function": function MD047(params, onError) {
    const lastLineNumber = params.lines.length;
    const lastLine = params.lines[lastLineNumber - 1];
    if (!isBlankLine(lastLine)) {
      addError(
        onError,
        lastLineNumber,
        null,
        null,
        [ lastLine.length, 1 ],
        {
          "insertText": "\n",
          "editColumn": lastLine.length + 1
        }
      );
    }
  }
};
