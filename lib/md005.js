// @ts-check

"use strict";

const shared = require("./shared");

module.exports = {
  "names": [ "MD005", "list-indent" ],
  "description": "Inconsistent indentation for list items at the same level",
  "tags": [ "bullet", "ul", "indentation" ],
  "function": function MD005(params, onError) {
    shared.flattenLists().forEach(function forList(list) {
      const expectedIndent = list.indent;
      let expectedEnd = 0;
      let actualEnd = -1;
      let endMatching = false;
      list.items.forEach(function forItem(item) {
        const actualIndent = shared.indentFor(item);
        if (list.unordered) {
          shared.addErrorDetailIf(onError, item.lineNumber,
            expectedIndent, actualIndent, null,
            shared.rangeFromRegExp(item.line, shared.listItemMarkerRe));
        } else {
          const match = shared.orderedListItemMarkerRe.exec(item.line);
          actualEnd = match && match[0].length;
          expectedEnd = expectedEnd || actualEnd;
          if ((expectedIndent !== actualIndent) || endMatching) {
            if (expectedEnd === actualEnd) {
              endMatching = true;
            } else {
              const detail = endMatching ?
                `Expected: (${expectedEnd}); Actual: (${actualEnd})` :
                `Expected: ${expectedIndent}; Actual: ${actualIndent}`;
              shared.addError(onError, item.lineNumber, detail, null,
                shared.rangeFromRegExp(item.line, shared.listItemMarkerRe));
            }
          }
        }
      });
    });
  }
};
