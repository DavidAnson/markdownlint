// @ts-check

"use strict";

const { addError, filterTokens, forEachLine, includesSorted, rangeFromRegExp } =
  require("../helpers");
const { lineMetadata } = require("./cache");

const trailingSpaceRe = /\s+$/;

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
    forEachLine(lineMetadata(), (line, lineIndex) => {
      const lineNumber = lineIndex + 1;
      if (trailingSpaceRe.test(line) &&
        !includesSorted(listItemLineNumbers, lineNumber)) {
        const actual = line.length - line.trimRight().length;
        if (expected !== actual) {
          addError(onError, lineNumber,
            "Expected: " + (expected === 0 ? "" : "0 or ") +
              expected + "; Actual: " + actual,
            null, rangeFromRegExp(line, trailingSpaceRe));
        }
      }
    });
  }
};
