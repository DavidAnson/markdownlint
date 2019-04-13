// @ts-check

"use strict";

const { addErrorContext, filterTokens, forEachInlineCodeSpan, newLineRe } =
  require("../helpers");

const startRe = /^\s([^`]|$)/;
const endRe = /[^`]\s$/;

module.exports = {
  "names": [ "MD038", "no-space-in-code" ],
  "description": "Spaces inside code span elements",
  "tags": [ "whitespace", "code" ],
  "function": function MD038(params, onError) {
    filterTokens(params, "inline", (token) => {
      if (token.children.some((child) => child.type === "code_inline")) {
        const tokenLines = params.lines.slice(token.map[0], token.map[1]);
        forEachInlineCodeSpan(
          tokenLines.join("\n"),
          (code, lineIndex, columnIndex, tickCount) => {
            let rangeIndex = columnIndex - tickCount;
            let rangeLength = code.length + (2 * tickCount);
            let rangeLineOffset = 0;
            const codeLines = code.split(newLineRe);
            const left = startRe.test(code);
            const right = !left && endRe.test(code);
            if (right && (codeLines.length > 1)) {
              rangeIndex = 0;
              rangeLineOffset = codeLines.length - 1;
            }
            if (left || right) {
              if (codeLines.length > 1) {
                rangeLength = codeLines[rangeLineOffset].length + tickCount;
              }
              const context = tokenLines[lineIndex + rangeLineOffset]
                .substring(rangeIndex, rangeIndex + rangeLength);
              addErrorContext(
                onError, token.lineNumber + lineIndex + rangeLineOffset,
                context, left, right, [ rangeIndex + 1, rangeLength ]);
            }
          });
      }
    });
  }
};
