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
    flattenedLists().forEach((list) => {
      const expectedIndent = list.indent;
      let expectedEnd = 0;
      let actualEnd = -1;
      let endMatching = false;
      list.items.forEach((item) => {
        const actualIndent = indentFor(item);
        if (list.unordered) {
          addErrorDetailIf(onError, item.lineNumber,
            expectedIndent, actualIndent, null, null,
            rangeFromRegExp(item.line, listItemMarkerRe));
        } else {
          const match = orderedListItemMarkerRe.exec(item.line);
          actualEnd = match && match[0].length;
          expectedEnd = expectedEnd || actualEnd;
          if ((expectedIndent !== actualIndent) || endMatching) {
            if (expectedEnd === actualEnd) {
              endMatching = true;
            } else {
              const detail = endMatching ?
                `Expected: (${expectedEnd}); Actual: (${actualEnd})` :
                `Expected: ${expectedIndent}; Actual: ${actualIndent}`;
              addError(onError, item.lineNumber, detail, null,
                rangeFromRegExp(item.line, listItemMarkerRe));
            }
          }
        }
      });
    });
  }
};
