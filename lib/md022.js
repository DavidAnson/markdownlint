// @ts-check

"use strict";

const { addErrorDetailIf, filterTokens, isBlankLine } = require("../helpers");

module.exports = {
  "names": [ "MD022", "blanks-around-headings", "blanks-around-headers" ],
  "description": "Headings should be surrounded by blank lines",
  "tags": [ "headings", "headers", "blank_lines" ],
  "function": function MD022(params, onError) {
    let linesAbove = params.config.lines_above;
    if (linesAbove === undefined) {
      linesAbove = 1;
    }
    let linesBelow = params.config.lines_below;
    if (linesBelow === undefined) {
      linesBelow = 1;
    }
    const { lines } = params;
    filterTokens(params, "heading_open", (token) => {
      const [ topIndex, nextIndex ] = token.map;
      for (let i = 0; i < linesAbove; i++) {
        if (!isBlankLine(lines[topIndex - i - 1])) {
          addErrorDetailIf(onError, topIndex + 1, linesAbove, i, "Above",
            lines[topIndex].trim());
          return;
        }
      }
      for (let i = 0; i < linesBelow; i++) {
        if (!isBlankLine(lines[nextIndex + i])) {
          addErrorDetailIf(onError, topIndex + 1, linesBelow, i, "Below",
            lines[topIndex].trim());
          return;
        }
      }
    });
  }
};
