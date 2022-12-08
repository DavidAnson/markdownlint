// @ts-check

"use strict";

const { addErrorDetailIf, blockquotePrefixRe, filterTokens, isBlankLine } =
  require("../helpers");

const getBlockQuote = (str, count) => (
  (str || "")
    .match(blockquotePrefixRe)[0]
    .trimEnd()
    // eslint-disable-next-line unicorn/prefer-spread
    .concat("\n")
    .repeat(count)
);

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
          "insertText":
            getBlockQuote(lines[topIndex - 1], linesAbove - actualAbove)
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
          "insertText":
            getBlockQuote(lines[nextIndex], linesBelow - actualBelow)
        });
    });
  }
};
