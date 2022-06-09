// @ts-check

"use strict";

const { addError, addErrorDetailIf, indentFor, listItemMarkerRe,
  orderedListItemMarkerRe, rangeFromRegExp } = require("../helpers");
const { flattenedLists } = require("./cache");

module.exports = {
  "names": [ "MD005", "list-indent" ],
  "description": "Inconsistent indentation for list items at the same level",
  "tags": [ "bullet", "ul", "indentation" ],
  "function": function MD005(params, onError) {
    for (const list of flattenedLists()) {
      const expectedIndent = list.indent;
      let expectedEnd = 0;
      let actualEnd = -1;
      let endMatching = false;
      for (const item of list.items) {
        const { line, lineNumber } = item;
        const actualIndent = indentFor(item);
        let match = null;
        if (list.unordered) {
          addErrorDetailIf(
            onError,
            lineNumber,
            expectedIndent,
            actualIndent,
            null,
            null,
            rangeFromRegExp(line, listItemMarkerRe)
            // No fixInfo; MD007 handles this scenario better
          );
        } else if ((match = orderedListItemMarkerRe.exec(line))) {
          actualEnd = match[0].length;
          expectedEnd = expectedEnd || actualEnd;
          const markerLength = match[1].length + 1;
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
                null,
                rangeFromRegExp(line, listItemMarkerRe),
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
