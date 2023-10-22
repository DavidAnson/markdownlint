// @ts-check

"use strict";

const { addError, addErrorDetailIf } = require("../helpers");
const { filterByTypes, inHtmlFlow } = require("../helpers/micromark.cjs");

module.exports = {
  "names": [ "MD005", "list-indent" ],
  "description": "Inconsistent indentation for list items at the same level",
  "tags": [ "bullet", "ul", "indentation" ],
  "function": function MD005(params, onError) {
    const lists = filterByTypes(
      params.parsers.micromark.tokens,
      [ "listOrdered", "listUnordered" ]
    ).filter((list) => !inHtmlFlow(list));
    for (const list of lists) {
      const expectedIndent = list.startColumn - 1;
      let expectedEnd = 0;
      let endMatching = false;
      const listItemPrefixes =
        list.children.filter((token) => (token.type === "listItemPrefix"));
      for (const listItemPrefix of listItemPrefixes) {
        const lineNumber = listItemPrefix.startLine;
        const actualIndent = listItemPrefix.startColumn - 1;
        const markerLength = listItemPrefix.text.trim().length;
        const range = [ 1, listItemPrefix.startColumn + markerLength ];
        if (list.type === "listUnordered") {
          addErrorDetailIf(
            onError,
            lineNumber,
            expectedIndent,
            actualIndent,
            null,
            null,
            range
            // No fixInfo; MD007 handles this scenario better
          );
        } else {
          const actualEnd = range[1] - 1;
          expectedEnd = expectedEnd || actualEnd;
          if ((expectedIndent !== actualIndent) || endMatching) {
            if (expectedEnd === actualEnd) {
              endMatching = true;
            } else {
              const detail = endMatching ?
                `Expected: (${expectedEnd}); Actual: (${actualEnd})` :
                `Expected: ${expectedIndent}; Actual: ${actualIndent}`;
              const expected = endMatching ?
                expectedEnd - markerLength :
                expectedIndent;
              const actual = endMatching ?
                actualEnd - markerLength :
                actualIndent;
              addError(
                onError,
                lineNumber,
                detail,
                undefined,
                range,
                {
                  "editColumn": Math.min(actual, expected) + 1,
                  "deleteCount": Math.max(actual - expected, 0),
                  "insertText": "".padEnd(Math.max(expected - actual, 0))
                }
              );
            }
          }
        }
      }
    }
  }
};
