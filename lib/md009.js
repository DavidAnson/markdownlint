// @ts-check

"use strict";

const { addError, filterTokens, forEachLine, includesSorted } =
  require("../helpers");
const { lineMetadata } = require("./cache");

module.exports = {
  "names": [ "MD009", "no-trailing-spaces" ],
  "description": "Trailing spaces",
  "tags": [ "whitespace" ],
  "function": function MD009(params, onError) {
    let brSpaces = params.config.br_spaces;
    if (brSpaces === undefined) {
      brSpaces = 2;
    }
    const listItemEmptyLines = params.config.list_item_empty_lines;
    const allowListItemEmptyLines =
      (listItemEmptyLines === undefined) ? false : !!listItemEmptyLines;
    const listItemLineNumbers = [];
    if (allowListItemEmptyLines) {
      filterTokens(params, "list_item_open", (token) => {
        for (let i = token.map[0]; i < token.map[1]; i++) {
          listItemLineNumbers.push(i + 1);
        }
      });
      listItemLineNumbers.sort((a, b) => a - b);
    }
    const expected = (brSpaces < 2) ? 0 : brSpaces;
    let inFencedCode = 0;
    forEachLine(lineMetadata(), (line, lineIndex, inCode, onFence) => {
      inFencedCode += onFence;
      const lineNumber = lineIndex + 1;
      const trailingSpaces = line.length - line.trimRight().length;
      if ((!inCode || inFencedCode) && trailingSpaces &&
        !includesSorted(listItemLineNumbers, lineNumber)) {
        if (expected !== trailingSpaces) {
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
      }
    });
  }
};
