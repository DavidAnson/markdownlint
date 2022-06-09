// @ts-check

"use strict";

const { addErrorDetailIf, listItemMarkerRe, rangeFromRegExp } =
  require("../helpers");
const { flattenedLists } = require("./cache");

module.exports = {
  "names": [ "MD006", "ul-start-left" ],
  "description":
    "Consider starting bulleted lists at the beginning of the line",
  "tags": [ "bullet", "ul", "indentation" ],
  "function": function MD006(params, onError) {
    for (const list of flattenedLists()) {
      if (list.unordered && !list.nesting && (list.indent !== 0)) {
        for (const item of list.items) {
          const { lineNumber, line } = item;
          addErrorDetailIf(
            onError,
            lineNumber,
            0,
            list.indent,
            null,
            null,
            rangeFromRegExp(line, listItemMarkerRe),
            {
              "deleteCount": line.length - line.trimStart().length
            });
        }
      }
    }
  }
};
