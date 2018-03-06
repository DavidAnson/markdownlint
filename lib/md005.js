// @ts-check

"use strict";

var shared = require("./shared");

module.exports = {
  "names": [ "MD005", "list-indent" ],
  "description": "Inconsistent indentation for list items at the same level",
  "tags": [ "bullet", "ul", "indentation" ],
  "function": function MD005(params, onError) {
    shared.flattenLists().forEach(function forList(list) {
      list.items.forEach(function forItem(item) {
        shared.addErrorDetailIf(onError, item.lineNumber, list.indent,
          shared.indentFor(item), null,
          shared.rangeFromRegExp(item.line, shared.listItemMarkerRe));
      });
    });
  }
};
