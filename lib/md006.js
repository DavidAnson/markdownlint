// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD006", "ul-start-left" ],
  "description":
    "Consider starting bulleted lists at the beginning of the line",
  "tags": [ "bullet", "ul", "indentation" ],
  "function": function MD006(params, onError) {
    shared.flattenLists().forEach(function forList(list) {
      if (list.unordered && !list.nesting) {
        shared.addErrorDetailIf(onError, list.open.lineNumber,
          0, list.indent, null,
          shared.rangeFromRegExp(list.open.line, shared.listItemMarkerRe));
      }
    });
  }
};
