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
    flattenedLists().forEach((list) => {
      if (list.unordered && !list.nesting) {
        addErrorDetailIf(onError, list.open.lineNumber,
          0, list.indent, null, null,
          rangeFromRegExp(list.open.line, listItemMarkerRe));
      }
    });
  }
};
