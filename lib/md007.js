// @ts-check

"use strict";

const { addErrorDetailIf, indentFor, listItemMarkerRe } =
  require("../helpers");
const { flattenedLists } = require("./cache");

module.exports = {
  "names": [ "MD007", "ul-indent" ],
  "description": "Unordered list indentation",
  "tags": [ "bullet", "ul", "indentation" ],
  "function": function MD007(params, onError) {
    const indent = Number(params.config.indent || 2);
    const startIndented = !!params.config.start_indented;
    const startIndent = Number(params.config.start_indent || indent);
    for (const list of flattenedLists()) {
      if (list.unordered && list.parentsUnordered) {
        for (const item of list.items) {
          const { lineNumber, line } = item;
          const expectedIndent =
            (startIndented ? startIndent : 0) +
            (list.nesting * indent);
          const actualIndent = indentFor(item);
          let range = null;
          let editColumn = 1;
          const match = line.match(listItemMarkerRe);
          if (match) {
            range = [ 1, match[0].length ];
            editColumn += match[1].length - actualIndent;
          }
          addErrorDetailIf(
            onError,
            lineNumber,
            expectedIndent,
            actualIndent,
            null,
            null,
            range,
            {
              editColumn,
              "deleteCount": actualIndent,
              "insertText": "".padEnd(expectedIndent)
            });
        }
      }
    }
  }
};
