// @ts-check

"use strict";

const { addErrorContext, filterTokens, forEachInlineCodeSpan, newLineRe } =
  require("../helpers");

const leftSpaceRe = /^\s([^`]|$)/;
const rightSpaceRe = /[^`]\s$/;

const spaceInsideCodeInline = (token) => (
  (token.type === "code_inline") &&
  (leftSpaceRe.test(token.content) || rightSpaceRe.test(token.content))
);

module.exports = {
  "names": [ "MD038", "no-space-in-code" ],
  "description": "Spaces inside code span elements",
  "tags": [ "whitespace", "code" ],
  "function": function MD038(params, onError) {
    filterTokens(params, "inline", (token) => {
      if (token.children.some(spaceInsideCodeInline)) {
        const tokenLines = params.lines.slice(token.map[0], token.map[1]);
        forEachInlineCodeSpan(
          tokenLines.join("\n"),
          (code, lineIndex, columnIndex, tickCount) => {
            let rangeIndex = columnIndex - tickCount;
            let rangeLength = code.length + (2 * tickCount);
            let rangeLineOffset = 0;
            let fixIndex = columnIndex;
            let fixLength = code.length;
            const codeLines = code.split(newLineRe);
            const left = leftSpaceRe.test(code);
            const right = !left && rightSpaceRe.test(code);
            if (right && (codeLines.length > 1)) {
              rangeIndex = 0;
              rangeLineOffset = codeLines.length - 1;
              fixIndex = 0;
            }
            if (left || right) {
              const codeLinesRange = codeLines[rangeLineOffset];
              if (codeLines.length > 1) {
                rangeLength = codeLinesRange.length + tickCount;
                fixLength = codeLinesRange.length;
              }
              const context = tokenLines[lineIndex + rangeLineOffset]
                .substring(rangeIndex, rangeIndex + rangeLength);
              const codeLinesRangeTrim = codeLinesRange.trim();
              const fixText =
                (codeLinesRangeTrim.startsWith("`") ? " " : "") +
                codeLinesRangeTrim +
                (codeLinesRangeTrim.endsWith("`") ? " " : "");
              addErrorContext(
                onError,
                token.lineNumber + lineIndex + rangeLineOffset,
                context,
                left,
                right,
                [ rangeIndex + 1, rangeLength ],
                {
                  "editColumn": fixIndex + 1,
                  "deleteCount": fixLength,
                  "insertText": fixText
                }
              );
            }
          });
      }
    });
  }
};
