// @ts-check

"use strict";

const shared = require("./shared");

const trailingSpaceRe = /\s+$/;

module.exports = {
  "names": [ "MD009", "no-trailing-spaces" ],
  "description": "Trailing spaces",
  "tags": [ "whitespace" ],
  "function": function MD009(params, onError) {
    const brSpaces = params.config.br_spaces || 0;
    const listItemEmptyLines = params.config.list_item_empty_lines;
    const allowListItemEmptyLines =
      (listItemEmptyLines === undefined) ? false : !!listItemEmptyLines;
    const listItemLineNumbers = [];
    if (allowListItemEmptyLines) {
      shared.filterTokens(params, "list_item_open", function forToken(token) {
        for (let i = token.map[0]; i < token.map[1]; i++) {
          listItemLineNumbers.push(i + 1);
        }
      });
    }
    shared.forEachLine(function forLine(line, lineIndex) {
      const lineNumber = lineIndex + 1;
      if (trailingSpaceRe.test(line) &&
        (listItemLineNumbers.indexOf(lineNumber) === -1)) {
        const expected = (brSpaces < 2) ? 0 : brSpaces;
        shared.addErrorDetailIf(onError, lineNumber,
          expected, line.length - shared.trimRight(line).length, null,
          shared.rangeFromRegExp(line, trailingSpaceRe));
      }
    });
  }
};
