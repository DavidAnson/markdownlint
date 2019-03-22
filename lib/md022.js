// @ts-check

"use strict";

const shared = require("./shared");
const { addErrorContext, filterTokens, isBlankLine } = shared;

module.exports = {
  "names": [ "MD022", "blanks-around-headings", "blanks-around-headers" ],
  "description": "Headings should be surrounded by blank lines",
  "tags": [ "headings", "headers", "blank_lines" ],
  "function": function MD022(params, onError) {
    const { lines } = params;
    filterTokens(params, "heading_open", (token) => {
      const [ topIndex, nextIndex ] = token.map;
      if (!isBlankLine(lines[topIndex - 1]) || !isBlankLine(lines[nextIndex])) {
        addErrorContext(onError, topIndex + 1, lines[topIndex].trim());
      }
    });
  }
};
