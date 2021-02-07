// @ts-check

"use strict";

const { addError, filterTokens, forEachInlineCodeSpan, forEachLine,
  includesSorted, newLineRe, numericSortAscending } = require("../helpers");
const { lineMetadata } = require("./cache");

module.exports = {
  "names": [ "MD009", "no-trailing-spaces" ],
  "description": "Trailing spaces",
  "tags": [ "whitespace" ],
  "function": function MD009(params, onError) {
    let brSpaces = params.config.br_spaces;
    brSpaces = Number((brSpaces === undefined) ? 2 : brSpaces);
    const listItemEmptyLines = !!params.config.list_item_empty_lines;
    const strict = !!params.config.strict;
    const listItemLineNumbers = [];
    if (listItemEmptyLines) {
      filterTokens(params, "list_item_open", (token) => {
        for (let i = token.map[0]; i < token.map[1]; i++) {
          listItemLineNumbers.push(i + 1);
        }
      });
      listItemLineNumbers.sort(numericSortAscending);
    }
    const paragraphLineNumbers = [];
    const codeInlineLineNumbers = [];
    if (strict) {
      filterTokens(params, "paragraph_open", (token) => {
        for (let i = token.map[0]; i < token.map[1] - 1; i++) {
          paragraphLineNumbers.push(i + 1);
        }
      });
      paragraphLineNumbers.sort(numericSortAscending);
      filterTokens(params, "inline", (token) => {
        if (token.children.some((child) => child.type === "code_inline")) {
          const tokenLines = params.lines.slice(token.map[0], token.map[1]);
          forEachInlineCodeSpan(tokenLines.join("\n"), (code, lineIndex) => {
            const codeLineCount = code.split(newLineRe).length;
            for (let i = 0; i < codeLineCount; i++) {
              codeInlineLineNumbers.push(token.lineNumber + lineIndex + i);
            }
          });
        }
      });
      codeInlineLineNumbers.sort(numericSortAscending);
    }
    const expected = (brSpaces < 2) ? 0 : brSpaces;
    forEachLine(lineMetadata(), (line, lineIndex, inCode) => {
      const lineNumber = lineIndex + 1;
      const trailingSpaces = line.length - line.trimEnd().length;
      if (
        trailingSpaces &&
        !inCode &&
        !includesSorted(listItemLineNumbers, lineNumber) &&
        (
          (expected !== trailingSpaces) ||
          (strict &&
            (!includesSorted(paragraphLineNumbers, lineNumber) ||
             includesSorted(codeInlineLineNumbers, lineNumber)))
        )
      ) {
        const column = line.length - trailingSpaces + 1;
        addError(
          onError,
          lineNumber,
          "Expected: " + (expected === 0 ? "" : "0 or ") +
            expected + "; Actual: " + trailingSpaces,
          null,
          [ column, trailingSpaces ],
          {
            "editColumn": column,
            "deleteCount": trailingSpaces
          });
      }
    });
  }
};
