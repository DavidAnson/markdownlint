// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD007", "ul-indent" ],
  "description": "Unordered list indentation",
  "tags": [ "bullet", "ul", "indentation" ],
  "function": function MD007(params, onError) {
    var optionsIndent = params.config.indent || 2;
    shared.flattenLists().forEach(function forList(list) {
      if (list.unordered && list.parentsUnordered && list.indent) {
        shared.addErrorDetailIf(onError, list.open.lineNumber,
          list.parentIndent + optionsIndent, list.indent, null,
          shared.rangeFromRegExp(list.open.line, shared.listItemMarkerRe));
      }
    });
  }
};
