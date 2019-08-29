// @ts-check

"use strict";

const { addErrorContext, isBlankLine } = require("../helpers");
const { flattenedLists } = require("./cache");

const quotePrefixRe = /^[>\s]*/;

module.exports = {
  "names": [ "MD032", "blanks-around-lists" ],
  "description": "Lists should be surrounded by blank lines",
  "tags": [ "bullet", "ul", "ol", "blank_lines" ],
  "function": function MD032(params, onError) {
    const { lines } = params;
    flattenedLists().filter((list) => !list.nesting).forEach((list) => {
      const firstIndex = list.open.map[0];
      if (!isBlankLine(lines[firstIndex - 1])) {
        const line = lines[firstIndex];
        const quotePrefix = line.match(quotePrefixRe)[0].trimEnd();
        addErrorContext(
          onError,
          firstIndex + 1,
          line.trim(),
          null,
          null,
          null,
          {
            "insertText": `${quotePrefix}\n`
          });
      }
      const lastIndex = list.lastLineIndex - 1;
      if (!isBlankLine(lines[lastIndex + 1])) {
        const line = lines[lastIndex];
        const quotePrefix = line.match(quotePrefixRe)[0].trimEnd();
        addErrorContext(
          onError,
          lastIndex + 1,
          line.trim(),
          null,
          null,
          null,
          {
            "lineNumber": lastIndex + 2,
            "insertText": `${quotePrefix}\n`
          });
      }
    });
  }
};
