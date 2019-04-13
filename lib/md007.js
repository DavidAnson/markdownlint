// @ts-check

"use strict";

const { addErrorDetailIf, listItemMarkerRe, rangeFromRegExp } =
  require("../helpers");
const { flattenedLists } = require("./cache");

module.exports = {
  "names": [ "MD007", "ul-indent" ],
  "description": "Unordered list indentation",
  "tags": [ "bullet", "ul", "indentation" ],
  "function": function MD007(params, onError) {
    const optionsIndent = params.config.indent || 2;
    flattenedLists().forEach((list) => {
      if (list.unordered && list.parentsUnordered && list.indent) {
        addErrorDetailIf(onError, list.open.lineNumber,
          list.parentIndent + optionsIndent, list.indent, null, null,
          rangeFromRegExp(list.open.line, listItemMarkerRe));
      }
    });
  }
};
