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
    flattenedLists().forEach((list) => {
      if (list.unordered && list.parentsUnordered) {
        list.items.forEach((item) => {
          const { lineNumber, line } = item;
          const expectedNesting = list.nesting + (startIndented ? 1 : 0);
          const expectedIndent = expectedNesting * indent;
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
        });
      }
    });
  }
};
