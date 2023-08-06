// @ts-check

"use strict";

const { addErrorDetailIf, blockquotePrefixRe, isBlankLine } =
  require("../helpers");
const { filterByTypes } = require("../helpers/micromark.cjs");

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
    const { lines, parsers } = params;
    const headings = filterByTypes(
      parsers.micromark.tokens,
      [ "atxHeading", "setextHeading" ]
    );
    for (const heading of headings) {
      const { startLine, endLine } = heading;
      const line = lines[startLine - 1].trim();

      // Check lines above
      if (linesAbove >= 0) {
        let actualAbove = 0;
        for (let i = 0; i < linesAbove; i++) {
          if (isBlankLine(lines[startLine - 2 - i])) {
            actualAbove++;
          }
        }
        addErrorDetailIf(
          onError,
          startLine,
          linesAbove,
          actualAbove,
          "Above",
          line,
          null,
          {
            "insertText":
              getBlockQuote(lines[startLine - 2], linesAbove - actualAbove)
          }
        );
      }

      // Check lines below
      if (linesBelow >= 0) {
        let actualBelow = 0;
        for (let i = 0; i < linesBelow; i++) {
          if (isBlankLine(lines[endLine + i])) {
            actualBelow++;
          }
        }
        addErrorDetailIf(
          onError,
          startLine,
          linesBelow,
          actualBelow,
          "Below",
          line,
          null,
          {
            "lineNumber": endLine + 1,
            "insertText":
              getBlockQuote(lines[endLine], linesBelow - actualBelow)
          }
        );
      }
    }
  }
};
