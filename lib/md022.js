// @ts-check

"use strict";

const { addErrorDetailIf, filterTokens, isBlankLine } = require("../helpers");

module.exports = {
  "names": [ "MD022", "blanks-around-headings", "blanks-around-headers" ],
  "description": "Headings should be surrounded by blank lines",
  "tags": [ "headings", "headers", "blank_lines" ],
  "function": function MD022(params, onError) {
    let linesAbove = params.config.lines_above;
    linesAbove = Number((linesAbove === undefined) ? 1 : linesAbove);
    let linesBelow = params.config.lines_below;
    linesBelow = Number((linesBelow === undefined) ? 1 : linesBelow);
    const { lines } = params;
    filterTokens(params, "heading_open", (token) => {
      const [ topIndex, nextIndex ] = token.map;
      let actualAbove = 0;
      for (let i = 0; i < linesAbove; i++) {
        if (isBlankLine(lines[topIndex - i - 1])) {
          actualAbove++;
        }
      }
      addErrorDetailIf(
        onError,
        topIndex + 1,
        linesAbove,
        actualAbove,
        "Above",
        lines[topIndex].trim(),
        null,
        {
          "insertText": "".padEnd(linesAbove - actualAbove, "\n")
        });
      let actualBelow = 0;
      for (let i = 0; i < linesBelow; i++) {
        if (isBlankLine(lines[nextIndex + i])) {
          actualBelow++;
        }
      }
      addErrorDetailIf(
        onError,
        topIndex + 1,
        linesBelow,
        actualBelow,
        "Below",
        lines[topIndex].trim(),
        null,
        {
          "lineNumber": nextIndex + 1,
          "insertText": "".padEnd(linesBelow - actualBelow, "\n")
        });
    });
  }
};
