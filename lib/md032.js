// @ts-check

"use strict";

const shared = require("./shared");
const { addErrorContext, flattenLists, isBlankLine } = shared;

module.exports = {
  "names": [ "MD032", "blanks-around-lists" ],
  "description": "Lists should be surrounded by blank lines",
  "tags": [ "bullet", "ul", "ol", "blank_lines" ],
  "function": function MD032(params, onError) {
    const { lines } = params;
    flattenLists().filter((list) => !list.nesting).forEach((list) => {
      const firstIndex = list.open.map[0];
      if (!isBlankLine(lines[firstIndex - 1])) {
        addErrorContext(onError, firstIndex + 1, lines[firstIndex].trim());
      }
      const lastIndex = list.lastLineIndex - 1;
      if (!isBlankLine(lines[lastIndex + 1])) {
        addErrorContext(onError, lastIndex + 1, lines[lastIndex].trim());
      }
    });
  }
};
