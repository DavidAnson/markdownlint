// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD007", "ul-indent" ],
  "description": "Unordered list indentation",
  "tags": [ "bullet", "ul", "indentation" ],
  "function": function MD007(params, onError) {
    var optionsIndent = params.config.indent || 2;
    var prevIndent = 0;
    shared.flattenLists(params).forEach(function forList(list) {
      if (list.unordered && list.parentsUnordered) {
        var indent = shared.indentFor(list.open);
        if (indent > prevIndent) {
          shared.addErrorDetailIf(onError, list.open.lineNumber,
            prevIndent + optionsIndent, indent, null,
            shared.rangeFromRegExp(list.open.line, shared.listItemMarkerRe));
        }
        prevIndent = indent;
      }
    });
  }
};
