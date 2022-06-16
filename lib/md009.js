// @ts-check

"use strict";

const { addError, filterTokens, forEachLine, includesSorted,
  numericSortAscending } = require("../helpers");
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
      const addLineNumberRange = (start, end) => {
        for (let i = start; i < end; i++) {
          codeInlineLineNumbers.push(i);
        }
      };
      filterTokens(params, "inline", (token) => {
        let start = 0;
        for (const child of token.children) {
          if (start > 0) {
            addLineNumberRange(start, child.lineNumber);
            start = 0;
          }
          if (child.type === "code_inline") {
            start = child.lineNumber;
          }
        }
        if (start > 0) {
          addLineNumberRange(start, token.map[1]);
        }
      });
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
          undefined,
          [ column, trailingSpaces ],
          {
            "editColumn": column,
            "deleteCount": trailingSpaces
          });
      }
    });
  }
};
